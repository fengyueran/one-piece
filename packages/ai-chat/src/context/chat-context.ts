import { createContext } from 'react'
import type { AxiosInstance } from 'axios'
import type { ChatStoreInstance } from '../store/chat-store'
import type { AiChatLabels } from '../types'

export interface ChatContextValue {
  store: ChatStoreInstance
  axios: AxiosInstance
  apiBaseUrl: string
  authToken: string
  labels: Required<AiChatLabels>
}

export const ChatContext = createContext<ChatContextValue | null>(null)
