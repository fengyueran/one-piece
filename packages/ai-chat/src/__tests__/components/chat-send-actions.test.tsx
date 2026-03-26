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
})
