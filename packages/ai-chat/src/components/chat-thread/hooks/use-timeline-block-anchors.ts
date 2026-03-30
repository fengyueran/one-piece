import { useEffect, useMemo, useReducer } from 'react'
import type { ChatMessage, ChatMessageRenderOrder } from '../../../types'
import {
  getTimelineBlockKey,
  getTimelineDisplayUnitCount,
  getTimelineTextStream,
} from '../lib/chat-message-timeline'

interface TimelineAnchorState {
  messageId: string
  previousBlockKeys: string[]
  timelineBlockAnchors: Record<string, number>
  visibleTimelineBlockKeys: Record<string, true>
}

type TimelineAnchorAction =
  | {
      type: 'reset-message'
      messageId: string
      currentBlockKeys: string[]
    }
  | {
      type: 'sync-anchors'
      currentBlockKeys: string[]
      timelineTextStreamLength: number
    }
  | {
      type: 'sync-visible'
      currentBlockKeys: string[]
      effectiveTimelineBlockAnchors: Record<string, number>
      displayedTimelineTextLength: number
    }

const createTimelineAnchorState = ({
  messageId,
  currentBlockKeys,
}: {
  messageId: string
  currentBlockKeys: string[]
}): TimelineAnchorState => ({
  messageId,
  previousBlockKeys: currentBlockKeys,
  timelineBlockAnchors: {},
  visibleTimelineBlockKeys: {},
})

const timelineAnchorReducer = (
  state: TimelineAnchorState,
  action: TimelineAnchorAction,
): TimelineAnchorState => {
  switch (action.type) {
    case 'reset-message':
      if (state.messageId === action.messageId) {
        return state
      }
      return createTimelineAnchorState(action)
    case 'sync-anchors': {
      const previousBlockKeys = new Set(state.previousBlockKeys)
      const nextAnchors = action.currentBlockKeys.reduce<Record<string, number>>(
        (acc, blockKey) => {
          const existingAnchor = state.timelineBlockAnchors[blockKey]

          if (existingAnchor !== undefined) {
            acc[blockKey] = existingAnchor
            return acc
          }

          if (!previousBlockKeys.has(blockKey)) {
            acc[blockKey] = action.timelineTextStreamLength
          }

          return acc
        },
        {},
      )

      const hasAnchorChanged =
        Object.keys(nextAnchors).length !== Object.keys(state.timelineBlockAnchors).length ||
        Object.entries(nextAnchors).some(
          ([blockKey, anchor]) => state.timelineBlockAnchors[blockKey] !== anchor,
        )

      const hasPreviousKeysChanged =
        action.currentBlockKeys.length !== state.previousBlockKeys.length ||
        action.currentBlockKeys.some(
          (blockKey, index) => state.previousBlockKeys[index] !== blockKey,
        )

      if (!hasAnchorChanged && !hasPreviousKeysChanged) {
        return state
      }

      return {
        ...state,
        previousBlockKeys: action.currentBlockKeys,
        timelineBlockAnchors: hasAnchorChanged ? nextAnchors : state.timelineBlockAnchors,
      }
    }
    case 'sync-visible': {
      const nextVisibleBlockKeys = action.currentBlockKeys.reduce<Record<string, true>>(
        (acc, blockKey) => {
          if (state.visibleTimelineBlockKeys[blockKey]) {
            acc[blockKey] = true
            return acc
          }

          const anchor = action.effectiveTimelineBlockAnchors[blockKey]
          if (anchor !== undefined && anchor <= action.displayedTimelineTextLength) {
            acc[blockKey] = true
          }

          return acc
        },
        {},
      )

      const hasVisibleBlockChanged =
        Object.keys(nextVisibleBlockKeys).length !==
          Object.keys(state.visibleTimelineBlockKeys).length ||
        Object.keys(nextVisibleBlockKeys).some(
          (blockKey) => !state.visibleTimelineBlockKeys[blockKey],
        )

      if (!hasVisibleBlockChanged) {
        return state
      }

      return {
        ...state,
        visibleTimelineBlockKeys: nextVisibleBlockKeys,
      }
    }
    default:
      return state
  }
}

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
  const [state, dispatch] = useReducer(
    timelineAnchorReducer,
    {
      messageId: message.id,
      currentBlockKeys: currentTimelineBlockKeys,
    },
    createTimelineAnchorState,
  )

  const effectiveTimelineBlockAnchors = useMemo(() => {
    if (messageRenderOrder !== 'timeline' || !isAssistantStreaming) {
      return state.timelineBlockAnchors
    }

    const previousBlockKeys = new Set(state.previousBlockKeys)

    return currentTimelineBlockKeys.reduce<Record<string, number>>(
      (acc, blockKey) => {
        const existingAnchor = state.timelineBlockAnchors[blockKey]
        if (existingAnchor !== undefined) {
          acc[blockKey] = existingAnchor
          return acc
        }

        if (!previousBlockKeys.has(blockKey)) {
          acc[blockKey] = timelineTextStreamLength
        }

        return acc
      },
      { ...state.timelineBlockAnchors },
    )
  }, [
    currentTimelineBlockKeys,
    isAssistantStreaming,
    messageRenderOrder,
    state.previousBlockKeys,
    state.timelineBlockAnchors,
    timelineTextStreamLength,
  ])

  useEffect(() => {
    dispatch({
      type: 'reset-message',
      messageId: message.id,
      currentBlockKeys: currentTimelineBlockKeys,
    })
  }, [currentTimelineBlockKeys, message.id])

  useEffect(() => {
    if (messageRenderOrder !== 'timeline' || !isAssistantStreaming) {
      return
    }

    dispatch({
      type: 'sync-anchors',
      currentBlockKeys: currentTimelineBlockKeys,
      timelineTextStreamLength,
    })
  }, [currentTimelineBlockKeys, isAssistantStreaming, messageRenderOrder, timelineTextStreamLength])

  useEffect(() => {
    if (messageRenderOrder !== 'timeline') {
      return
    }

    dispatch({
      type: 'sync-visible',
      currentBlockKeys: currentTimelineBlockKeys,
      effectiveTimelineBlockAnchors,
      displayedTimelineTextLength,
    })
  }, [
    currentTimelineBlockKeys,
    displayedTimelineTextLength,
    effectiveTimelineBlockAnchors,
    messageRenderOrder,
  ])

  return {
    timelineBlockAnchors: messageRenderOrder === 'timeline' ? effectiveTimelineBlockAnchors : {},
    visibleTimelineBlockKeys:
      messageRenderOrder === 'timeline' ? state.visibleTimelineBlockKeys : {},
  }
}
