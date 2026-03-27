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
  isStopping: boolean
  onStop: () => void | Promise<void>
  onSend: () => void | Promise<void>
}

export const ChatSendActions = ({
  canSend,
  isStreaming,
  isStopping,
  onStop,
  onSend,
}: ChatSendActionsProps) => (
  <>
    {isStreaming ? (
      <StopButton
        type="button"
        aria-label="Stop"
        aria-busy={isStopping}
        data-testid="chat-composer-stop"
        disabled={isStopping}
        shape="circle"
        onClick={() => void onStop()}
      >
        {isStopping ? (
          <StopSpinner aria-hidden="true" data-testid="chat-composer-stop-spinner" />
        ) : (
          <StopGlyph aria-hidden="true" data-testid="chat-composer-stop-glyph" />
        )}
      </StopButton>
    ) : (
      <PrimaryButton
        $canSend={canSend}
        type="button"
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

const PrimaryButton = styled(Button)<{ $canSend: boolean }>`
  && {
    min-width: 24px;
    width: 24px;
    height: 24px;
    background: ${({ $canSend }) => ($canSend ? '#fcfbf8' : 'rgba(255, 255, 255, 0.3)')};
    color: ${({ $canSend }) => ($canSend ? '#5b5448' : 'rgba(255, 255, 255, 0.72)')};
    border-radius: 12px;
    border: 1px solid ${({ $canSend }) => ($canSend ? 'rgba(198, 188, 170, 0.38)' : 'transparent')};
    box-shadow: ${({ $canSend }) =>
      $canSend
        ? 'inset 0 1px 0 rgba(255, 255, 255, 0.92), 0 8px 18px rgba(0, 0, 0, 0.18)'
        : 'none'};
    svg {
      color: currentColor;
      stroke: currentColor;
    }

    &:hover:not(:disabled) {
      background: ${({ $canSend }) => ($canSend ? '#f7f4ec' : 'rgba(255, 255, 255, 0.3)')};
      color: ${({ $canSend }) => ($canSend ? '#4f493f' : 'rgba(255, 255, 255, 0.72)')};
      border-color: ${({ $canSend }) => ($canSend ? 'rgba(198, 188, 170, 0.46)' : 'transparent')};
    }

    &:disabled {
      cursor: not-allowed;
    }
  }
`

const StopButton = styled(Button)`
  && {
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
  }
`

const StopGlyph = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: #1b1b1b;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);
`

const StopSpinner = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  border: 1.5px solid rgba(27, 27, 27, 0.2);
  border-top-color: #1b1b1b;
  animation: chat-composer-stop-spin 0.7s linear infinite;

  @keyframes chat-composer-stop-spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
`
