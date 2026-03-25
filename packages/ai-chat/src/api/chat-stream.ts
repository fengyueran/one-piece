import type {
  ChatAgentMode,
  ChatStreamPacket,
  ChatStreamPacketData,
  ChatStreamPacketUpdate,
  ChatStructuredStreamPacketData,
} from '../types'

const CHAT_COMPLETIONS_PATH = '/chat/completions'

export interface StartChatStreamOptions {
  apiBaseUrl: string
  endpointPath?: string
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

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isPayloadPacketData = (value: unknown): value is ChatStreamPacketData =>
  isObjectRecord(value) && Array.isArray(value.payload)

const isStructuredPacketData = (value: unknown): value is ChatStructuredStreamPacketData =>
  isObjectRecord(value) && ('content' in value || 'message' in value || 'blocks' in value)

const parseSseEvent = (eventText: string): ChatStreamPacket | null => {
  const dataLine = eventText
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.startsWith('data:'))

  if (!dataLine) return null

  const raw = dataLine.slice(5).trim()
  if (!raw) return null

  try {
    return JSON.parse(raw) as ChatStreamPacket
  } catch {
    return null
  }
}

/**
 * Extracts a normalized message patch from a backend stream packet.
 */
export const extractChatStreamUpdate = (
  packet: ChatStreamPacket,
): ChatStreamPacketUpdate | null => {
  if (packet.type !== 'delta' && packet.type !== 'message_complete') {
    return null
  }

  if (isPayloadPacketData(packet.data)) {
    const contentDelta = packet.data.payload[0]?.delta?.content ?? ''
    return contentDelta ? { contentDelta } : null
  }

  if (!isStructuredPacketData(packet.data)) {
    return null
  }

  const content =
    typeof packet.data.content === 'string'
      ? packet.data.content
      : typeof packet.data.message === 'string'
        ? packet.data.message
        : undefined
  const blocks = Array.isArray(packet.data.blocks) ? packet.data.blocks : undefined

  if (content === undefined && blocks === undefined) {
    return null
  }

  return {
    ...(content !== undefined ? { content } : {}),
    ...(blocks !== undefined ? { blocks } : {}),
  }
}

/**
 * Open a streaming chat response using fetch + ReadableStream and parse the
 * backend's custom SSE packet envelope.
 */
export const startChatStream = async ({
  apiBaseUrl,
  endpointPath = CHAT_COMPLETIONS_PATH,
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

    const response = await fetch(`${apiBaseUrl}${endpointPath}`, {
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
