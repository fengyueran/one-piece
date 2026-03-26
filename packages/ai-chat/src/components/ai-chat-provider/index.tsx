import { useRef, useMemo, useState, type ReactNode } from 'react'
import axios from 'axios'
import { ChatContext, type ChatContextValue } from '../../context/chat-context'
import { createChatStore } from '../../store/chat-store'
import { createDefaultChatTransport } from '../../transport'
import {
  DEFAULT_AI_CHAT_LABELS,
  type AiChatLabels,
  type ChatAgentMode,
  type ChatMessageBlockRenderer,
  type ChatTransport,
  type TransformChatStreamPacket,
} from '../../types'

interface AiChatProviderBaseProps {
  /** Initial agent mode for new sessions. */
  defaultMode?: ChatAgentMode
  /** Optional label overrides for UI strings. */
  labels?: AiChatLabels
  /** Optional renderer used to extend message blocks with app-specific UI. */
  renderMessageBlock?: ChatMessageBlockRenderer
  /**
   * Whether to enable image attachment uploads. Defaults to `true`.
   * Set to `false` to hide the upload button, disable paste-image handling,
   * and make programmatic `pickImages`/`pasteImages` calls no-ops.
   */
  enableImageAttachments?: boolean
  /** Child elements rendered inside the provider. */
  children: ReactNode
}

interface AiChatProviderDefaultAdapterProps {
  /** Base URL used by the built-in HTTP transport adapter. */
  apiBaseUrl: string
  /** Authorization header value (e.g. "Bearer <token>") used by the built-in adapter. */
  authToken: string
  /** Optional transformer used to adapt custom backend stream packets. */
  transformStreamPacket?: TransformChatStreamPacket
  transport?: never
}

interface AiChatProviderCustomTransportProps {
  /** Fully custom transport implementation used by the generic chat shell. */
  transport: ChatTransport
  apiBaseUrl?: never
  authToken?: never
  transformStreamPacket?: never
}

/**
 * Props accepted by `AiChatProvider`.
 *
 * Recommended:
 * Inject a `transport` adapter so the chat UI can talk to any backend contract.
 *
 * Backward compatibility:
 * `apiBaseUrl` + `authToken` still create the built-in HTTP adapter.
 */
export type AiChatProviderProps = AiChatProviderBaseProps &
  (AiChatProviderDefaultAdapterProps | AiChatProviderCustomTransportProps)

export const AiChatProvider = (props: AiChatProviderProps) => {
  const { defaultMode, labels, renderMessageBlock, enableImageAttachments = true, children } = props
  const [store] = useState(() =>
    createChatStore(defaultMode ? { preferredMode: defaultMode } : undefined),
  )
  // Stable ref populated by ChatComposer on mount; allows ChatThread to trigger sends.
  const sendRef = useRef<(content: string) => Promise<void>>(async () => {})
  // Stable ref populated by ChatComposer on mount; allows ChatThread to replay the last request.
  const retryRef = useRef<() => Promise<void>>(async () => {})

  const defaultApiBaseUrl = 'apiBaseUrl' in props ? props.apiBaseUrl : undefined
  const defaultAuthToken = 'authToken' in props ? props.authToken : undefined
  const defaultTransformStreamPacket =
    'transformStreamPacket' in props ? props.transformStreamPacket : undefined
  const customTransport = 'transport' in props ? props.transport : undefined

  const axiosInstance = useMemo(() => {
    if (!defaultApiBaseUrl || !defaultAuthToken) {
      return undefined
    }

    return axios.create({
      baseURL: defaultApiBaseUrl,
      headers: { Authorization: defaultAuthToken },
    })
  }, [defaultApiBaseUrl, defaultAuthToken])

  const transport = useMemo<ChatTransport>(() => {
    if (customTransport) {
      return customTransport
    }

    if (!defaultApiBaseUrl || !defaultAuthToken) {
      throw new Error('AiChatProvider requires either transport or apiBaseUrl + authToken')
    }

    return createDefaultChatTransport({
      apiBaseUrl: defaultApiBaseUrl,
      authToken: defaultAuthToken,
      transformStreamPacket: defaultTransformStreamPacket,
      axiosInstance,
    })
  }, [
    axiosInstance,
    customTransport,
    defaultApiBaseUrl,
    defaultAuthToken,
    defaultTransformStreamPacket,
  ])

  const contextValue: ChatContextValue = useMemo(
    () => ({
      store,
      transport,
      axios: axiosInstance,
      apiBaseUrl: defaultApiBaseUrl,
      authToken: defaultAuthToken,
      labels: { ...DEFAULT_AI_CHAT_LABELS, ...labels },
      sendRef,
      retryRef,
      renderMessageBlock,
      transformStreamPacket: defaultTransformStreamPacket,
      enableImageAttachments,
    }),
    [
      axiosInstance,
      defaultApiBaseUrl,
      defaultAuthToken,
      defaultTransformStreamPacket,
      enableImageAttachments,
      labels,
      renderMessageBlock,
      sendRef,
      retryRef,
      store,
      transport,
    ],
  )

  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
}
