import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import type { ChatMessage } from '../../../types'
import {
  getNextDisplayedUnitCount,
  splitMarkdownBlocks,
  STREAM_FRESH_BLOCK_SETTLE_MS,
  STREAM_INPUT_BATCH_WINDOW_MS,
  STREAM_REVEAL_TICK_MS,
} from '../lib/message-reveal'

export interface UseChatMessageRevealResult {
  isAssistantStreaming: boolean
  displayedContent: string
  settledContent: string
  freshContent: string
}

interface RevealState {
  batchedTargetUnitCount: number
  displayedUnitCount: number
  isFreshBlockActive: boolean
}

type RevealAction =
  | {
      type: 'reset-message'
      isAssistantStreaming: boolean
      targetUnitCount: number
    }
  | {
      type: 'commit-batched-target'
      isAssistantStreaming: boolean
      nextTargetUnitCount: number
      role: ChatMessage['role']
    }
  | {
      type: 'set-fresh-block-active'
      isActive: boolean
    }
  | {
      type: 'sync-displayed-target'
    }
  | {
      type: 'advance-reveal'
      isAssistantStreaming: boolean
    }

const createRevealState = ({
  isAssistantStreaming,
  targetUnitCount,
}: {
  isAssistantStreaming: boolean
  targetUnitCount: number
}): RevealState => {
  const initialDisplayedUnitCount = isAssistantStreaming ? 0 : targetUnitCount

  return {
    batchedTargetUnitCount: initialDisplayedUnitCount,
    displayedUnitCount: initialDisplayedUnitCount,
    isFreshBlockActive: false,
  }
}

const revealReducer = (state: RevealState, action: RevealAction): RevealState => {
  switch (action.type) {
    case 'reset-message':
      return createRevealState(action)
    case 'commit-batched-target': {
      const nextDisplayedUnitCount =
        action.role === 'assistant'
          ? getNextDisplayedUnitCount({
              currentUnits: state.displayedUnitCount,
              targetUnits: action.nextTargetUnitCount,
              isStreaming: action.isAssistantStreaming,
              minimumStep: state.displayedUnitCount > 0 && action.isAssistantStreaming ? 2 : 1,
            })
          : action.nextTargetUnitCount

      return {
        ...state,
        batchedTargetUnitCount: action.nextTargetUnitCount,
        displayedUnitCount: nextDisplayedUnitCount,
      }
    }
    case 'set-fresh-block-active':
      return state.isFreshBlockActive === action.isActive
        ? state
        : {
            ...state,
            isFreshBlockActive: action.isActive,
          }
    case 'sync-displayed-target':
      return state.displayedUnitCount === state.batchedTargetUnitCount
        ? state
        : {
            ...state,
            displayedUnitCount: state.batchedTargetUnitCount,
          }
    case 'advance-reveal': {
      if (state.displayedUnitCount >= state.batchedTargetUnitCount) {
        return state
      }

      return {
        ...state,
        displayedUnitCount: Math.min(
          state.batchedTargetUnitCount,
          getNextDisplayedUnitCount({
            currentUnits: state.displayedUnitCount,
            targetUnits: state.batchedTargetUnitCount,
            isStreaming: action.isAssistantStreaming,
          }),
        ),
      }
    }
    default:
      return state
  }
}

export const useChatMessageReveal = (message: ChatMessage): UseChatMessageRevealResult => {
  const isAssistantStreaming = message.role === 'assistant' && message.status === 'streaming'
  const targetContent = message.content || ''
  const targetUnits = useMemo(() => Array.from(targetContent), [targetContent])
  const pendingTargetUnitCountRef = useRef(targetUnits.length)
  const batchedTargetUnitCountRef = useRef(isAssistantStreaming ? 0 : targetUnits.length)
  const inputBatchTimeoutRef = useRef<number | null>(null)
  const lastDisplayedBlockCountRef = useRef(0)
  const previousMessageIdRef = useRef(message.id)
  const [state, dispatch] = useReducer(
    revealReducer,
    {
      isAssistantStreaming,
      targetUnitCount: targetUnits.length,
    },
    createRevealState,
  )

  const { batchedTargetUnitCount, displayedUnitCount, isFreshBlockActive } = state

  const commitBatchedTargetUnitCount = useCallback(
    (nextTargetUnitCount: number) => {
      batchedTargetUnitCountRef.current = nextTargetUnitCount
      dispatch({
        type: 'commit-batched-target',
        isAssistantStreaming,
        nextTargetUnitCount,
        role: message.role,
      })
    },
    [isAssistantStreaming, message.role],
  )

  useEffect(() => {
    if (previousMessageIdRef.current === message.id) {
      return
    }

    previousMessageIdRef.current = message.id
    pendingTargetUnitCountRef.current = targetUnits.length
    batchedTargetUnitCountRef.current = isAssistantStreaming ? 0 : targetUnits.length
    lastDisplayedBlockCountRef.current = 0

    if (inputBatchTimeoutRef.current !== null) {
      window.clearTimeout(inputBatchTimeoutRef.current)
      inputBatchTimeoutRef.current = null
    }

    dispatch({
      type: 'reset-message',
      isAssistantStreaming,
      targetUnitCount: targetUnits.length,
    })
  }, [isAssistantStreaming, message.id, targetUnits.length])

  useEffect(() => {
    pendingTargetUnitCountRef.current = targetUnits.length

    if (message.role !== 'assistant' || !isAssistantStreaming) {
      if (inputBatchTimeoutRef.current !== null) {
        window.clearTimeout(inputBatchTimeoutRef.current)
        inputBatchTimeoutRef.current = null
      }

      commitBatchedTargetUnitCount(targetUnits.length)
      return
    }

    if (targetUnits.length <= batchedTargetUnitCountRef.current) {
      return
    }

    if (batchedTargetUnitCountRef.current === 0) {
      commitBatchedTargetUnitCount(targetUnits.length)
      return
    }

    if (inputBatchTimeoutRef.current !== null) {
      return
    }

    inputBatchTimeoutRef.current = window.setTimeout(() => {
      inputBatchTimeoutRef.current = null
      commitBatchedTargetUnitCount(pendingTargetUnitCountRef.current)
    }, STREAM_INPUT_BATCH_WINDOW_MS)

    return () => {
      if (inputBatchTimeoutRef.current !== null) {
        window.clearTimeout(inputBatchTimeoutRef.current)
        inputBatchTimeoutRef.current = null
      }
    }
  }, [commitBatchedTargetUnitCount, isAssistantStreaming, message.role, targetUnits.length])

  const displayedContent = useMemo(
    () => targetUnits.slice(0, displayedUnitCount).join(''),
    [displayedUnitCount, targetUnits],
  )
  const contentBlocks = useMemo(() => splitMarkdownBlocks(displayedContent), [displayedContent])

  useEffect(() => {
    const hasNewDisplayedBlock =
      message.role === 'assistant' &&
      contentBlocks.length > 1 &&
      contentBlocks.length > lastDisplayedBlockCountRef.current

    lastDisplayedBlockCountRef.current = contentBlocks.length

    if (!hasNewDisplayedBlock) {
      return
    }

    dispatch({ type: 'set-fresh-block-active', isActive: true })

    const timer = window.setTimeout(() => {
      dispatch({ type: 'set-fresh-block-active', isActive: false })
    }, STREAM_FRESH_BLOCK_SETTLE_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [contentBlocks.length, message.role])

  useEffect(() => {
    const shouldAnimateReveal =
      message.role === 'assistant' &&
      displayedUnitCount < batchedTargetUnitCount &&
      (isAssistantStreaming || displayedUnitCount > 0)

    if (!shouldAnimateReveal) {
      if (displayedUnitCount !== batchedTargetUnitCount) {
        dispatch({ type: 'sync-displayed-target' })
      }
      return
    }

    const timer = window.setInterval(() => {
      dispatch({ type: 'advance-reveal', isAssistantStreaming })
    }, STREAM_REVEAL_TICK_MS)

    return () => {
      window.clearInterval(timer)
    }
  }, [batchedTargetUnitCount, displayedUnitCount, isAssistantStreaming, message.role])

  const settledContent = isFreshBlockActive
    ? contentBlocks.slice(0, -1).join('\n\n')
    : displayedContent
  const freshContent = isFreshBlockActive ? (contentBlocks[contentBlocks.length - 1] ?? '') : ''

  return {
    isAssistantStreaming,
    displayedContent,
    settledContent,
    freshContent,
  }
}
