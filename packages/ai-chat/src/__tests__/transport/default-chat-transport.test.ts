import type { AxiosInstance } from 'axios'
import { createDefaultChatTransport } from '../../transport'

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

describe('createDefaultChatTransport', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('uses custom models and terminate endpoints when configured', async () => {
    const axiosInstance = {
      get: jest.fn().mockResolvedValue({
        data: {
          data: [{ id: 'gpt-4.1', object: 'model' }],
        },
      }),
      post: jest.fn().mockResolvedValue({
        data: { terminated: true },
      }),
    } as unknown as AxiosInstance

    const transport = createDefaultChatTransport({
      apiBaseUrl: 'http://api.test',
      authToken: 'Bearer tok',
      axiosInstance,
      endpoints: {
        models: '/catalog/models',
        terminate: '/chat/stop',
      },
    })

    await transport.getModels()
    await transport.terminateStream('session-1')

    expect(axiosInstance.get).toHaveBeenCalledWith('/catalog/models')
    expect(axiosInstance.post).toHaveBeenCalledWith(
      '/chat/stop',
      { session_id: 'session-1' },
      { headers: { 'X-Session-ID': 'session-1' } },
    )
  })

  it('uses a custom completions endpoint when configured', async () => {
    const donePacket = JSON.stringify({ type: 'stream_end', data: '[DONE]' })
    mockFetch.mockResolvedValueOnce(makeStreamResponse([`data: ${donePacket}`]))

    const transport = createDefaultChatTransport({
      apiBaseUrl: 'http://api.test',
      authToken: 'Bearer tok',
      endpoints: {
        completions: '/chat/run',
      },
    })

    await transport.startStream({
      model: 'gpt-4.1',
      mode: 'agent',
      content: 'hello',
      onUpdate: jest.fn(),
      onDone: jest.fn(),
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'http://api.test/chat/run',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('forwards custom stream headers when configured', async () => {
    const donePacket = JSON.stringify({ type: 'stream_end', data: '[DONE]' })
    mockFetch.mockResolvedValueOnce(makeStreamResponse([`data: ${donePacket}`]))

    const transport = createDefaultChatTransport({
      apiBaseUrl: 'http://api.test',
      authToken: 'Bearer tok',
      streamHeaders: {
        'X-Tool-Approval-Required': 'true',
        'X-Tool-Approval-Timeout': '120',
      },
    })

    await transport.startStream({
      model: 'gpt-4.1',
      mode: 'agent',
      content: 'hello',
      onUpdate: jest.fn(),
      onDone: jest.fn(),
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'http://api.test/chat/completions',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer tok',
          'Content-Type': 'application/json',
          'X-Tool-Approval-Required': 'true',
          'X-Tool-Approval-Timeout': '120',
        }),
      }),
    )
  })

  it('adds tool approval headers from tool execution policy when enabled', async () => {
    const donePacket = JSON.stringify({ type: 'stream_end', data: '[DONE]' })
    mockFetch.mockResolvedValueOnce(makeStreamResponse([`data: ${donePacket}`]))

    const transport = createDefaultChatTransport({
      apiBaseUrl: 'http://api.test',
      authToken: 'Bearer tok',
      toolExecutionPolicy: {
        enabled: true,
        approvalRequired: true,
        approvalTimeoutSec: 120,
      },
    })

    await transport.startStream({
      model: 'gpt-4.1',
      mode: 'agent',
      content: 'hello',
      onUpdate: jest.fn(),
      onDone: jest.fn(),
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'http://api.test/chat/completions',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer tok',
          'Content-Type': 'application/json',
          'X-Tool-Approval-Required': 'true',
          'X-Tool-Approval-Timeout': '120',
        }),
      }),
    )
  })

  it('does not add tool approval headers when tool execution is disabled', async () => {
    const donePacket = JSON.stringify({ type: 'stream_end', data: '[DONE]' })
    mockFetch.mockResolvedValueOnce(makeStreamResponse([`data: ${donePacket}`]))

    const transport = createDefaultChatTransport({
      apiBaseUrl: 'http://api.test',
      authToken: 'Bearer tok',
      toolExecutionPolicy: {
        enabled: false,
        approvalRequired: true,
        approvalTimeoutSec: 120,
      },
    })

    await transport.startStream({
      model: 'gpt-4.1',
      mode: 'plan',
      content: 'hello',
      onUpdate: jest.fn(),
      onDone: jest.fn(),
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'http://api.test/chat/completions',
      expect.objectContaining({
        headers: expect.not.objectContaining({
          'X-Tool-Approval-Required': expect.anything(),
          'X-Tool-Approval-Timeout': expect.anything(),
        }),
      }),
    )
  })

  it('sends X-Tool-Approval-Required=false for ask mode by default', async () => {
    const donePacket = JSON.stringify({ type: 'stream_end', data: '[DONE]' })
    mockFetch.mockResolvedValueOnce(makeStreamResponse([`data: ${donePacket}`]))

    const transport = createDefaultChatTransport({
      apiBaseUrl: 'http://api.test',
      authToken: 'Bearer tok',
    })

    await transport.startStream({
      model: 'gpt-4.1',
      mode: 'ask',
      content: 'hello',
      onUpdate: jest.fn(),
      onDone: jest.fn(),
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'http://api.test/chat/completions',
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Tool-Approval-Required': 'false',
        }),
      }),
    )
  })

  it('sends X-Tool-Approval-Required=false for plan mode by default', async () => {
    const donePacket = JSON.stringify({ type: 'stream_end', data: '[DONE]' })
    mockFetch.mockResolvedValueOnce(makeStreamResponse([`data: ${donePacket}`]))

    const transport = createDefaultChatTransport({
      apiBaseUrl: 'http://api.test',
      authToken: 'Bearer tok',
    })

    await transport.startStream({
      model: 'gpt-4.1',
      mode: 'plan',
      content: 'hello',
      onUpdate: jest.fn(),
      onDone: jest.fn(),
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'http://api.test/chat/completions',
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Tool-Approval-Required': 'false',
        }),
      }),
    )
  })
})
