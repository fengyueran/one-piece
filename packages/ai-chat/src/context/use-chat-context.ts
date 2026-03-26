import { useContext } from 'react'
import { useStore } from 'zustand/react'
import { ChatContext } from './chat-context'
import type { ChatStore } from '../store/chat-store'

/**
 * Returns the active AI chat context from `AiChatProvider`.
 *
 * @throws {Error} When called outside of `AiChatProvider`.
 */
export const useChatContext = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChatContext must be used inside AiChatProvider')
  return ctx
}

/**
 * Selects a slice from the internal chat Zustand store.
 *
 * @param selector Receives the full chat store and returns the desired slice.
 * @throws {Error} When called outside of `AiChatProvider`.
 */
export const useChatStore = <T>(selector: (state: ChatStore) => T): T => {
  const { store } = useChatContext()
  return useStore(store, selector)
}
