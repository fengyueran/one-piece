import axios from 'axios'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChatThread } from '../../components/chat-thread'
import { ChatContext, type ChatContextValue } from '../../context/chat-context'
import { createChatStore } from '../../store/chat-store'
import { DEFAULT_AI_CHAT_LABELS, type ChatTransport } from '../../types'

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <>{children}</>,
}))
jest.mock('remark-gfm', () => ({}))
jest.mock('remark-math', () => ({}))
jest.mock('rehype-katex', () => ({}))

const createContextValue = () => {
  const store = createChatStore()
  const sendRef = { current: jest.fn(async (_content: string) => {}) }
  const retryRef = { current: jest.fn(async () => {}) }
  const transport: ChatTransport = {
    getModels: async () => ({ data: [] }),
    startStream: async ({ onDone }) => {
      onDone?.()
    },
    terminateStream: async () => ({ terminated: true }),
  }
  const value: ChatContextValue = {
    store,
    transport,
    axios: axios.create(),
    apiBaseUrl: 'http://test',
    authToken: 'Bearer token',
    labels: DEFAULT_AI_CHAT_LABELS,
    enableImageAttachments: true,
    sendRef,
    retryRef,
    handleQuestionnaireSubmit: undefined,
    handleConfirmationSubmit: undefined,
  }

  return {
    store,
    sendRef,
    retryRef,
    value,
  }
}

describe('ChatThread', () => {
  it('renders the localized empty state title and subtitle from labels', () => {
    const ctx = createContextValue()
    ctx.value.labels = {
      ...DEFAULT_AI_CHAT_LABELS,
      emptyStateTitle: '随时发问',
      emptyStateSubtitle: '开始一段新对话',
    }

    render(
      <ChatContext.Provider value={ctx.value}>
        <ChatThread />
      </ChatContext.Provider>,
    )

    expect(screen.getByTestId('chat-empty-hero')).toHaveTextContent('随时发问')
    expect(screen.getByTestId('chat-empty-hero')).toHaveTextContent('开始一段新对话')
  })

  it('uses retryRef instead of resending the last user message directly', async () => {
    const user = userEvent.setup()
    const ctx = createContextValue()

    ctx.store.getState().createSession({
      sessionId: 'session-1',
      title: 'Chat',
      createdAt: '2026-03-25T00:00:00.000Z',
      updatedAt: '2026-03-25T00:00:00.000Z',
      model: 'gpt-4.1',
    })
    ctx.store.getState().appendMessage('session-1', {
      id: 'message-1',
      sessionId: 'session-1',
      role: 'user',
      content: 'retry me',
      createdAt: '2026-03-25T00:00:01.000Z',
    })
    ctx.store.getState().setSessionError('session-1', 'boom')

    render(
      <ChatContext.Provider value={ctx.value}>
        <ChatThread />
      </ChatContext.Provider>,
    )

    await user.click(screen.getByTestId('chat-thread-retry'))

    expect(ctx.retryRef.current).toHaveBeenCalledTimes(1)
    expect(ctx.sendRef.current).not.toHaveBeenCalled()
  })

  it('renders the localized retry button label in the error state', async () => {
    const ctx = createContextValue()

    ctx.store.getState().createSession({
      sessionId: 'session-1',
      title: 'Chat',
      createdAt: '2026-03-25T00:00:00.000Z',
      updatedAt: '2026-03-25T00:00:00.000Z',
      model: 'gpt-4.1',
    })
    ctx.store.getState().appendMessage('session-1', {
      id: 'message-1',
      sessionId: 'session-1',
      role: 'user',
      content: 'hello',
      createdAt: '2026-03-25T00:00:01.000Z',
    })
    ctx.store.getState().setSessionError('session-1', '网络请求失败，请稍后重试。')
    ctx.value.labels = {
      ...DEFAULT_AI_CHAT_LABELS,
      retryButton: '重试',
    }

    render(
      <ChatContext.Provider value={ctx.value}>
        <ChatThread />
      </ChatContext.Provider>,
    )

    expect(screen.getByTestId('chat-thread-retry')).toHaveTextContent('重试')
  })

  it('keeps the confirmation submission content compatible with the existing backend wording', async () => {
    const user = userEvent.setup()
    const ctx = createContextValue()

    ctx.store.getState().createSession({
      sessionId: 'session-plan',
      title: 'Plan Chat',
      createdAt: '2026-03-25T00:00:00.000Z',
      updatedAt: '2026-03-25T00:00:00.000Z',
      model: 'gpt-4.1',
      mode: 'plan',
    })
    ctx.store.getState().appendMessage('session-plan', {
      id: 'assistant-1',
      sessionId: 'session-plan',
      role: 'assistant',
      content: 'Please confirm execution.',
      blocks: [
        {
          type: 'confirmation_card',
          proposal: {
            proposalId: 'proposal-1',
            resourceKey: 'heat-equation',
            resourceName: 'Heat Equation',
            executorName: 'Finite Difference',
            parameterSummary: [{ label: 'dt', value: '0.01' }],
            requiresConfirmation: true,
          },
        },
      ],
      createdAt: '2026-03-25T00:00:01.000Z',
    })

    render(
      <ChatContext.Provider value={ctx.value}>
        <ChatThread />
      </ChatContext.Provider>,
    )

    await user.click(screen.getByTestId('confirmation-confirm'))

    expect(ctx.sendRef.current).toHaveBeenCalledWith(
      [
        'Execution confirmed',
        '- Equation: Heat Equation',
        '- Solver: Finite Difference',
        '- Proposal ID: proposal-1',
      ].join('\n'),
    )
  })

  it('delegates questionnaire submission to a custom handler when provided', async () => {
    const user = userEvent.setup()
    const ctx = createContextValue()
    const handleQuestionnaireSubmit = jest.fn(async () => {})

    ctx.value.handleQuestionnaireSubmit = handleQuestionnaireSubmit

    ctx.store.getState().createSession({
      sessionId: 'session-plan',
      title: 'Plan Chat',
      createdAt: '2026-03-25T00:00:00.000Z',
      updatedAt: '2026-03-25T00:00:00.000Z',
      model: 'gpt-4.1',
      mode: 'plan',
    })
    ctx.store.getState().appendMessage('session-plan', {
      id: 'assistant-2',
      sessionId: 'session-plan',
      role: 'assistant',
      content: 'Please choose a path.',
      blocks: [
        {
          type: 'questionnaire',
          questionnaire: {
            questionnaireId: 'plan-1',
            title: 'Choose a direction',
            questions: [
              {
                id: 'direction',
                label: 'Which route should we use?',
                kind: 'single_select',
                required: true,
                options: [
                  { label: 'Classic numeric simulation', value: 'classic' },
                  { label: 'Quantum simulation', value: 'quantum' },
                ],
              },
            ],
          },
        },
      ],
      createdAt: '2026-03-25T00:00:02.000Z',
    })

    render(
      <ChatContext.Provider value={ctx.value}>
        <ChatThread />
      </ChatContext.Provider>,
    )

    await user.click(screen.getByTestId('question-option-direction-0'))
    await user.click(screen.getByTestId('questionnaire-submit'))

    await waitFor(() => expect(handleQuestionnaireSubmit).toHaveBeenCalledTimes(1))
    expect(handleQuestionnaireSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        questionnaireId: 'plan-1',
        answers: { direction: 'classic' },
        details: {
          direction: {
            questionId: 'direction',
            kind: 'single_select',
            value: 'classic',
            selectedOptionValues: ['classic'],
            otherValue: undefined,
          },
        },
      }),
      expect.anything(),
    )
    expect(ctx.sendRef.current).not.toHaveBeenCalled()
  })

  it('submits multi-select answers together with custom other input', async () => {
    const user = userEvent.setup()
    const ctx = createContextValue()
    const handleQuestionnaireSubmit = jest.fn(async () => {})

    ctx.value.handleQuestionnaireSubmit = handleQuestionnaireSubmit

    ctx.store.getState().createSession({
      sessionId: 'session-plan',
      title: 'Plan Chat',
      createdAt: '2026-03-25T00:00:00.000Z',
      updatedAt: '2026-03-25T00:00:00.000Z',
      model: 'gpt-4.1',
      mode: 'plan',
    })
    ctx.store.getState().appendMessage('session-plan', {
      id: 'assistant-multi-other',
      sessionId: 'session-plan',
      role: 'assistant',
      content: 'Please choose the dimensions.',
      blocks: [
        {
          type: 'questionnaire',
          questionnaire: {
            questionnaireId: 'plan-multi-other',
            title: 'Choose dimensions',
            questions: [
              {
                id: 'dimensions',
                label: 'Which dimensions matter?',
                kind: 'multi_select',
                required: true,
                allowOther: true,
                options: [
                  { label: 'Stability', value: 'stability' },
                  { label: 'Error analysis', value: 'error-analysis' },
                ],
              },
            ],
          },
        },
      ],
      createdAt: '2026-03-25T00:00:02.000Z',
    })

    render(
      <ChatContext.Provider value={ctx.value}>
        <ChatThread />
      </ChatContext.Provider>,
    )

    await user.click(screen.getByTestId('question-option-dimensions-0'))
    await user.click(screen.getByTestId('question-option-dimensions-2'))
    await user.type(
      screen.getByTestId('question-input-dimensions'),
      'Need stronger convergence guarantees',
    )
    expect(screen.getByTestId('question-input-dimensions')).toHaveFocus()
    await user.click(screen.getByTestId('questionnaire-submit'))

    await waitFor(() => expect(handleQuestionnaireSubmit).toHaveBeenCalledTimes(1))
    expect(handleQuestionnaireSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        questionnaireId: 'plan-multi-other',
        answers: {
          dimensions: ['stability', 'Need stronger convergence guarantees'],
        },
        details: {
          dimensions: {
            questionId: 'dimensions',
            kind: 'multi_select',
            value: ['stability', 'Need stronger convergence guarantees'],
            selectedOptionValues: ['stability'],
            otherValue: 'Need stronger convergence guarantees',
          },
        },
        content: expect.stringContaining('Stability, Need stronger convergence guarantees'),
      }),
      expect.anything(),
    )
  })

  it('shows a multi-select hint for checkbox-style questionnaires', () => {
    const ctx = createContextValue()

    ctx.value.labels = {
      ...DEFAULT_AI_CHAT_LABELS,
      questionnaireMultiSelectHint: '可多选',
    }

    ctx.store.getState().createSession({
      sessionId: 'session-plan',
      title: 'Plan Chat',
      createdAt: '2026-03-25T00:00:00.000Z',
      updatedAt: '2026-03-25T00:00:00.000Z',
      model: 'gpt-4.1',
      mode: 'plan',
    })
    ctx.store.getState().appendMessage('session-plan', {
      id: 'assistant-multi-hint',
      sessionId: 'session-plan',
      role: 'assistant',
      content: 'Please choose the dimensions.',
      blocks: [
        {
          type: 'questionnaire',
          questionnaire: {
            questionnaireId: 'plan-multi-hint',
            title: 'Choose dimensions',
            questions: [
              {
                id: 'dimensions',
                label: 'Which dimensions matter?',
                kind: 'multi_select',
                required: true,
                options: [
                  { label: 'Stability', value: 'stability' },
                  { label: 'Error analysis', value: 'error-analysis' },
                ],
              },
            ],
          },
        },
      ],
      createdAt: '2026-03-25T00:00:02.000Z',
    })

    render(
      <ChatContext.Provider value={ctx.value}>
        <ChatThread />
      </ChatContext.Provider>,
    )

    expect(screen.getByText('可多选')).toBeInTheDocument()
  })

  it('forwards questionnaire blockKey to custom submit handlers when available', async () => {
    const user = userEvent.setup()
    const ctx = createContextValue()
    const handleQuestionnaireSubmit = jest.fn(async () => {})

    ctx.value.handleQuestionnaireSubmit = handleQuestionnaireSubmit

    ctx.store.getState().createSession({
      sessionId: 'session-plan',
      title: 'Plan Chat',
      createdAt: '2026-03-25T00:00:00.000Z',
      updatedAt: '2026-03-25T00:00:00.000Z',
      model: 'gpt-4.1',
      mode: 'plan',
    })
    ctx.store.getState().appendMessage('session-plan', {
      id: 'assistant-2b',
      sessionId: 'session-plan',
      role: 'assistant',
      content: 'Please choose a path.',
      blocks: [
        {
          type: 'questionnaire',
          questionnaire: {
            questionnaireId: 'plan-1',
            blockKey: 'plan:plan-1:opt-1',
            title: 'Choose a direction',
            questions: [
              {
                id: 'direction',
                label: 'Which route should we use?',
                kind: 'single_select',
                required: true,
                options: [
                  { label: 'Classic numeric simulation', value: 'classic' },
                  { label: 'Quantum simulation', value: 'quantum' },
                ],
              },
            ],
          },
        },
      ],
      createdAt: '2026-03-25T00:00:02.000Z',
    })

    render(
      <ChatContext.Provider value={ctx.value}>
        <ChatThread />
      </ChatContext.Provider>,
    )

    await user.click(screen.getByTestId('question-option-direction-0'))
    await user.click(screen.getByTestId('questionnaire-submit'))

    await waitFor(() => expect(handleQuestionnaireSubmit).toHaveBeenCalledTimes(1))
    expect(handleQuestionnaireSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        questionnaireId: 'plan-1',
        blockKey: 'plan:plan-1:opt-1',
        answers: { direction: 'classic' },
      }),
      expect.anything(),
    )
  })

  it('falls back to sending the questionnaire content when the custom handler declines it', async () => {
    const user = userEvent.setup()
    const ctx = createContextValue()

    ctx.value.handleQuestionnaireSubmit = jest.fn(async () => false)

    ctx.store.getState().createSession({
      sessionId: 'session-plan',
      title: 'Plan Chat',
      createdAt: '2026-03-25T00:00:00.000Z',
      updatedAt: '2026-03-25T00:00:00.000Z',
      model: 'gpt-4.1',
      mode: 'plan',
    })
    ctx.store.getState().appendMessage('session-plan', {
      id: 'assistant-fallback',
      sessionId: 'session-plan',
      role: 'assistant',
      content: 'Please choose a path.',
      blocks: [
        {
          type: 'questionnaire',
          questionnaire: {
            questionnaireId: 'plan-fallback',
            title: 'Choose a direction',
            questions: [
              {
                id: 'direction',
                label: 'Which route should we use?',
                kind: 'single_select',
                required: true,
                options: [
                  { label: 'Classic numeric simulation', value: 'classic' },
                  { label: 'Quantum simulation', value: 'quantum' },
                ],
              },
            ],
          },
        },
      ],
      createdAt: '2026-03-25T00:00:02.200Z',
    })

    render(
      <ChatContext.Provider value={ctx.value}>
        <ChatThread />
      </ChatContext.Provider>,
    )

    await user.click(screen.getByTestId('question-option-direction-0'))
    await user.click(screen.getByTestId('questionnaire-submit'))

    await waitFor(() => expect(ctx.sendRef.current).toHaveBeenCalledTimes(1))
    expect(ctx.sendRef.current).toHaveBeenCalledWith(
      ['Choose a direction', '- Which route should we use?: Classic numeric simulation'].join('\n'),
    )
  })

  it('uses external questionnaire validation labels', async () => {
    const user = userEvent.setup()
    const ctx = createContextValue()

    ctx.value.labels = {
      ...ctx.value.labels,
      questionnaireValidationPrefix: '请先完成：',
    }

    ctx.store.getState().createSession({
      sessionId: 'session-plan',
      title: 'Plan Chat',
      createdAt: '2026-03-25T00:00:00.000Z',
      updatedAt: '2026-03-25T00:00:00.000Z',
      model: 'gpt-4.1',
      mode: 'plan',
    })
    ctx.store.getState().appendMessage('session-plan', {
      id: 'assistant-validation',
      sessionId: 'session-plan',
      role: 'assistant',
      content: 'Please choose a path.',
      blocks: [
        {
          type: 'questionnaire',
          questionnaire: {
            questionnaireId: 'plan-validation',
            title: 'Choose a direction',
            questions: [
              {
                id: 'direction',
                label: 'Which route should we use?',
                kind: 'single_select',
                required: true,
                options: [
                  { label: 'Classic numeric simulation', value: 'classic' },
                  { label: 'Quantum simulation', value: 'quantum' },
                ],
              },
            ],
            submitLabel: 'Continue',
          },
        },
      ],
      createdAt: '2026-03-25T00:00:02.500Z',
    })

    render(
      <ChatContext.Provider value={ctx.value}>
        <ChatThread />
      </ChatContext.Provider>,
    )

    await user.click(screen.getByTestId('questionnaire-submit'))

    expect(screen.getByTestId('questionnaire-error')).toHaveTextContent(
      '请先完成： Which route should we use?',
    )
  })

  it('shows submitting feedback and replaces continue after questionnaire submit succeeds', async () => {
    const user = userEvent.setup()
    const ctx = createContextValue()
    let resolveSubmission: (() => void) | undefined
    const handleQuestionnaireSubmit = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmission = resolve
        }),
    )

    ctx.value.handleQuestionnaireSubmit = handleQuestionnaireSubmit
    ctx.value.labels = {
      ...ctx.value.labels,
      questionnaireSubmitting: '提交中...',
      questionnaireSubmitted: '已提交选择，正在等待计划继续...',
    }

    ctx.store.getState().createSession({
      sessionId: 'session-plan',
      title: 'Plan Chat',
      createdAt: '2026-03-25T00:00:00.000Z',
      updatedAt: '2026-03-25T00:00:00.000Z',
      model: 'gpt-4.1',
      mode: 'plan',
    })
    ctx.store.getState().appendMessage('session-plan', {
      id: 'assistant-3',
      sessionId: 'session-plan',
      role: 'assistant',
      content: 'Please choose a path.',
      blocks: [
        {
          type: 'questionnaire',
          questionnaire: {
            questionnaireId: 'plan-2',
            title: 'Choose a direction',
            questions: [
              {
                id: 'direction',
                label: 'Which route should we use?',
                kind: 'single_select',
                required: true,
                options: [
                  { label: 'Classic numeric simulation', value: 'classic' },
                  { label: 'Quantum simulation', value: 'quantum' },
                ],
              },
            ],
            submitLabel: 'Continue',
          },
        },
      ],
      createdAt: '2026-03-25T00:00:03.000Z',
    })

    render(
      <ChatContext.Provider value={ctx.value}>
        <ChatThread />
      </ChatContext.Provider>,
    )

    await user.click(screen.getByTestId('question-option-direction-0'))
    await user.click(screen.getByTestId('questionnaire-submit'))

    await waitFor(() =>
      expect(screen.getByTestId('questionnaire-submit')).toHaveTextContent('提交中...'),
    )
    expect(screen.getByTestId('questionnaire-submit')).toBeDisabled()

    resolveSubmission?.()

    await waitFor(() =>
      expect(screen.queryByTestId('questionnaire-submit')).not.toBeInTheDocument(),
    )
    expect(screen.getByTestId('questionnaire-success')).toHaveTextContent(
      '已提交选择，正在等待计划继续...',
    )
  })

  it('uses external questionnaire submit failed label when submission throws a non-error value', async () => {
    const user = userEvent.setup()
    const ctx = createContextValue()
    ctx.value.handleQuestionnaireSubmit = jest.fn(async () => {
      throw 'submit failed'
    })
    ctx.value.labels = {
      ...ctx.value.labels,
      questionnaireSubmitFailed: '提交失败，请稍后重试。',
    }

    ctx.store.getState().createSession({
      sessionId: 'session-plan',
      title: 'Plan Chat',
      createdAt: '2026-03-25T00:00:00.000Z',
      updatedAt: '2026-03-25T00:00:00.000Z',
      model: 'gpt-4.1',
      mode: 'plan',
    })
    ctx.store.getState().appendMessage('session-plan', {
      id: 'assistant-submit-failed',
      sessionId: 'session-plan',
      role: 'assistant',
      content: 'Please choose a path.',
      blocks: [
        {
          type: 'questionnaire',
          questionnaire: {
            questionnaireId: 'plan-submit-failed',
            title: 'Choose a direction',
            questions: [
              {
                id: 'direction',
                label: 'Which route should we use?',
                kind: 'single_select',
                required: true,
                options: [
                  { label: 'Classic numeric simulation', value: 'classic' },
                  { label: 'Quantum simulation', value: 'quantum' },
                ],
              },
            ],
            submitLabel: 'Continue',
          },
        },
      ],
      createdAt: '2026-03-25T00:00:03.500Z',
    })

    render(
      <ChatContext.Provider value={ctx.value}>
        <ChatThread />
      </ChatContext.Provider>,
    )

    await user.click(screen.getByTestId('question-option-direction-0'))
    await user.click(screen.getByTestId('questionnaire-submit'))

    await waitFor(() =>
      expect(screen.getByTestId('questionnaire-error')).toHaveTextContent('提交失败，请稍后重试。'),
    )
  })

  it('locks the questionnaire and shows the external timeout message after it expires', async () => {
    const ctx = createContextValue()

    ctx.store.getState().createSession({
      sessionId: 'session-plan',
      title: 'Plan Chat',
      createdAt: '2026-03-25T00:00:00.000Z',
      updatedAt: '2026-03-25T00:00:00.000Z',
      model: 'gpt-4.1',
      mode: 'plan',
    })
    ctx.store.getState().appendMessage('session-plan', {
      id: 'user-1',
      sessionId: 'session-plan',
      role: 'user',
      content: 'hello',
      createdAt: '2026-03-25T00:00:01.000Z',
    })
    ctx.store.getState().startStreamingMessage('session-plan', {
      id: 'assistant-timeout',
      sessionId: 'session-plan',
      role: 'assistant',
      content: '',
      status: 'streaming',
      createdAt: '2026-03-25T00:00:02.000Z',
    })
    ctx.store.getState().patchStreamingMessage('session-plan', {
      blocks: [
        {
          type: 'questionnaire',
          questionnaire: {
            questionnaireId: 'plan-timeout',
            title: 'Choose a direction',
            submitLabel: 'Continue',
            questions: [
              {
                id: 'direction',
                label: 'Which route should we use?',
                kind: 'single_select',
                required: true,
                options: [
                  { label: 'Classic numeric simulation', value: 'classic' },
                  { label: 'Quantum simulation', value: 'quantum' },
                ],
              },
            ],
          },
        },
      ],
    })
    ctx.store.getState().patchStreamingMessage('session-plan', {
      blocks: [
        {
          type: 'questionnaire',
          questionnaire: {
            questionnaireId: 'plan-timeout',
            title: 'Choose a direction',
            submitLabel: 'Continue',
            status: 'expired',
            statusMessage: '选择已超时（120 秒），请重新开始。',
            questions: [
              {
                id: 'direction',
                label: 'Which route should we use?',
                kind: 'single_select',
                required: true,
                options: [
                  { label: 'Classic numeric simulation', value: 'classic' },
                  { label: 'Quantum simulation', value: 'quantum' },
                ],
              },
            ],
          },
        },
      ],
    })

    render(
      <ChatContext.Provider value={ctx.value}>
        <ChatThread />
      </ChatContext.Provider>,
    )

    expect(screen.getByTestId('questionnaire-error')).toHaveTextContent(
      '选择已超时（120 秒），请重新开始。',
    )
    expect(screen.queryByTestId('questionnaire-submit')).not.toBeInTheDocument()
  })

  it('preserves local questionnaire edits when only the streamed description changes', async () => {
    const user = userEvent.setup()
    const ctx = createContextValue()

    ctx.store.getState().createSession({
      sessionId: 'session-plan',
      title: 'Plan Chat',
      createdAt: '2026-03-25T00:00:00.000Z',
      updatedAt: '2026-03-25T00:00:00.000Z',
      model: 'gpt-4.1',
      mode: 'plan',
    })
    ctx.store.getState().startStreamingMessage('session-plan', {
      id: 'assistant-streaming-description',
      sessionId: 'session-plan',
      role: 'assistant',
      content: 'Please choose a path.',
      status: 'streaming',
      createdAt: '2026-03-25T00:00:02.000Z',
    })
    ctx.store.getState().patchStreamingMessage('session-plan', {
      blocks: [
        {
          type: 'questionnaire',
          questionnaire: {
            questionnaireId: 'plan-streaming-description',
            blockKey: 'plan:streaming-description',
            mergePolicy: 'replace',
            title: 'Choose a direction',
            description: 'Initial hint',
            questions: [
              {
                id: 'direction',
                label: 'Which route should we use?',
                kind: 'single_select',
                required: true,
                options: [
                  { label: 'Classic numeric simulation', value: 'classic' },
                  { label: 'Quantum simulation', value: 'quantum' },
                ],
              },
            ],
          },
        },
      ],
    })

    render(
      <ChatContext.Provider value={ctx.value}>
        <ChatThread />
      </ChatContext.Provider>,
    )

    await user.click(screen.getByTestId('question-option-direction-0'))

    await act(async () => {
      ctx.store.getState().patchStreamingMessage('session-plan', {
        blocks: [
          {
            type: 'questionnaire',
            questionnaire: {
              questionnaireId: 'plan-streaming-description',
              blockKey: 'plan:streaming-description',
              mergePolicy: 'replace',
              title: 'Choose a direction',
              description: 'Updated hint from the stream',
              questions: [
                {
                  id: 'direction',
                  label: 'Which route should we use?',
                  kind: 'single_select',
                  required: true,
                  options: [
                    { label: 'Classic numeric simulation', value: 'classic' },
                    { label: 'Quantum simulation', value: 'quantum' },
                  ],
                },
              ],
            },
          },
        ],
      })
    })

    expect(screen.getByText('Updated hint from the stream')).toBeInTheDocument()
    expect(screen.getByTestId('question-option-direction-0')).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('resets questionnaire selection when the streamed questionnaire answers change', async () => {
    const user = userEvent.setup()
    const ctx = createContextValue()

    ctx.store.getState().createSession({
      sessionId: 'session-plan',
      title: 'Plan Chat',
      createdAt: '2026-03-25T00:00:00.000Z',
      updatedAt: '2026-03-25T00:00:00.000Z',
      model: 'gpt-4.1',
      mode: 'plan',
    })
    ctx.store.getState().startStreamingMessage('session-plan', {
      id: 'assistant-streaming-answers',
      sessionId: 'session-plan',
      role: 'assistant',
      content: 'Please choose a path.',
      status: 'streaming',
      createdAt: '2026-03-25T00:00:02.000Z',
    })
    ctx.store.getState().patchStreamingMessage('session-plan', {
      blocks: [
        {
          type: 'questionnaire',
          questionnaire: {
            questionnaireId: 'plan-streaming-answers',
            blockKey: 'plan:streaming-answers',
            mergePolicy: 'replace',
            title: 'Choose a direction',
            questions: [
              {
                id: 'direction',
                label: 'Which route should we use?',
                kind: 'single_select',
                required: true,
                options: [
                  { label: 'Classic numeric simulation', value: 'classic' },
                  { label: 'Quantum simulation', value: 'quantum' },
                ],
              },
            ],
          },
        },
      ],
    })

    render(
      <ChatContext.Provider value={ctx.value}>
        <ChatThread />
      </ChatContext.Provider>,
    )

    await user.click(screen.getByTestId('question-option-direction-0'))
    expect(screen.getByTestId('question-option-direction-0')).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    await act(async () => {
      ctx.store.getState().patchStreamingMessage('session-plan', {
        blocks: [
          {
            type: 'questionnaire',
            questionnaire: {
              questionnaireId: 'plan-streaming-answers',
              blockKey: 'plan:streaming-answers',
              mergePolicy: 'replace',
              title: 'Choose a direction',
              answers: {
                direction: 'quantum',
              },
              questions: [
                {
                  id: 'direction',
                  label: 'Which route should we use?',
                  kind: 'single_select',
                  required: true,
                  options: [
                    { label: 'Classic numeric simulation', value: 'classic' },
                    { label: 'Quantum simulation', value: 'quantum' },
                  ],
                },
              ],
            },
          },
        ],
      })
    })

    expect(screen.getByTestId('question-option-direction-0')).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(screen.getByTestId('question-option-direction-1')).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('treats invalid single-select prefills as unanswered when other is not allowed', async () => {
    const user = userEvent.setup()
    const ctx = createContextValue()
    const handleQuestionnaireSubmit = jest.fn(async () => {})

    ctx.value.handleQuestionnaireSubmit = handleQuestionnaireSubmit

    ctx.store.getState().createSession({
      sessionId: 'session-plan',
      title: 'Plan Chat',
      createdAt: '2026-03-25T00:00:00.000Z',
      updatedAt: '2026-03-25T00:00:00.000Z',
      model: 'gpt-4.1',
      mode: 'plan',
    })
    ctx.store.getState().appendMessage('session-plan', {
      id: 'assistant-invalid-prefill',
      sessionId: 'session-plan',
      role: 'assistant',
      content: 'Please choose a path.',
      blocks: [
        {
          type: 'questionnaire',
          questionnaire: {
            questionnaireId: 'plan-invalid-prefill',
            title: 'Choose a direction',
            questions: [
              {
                id: 'direction',
                label: 'Which route should we use?',
                kind: 'single_select',
                required: true,
                options: [
                  { label: 'Classic numeric simulation', value: 'classic' },
                  { label: 'Quantum simulation', value: 'quantum' },
                ],
              },
            ],
            answers: {
              direction: 'legacy-option',
            },
          },
        },
      ],
      createdAt: '2026-03-25T00:00:02.000Z',
    })

    render(
      <ChatContext.Provider value={ctx.value}>
        <ChatThread />
      </ChatContext.Provider>,
    )

    expect(screen.getByTestId('question-option-direction-0')).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(screen.getByTestId('question-option-direction-1')).toHaveAttribute(
      'aria-pressed',
      'false',
    )

    await user.click(screen.getByTestId('questionnaire-submit'))

    expect(screen.getByTestId('questionnaire-error')).toHaveTextContent(
      'Please complete: Which route should we use?',
    )
    expect(handleQuestionnaireSubmit).not.toHaveBeenCalled()
    expect(ctx.sendRef.current).not.toHaveBeenCalled()
  })

  it('wraps each conversation turn and keeps min-height on the latest turn', async () => {
    const ctx = createContextValue()
    let currentClientHeight = 480
    let resizeObserverCallback: ResizeObserverCallback | undefined
    const originalResizeObserver = global.ResizeObserver
    const scrollToMock = jest.fn()
    const getComputedStyleSpy = jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      paddingTop: '24px',
      paddingBottom: '24px',
      getPropertyValue: (property: string) => {
        if (property === 'padding-top') return '24px'
        if (property === 'padding-bottom') return '24px'
        return ''
      },
    } as CSSStyleDeclaration)
    const clientHeightSpy = jest
      .spyOn(HTMLElement.prototype, 'clientHeight', 'get')
      .mockImplementation(() => currentClientHeight)
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      writable: true,
      value: scrollToMock,
    })
    global.ResizeObserver = class ResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        resizeObserverCallback = callback
      }
      observe() {}
      disconnect() {}
      unobserve() {}
    } as typeof ResizeObserver
    const requestAnimationFrameSpy = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback: FrameRequestCallback) => {
        callback(0)
        return 1
      })
    const cancelAnimationFrameSpy = jest
      .spyOn(window, 'cancelAnimationFrame')
      .mockImplementation(() => {})

    ctx.store.getState().createSession({
      sessionId: 'session-1',
      title: 'Chat',
      createdAt: '2026-03-25T00:00:00.000Z',
      updatedAt: '2026-03-25T00:00:00.000Z',
      model: 'gpt-4.1',
    })
    ctx.store.getState().appendMessage('session-1', {
      id: 'assistant-0',
      sessionId: 'session-1',
      role: 'assistant',
      content: '欢迎',
      createdAt: '2026-03-25T00:00:01.000Z',
    })
    ctx.store.getState().appendMessage('session-1', {
      id: 'user-1',
      sessionId: 'session-1',
      role: 'user',
      content: 'hello',
      createdAt: '2026-03-25T00:00:02.000Z',
    })
    ctx.store.getState().startStreamingMessage('session-1', {
      id: 'assistant-1',
      sessionId: 'session-1',
      role: 'assistant',
      content: 'processing',
      status: 'streaming',
      createdAt: '2026-03-25T00:00:03.000Z',
    })
    ctx.store.getState().setSessionError('session-1', 'boom')

    render(
      <ChatContext.Provider value={ctx.value}>
        <ChatThread />
      </ChatContext.Provider>,
    )

    expect(screen.getAllByTestId('chat-thread-turn')).toHaveLength(1)
    await waitFor(() =>
      expect(
        (screen.getByTestId('chat-thread-latest-turn') as HTMLDivElement).style.minHeight,
      ).toBe('432px'),
    )
    expect(screen.getByTestId('chat-thread-latest-turn')).toContainElement(
      screen.getByTestId('chat-thread-error-state'),
    )
    expect(screen.getByTestId('chat-thread-latest-turn')).toContainElement(
      screen.getByTestId('chat-latest-user-anchor'),
    )
    expect(scrollToMock).toHaveBeenCalled()

    act(() => {
      currentClientHeight = 560
      window.dispatchEvent(new Event('resize'))
      resizeObserverCallback?.([], {} as ResizeObserver)
    })

    await waitFor(() =>
      expect(
        (screen.getByTestId('chat-thread-latest-turn') as HTMLDivElement).style.minHeight,
      ).toBe('512px'),
    )

    act(() => {
      ctx.store.getState().completeStreamingMessage('session-1')
    })

    await waitFor(() =>
      expect(
        (screen.getByTestId('chat-thread-latest-turn') as HTMLDivElement).style.minHeight,
      ).toBe('512px'),
    )

    global.ResizeObserver = originalResizeObserver
    getComputedStyleSpy.mockRestore()
    clientHeightSpy.mockRestore()
    requestAnimationFrameSpy.mockRestore()
    cancelAnimationFrameSpy.mockRestore()
    delete (HTMLElement.prototype as Partial<typeof HTMLElement.prototype>).scrollTo
  })
})
