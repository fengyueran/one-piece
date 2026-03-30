import axios from 'axios'
import { act, render, screen } from '@testing-library/react'
import { ChatThread } from '../../components/chat-thread'
import {
  buildAnchoredTimelineSegments,
  getTimelineBlockKey,
  getTimelineDisplayUnitCount,
} from '../../components/chat-thread/lib/chat-message-timeline'
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
  it('preserves markdown paragraph boundaries when timeline text is split before a custom block', () => {
    const approvalBlock = {
      type: 'custom',
      kind: 'tool_approval_request',
      data: { toolName: 'get_equation_default_params' },
    } as ChatMessageBlock
    const blockKey = getTimelineBlockKey(approvalBlock, 0)
    const paragraphBlocks = [
      { content: '第一步：获取方程列表。', tone: 'settled' as const },
      { content: '第二步：获取默认参数。', tone: 'settled' as const },
    ]

    expect(blockKey).not.toBeNull()

    const segments = buildAnchoredTimelineSegments({
      blocks: [approvalBlock],
      timelineBlockAnchors: {
        [blockKey!]: getTimelineDisplayUnitCount(
          paragraphBlocks.map((block) => block.content).join('\n\n'),
        ),
      },
      timelineDisplayedBlocks: paragraphBlocks,
      visibleTimelineBlockKeys: {
        [blockKey!]: true,
      },
    })

    expect(segments[0]).toEqual({
      type: 'text',
      content: '第一步：获取方程列表。\n\n第二步：获取默认参数。',
      displayedBlocks: [
        { content: '第一步：获取方程列表。', tone: 'settled' },
        { content: '第二步：获取默认参数。', tone: 'settled' },
      ],
      useTimelineSegmentation: true,
    })
  })

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
    expect(screen.getByTestId('chat-message-body-stack')).toHaveTextContent(
      'ExtensibleFollow-up text remains visible.',
    )
  })

  it('keeps plain text ahead of structured blocks when timeline render order is enabled', () => {
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
          messageRenderOrder: 'timeline',
        }}
      >
        <ChatThread />
      </ChatContext.Provider>,
    )

    expect(screen.getByTestId('custom-block')).toHaveTextContent('Extensible')
    expect(screen.getByText('Follow-up text remains visible.')).toBeInTheDocument()
    expect(screen.getByTestId('chat-message-body-stack')).toHaveTextContent(
      'Follow-up text remains visible.Extensible',
    )
  })

  it('keeps markdown timeline blocks ahead of later text when timeline render order is enabled', () => {
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
      content: '已收到审批请求，请确认后继续执行。',
      blocks: [
        { type: 'markdown', text: '已收到审批请求，' },
        { type: 'custom', kind: 'badge', data: { label: 'Approval Card' } } as ChatMessageBlock,
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
          messageRenderOrder: 'timeline',
        }}
      >
        <ChatThread />
      </ChatContext.Provider>,
    )

    expect(screen.getByTestId('chat-message-body-stack')).toHaveTextContent(
      '已收到审批请求，Approval Card请确认后继续执行。',
    )
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

  it('settles timeline text before a later custom block while streaming', () => {
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
          messageRenderOrder: 'timeline',
        }}
      >
        <ChatThread />
      </ChatContext.Provider>,
    )

    act(() => {
      store.getState().patchStreamingMessage('session-1', {
        content: '首先，我需要获取方程列表来确认一维热方程的ID和type。',
      })
    })
    act(() => {
      jest.advanceTimersByTime(1000)
    })

    act(() => {
      store.getState().patchStreamingMessage('session-1', {
        blocks: [
          {
            type: 'custom',
            kind: 'tool_approval_request',
            data: {
              toolName: 'get_equation_default_params',
            },
          } as ChatMessageBlock,
        ],
      })
    })

    expect(screen.getByTestId('chat-message-settled-block')).toHaveTextContent(
      '首先，我需要获取方程列表来确认一维热方程的ID和type',
    )
    expect(screen.queryByTestId('chat-message-fresh-block')).not.toBeInTheDocument()

    act(() => {
      store.getState().patchStreamingMessage('session-1', {
        content:
          '首先，我需要获取方程列表来确认一维热方程的ID和type。接下来，我会获取默认参数配置。',
      })
    })
    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(screen.getByTestId('chat-message-body-stack')).toHaveTextContent(
      '首先，我需要获取方程列表来确认一维热方程的ID和type。get_equation_default_params接下来，我会获取默认参数配置。',
    )

    jest.useRealTimers()
  })

  it('settles anchored text tone once a later approval block becomes visible', () => {
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
          messageRenderOrder: 'timeline',
        }}
      >
        <ChatThread />
      </ChatContext.Provider>,
    )

    act(() => {
      store.getState().patchStreamingMessage('session-1', {
        content:
          '首先，我需要获取方程列表来确认1D热方程的ID和类型。\n\n找到了！1D Forward heat equation的ID是55，type是"equation_heat"。现在我需要获取该方程的默认参数配置。',
      })
    })
    act(() => {
      jest.advanceTimersByTime(5000)
    })

    act(() => {
      store.getState().patchStreamingMessage('session-1', {
        blocks: [
          {
            type: 'custom',
            kind: 'tool_approval_request',
            data: {
              toolName: 'get_equation_default_params',
            },
          } as ChatMessageBlock,
        ],
      })
    })

    expect(screen.getByTestId('chat-message-body-stack')).toHaveTextContent(
      '首先，我需要获取方程列表来确认1D热方程的ID和类型。找到了！1D Forward heat equation的ID是55，type是"equation_heat"。现在我需要获取该方程的默认参数配置。get_equation_default_params',
    )
    expect(screen.queryByTestId('chat-message-fresh-block')).not.toBeInTheDocument()

    jest.useRealTimers()
  })

  it('delays anchored approval blocks until preceding streamed text has finished revealing', () => {
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
          messageRenderOrder: 'timeline',
        }}
      >
        <ChatThread />
      </ChatContext.Provider>,
    )

    act(() => {
      store.getState().patchStreamingMessage('session-1', {
        content:
          '首先，我需要获取方程列表来确认1D热方程的ID和类型。\n\n找到了！1D Forward heat equation的ID是55，type是"equation_heat"。现在我需要获取该方程的默认参数配置。',
      })
    })
    act(() => {
      jest.advanceTimersByTime(1500)
    })

    act(() => {
      store.getState().patchStreamingMessage('session-1', {
        blocks: [
          {
            type: 'custom',
            kind: 'tool_approval_request',
            data: {
              toolName: 'get_equation_default_params',
            },
          } as ChatMessageBlock,
        ],
      })
    })

    expect(screen.queryByTestId('custom-block')).not.toBeInTheDocument()
    expect(screen.getByTestId('chat-message-content')).toHaveTextContent(
      '找到了！1D Forward heat equation的ID是55',
    )

    act(() => {
      jest.advanceTimersByTime(5000)
    })

    expect(screen.getByTestId('custom-block')).toHaveTextContent('get_equation_default_params')
    expect(screen.getByTestId('chat-message-body-stack')).toHaveTextContent(
      '首先，我需要获取方程列表来确认1D热方程的ID和类型。找到了！1D Forward heat equation的ID是55，type是"equation_heat"。现在我需要获取该方程的默认参数配置。get_equation_default_params',
    )

    jest.useRealTimers()
  })

  it('keeps anchored approval blocks in place after the streaming message completes', () => {
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
          messageRenderOrder: 'timeline',
        }}
      >
        <ChatThread />
      </ChatContext.Provider>,
    )

    act(() => {
      store.getState().patchStreamingMessage('session-1', {
        content:
          '第一步：获取方程列表，确认目标方程的ID和type。\n\n第二步：获取方程默认参数配置。\n\n确认目标方程为"1D Forward heat equation"，其ID为55，type为"equation_heat"。现在我将获取该方程的默认参数配置。',
      })
    })
    act(() => {
      jest.advanceTimersByTime(10000)
    })

    act(() => {
      store.getState().patchStreamingMessage('session-1', {
        blocks: [
          {
            type: 'custom',
            kind: 'tool_approval_request',
            data: {
              toolName: 'get_equation_default_params',
            },
          } as ChatMessageBlock,
        ],
      })
    })
    act(() => {
      jest.advanceTimersByTime(5000)
    })

    const bodyStackBeforeComplete = screen.getByTestId('chat-message-body-stack').textContent

    act(() => {
      store.getState().completeStreamingMessage('session-1')
    })

    expect(screen.getByTestId('chat-message-body-stack').textContent).toBe(bodyStackBeforeComplete)

    jest.useRealTimers()
  })

  it('keeps an anchored approval block visible after it has appeared during later stream updates', () => {
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
          messageRenderOrder: 'timeline',
        }}
      >
        <ChatThread />
      </ChatContext.Provider>,
    )

    act(() => {
      store.getState().patchStreamingMessage('session-1', {
        content: '首先，我需要确认一维热方程的ID和类型。\n\n接下来我将获取方程默认参数配置。',
      })
    })
    act(() => {
      jest.advanceTimersByTime(5000)
    })

    act(() => {
      store.getState().patchStreamingMessage('session-1', {
        blocks: [
          {
            type: 'custom',
            kind: 'tool_approval_request',
            data: {
              toolName: 'get_equation_default_params',
            },
          } as ChatMessageBlock,
        ],
      })
    })
    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(screen.getByTestId('custom-block')).toHaveTextContent('get_equation_default_params')

    act(() => {
      store.getState().patchStreamingMessage('session-1', {
        content:
          '首先，我需要确认一维热方程的ID和类型。\n\n接下来我将获取方程默认参数配置。\n\n获取成功后我会继续为您执行下一步。',
      })
    })
    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(screen.getByTestId('custom-block')).toHaveTextContent('get_equation_default_params')

    jest.useRealTimers()
  })

  it('keeps typewriter reveal when streaming markdown blocks are present', () => {
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
        }}
      >
        <ChatThread />
      </ChatContext.Provider>,
    )

    act(() => {
      store.getState().patchStreamingMessage('session-1', {
        content: '信息，了解一下',
        blocks: [{ type: 'markdown', text: '信息，了解一下' }],
      })
    })
    act(() => {
      jest.advanceTimersByTime(36)
    })

    expect(screen.getByTestId('chat-message-content')).toHaveTextContent('信')
    expect(screen.getByTestId('chat-message-content')).not.toHaveTextContent('信息，了解一下')

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
