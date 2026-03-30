import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChatMessage, ChatMessageRenderOrder } from '../../../types'
import {
  getTimelineBlockKey,
  getTimelineDisplayUnitCount,
  getTimelineTextStream,
} from '../lib/chat-message-timeline'

export const useTimelineBlockAnchors = ({
  blocks,
  displayedTimelineTextLength,
  isAssistantStreaming,
  message,
  messageRenderOrder,
}: {
  blocks: NonNullable<ChatMessage['blocks']>
  displayedTimelineTextLength: number
  isAssistantStreaming: boolean
  message: ChatMessage
  messageRenderOrder: ChatMessageRenderOrder
}) => {
  const [timelineBlockAnchors, setTimelineBlockAnchors] = useState<Record<string, number>>({})
  const [visibleTimelineBlockKeys, setVisibleTimelineBlockKeys] = useState<Record<string, true>>({})
  const currentTimelineBlockKeys = useMemo(
    () =>
      blocks
        .map((block, index) => getTimelineBlockKey(block, index))
        .filter((blockKey): blockKey is string => Boolean(blockKey)),
    [blocks],
  )
  const timelineTextStreamLength = useMemo(
    () => getTimelineDisplayUnitCount(getTimelineTextStream(message.content, blocks)),
    [blocks, message.content],
  )
  const previousTimelineStateRef = useRef<{
    messageId: string
    blockKeys: string[]
    textLength: number
  }>({
    messageId: message.id,
    blockKeys: currentTimelineBlockKeys,
    textLength: timelineTextStreamLength,
  })
  const effectiveTimelineBlockAnchors = useMemo(() => {
    if (messageRenderOrder !== 'timeline' || !isAssistantStreaming) {
      return timelineBlockAnchors
    }

    const previousTimelineState = previousTimelineStateRef.current
    const previousBlockKeys = new Set(previousTimelineState.blockKeys)

    return currentTimelineBlockKeys.reduce<Record<string, number>>(
      (acc, blockKey) => {
        const existingAnchor = timelineBlockAnchors[blockKey]
        if (existingAnchor !== undefined) {
          acc[blockKey] = existingAnchor
          return acc
        }

        if (!previousBlockKeys.has(blockKey)) {
          acc[blockKey] = timelineTextStreamLength
        }

        return acc
      },
      { ...timelineBlockAnchors },
    )
  }, [
    currentTimelineBlockKeys,
    isAssistantStreaming,
    messageRenderOrder,
    timelineBlockAnchors,
    timelineTextStreamLength,
  ])

  useEffect(() => {
    const previousTimelineState = previousTimelineStateRef.current

    if (previousTimelineState.messageId !== message.id) {
      if (Object.keys(timelineBlockAnchors).length > 0) {
        setTimelineBlockAnchors({})
      }
      if (Object.keys(visibleTimelineBlockKeys).length > 0) {
        setVisibleTimelineBlockKeys({})
      }
      previousTimelineStateRef.current = {
        messageId: message.id,
        blockKeys: currentTimelineBlockKeys,
        textLength: timelineTextStreamLength,
      }
      return
    }

    if (messageRenderOrder === 'timeline' && isAssistantStreaming) {
      const previousBlockKeys = new Set(previousTimelineState.blockKeys)
      const nextAnchors = currentTimelineBlockKeys.reduce<Record<string, number>>(
        (acc, blockKey) => {
          const existingAnchor = timelineBlockAnchors[blockKey]

          if (existingAnchor !== undefined) {
            acc[blockKey] = existingAnchor
            return acc
          }

          if (!previousBlockKeys.has(blockKey)) {
            acc[blockKey] = timelineTextStreamLength
          }

          return acc
        },
        {},
      )

      const hasAnchorChanged =
        Object.keys(nextAnchors).length !== Object.keys(timelineBlockAnchors).length ||
        Object.entries(nextAnchors).some(
          ([blockKey, anchor]) => timelineBlockAnchors[blockKey] !== anchor,
        )

      if (hasAnchorChanged) {
        setTimelineBlockAnchors(nextAnchors)
      }
    } else if (messageRenderOrder !== 'timeline' && Object.keys(timelineBlockAnchors).length > 0) {
      setTimelineBlockAnchors({})
    }

    previousTimelineStateRef.current = {
      messageId: message.id,
      blockKeys: currentTimelineBlockKeys,
      textLength: timelineTextStreamLength,
    }
  }, [
    currentTimelineBlockKeys,
    isAssistantStreaming,
    message.id,
    message.content,
    messageRenderOrder,
    timelineBlockAnchors,
    timelineTextStreamLength,
    visibleTimelineBlockKeys,
  ])

  useEffect(() => {
    if (messageRenderOrder !== 'timeline') {
      if (Object.keys(visibleTimelineBlockKeys).length > 0) {
        setVisibleTimelineBlockKeys({})
      }
      return
    }

    const nextVisibleBlockKeys = currentTimelineBlockKeys.reduce<Record<string, true>>(
      (acc, blockKey) => {
        if (visibleTimelineBlockKeys[blockKey]) {
          acc[blockKey] = true
          return acc
        }

        const anchor = effectiveTimelineBlockAnchors[blockKey]
        if (anchor !== undefined && anchor <= displayedTimelineTextLength) {
          acc[blockKey] = true
        }

        return acc
      },
      {},
    )

    const hasVisibleBlockChanged =
      Object.keys(nextVisibleBlockKeys).length !== Object.keys(visibleTimelineBlockKeys).length ||
      Object.keys(nextVisibleBlockKeys).some((blockKey) => !visibleTimelineBlockKeys[blockKey])

    if (hasVisibleBlockChanged) {
      setVisibleTimelineBlockKeys(nextVisibleBlockKeys)
    }
  }, [
    currentTimelineBlockKeys,
    displayedTimelineTextLength,
    effectiveTimelineBlockAnchors,
    messageRenderOrder,
    timelineBlockAnchors,
    visibleTimelineBlockKeys,
  ])

  return {
    timelineBlockAnchors: effectiveTimelineBlockAnchors,
    visibleTimelineBlockKeys,
  }
}
