import { useRef, useMemo, type ReactNode } from 'react'
import axios from 'axios'
import { ChatContext, type ChatContextValue } from '../../context/chat-context'
import { createChatStore } from '../../store/chat-store'
import { DEFAULT_AI_CHAT_LABELS, type AiChatLabels, type ChatAgentMode } from '../../types'

export interface AiChatProviderProps {
  /** Base URL of the AI chat backend API. */
  apiBaseUrl: string
  /** Authorization header value (e.g. "Bearer <token>"). */
  authToken: string
  /** Initial agent mode for new sessions. */
  defaultMode?: ChatAgentMode
  /** Optional label overrides for UI strings. */
  labels?: AiChatLabels
  /** Child elements rendered inside the provider. */
  children: ReactNode
}

export const AiChatProvider = ({
  apiBaseUrl,
  authToken,
  defaultMode,
  labels,
  children,
}: AiChatProviderProps) => {
  const storeRef = useRef(createChatStore(defaultMode ? { preferredMode: defaultMode } : undefined))
  // Stable ref populated by ChatComposer on mount; allows ChatThread to trigger sends.
  const sendRef = useRef<(content: string) => Promise<void>>(async () => {})

  const axiosInstance = useMemo(
    () => axios.create({ baseURL: apiBaseUrl, headers: { Authorization: authToken } }),
    [apiBaseUrl, authToken],
  )

  const contextValue: ChatContextValue = useMemo(
    () => ({
      store: storeRef.current,
      axios: axiosInstance,
      apiBaseUrl,
      authToken,
      labels: { ...DEFAULT_AI_CHAT_LABELS, ...labels },
      sendRef,
    }),
    [axiosInstance, apiBaseUrl, authToken, labels],
  )

  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
}
