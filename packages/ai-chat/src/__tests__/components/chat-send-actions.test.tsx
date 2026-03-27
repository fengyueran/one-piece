import { render, screen } from '@testing-library/react'
import { ChatSendActions } from '../../components/chat-composer/components/chat-send-actions'

describe('ChatSendActions', () => {
  it('uses a dedicated highlighted palette when the composer can send', () => {
    render(
      <ChatSendActions
        canSend
        isStreaming={false}
        isStopping={false}
        onStop={() => {}}
        onSend={() => {}}
      />,
    )

    expect(screen.getByTestId('chat-composer-send')).toHaveStyle({
      background: '#fcfbf8',
      color: '#5b5448',
    })
  })

  it('shows a loading spinner on the stop button while stopping is pending', () => {
    render(<ChatSendActions canSend isStreaming isStopping onStop={() => {}} onSend={() => {}} />)

    const stopButton = screen.getByTestId('chat-composer-stop')
    expect(stopButton).toBeDisabled()
    expect(stopButton).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByTestId('chat-composer-stop-spinner')).toBeInTheDocument()
    expect(stopButton).not.toContainElement(screen.queryByTestId('chat-composer-stop-glyph'))
  })
})
