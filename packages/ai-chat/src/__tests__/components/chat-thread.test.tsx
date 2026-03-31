import axios from 'axios'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChatThread } from '../../components/chat-thread'
import { ChatContext } from '../../context/chat-context'
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

  return {
    store,
    sendRef,
    retryRef,
    value: {
      store,
      transport,
      axios: axios.create(),
      apiBaseUrl: 'http://test',
      authToken: 'Bearer token',
      labels: DEFAULT_AI_CHAT_LABELS,
      enableImageAttachments: true,
      sendRef,
      retryRef,
    },
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
