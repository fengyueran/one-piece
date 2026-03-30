import { renderHook, waitFor } from '@testing-library/react'
import { useTimelineBlockAnchors } from '../../components/chat-thread/hooks/use-timeline-block-anchors'
import type { ChatMessage, ChatMessageBlock } from '../../types'

const createStreamingMessage = ({
  id,
  content,
  blocks,
}: {
  id: string
  content: string
  blocks?: ChatMessageBlock[]
}): ChatMessage => ({
  id,
  sessionId: 'session-1',
  role: 'assistant',
  content,
  blocks,
  status: 'streaming',
  createdAt: '2026-03-30T00:00:00.000Z',
})

describe('useTimelineBlockAnchors', () => {
  it('does not leak visible timeline block state across message switches', async () => {
    const firstBlocks = [
      {
        type: 'custom',
        kind: 'tool_approval_request',
        data: { requestId: 'req-1', toolName: 'get_equation_default_params' },
      } as ChatMessageBlock,
    ]
    const secondBlocks = [
      {
        type: 'custom',
        kind: 'tool_approval_request',
        data: { requestId: 'req-1', toolName: 'get_equation_default_params' },
      } as ChatMessageBlock,
    ]

    const { result, rerender } = renderHook<
      ReturnType<typeof useTimelineBlockAnchors>,
      {
        blocks: ChatMessageBlock[]
        displayedTimelineTextLength: number
        message: ChatMessage
      }
    >(
      ({ blocks, displayedTimelineTextLength, message }) =>
        useTimelineBlockAnchors({
          blocks,
          displayedTimelineTextLength,
          isAssistantStreaming: true,
          message,
          messageRenderOrder: 'timeline',
        }),
      {
        initialProps: {
          blocks: [],
          displayedTimelineTextLength: 0,
          message: createStreamingMessage({
            id: 'assistant-1',
            content: '第一条消息正文',
            blocks: [],
          }),
        },
      },
    )

    rerender({
      blocks: firstBlocks,
      displayedTimelineTextLength: '第一条消息正文'.length,
      message: createStreamingMessage({
        id: 'assistant-1',
        content: '第一条消息正文',
        blocks: firstBlocks,
      }),
    })

    await waitFor(() => {
      expect(Object.keys(result.current.visibleTimelineBlockKeys)).toHaveLength(1)
    })

    rerender({
      blocks: secondBlocks,
      displayedTimelineTextLength: 0,
      message: createStreamingMessage({
        id: 'assistant-2',
        content: '',
        blocks: secondBlocks,
      }),
    })

    expect(result.current.visibleTimelineBlockKeys).toEqual({})
  })
})
