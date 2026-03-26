import { act, renderHook } from '@testing-library/react'
import { useChatMessageReveal } from '../../components/chat-thread/hooks/use-chat-message-reveal'
import type { ChatMessage } from '../../types'

const createStreamingMessage = (content: string): ChatMessage => ({
  id: 'assistant-1',
  sessionId: 'session-1',
  role: 'assistant',
  content,
  status: 'streaming',
  createdAt: '2026-03-26T00:00:00.000Z',
})

describe('useChatMessageReveal', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('reveals streaming content progressively', () => {
    const { result } = renderHook(() => useChatMessageReveal(createStreamingMessage('Hello')))

    expect(result.current.displayedContent).toBe('H')

    act(() => {
      jest.advanceTimersByTime(36)
    })

    expect(result.current.displayedContent.length).toBeGreaterThan(1)
    expect(result.current.displayedContent).not.toBe('Hello')

    act(() => {
      jest.advanceTimersByTime(200)
    })

    expect(result.current.displayedContent).toBe('Hello')
  })
})
