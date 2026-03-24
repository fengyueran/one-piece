import type { ChatAgentMode, ChatStreamPacket } from '../types'

const CHAT_COMPLETIONS_PATH = '/v1/chat/completions'

export interface StartChatStreamOptions {
  apiBaseUrl: string
  sessionId?: string
  authToken: string
  model: string
  mode: ChatAgentMode
  content: string
  signal?: AbortSignal
  onPacket: (packet: ChatStreamPacket) => void
  onSessionId?: (sessionId: string) => void
  onDone?: () => void
  onError?: (error: Error) => void
}

const SSE_CONTENT_TYPE = 'text/event-stream'

const parseSseEvent = (eventText: string): ChatStreamPacket | null => {
  const dataLine = eventText
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.startsWith('data:'))

  if (!dataLine) return null

  const raw = dataLine.slice(5).trim()
  if (!raw) return null

  return JSON.parse(raw) as ChatStreamPacket
}

/**
 * Open a streaming chat response using fetch + ReadableStream and parse the
 * backend's custom SSE packet envelope.
 */
export const startChatStream = async ({
  apiBaseUrl,
  sessionId,
  authToken,
  model,
  mode,
  content,
  signal,
  onPacket,
  onSessionId,
  onDone,
  onError,
}: StartChatStreamOptions): Promise<void> => {
  try {
    const headers: Record<string, string> = {
      Authorization: authToken,
      'Content-Type': 'application/json',
    }

    if (sessionId) {
      headers['X-Session-ID'] = sessionId
    }

    const response = await fetch(`${apiBaseUrl}${CHAT_COMPLETIONS_PATH}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        mode,
        stream: true,
        messages: [{ role: 'user', content }],
      }),
      signal,
    })

    const contentType = response.headers.get('content-type') ?? ''
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    if (!response.body || !contentType.includes(SSE_CONTENT_TYPE)) {
      throw new Error('Expected SSE response')
    }

    const responseSessionId = response.headers.get('X-Session-ID')?.trim()
    if (responseSessionId) {
      onSessionId?.(responseSessionId)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const events = buffer.split('\n\n')
      buffer = events.pop() ?? ''

      for (const eventText of events) {
        const packet = parseSseEvent(eventText)
        if (!packet) continue

        if (packet.type === 'stream_end' && packet.data === '[DONE]') {
          onDone?.()
          return
        }

        if (packet.type === 'error') {
          throw new Error(
            typeof packet.data === 'string'
              ? packet.data
              : 'message' in packet.data
                ? packet.data.message || 'stream error'
                : 'stream error',
          )
        }

        onPacket(packet)
      }
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return
    }

    const normalizedError = error instanceof Error ? error : new Error('stream error')
    onError?.(normalizedError)
    throw normalizedError
  }
}
