import axios from 'axios'
import { act, render, screen } from '@testing-library/react'
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
      content: 'Follow-up text remains visible.',
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
    expect(screen.getByText('Follow-up text remains visible.')).toBeInTheDocument()
    expect(screen.getAllByTestId('chat-message-content-segment')).toHaveLength(2)
  })

  it('keeps rendering streamed text when custom blocks arrive mid-stream', () => {
    jest.useFakeTimers()

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
    store.getState().startStreamingMessage('session-1', {
      id: 'assistant-stream',
      sessionId: 'session-1',
      role: 'assistant',
      content: '',
      status: 'streaming',
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
              <div data-testid="custom-block">{String((block.data as any).toolName)}</div>
            ) : null,
        }}
      >
        <ChatThread />
      </ChatContext.Provider>,
    )

    const pushStreamingContent = (content: string) => {
      act(() => {
        store.getState().patchStreamingMessage('session-1', { content })
      })
      act(() => {
        jest.advanceTimersByTime(400)
      })
    }

    pushStreamingContent('信')
    expect(screen.getByTestId('chat-message-content')).toHaveTextContent('信')

    pushStreamingContent('信息')
    expect(screen.getByTestId('chat-message-content')).toHaveTextContent('信')

    act(() => {
      store.getState().patchStreamingMessage('session-1', {
        blocks: [
          {
            type: 'custom',
            kind: 'tool_approval_request',
            data: {
              requestId: 'req-1',
              sessionId: 'session-1',
              mode: 'agent',
              toolName: 'get_equation',
              toolInput: "{'id': 55}",
              timeoutSec: 120,
            },
          } as ChatMessageBlock,
        ],
      })
    })

    expect(screen.getByTestId('custom-block')).toHaveTextContent('get_equation')
    expect(screen.getByTestId('chat-message-content')).toHaveTextContent('信')

    pushStreamingContent('信息，')
    expect(screen.getByTestId('chat-message-content')).toHaveTextContent('信息')

    pushStreamingContent('信息，了')
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(screen.getByText('信息，了')).toBeInTheDocument()

    jest.useRealTimers()
  })

  it('uses configurable localized labels for message roles and status text', () => {
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
      id: 'user-1',
      sessionId: 'session-1',
      role: 'user',
      content: '你好',
      createdAt: '2026-03-25T00:00:01.000Z',
    })
    store.getState().appendMessage('session-1', {
      id: 'assistant-1',
      sessionId: 'session-1',
      role: 'assistant',
      content: '已停止',
      status: 'stopped',
      createdAt: '2026-03-25T00:00:02.000Z',
    })

    render(
      <ChatContext.Provider
        value={{
          store,
          transport,
          axios: axios.create(),
          apiBaseUrl: 'http://test',
          authToken: 'Bearer token',
          labels: {
            ...DEFAULT_AI_CHAT_LABELS,
            userRoleLabel: '用户',
            assistantRoleLabel: '助手',
            stoppedResponse: '回答已中断',
            assistantStreamingAriaLabel: '助手生成中',
          },
          enableImageAttachments: true,
          sendRef: { current: async (_content: string) => {} },
          retryRef: { current: async () => {} },
        }}
      >
        <ChatThread />
      </ChatContext.Provider>,
    )

    expect(screen.getByText('用户')).toBeInTheDocument()
    expect(screen.getByText('助手')).toBeInTheDocument()
    expect(screen.getByTestId('chat-message-stopped-tag')).toHaveTextContent('回答已中断')
  })
})
