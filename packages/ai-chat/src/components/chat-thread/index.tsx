import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { DEFAULT_CHAT_AGENT_MODE } from '../../types'
import type {
  ChatAgentMode,
  ChatMessage,
  ChatMessageBlockRenderer,
  ExecutionConfirmationSubmission,
  PlanQuestionnaireSubmission,
} from '../../types'
import { useChatContext, useChatStore } from '../../context/use-chat-context'
import { calculateChatThreadScrollSpacerHeight, findLatestUserMessageId } from './lib/chat-thread'
import { ChatMessageItem } from './components/chat-message-item'
import { ChatThreadHistoryList } from './components/chat-thread-history-list'
import { ChatThreadEmptyState } from './components/chat-thread-empty-state'

// ---------------------------------------------------------------------------
// View (presentational)
// ---------------------------------------------------------------------------

interface ChatThreadViewProps {
  activeSessionMode?: ChatAgentMode
  historyMessages: ChatMessage[]
  streamingMessage?: ChatMessage
  error?: string | null
  retryButtonLabel: string
  onRetry?: () => void
  onConfirmationSubmit?: (submission: ExecutionConfirmationSubmission) => void
  onQuestionnaireSubmit?: (submission: PlanQuestionnaireSubmission) => void
  renderMessageBlock?: ChatMessageBlockRenderer
}

const ChatThreadView = ({
  activeSessionMode = DEFAULT_CHAT_AGENT_MODE,
  historyMessages,
  streamingMessage,
  error,
  retryButtonLabel,
  onRetry,
  onConfirmationSubmit,
  onQuestionnaireSubmit,
  renderMessageBlock,
}: ChatThreadViewProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const latestUserMessageId = useMemo(
    () => findLatestUserMessageId(historyMessages),
    [historyMessages],
  )
  const latestUserMessageRef = useRef<HTMLDivElement | null>(null)
  const pendingScrollUserMessageIdRef = useRef<string | undefined>(undefined)
  const reservedSpaceFrameRef = useRef<number | null>(null)
  const [latestUserMessageReservedSpace, setLatestUserMessageReservedSpace] = useState<{
    messageId?: string
    value: number
  }>({ messageId: undefined, value: 0 })

  const reservedPaddingBottom =
    24 +
    (latestUserMessageReservedSpace.messageId === latestUserMessageId
      ? latestUserMessageReservedSpace.value
      : 0)

  const measureLatestUserMessageReservedSpace = useCallback((messageId: string) => {
    const container = containerRef.current
    const target = latestUserMessageRef.current
    if (!container || !target) return

    const reservedHeight = calculateChatThreadScrollSpacerHeight({
      containerClientHeight: container.clientHeight,
      containerScrollHeight: container.scrollHeight,
      targetOffsetTop: target.offsetTop,
    })

    setLatestUserMessageReservedSpace((current) => {
      const next = reservedHeight > 0 ? reservedHeight : 0
      if (current.messageId === messageId && current.value === next) return current
      return { messageId, value: next }
    })
  }, [])

  useLayoutEffect(() => {
    if (reservedSpaceFrameRef.current !== null) {
      window.cancelAnimationFrame(reservedSpaceFrameRef.current)
      reservedSpaceFrameRef.current = null
    }

    if (!latestUserMessageId) {
      pendingScrollUserMessageIdRef.current = undefined
      reservedSpaceFrameRef.current = window.requestAnimationFrame(() => {
        reservedSpaceFrameRef.current = null
        setLatestUserMessageReservedSpace((current) =>
          current.messageId === undefined && current.value === 0
            ? current
            : { messageId: undefined, value: 0 },
        )
      })
      return () => {
        if (reservedSpaceFrameRef.current !== null) {
          window.cancelAnimationFrame(reservedSpaceFrameRef.current)
          reservedSpaceFrameRef.current = null
        }
      }
    }

    pendingScrollUserMessageIdRef.current = latestUserMessageId
    reservedSpaceFrameRef.current = window.requestAnimationFrame(() => {
      reservedSpaceFrameRef.current = null
      measureLatestUserMessageReservedSpace(latestUserMessageId)
    })

    return () => {
      if (reservedSpaceFrameRef.current !== null) {
        window.cancelAnimationFrame(reservedSpaceFrameRef.current)
        reservedSpaceFrameRef.current = null
      }
    }
  }, [latestUserMessageId, measureLatestUserMessageReservedSpace])

  useLayoutEffect(() => {
    if (!latestUserMessageId || pendingScrollUserMessageIdRef.current !== latestUserMessageId)
      return
    if (latestUserMessageReservedSpace.messageId !== latestUserMessageId) return

    latestUserMessageRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
    pendingScrollUserMessageIdRef.current = undefined
  }, [latestUserMessageId, latestUserMessageReservedSpace])

  return (
    <Container
      ref={containerRef}
      data-testid="chat-thread"
      style={{ paddingBottom: `${reservedPaddingBottom}px` }}
    >
      <ChatThreadHistoryList
        mode={activeSessionMode}
        historyMessages={historyMessages}
        latestUserMessageId={latestUserMessageId}
        latestUserMessageRef={latestUserMessageRef}
        onConfirmationSubmit={onConfirmationSubmit}
        onQuestionnaireSubmit={onQuestionnaireSubmit}
        renderMessageBlock={renderMessageBlock}
      />
      {streamingMessage ? (
        <StreamingGroup data-testid="chat-thread-streaming">
          <MessageSlot>
            <ChatMessageItem
              mode={activeSessionMode}
              message={streamingMessage}
              onConfirmationSubmit={onConfirmationSubmit}
              onQuestionnaireSubmit={onQuestionnaireSubmit}
              renderMessageBlock={renderMessageBlock}
            />
          </MessageSlot>
        </StreamingGroup>
      ) : null}
      {error ? (
        <ErrorState data-testid="chat-thread-error-state">
          <ErrorText>{error}</ErrorText>
          {onRetry ? (
            <ErrorActions>
              <RetryButton type="button" data-testid="chat-thread-retry" onClick={onRetry}>
                {retryButtonLabel}
              </RetryButton>
            </ErrorActions>
          ) : null}
        </ErrorState>
      ) : null}
    </Container>
  )
}

// ---------------------------------------------------------------------------
// Connected component
// ---------------------------------------------------------------------------

// Stable fallback — avoids creating a new array reference on every selector call,
// which would cause useSyncExternalStore (Zustand) to trigger infinite re-renders.
const EMPTY_MESSAGES: ChatMessage[] = []

export const ChatThread = () => {
  const activeSessionId = useChatStore((s) => s.activeSessionId)
  const hasSessions = useChatStore((s) => s.sessions.length > 0)
  const activeSessionMode = useChatStore(
    (s) =>
      s.sessions.find((x) => x.sessionId === s.activeSessionId)?.mode ?? DEFAULT_CHAT_AGENT_MODE,
  )
  const messages = useChatStore(
    (s) => s.messagesBySession[s.activeSessionId ?? ''] ?? EMPTY_MESSAGES,
  )
  const streamingMessage = useChatStore((s) => s.streamingMessageBySession[s.activeSessionId ?? ''])
  const error = useChatStore((s) => s.errorBySession[s.activeSessionId ?? ''])
  const updateQA = useChatStore((s) => s.updateQuestionnaireAnswers)
  const clearSessionError = useChatStore((s) => s.clearSessionError)
  const { sendRef, retryRef, renderMessageBlock, labels } = useChatContext()

  const handleRetry = useCallback(() => {
    if (!activeSessionId) return
    clearSessionError(activeSessionId)
    void retryRef.current()
  }, [activeSessionId, clearSessionError, retryRef])

  const handleQuestionnaireSubmit = useCallback(
    (submission: PlanQuestionnaireSubmission) => {
      if (activeSessionId && submission.sourceMessageId) {
        updateQA(
          activeSessionId,
          submission.sourceMessageId,
          submission.questionnaireId,
          submission.answers,
        )
      }
      void sendRef.current(submission.content)
    },
    [activeSessionId, updateQA, sendRef],
  )

  const handleConfirmationSubmit = useCallback(
    (submission: ExecutionConfirmationSubmission) => {
      void sendRef.current(submission.content)
    },
    [sendRef],
  )

  if (!hasSessions || (messages.length === 0 && !streamingMessage)) {
    return <ChatThreadEmptyState />
  }

  return (
    <ChatThreadView
      activeSessionMode={activeSessionMode}
      historyMessages={messages}
      streamingMessage={streamingMessage}
      error={error}
      retryButtonLabel={labels.retryButton}
      onRetry={handleRetry}
      onConfirmationSubmit={handleConfirmationSubmit}
      onQuestionnaireSubmit={handleQuestionnaireSubmit}
      renderMessageBlock={renderMessageBlock}
    />
  )
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 18px;
  min-height: 0;
  overflow: auto;
  padding: 24px;
  overscroll-behavior: contain;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.18);
    border-radius: 999px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`

const MessageSlot = styled.div`
  display: flex;
`

const StreamingGroup = styled.div`
  display: contents;
`

const ErrorText = styled.div`
  color: #ff7b72;
  font-size: 14px;
`

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`

const ErrorActions = styled.div`
  display: flex;
  align-items: center;
`

const RetryButton = styled.button`
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.82);
  font-size: 12px;
  line-height: 1;
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`
