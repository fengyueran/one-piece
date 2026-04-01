import axios from 'axios'
import { render, screen } from '@testing-library/react'
import { ChatThread } from '../../components/chat-thread'
import { ChatContext, type ChatContextValue } from '../../context/chat-context'
import { createChatStore } from '../../store/chat-store'
import { DEFAULT_AI_CHAT_LABELS, type ChatTransport } from '../../types'

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
    value,
  }
}

describe('ChatThread markdown rendering', () => {
  it('renders assistant messages with real markdown semantics', () => {
    const ctx = createContextValue()

    ctx.store.getState().createSession({
      sessionId: 'session-1',
      title: 'Chat',
      createdAt: '2026-03-25T00:00:00.000Z',
      updatedAt: '2026-03-25T00:00:00.000Z',
      model: 'gpt-4.1',
    })
    ctx.store.getState().appendMessage('session-1', {
      id: 'assistant-1',
      sessionId: 'session-1',
      role: 'assistant',
      content: '# Title\n- item 1\n- item 2\n**bold**',
      createdAt: '2026-03-25T00:00:01.000Z',
    })

    render(
      <ChatContext.Provider value={ctx.value}>
        <ChatThread />
      </ChatContext.Provider>,
    )

    expect(screen.getByTestId('chat-message-settled-block')).toHaveAttribute(
      'data-render-mode',
      'markdown',
    )
    expect(
      window.getComputedStyle(screen.getByTestId('chat-message-settled-block')).whiteSpace,
    ).not.toBe('pre-wrap')
    expect(screen.getByRole('heading', { level: 1, name: 'Title' })).toBeInTheDocument()
    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('item 1')).toBeInTheDocument()
    expect(screen.getByText('item 2')).toBeInTheDocument()
    expect(screen.getByText('bold', { selector: 'strong' })).toBeInTheDocument()
  })
})
