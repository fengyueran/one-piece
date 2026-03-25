import styled from '@emotion/styled'
import { Button } from '@xinghunm/compass-ui'

/** Inline arrow-up icon (replaces SVG file import). */
const ArrowUpIcon = () => (
  <svg
    aria-hidden="true"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 10V2M6 2L2 6M6 2L10 6"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

interface ChatSendActionsProps {
  canSend: boolean
  isStreaming: boolean
  onStop: () => void | Promise<void>
  onSend: () => void | Promise<void>
}

export const ChatSendActions = ({ canSend, isStreaming, onStop, onSend }: ChatSendActionsProps) => {
  return (
    <>
      {isStreaming ? (
        <StopButton
          type="button"
          aria-label="Stop"
          data-testid="chat-composer-stop"
          shape="circle"
          onClick={() => void onStop()}
        >
          <StopGlyph aria-hidden="true" />
        </StopButton>
      ) : (
        <PrimaryButton
          type="button"
          variant="primary"
          icon={<ArrowUpIcon />}
          aria-label="Send"
          data-testid="chat-composer-send"
          disabled={!canSend}
          shape="circle"
          onClick={() => void onSend()}
        />
      )}
    </>
  )
}

const PrimaryButton = styled(Button)`
  min-width: 24px;
  width: 24px;
  height: 24px;
  background: var(--text-primary);
  border-radius: 12px;
  border: none;

  &:hover:not(:disabled) {
    background: rgba(252, 251, 248, 0.8);
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.3);
    cursor: not-allowed;
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`

const StopButton = styled(Button)`
  min-width: 24px;
  width: 24px;
  height: 24px;
  padding: 0;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(244, 244, 244, 0.96) 45%,
    rgba(230, 230, 230, 0.95) 100%
  );
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    0 8px 18px rgba(0, 0, 0, 0.18);

  &:hover:not(:disabled) {
    background: radial-gradient(
      circle at 30% 30%,
      rgba(255, 255, 255, 1) 0%,
      rgba(249, 249, 249, 0.98) 45%,
      rgba(236, 236, 236, 0.98) 100%
    );
  }
`

const StopGlyph = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: #1b1b1b;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);
`
