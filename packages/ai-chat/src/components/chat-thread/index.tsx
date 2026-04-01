import { useCallback, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
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
import { CHAT_THREAD_SCROLL_TOP_GAP } from './lib/chat-thread'
import { ChatMessageItem } from './components/chat-message-item'
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

interface ChatConversationTurn {
  id: string
  userMessage?: ChatMessage
  responseMessages: ChatMessage[]
}

const renderChatMessage = ({
  message,
  mode,
  onConfirmationSubmit,
  onQuestionnaireSubmit,
  renderMessageBlock,
}: {
  message: ChatMessage
  mode: ChatAgentMode
  onConfirmationSubmit?: (submission: ExecutionConfirmationSubmission) => void
  onQuestionnaireSubmit?: (submission: PlanQuestionnaireSubmission) => void
  renderMessageBlock?: ChatMessageBlockRenderer
}) => (
  <ChatMessageItem
    mode={mode}
    message={message}
    onConfirmationSubmit={onConfirmationSubmit}
    onQuestionnaireSubmit={onQuestionnaireSubmit}
    renderMessageBlock={renderMessageBlock}
  />
)

const renderErrorState = ({
  error,
  onRetry,
  retryButtonLabel,
}: {
  error: string
  onRetry?: () => void
  retryButtonLabel: string
}): ReactNode => (
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
)

const groupConversationTurns = (
  historyMessages: ChatMessage[],
  streamingMessage?: ChatMessage,
): ChatConversationTurn[] => {
  const turns: ChatConversationTurn[] = []
  let currentTurn: ChatConversationTurn | null = null

  historyMessages.forEach((message) => {
    if (message.role === 'user') {
      currentTurn = {
        id: message.id,
        userMessage: message,
        responseMessages: [],
      }
      turns.push(currentTurn)
      return
    }

    if (!currentTurn) {
      currentTurn = {
        id: `assistant-turn-${message.id}`,
        responseMessages: [message],
      }
      turns.push(currentTurn)
      return
    }

    currentTurn.responseMessages.push(message)
  })

  if (!streamingMessage) {
    return turns
  }

  const lastTurn = turns[turns.length - 1]
  if (lastTurn) {
    return [
      ...turns.slice(0, -1),
      {
        ...lastTurn,
        responseMessages: [...lastTurn.responseMessages, streamingMessage],
      },
    ]
  }

  return [
    {
      id: `assistant-turn-${streamingMessage.id}`,
      responseMessages: [streamingMessage],
    },
  ]
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
  const conversationTurns = useMemo(
    () => groupConversationTurns(historyMessages, streamingMessage),
    [historyMessages, streamingMessage],
  )
  const latestTurn = conversationTurns[conversationTurns.length - 1]
  const previousTurns = conversationTurns.slice(0, -1)
  const latestUserMessageId = latestTurn?.userMessage?.id
  const latestUserMessageRef = useRef<HTMLDivElement | null>(null)
  const reservedSpaceFrameRef = useRef<number | null>(null)
  const [latestTurnMinHeight, setLatestTurnMinHeight] = useState(0)

  const measureLatestTurnMinHeight = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const computedStyle = window.getComputedStyle(container)
    const paddingTop = Number.parseFloat(computedStyle.paddingTop || '0') || 0
    const paddingBottom = Number.parseFloat(computedStyle.paddingBottom || '0') || 0
    const nextMinHeight = Math.max(0, container.clientHeight - paddingTop - paddingBottom)

    setLatestTurnMinHeight((current) => (current === nextMinHeight ? current : nextMinHeight))
  }, [])

  const scrollLatestUserMessageToTop = useCallback(() => {
    const container = containerRef.current
    const target = latestUserMessageRef.current
    if (!container || !target) return

    const containerRect = container.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const nextScrollTop = Math.max(
      0,
      container.scrollTop + (targetRect.top - containerRect.top) - CHAT_THREAD_SCROLL_TOP_GAP,
    )

    if (typeof container.scrollTo === 'function') {
      container.scrollTo({
        top: nextScrollTop,
        behavior: 'auto',
      })
      return
    }

    container.scrollTop = nextScrollTop
  }, [])

  useLayoutEffect(() => {
    if (reservedSpaceFrameRef.current !== null) {
      window.cancelAnimationFrame(reservedSpaceFrameRef.current)
      reservedSpaceFrameRef.current = null
    }

    if (!latestUserMessageId) {
      reservedSpaceFrameRef.current = window.requestAnimationFrame(() => {
        reservedSpaceFrameRef.current = null
        setLatestTurnMinHeight((current) => (current === 0 ? current : 0))
      })
      return () => {
        if (reservedSpaceFrameRef.current !== null) {
          window.cancelAnimationFrame(reservedSpaceFrameRef.current)
          reservedSpaceFrameRef.current = null
        }
      }
    }

    reservedSpaceFrameRef.current = window.requestAnimationFrame(() => {
      reservedSpaceFrameRef.current = null
      measureLatestTurnMinHeight()
      scrollLatestUserMessageToTop()
    })

    return () => {
      if (reservedSpaceFrameRef.current !== null) {
        window.cancelAnimationFrame(reservedSpaceFrameRef.current)
        reservedSpaceFrameRef.current = null
      }
    }
  }, [latestUserMessageId, measureLatestTurnMinHeight, scrollLatestUserMessageToTop])

  useLayoutEffect(() => {
    if (!latestUserMessageId) return

    const handleResize = () => {
      measureLatestTurnMinHeight()
      scrollLatestUserMessageToTop()
    }

    const container = containerRef.current
    let resizeObserver: ResizeObserver | null = null

    if (container && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        handleResize()
      })
      resizeObserver.observe(container)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener('resize', handleResize)
    }
  }, [latestUserMessageId, measureLatestTurnMinHeight, scrollLatestUserMessageToTop])

  return (
    <Container ref={containerRef} data-testid="chat-thread">
      {previousTurns.map((turn) => (
        <ConversationTurn key={turn.id} data-testid="chat-thread-turn">
          {turn.userMessage ? (
            <MessageSlot>
              {renderChatMessage({
                message: turn.userMessage,
                mode: activeSessionMode,
                onConfirmationSubmit,
                onQuestionnaireSubmit,
                renderMessageBlock,
              })}
            </MessageSlot>
          ) : null}
          {turn.responseMessages.map((message) => (
            <MessageSlot key={message.id}>
              {renderChatMessage({
                message,
                mode: activeSessionMode,
                onConfirmationSubmit,
                onQuestionnaireSubmit,
                renderMessageBlock,
              })}
            </MessageSlot>
          ))}
        </ConversationTurn>
      ))}
      {latestTurn ? (
        <ConversationTurn
          data-testid="chat-thread-latest-turn"
          style={latestTurnMinHeight > 0 ? { minHeight: `${latestTurnMinHeight}px` } : undefined}
        >
          {latestTurn.userMessage ? (
            <MessageSlot
              ref={latestUserMessageRef}
              data-testid="chat-latest-user-anchor"
              style={{ scrollMarginTop: `${CHAT_THREAD_SCROLL_TOP_GAP}px` }}
            >
              {renderChatMessage({
                message: latestTurn.userMessage,
                mode: activeSessionMode,
                onConfirmationSubmit,
                onQuestionnaireSubmit,
                renderMessageBlock,
              })}
            </MessageSlot>
          ) : null}
          {latestTurn.responseMessages.map((message) => (
            <MessageSlot key={message.id}>
              {renderChatMessage({
                message,
                mode: activeSessionMode,
                onConfirmationSubmit,
                onQuestionnaireSubmit,
                renderMessageBlock,
              })}
            </MessageSlot>
          ))}
          {error ? renderErrorState({ error, onRetry, retryButtonLabel }) : null}
        </ConversationTurn>
      ) : null}
      {!latestTurn && error ? renderErrorState({ error, onRetry, retryButtonLabel }) : null}
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
  const {
    sendRef,
    retryRef,
    renderMessageBlock,
    handleQuestionnaireSubmit: customQuestionnaireSubmit,
    handleConfirmationSubmit: customConfirmationSubmit,
    labels,
  } = useChatContext()

  const handleRetry = useCallback(() => {
    if (!activeSessionId) return
    clearSessionError(activeSessionId)
    void retryRef.current()
  }, [activeSessionId, clearSessionError, retryRef])

  const handleQuestionnaireSubmit = useCallback(
    async (submission: PlanQuestionnaireSubmission) => {
      if (customQuestionnaireSubmit) {
        await customQuestionnaireSubmit(submission, {
          sessionId: activeSessionId ?? undefined,
          mode: activeSessionMode,
        })
      } else {
        await sendRef.current(submission.content)
      }

      if (activeSessionId && submission.sourceMessageId) {
        updateQA(
          activeSessionId,
          submission.sourceMessageId,
          submission.questionnaireId,
          submission.answers,
        )
      }
    },
    [activeSessionId, activeSessionMode, updateQA, sendRef, customQuestionnaireSubmit],
  )

  const handleConfirmation = useCallback(
    async (submission: ExecutionConfirmationSubmission) => {
      if (customConfirmationSubmit) {
        await customConfirmationSubmit(submission, {
          sessionId: activeSessionId ?? undefined,
          mode: activeSessionMode,
        })
        return
      }
      await sendRef.current(submission.content)
    },
    [activeSessionId, activeSessionMode, sendRef, customConfirmationSubmit],
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
      onConfirmationSubmit={handleConfirmation}
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

const ConversationTurn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
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
