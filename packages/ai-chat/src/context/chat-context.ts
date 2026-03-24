import { createContext, type MutableRefObject } from 'react'
import type { AxiosInstance } from 'axios'
import type { ChatStoreInstance } from '../store/chat-store'
import type { AiChatLabels } from '../types'

export interface ChatContextValue {
  store: ChatStoreInstance
  axios: AxiosInstance
  apiBaseUrl: string
  authToken: string
  labels: Required<AiChatLabels>
  /** Stable ref populated by ChatComposer on mount; allows ChatThread to trigger sends. */
  sendRef: MutableRefObject<(content: string) => Promise<void>>
}

export const ChatContext = createContext<ChatContextValue | null>(null)
