import { useRef, useMemo, type ReactNode } from 'react'
import axios from 'axios'
import { ChatContext, type ChatContextValue } from '../../context/chat-context'
import { createChatStore } from '../../store/chat-store'
import { DEFAULT_AI_CHAT_LABELS, type AiChatLabels, type ChatAgentMode } from '../../types'

export interface AiChatProviderProps {
  apiBaseUrl: string
  authToken: string
  defaultMode?: ChatAgentMode
  labels?: AiChatLabels
  children: ReactNode
}

export const AiChatProvider = ({
  apiBaseUrl,
  authToken,
  labels,
  children,
}: AiChatProviderProps) => {
  const storeRef = useRef(createChatStore())

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
    }),
    [axiosInstance, apiBaseUrl, authToken, labels],
  )

  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
}
