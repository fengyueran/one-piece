import { getSendButtonPalette } from '../../components/chat-composer/components/chat-send-actions'

describe('ChatSendActions', () => {
  it('uses a dedicated highlighted palette when the composer can send', () => {
    expect(getSendButtonPalette(true)).toMatchObject({
      background: '#fcfbf8',
      color: '#1b1b1b',
    })
  })
})
