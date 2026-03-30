import { useEffect } from 'react'
import { render, screen } from '@testing-library/react'
import { AiChatProvider } from '../../components/ai-chat-provider'
import { ChatThread } from '../../components/chat-thread'
import { useChatContext, useChatStore } from '../../context/use-chat-context'
import { DEFAULT_AI_CHAT_LABELS, type ChatMessageBlock, type ChatTransport } from '../../types'

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <>{children}</>,
}))
jest.mock('remark-gfm', () => ({}))
jest.mock('remark-math', () => ({}))
jest.mock('rehype-katex', () => ({}))

const TestConsumer = () => {
  const sessions = useChatStore((s) => s.sessions)
  return <div data-testid="count">{sessions.length}</div>
}

const TimelineSeed = () => {
  const createSession = useChatStore((state) => state.createSession)
  const appendMessage = useChatStore((state) => state.appendMessage)

  useEffect(() => {
    createSession({
      sessionId: 'session-1',
      title: 'Chat',
      createdAt: '2026-03-25T00:00:00.000Z',
      updatedAt: '2026-03-25T00:00:00.000Z',
      model: 'gpt-4.1',
    })
    appendMessage('session-1', {
      id: 'assistant-1',
      sessionId: 'session-1',
      role: 'assistant',
      content: 'Follow-up text remains visible.',
      blocks: [
        { type: 'custom', kind: 'badge', data: { label: 'Extensible' } } as ChatMessageBlock,
      ],
      createdAt: '2026-03-25T00:00:01.000Z',
    })
  }, [appendMessage, createSession])

  return null
}

const makeTransport = (): ChatTransport => ({
  getModels: async () => ({ data: [{ id: 'gpt-4.1', object: 'model' }] }),
  startStream: async ({ onDone }) => {
    onDone?.()
  },
  terminateStream: async () => ({ terminated: true }),
})

describe('AiChatProvider', () => {
  it('renders children and provides store context', () => {
    render(
      <AiChatProvider apiBaseUrl="http://api.test" authToken="Bearer tok">
        <TestConsumer />
      </AiChatProvider>,
    )
    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })

  it('throws when useChatStore used outside provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<TestConsumer />)).toThrow(
      'useChatContext must be used inside AiChatProvider',
    )
    spy.mockRestore()
  })

  it('accepts a custom transport without requiring legacy api props', () => {
    const transport = makeTransport()

    const Consumer = () => {
      const { transport: currentTransport } = useChatContext()
      return <div data-testid="transport-ok">{String(currentTransport === transport)}</div>
    }

    render(
      <AiChatProvider transport={transport}>
        <Consumer />
      </AiChatProvider>,
    )

    expect(screen.getByTestId('transport-ok')).toHaveTextContent('true')
  })

  it('passes timeline render order through the provider to ChatThread', () => {
    const transport = makeTransport()

    render(
      <AiChatProvider
        transport={transport}
        messageRenderOrder="timeline"
        renderMessageBlock={({ block }) =>
          block.type === 'custom' ? (
            <div data-testid="custom-block">{String((block.data as { label: string }).label)}</div>
          ) : null
        }
        labels={DEFAULT_AI_CHAT_LABELS}
      >
        <TimelineSeed />
        <ChatThread />
      </AiChatProvider>,
    )

    expect(screen.getByTestId('chat-message-body-stack')).toHaveTextContent(
      'Follow-up text remains visible.Extensible',
    )
  })
})
