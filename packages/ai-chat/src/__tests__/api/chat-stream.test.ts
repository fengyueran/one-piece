import { startChatStream } from '../../api/chat-stream'

const mockFetch = jest.fn()
global.fetch = mockFetch

const makeStreamResponse = (lines: string[]) => {
  const text = lines.join('\n\n') + '\n\n'
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(text))
      controller.close()
    },
  })
  return {
    ok: true,
    status: 200,
    headers: new Headers({ 'content-type': 'text/event-stream', 'X-Session-ID': 'sess-123' }),
    body: stream,
  }
}

describe('startChatStream', () => {
  beforeEach(() => mockFetch.mockReset())

  it('calls onSessionId with the session ID from response headers', async () => {
    const deltaPacket = JSON.stringify({
      type: 'delta',
      data: {
        id: '1',
        object: 'chat',
        created: 0,
        model: 'm',
        payload: [{ index: 0, delta: { content: 'hi' }, finish_reason: null }],
      },
    })
    const donePacket = JSON.stringify({ type: 'stream_end', data: '[DONE]' })

    mockFetch.mockResolvedValueOnce(
      makeStreamResponse([`data: ${deltaPacket}`, `data: ${donePacket}`]),
    )

    const onSessionId = jest.fn()
    const onPacket = jest.fn()
    const onDone = jest.fn()

    await startChatStream({
      apiBaseUrl: 'http://api.test',
      authToken: 'Bearer tok',
      model: 'gpt-4',
      mode: 'ask',
      content: 'hello',
      onSessionId,
      onPacket,
      onDone,
    })

    expect(onSessionId).toHaveBeenCalledWith('sess-123')
    expect(onPacket).toHaveBeenCalledTimes(1)
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it('calls onError on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500, headers: new Headers(), body: null })
    const onError = jest.fn()
    await startChatStream({
      apiBaseUrl: 'http://api.test',
      authToken: 'Bearer tok',
      model: 'gpt-4',
      mode: 'ask',
      content: 'hello',
      onPacket: jest.fn(),
      onError,
    }).catch(() => {})
    expect(onError).toHaveBeenCalled()
  })
})
