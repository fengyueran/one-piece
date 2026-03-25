import axios from 'axios'
import { render, screen } from '@testing-library/react'
import { ChatThread } from '../../components/chat-thread'
import { ChatContext } from '../../context/chat-context'
import { createChatStore } from '../../store/chat-store'
import {
  DEFAULT_AI_CHAT_LABELS,
  type ChatMessageBlock,
  type ChatMessageBlockRendererProps,
  type ChatTransport,
} from '../../types'

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <>{children}</>,
}))
jest.mock('remark-gfm', () => ({}))
jest.mock('remark-math', () => ({}))
jest.mock('rehype-katex', () => ({}))

describe('ChatThread custom block renderer', () => {
  it('renders custom blocks through the provider renderer', () => {
    const store = createChatStore()
    const transport: ChatTransport = {
      getModels: async () => ({ data: [] }),
      startStream: async ({ onDone }) => {
        onDone?.()
      },
      terminateStream: async () => ({ terminated: true }),
    }
    store.getState().createSession({
      sessionId: 'session-1',
      title: 'Chat',
      createdAt: '2026-03-25T00:00:00.000Z',
      updatedAt: '2026-03-25T00:00:00.000Z',
      model: 'gpt-4.1',
    })
    store.getState().appendMessage('session-1', {
      id: 'assistant-1',
      sessionId: 'session-1',
      role: 'assistant',
      content: '',
      blocks: [
        { type: 'custom', kind: 'badge', data: { label: 'Extensible' } } as ChatMessageBlock,
      ],
      createdAt: '2026-03-25T00:00:01.000Z',
    })

    render(
      <ChatContext.Provider
        value={{
          store,
          transport,
          axios: axios.create(),
          apiBaseUrl: 'http://test',
          authToken: 'Bearer token',
          labels: DEFAULT_AI_CHAT_LABELS,
          enableImageAttachments: true,
          sendRef: { current: async (_content: string) => {} },
          retryRef: { current: async () => {} },
          renderMessageBlock: ({ block }: ChatMessageBlockRendererProps) =>
            block.type === 'custom' ? (
              <div data-testid="custom-block">{String((block.data as any).label)}</div>
            ) : null,
        }}
      >
        <ChatThread />
      </ChatContext.Provider>,
    )

    expect(screen.getByTestId('custom-block')).toHaveTextContent('Extensible')
  })
})
