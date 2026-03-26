import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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

export const useChatMessageReveal = (message: ChatMessage): UseChatMessageRevealResult => {
  const isAssistantStreaming = message.role === 'assistant' && message.status === 'streaming'
  const targetContent = message.content || ''
  const targetUnits = useMemo(() => Array.from(targetContent), [targetContent])
  const resetSnapshot = useMemo(
    () => ({
      messageId: message.id,
      initialTargetUnitCount: targetUnits.length,
      initialBatchedTargetUnitCount: isAssistantStreaming ? 0 : targetUnits.length,
    }),
    [isAssistantStreaming, message.id, targetUnits.length],
  )
  const pendingTargetUnitCountRef = useRef(targetUnits.length)
  const batchedTargetUnitCountRef = useRef(isAssistantStreaming ? 0 : targetUnits.length)
  const inputBatchTimeoutRef = useRef<number | null>(null)
  const commitAnimationFrameRef = useRef<number | null>(null)
  const freshBlockActivationFrameRef = useRef<number | null>(null)
  const displayedUnitSyncFrameRef = useRef<number | null>(null)
  const resetAnimationFrameRef = useRef<number | null>(null)
  const [batchedTargetUnitCount, setBatchedTargetUnitCount] = useState(() =>
    isAssistantStreaming ? 0 : targetUnits.length,
  )
  const lastDisplayedBlockCountRef = useRef(0)
  const [displayedUnitCount, setDisplayedUnitCount] = useState(() =>
    isAssistantStreaming ? 0 : targetUnits.length,
  )
  const [isFreshBlockActive, setIsFreshBlockActive] = useState(false)

  const commitBatchedTargetUnitCount = useCallback(
    (nextTargetUnitCount: number) => {
      batchedTargetUnitCountRef.current = nextTargetUnitCount
      setBatchedTargetUnitCount(nextTargetUnitCount)
      setDisplayedUnitCount((current) =>
        message.role === 'assistant'
          ? getNextDisplayedUnitCount({
              currentUnits: current,
              targetUnits: nextTargetUnitCount,
              isStreaming: isAssistantStreaming,
              minimumStep: current > 0 && isAssistantStreaming ? 2 : 1,
            })
          : nextTargetUnitCount,
      )
    },
    [isAssistantStreaming, message.role],
  )

  const scheduleBatchedTargetUnitCountCommit = useCallback(
    (nextTargetUnitCount: number) => {
      if (commitAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(commitAnimationFrameRef.current)
      }

      commitAnimationFrameRef.current = window.requestAnimationFrame(() => {
        commitAnimationFrameRef.current = null
        commitBatchedTargetUnitCount(nextTargetUnitCount)
      })
    },
    [commitBatchedTargetUnitCount],
  )

  useEffect(() => {
    pendingTargetUnitCountRef.current = resetSnapshot.initialTargetUnitCount
    batchedTargetUnitCountRef.current = resetSnapshot.initialBatchedTargetUnitCount
    lastDisplayedBlockCountRef.current = 0

    if (inputBatchTimeoutRef.current !== null) {
      window.clearTimeout(inputBatchTimeoutRef.current)
      inputBatchTimeoutRef.current = null
    }

    if (commitAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(commitAnimationFrameRef.current)
      commitAnimationFrameRef.current = null
    }

    if (freshBlockActivationFrameRef.current !== null) {
      window.cancelAnimationFrame(freshBlockActivationFrameRef.current)
      freshBlockActivationFrameRef.current = null
    }

    if (displayedUnitSyncFrameRef.current !== null) {
      window.cancelAnimationFrame(displayedUnitSyncFrameRef.current)
      displayedUnitSyncFrameRef.current = null
    }

    if (resetAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(resetAnimationFrameRef.current)
    }

    resetAnimationFrameRef.current = window.requestAnimationFrame(() => {
      resetAnimationFrameRef.current = null
      setBatchedTargetUnitCount(resetSnapshot.initialBatchedTargetUnitCount)
      setDisplayedUnitCount(resetSnapshot.initialBatchedTargetUnitCount)
      setIsFreshBlockActive(false)
    })

    return () => {
      if (resetAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(resetAnimationFrameRef.current)
        resetAnimationFrameRef.current = null
      }
    }
  }, [resetSnapshot])

  useEffect(() => {
    pendingTargetUnitCountRef.current = targetUnits.length

    if (message.role !== 'assistant' || !isAssistantStreaming) {
      if (inputBatchTimeoutRef.current !== null) {
        window.clearTimeout(inputBatchTimeoutRef.current)
        inputBatchTimeoutRef.current = null
      }

      scheduleBatchedTargetUnitCountCommit(targetUnits.length)
      return
    }

    if (targetUnits.length <= batchedTargetUnitCountRef.current) {
      return
    }

    if (batchedTargetUnitCountRef.current === 0) {
      scheduleBatchedTargetUnitCountCommit(targetUnits.length)
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
  }, [
    commitBatchedTargetUnitCount,
    isAssistantStreaming,
    message.role,
    scheduleBatchedTargetUnitCountCommit,
    targetUnits.length,
  ])

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

    freshBlockActivationFrameRef.current = window.requestAnimationFrame(() => {
      freshBlockActivationFrameRef.current = null
      setIsFreshBlockActive(true)
    })

    const timer = window.setTimeout(() => {
      setIsFreshBlockActive(false)
    }, STREAM_FRESH_BLOCK_SETTLE_MS)

    return () => {
      if (freshBlockActivationFrameRef.current !== null) {
        window.cancelAnimationFrame(freshBlockActivationFrameRef.current)
        freshBlockActivationFrameRef.current = null
      }
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
        displayedUnitSyncFrameRef.current = window.requestAnimationFrame(() => {
          displayedUnitSyncFrameRef.current = null
          setDisplayedUnitCount(batchedTargetUnitCount)
        })
      }
      return () => {
        if (displayedUnitSyncFrameRef.current !== null) {
          window.cancelAnimationFrame(displayedUnitSyncFrameRef.current)
          displayedUnitSyncFrameRef.current = null
        }
      }
    }

    const timer = window.setInterval(() => {
      setDisplayedUnitCount((current) => {
        if (current >= batchedTargetUnitCount) {
          window.clearInterval(timer)
          return current
        }

        return Math.min(
          batchedTargetUnitCount,
          getNextDisplayedUnitCount({
            currentUnits: current,
            targetUnits: batchedTargetUnitCount,
            isStreaming: isAssistantStreaming,
          }),
        )
      })
    }, STREAM_REVEAL_TICK_MS)

    return () => {
      window.clearInterval(timer)
    }
  }, [batchedTargetUnitCount, displayedUnitCount, isAssistantStreaming, message.role])

  const settledContent = isFreshBlockActive
    ? contentBlocks.slice(0, -1).join('\n\n')
    : displayedContent
  const freshContent = isFreshBlockActive ? (contentBlocks.at(-1) ?? '') : ''

  return {
    isAssistantStreaming,
    displayedContent,
    settledContent,
    freshContent,
  }
}
