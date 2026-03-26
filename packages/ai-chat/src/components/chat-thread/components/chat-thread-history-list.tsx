import { memo, type RefObject, type Ref } from 'react'
import styled from '@emotion/styled'
import type {
  ChatAgentMode,
  ChatMessage,
  ChatMessageBlockRenderer,
  ExecutionConfirmationSubmission,
  PlanQuestionnaireSubmission,
} from '../../../types'
import { CHAT_THREAD_SCROLL_TOP_GAP } from '../lib/chat-thread'
import { ChatMessageItem } from './chat-message-item'

interface ChatThreadHistoryListProps {
  mode: ChatAgentMode
  historyMessages: ChatMessage[]
  latestUserMessageId?: string
  latestUserMessageRef: RefObject<HTMLDivElement | null>
  onConfirmationSubmit?: (submission: ExecutionConfirmationSubmission) => void
  onQuestionnaireSubmit?: (submission: PlanQuestionnaireSubmission) => void
  renderMessageBlock?: ChatMessageBlockRenderer
}

export const ChatThreadHistoryList = memo(
  ({
    mode,
    historyMessages,
    latestUserMessageId,
    latestUserMessageRef,
    onConfirmationSubmit,
    onQuestionnaireSubmit,
    renderMessageBlock,
  }: ChatThreadHistoryListProps) => (
    <HistoryGroup data-testid="chat-thread-history">
      {historyMessages.map((message) => (
        <MessageSlot
          key={message.id}
          ref={
            message.id === latestUserMessageId
              ? (latestUserMessageRef as Ref<HTMLDivElement>)
              : null
          }
          data-testid={message.id === latestUserMessageId ? 'chat-latest-user-anchor' : undefined}
          style={
            message.id === latestUserMessageId
              ? {
                  scrollMarginTop: `${CHAT_THREAD_SCROLL_TOP_GAP}px`,
                }
              : undefined
          }
        >
          <ChatMessageItem
            mode={mode}
            message={message}
            onConfirmationSubmit={onConfirmationSubmit}
            onQuestionnaireSubmit={onQuestionnaireSubmit}
            renderMessageBlock={renderMessageBlock}
          />
        </MessageSlot>
      ))}
    </HistoryGroup>
  ),
)

ChatThreadHistoryList.displayName = 'ChatThreadHistoryList'

const HistoryGroup = styled.div`
  display: contents;
`

const MessageSlot = styled.div`
  display: flex;
  align-items: flex-start;
`
