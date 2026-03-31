import axios, { type AxiosInstance } from 'axios'
import { getChatModels, terminateChat } from '../api'
import { extractChatStreamUpdate, startChatStream } from '../api/chat-stream'
import type { ChatAgentMode, ChatTransport, TransformChatStreamPacket } from '../types'

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

/**
 * Tool execution policy applied to outgoing stream requests.
 */
export interface ChatToolExecutionPolicy {
  /** Enables tool execution headers for the stream request. */
  enabled?: boolean
  /** Marks the request as requiring explicit approval before tool execution. */
  approvalRequired?: boolean
  /** Approval timeout in seconds, forwarded when approval is enabled. */
  approvalTimeoutSec?: number
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
  /** Optional tool execution policy translated into stream request headers. */
  toolExecutionPolicy?: ChatToolExecutionPolicy
  /** Optional extra headers appended to each streaming chat completion request. */
  streamHeaders?: Record<string, string>
  /** Optional transformer used to normalize custom stream packets. */
  transformStreamPacket?: TransformChatStreamPacket
  /** Optional endpoint overrides for backends that use different paths. */
  endpoints?: DefaultChatTransportEndpoints
  /** Optional preconfigured axios instance reused for non-streaming requests. */
  axiosInstance?: AxiosInstance
}

const createToolExecutionHeaders = (policy?: ChatToolExecutionPolicy): Record<string, string> => {
  if (!policy?.enabled) {
    return {}
  }

  return {
    'X-Tool-Approval-Required': String(Boolean(policy.approvalRequired)),
    ...(typeof policy.approvalTimeoutSec === 'number'
      ? { 'X-Tool-Approval-Timeout': String(policy.approvalTimeoutSec) }
      : {}),
  }
}

const createModeDefaultHeaders = (mode: ChatAgentMode): Record<string, string> => {
  if (mode === 'ask' || mode === 'plan') {
    return {
      'X-Tool-Approval-Required': 'false',
    }
  }

  return {}
}

/**
 * Creates the built-in transport backed by the current HTTP chat API.
 */
export const createDefaultChatTransport = ({
  apiBaseUrl,
  authToken,
  toolExecutionPolicy,
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
  const resolvedStreamHeaders = {
    ...createToolExecutionHeaders(toolExecutionPolicy),
    ...streamHeaders,
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
      const requestHeaders = {
        ...createModeDefaultHeaders(mode),
        ...resolvedStreamHeaders,
      }

      await startChatStream({
        apiBaseUrl,
        endpointPath: resolvedEndpoints.completions,
        sessionId,
        authToken,
        requestHeaders,
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
