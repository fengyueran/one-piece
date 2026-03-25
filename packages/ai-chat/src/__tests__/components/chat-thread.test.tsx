import axios from 'axios'
import { render, screen } from '@testing-library/react'
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
      sendRef,
      retryRef,
    },
  }
}

describe('ChatThread', () => {
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
})
