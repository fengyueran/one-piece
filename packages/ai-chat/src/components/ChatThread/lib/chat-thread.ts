import type { ChatMessage } from '../../../types'

export const CHAT_THREAD_SCROLL_TOP_GAP = 16

/**
 * Returns the latest user-authored message id from the visible history list.
 */
export const findLatestUserMessageId = (historyMessages: ChatMessage[]) => {
  for (let index = historyMessages.length - 1; index >= 0; index -= 1) {
    if (historyMessages[index]?.role === 'user') {
      return historyMessages[index]?.id
    }
  }

  return undefined
}

export interface ChatThreadScrollSpacerArgs {
  containerClientHeight: number
  containerScrollHeight: number
  targetOffsetTop: number
}

/**
 * Computes the extra bottom spacer required so the latest user message can scroll near the top.
 */
export const calculateChatThreadScrollSpacerHeight = ({
  containerClientHeight,
  containerScrollHeight,
  targetOffsetTop,
}: ChatThreadScrollSpacerArgs) =>
  Math.max(
    0,
    targetOffsetTop - CHAT_THREAD_SCROLL_TOP_GAP - (containerScrollHeight - containerClientHeight),
  )
