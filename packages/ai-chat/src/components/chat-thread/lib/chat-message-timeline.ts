import { splitMarkdownBlocks } from './message-reveal'
import type { ChatMessageBlock } from '../../../types'

const stringifyTimelineKeyPart = (value: unknown): string => {
  if (value === null || value === undefined) {
    return String(value)
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stringifyTimelineKeyPart(item)).join(',')}]`
  }

  if (typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
      .map(([key, nestedValue]) => `${key}:${stringifyTimelineKeyPart(nestedValue)}`)
      .join(',')}}`
  }

  return String(value)
}

export type MessageBodySegment =
  | {
      type: 'text'
      content?: string
      displayedBlocks?: Array<{ content: string; tone: 'fresh' | 'settled' }>
      useTimelineSegmentation?: boolean
    }
  | { type: 'markdown'; content: string }
  | {
      type: 'block'
      block: ChatMessageBlock
      index: number
    }

export const getTimelineBlockKey = (block: ChatMessageBlock, index: number) => {
  switch (block.type) {
    case 'markdown':
      return null
    case 'notice':
      return `${index}:notice:${block.tone}:${block.text}`
    case 'parameter_summary':
      return `${index}:parameter_summary:${block.items
        .map((item) => `${item.label}:${item.value}:${item.fieldPath ?? ''}`)
        .join('|')}`
    case 'confirmation_card':
      return `${index}:confirmation_card:${block.proposal.proposalId}`
    case 'result_summary':
      return `${index}:result_summary:${block.summary.summaryId}:${block.summary.status}`
    case 'questionnaire':
      return `${index}:questionnaire:${block.questionnaire.questionnaireId}`
    case 'custom':
      return block.blockKey
        ? `custom:${block.blockKey}`
        : `${index}:custom:${block.kind}:${stringifyTimelineKeyPart(block.data)}`
    default:
      return null
  }
}

export const getTimelineConsumedText = (blocks: ChatMessageBlock[]) =>
  blocks
    .filter(
      (block): block is Extract<ChatMessageBlock, { type: 'markdown' }> =>
        block.type === 'markdown',
    )
    .map((block) => block.text)
    .join('\n\n')

export const getTimelineTextStream = (content: string, blocks: ChatMessageBlock[]) => {
  const consumedText = getTimelineConsumedText(blocks)

  if (consumedText.length > 0 && content.startsWith(consumedText)) {
    return content.slice(consumedText.length)
  }

  return content
}

export const buildTimelineTextDisplay = (
  content: string,
  isAssistantStreaming: boolean,
  isFreshBlockActive = isAssistantStreaming,
) => {
  const contentBlocks = splitMarkdownBlocks(content)
  const settledContent =
    isAssistantStreaming && isFreshBlockActive && contentBlocks.length > 1
      ? contentBlocks.slice(0, -1).join('\n\n')
      : content
  const freshContent =
    isAssistantStreaming && isFreshBlockActive && contentBlocks.length > 1
      ? (contentBlocks[contentBlocks.length - 1] ?? '')
      : ''
  const displayedBlocks =
    contentBlocks.length > 1
      ? contentBlocks.map((blockContent, index) => ({
          content: blockContent,
          tone:
            isAssistantStreaming &&
            isFreshBlockActive &&
            freshContent &&
            index === contentBlocks.length - 1
              ? ('fresh' as const)
              : ('settled' as const),
        }))
      : [{ content, tone: 'settled' as const }]

  return {
    settledContent,
    freshContent,
    displayedBlocks,
  }
}

export const getTimelineDisplayUnitCount = (content: string) =>
  splitMarkdownBlocks(content).reduce((count, block) => count + Array.from(block).length, 0)

export const buildAnchoredTimelineSegments = ({
  blocks,
  timelineBlockAnchors,
  timelineDisplayedBlocks,
  visibleTimelineBlockKeys,
}: {
  blocks: ChatMessageBlock[]
  timelineBlockAnchors: Record<string, number>
  timelineDisplayedBlocks: Array<{ content: string; tone: 'fresh' | 'settled' }>
  visibleTimelineBlockKeys?: Record<string, true>
}): MessageBodySegment[] => {
  const orderedTimelineSegments: MessageBodySegment[] = []
  const totalTimelineUnits = timelineDisplayedBlocks.reduce(
    (count, block) => count + Array.from(block.content).length,
    0,
  )
  let textCursor = 0

  const buildTextSegment = (
    start: number,
    end: number,
    options?: { forceSettled?: boolean },
  ): MessageBodySegment | null => {
    if (end <= start) {
      return null
    }

    const displayedBlocks: Array<{ content: string; tone: 'fresh' | 'settled' }> = []
    let blockCursor = 0

    for (const block of timelineDisplayedBlocks) {
      const blockUnits = Array.from(block.content)
      const blockStart = blockCursor
      const blockEnd = blockCursor + blockUnits.length

      if (blockEnd <= start) {
        blockCursor = blockEnd
        continue
      }

      if (blockStart >= end) {
        break
      }

      const sliceStart = Math.max(0, start - blockStart)
      const sliceEnd = Math.min(blockUnits.length, end - blockStart)
      const slicedContent = blockUnits.slice(sliceStart, sliceEnd).join('')

      if (slicedContent) {
        displayedBlocks.push({
          content: slicedContent,
          tone: options?.forceSettled ? 'settled' : block.tone,
        })
      }

      blockCursor = blockEnd
    }

    const content = displayedBlocks.map((block) => block.content).join('\n\n')
    if (!content) {
      return null
    }

    return {
      type: 'text',
      content,
      displayedBlocks,
      useTimelineSegmentation: true,
    }
  }

  // Tracks the upper bound for trailing text. An invisible block sets a cutoff at its anchor;
  // a subsequent visible block resets it to allow full trailing text after that block.
  let trailingCutoff = totalTimelineUnits

  for (const [index, block] of blocks.entries()) {
    if (block.type === 'markdown') {
      orderedTimelineSegments.push({
        type: 'markdown',
        content: block.text,
      })
      continue
    }

    const blockKey = getTimelineBlockKey(block, index)
    const anchor =
      blockKey !== null
        ? (timelineBlockAnchors[blockKey] ?? totalTimelineUnits)
        : totalTimelineUnits
    const isBlockVisible =
      blockKey !== null && visibleTimelineBlockKeys?.[blockKey]
        ? true
        : anchor <= totalTimelineUnits

    if (anchor > textCursor) {
      const textSegment = buildTextSegment(textCursor, Math.min(anchor, totalTimelineUnits), {
        forceSettled: isBlockVisible,
      })
      if (textSegment) {
        orderedTimelineSegments.push(textSegment)
      }
    }

    if (!isBlockVisible) {
      textCursor = Math.min(anchor, totalTimelineUnits)
      trailingCutoff = Math.min(trailingCutoff, textCursor)
      continue
    }

    // Visible block clears any pending cutoff so trailing text flows past it.
    trailingCutoff = totalTimelineUnits
    orderedTimelineSegments.push({
      type: 'block',
      block,
      index,
    })
    textCursor = Math.max(textCursor, anchor)
  }

  const trailingTextSegment = buildTextSegment(textCursor, trailingCutoff)
  if (trailingTextSegment) {
    orderedTimelineSegments.push(trailingTextSegment)
  }

  return orderedTimelineSegments
}
