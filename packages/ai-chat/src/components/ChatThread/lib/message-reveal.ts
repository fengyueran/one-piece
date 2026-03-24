export const STREAM_REVEAL_TICK_MS = 36
export const STREAM_FRESH_BLOCK_SETTLE_MS = 180
export const STREAM_INPUT_BATCH_WINDOW_MS = 48

export const getRevealStep = ({
  backlogUnits,
  isStreaming,
  totalUnits,
}: {
  backlogUnits: number
  isStreaming: boolean
  totalUnits: number
}) => {
  if (!isStreaming) {
    return Math.max(24, Math.ceil(backlogUnits / 2))
  }

  if (backlogUnits >= 240) {
    return Math.max(24, Math.ceil(backlogUnits / 8))
  }

  if (backlogUnits >= 120) {
    return Math.max(10, Math.ceil(backlogUnits / 12))
  }

  if (backlogUnits >= 48) {
    return Math.max(2, Math.ceil(backlogUnits / 24))
  }

  if (totalUnits >= 200 && backlogUnits >= 24) {
    return 4
  }

  return 1
}

export const getNextDisplayedUnitCount = ({
  currentUnits,
  targetUnits,
  isStreaming,
  minimumStep = 1,
}: {
  currentUnits: number
  targetUnits: number
  isStreaming: boolean
  minimumStep?: number
}) => {
  if (currentUnits >= targetUnits) {
    return currentUnits
  }

  const revealStep = getRevealStep({
    backlogUnits: targetUnits - currentUnits,
    isStreaming,
    totalUnits: targetUnits,
  })

  return Math.min(targetUnits, currentUnits + Math.max(minimumStep, revealStep))
}

export const splitMarkdownBlocks = (content: string) =>
  content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
