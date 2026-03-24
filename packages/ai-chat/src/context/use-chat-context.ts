import { useContext } from 'react'
import { useStore } from 'zustand/react'
import { ChatContext } from './chat-context'
import type { ChatStore } from '../store/chat-store'

export const useChatContext = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChatContext must be used inside AiChatProvider')
  return ctx
}

export const useChatStore = <T>(selector: (state: ChatStore) => T): T => {
  const { store } = useChatContext()
  return useStore(store, selector)
}
