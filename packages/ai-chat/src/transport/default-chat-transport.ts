import axios, { type AxiosInstance } from 'axios'
import { getChatModels, terminateChat } from '../api'
import { extractChatStreamUpdate, startChatStream } from '../api/chat-stream'
import type { ChatTransport, TransformChatStreamPacket } from '../types'

/**
 * Endpoint overrides for the built-in HTTP transport adapter.
 */
export interface DefaultChatTransportEndpoints {
  /** Relative path used to fetch the available model list. */
  models?: string
  /** Relative path used to start a streaming chat completion. */
  completions?: string
  /** Relative path used to request stream termination. */
  terminate?: string
}

const DEFAULT_CHAT_TRANSPORT_ENDPOINTS: Required<DefaultChatTransportEndpoints> = {
  models: '/models',
  completions: '/chat/completions',
  terminate: '/chat/terminate',
}

/**
 * Options for the built-in HTTP transport adapter.
 */
export interface CreateDefaultChatTransportOptions {
  /** Base URL of the backend that serves the built-in chat endpoints. */
  apiBaseUrl: string
  /** Authorization header value forwarded to the backend. */
  authToken: string
  /** Optional extra headers appended to each streaming chat completion request. */
  streamHeaders?: Record<string, string>
  /** Optional transformer used to normalize custom stream packets. */
  transformStreamPacket?: TransformChatStreamPacket
  /** Optional endpoint overrides for backends that use different paths. */
  endpoints?: DefaultChatTransportEndpoints
  /** Optional preconfigured axios instance reused for non-streaming requests. */
  axiosInstance?: AxiosInstance
}

/**
 * Creates the built-in transport backed by the current HTTP chat API.
 */
export const createDefaultChatTransport = ({
  apiBaseUrl,
  authToken,
  streamHeaders,
  transformStreamPacket,
  endpoints,
  axiosInstance,
}: CreateDefaultChatTransportOptions): ChatTransport => {
  const client =
    axiosInstance ?? axios.create({ baseURL: apiBaseUrl, headers: { Authorization: authToken } })
  const resolvedEndpoints = {
    ...DEFAULT_CHAT_TRANSPORT_ENDPOINTS,
    ...endpoints,
  }

  return {
    getModels: () => getChatModels(client, resolvedEndpoints.models),
    startStream: async ({
      sessionId,
      model,
      mode,
      content,
      signal,
      onUpdate,
      onSessionId,
      onDone,
      onError,
    }) => {
      await startChatStream({
        apiBaseUrl,
        endpointPath: resolvedEndpoints.completions,
        sessionId,
        authToken,
        requestHeaders: streamHeaders,
        model,
        mode,
        content,
        signal,
        onSessionId,
        onDone,
        onError,
        onPacket: (packet) => {
          const defaultUpdate = extractChatStreamUpdate(packet)
          const nextUpdate = transformStreamPacket?.({ packet, defaultUpdate }) ?? defaultUpdate

          if (!nextUpdate) {
            return
          }

          onUpdate(nextUpdate)
        },
      })
    },
    terminateStream: (sessionId) => terminateChat(client, sessionId, resolvedEndpoints.terminate),
  }
}
