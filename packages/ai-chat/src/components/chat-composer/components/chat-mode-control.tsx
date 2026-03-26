import styled from '@emotion/styled'
import { Select } from '@xinghunm/compass-ui'
import { CHAT_AGENT_MODES, type ChatAgentMode } from '../../../types'

interface ChatModeControlProps {
  /** Currently selected agent mode. */
  value: ChatAgentMode
  disabled?: boolean
  /** Display labels for each mode — passed down from useChatContext().labels. */
  labels: { ask: string; plan: string; agent: string }
  onChange: (mode: ChatAgentMode) => void
}

/**
 * Agent mode selector aligned with the existing model picker interaction.
 */
export const ChatModeControl = ({
  value,
  disabled = false,
  labels,
  onChange,
}: ChatModeControlProps) => {
  return (
    <ModeSelect
      data-testid="chat-mode-select"
      aria-label="Select mode"
      value={value}
      disabled={disabled}
      onChange={(v: unknown) => onChange(String(v) as ChatAgentMode)}
      options={CHAT_AGENT_MODES.map((mode) => ({
        label: labels[mode],
        value: mode,
      }))}
    />
  )
}

const ModeSelect = styled(Select)`
  && {
    flex: 0 1 auto;
    width: auto;
    min-width: 0;
    max-width: 100%;

    .compass-select-selector {
      line-height: 1;
      border-radius: 999px;
      min-height: 24px;
      height: 24px;
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(255, 255, 255, 0.12);
      color: rgba(255, 255, 255, 0.82);
      padding: 4px 12px;
    }
  }
`
