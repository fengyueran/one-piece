import { render, screen } from '@testing-library/react'
import { ChatComposerView } from '../../components/chat-composer'

describe('ChatComposerView', () => {
  it('grows the textarea height with content until the max row limit', () => {
    const originalScrollHeight = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      'scrollHeight',
    )

    Object.defineProperty(HTMLTextAreaElement.prototype, 'scrollHeight', {
      configurable: true,
      get() {
        return 120
      },
    })

    render(
      <ChatComposerView
        value={'line 1\nline 2\nline 3\nline 4\nline 5\nline 6'}
        placeholder="Ask something..."
        attachments={[]}
        attachmentLimitNotice=""
        selectedModel="gpt-4.1"
        selectedMode="agent"
        availableModels={[]}
        isModelsLoading={false}
        isModelsError={false}
        hasModels={true}
        isStreaming={false}
        isStopping={false}
        enableImageAttachments={false}
        modeLabels={{ ask: 'Ask', plan: 'Plan', agent: 'Agent' }}
        onValueChange={() => {}}
        onPickImages={() => {}}
        onPasteImages={() => {}}
        onRemoveAttachment={() => {}}
        onSelectedModelChange={() => {}}
        onSelectedModeChange={() => {}}
        onReloadModels={() => {}}
        onStop={() => {}}
        onSend={() => {}}
      />,
    )

    const input = screen.getByTestId('chat-composer-input')

    expect(input).toHaveStyle({ height: '120px', overflowY: 'hidden' })

    if (originalScrollHeight) {
      Object.defineProperty(HTMLTextAreaElement.prototype, 'scrollHeight', originalScrollHeight)
    }
  })

  it('caps the textarea height and enables scrolling after the max row limit', () => {
    const originalScrollHeight = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      'scrollHeight',
    )

    Object.defineProperty(HTMLTextAreaElement.prototype, 'scrollHeight', {
      configurable: true,
      get() {
        return 240
      },
    })

    render(
      <ChatComposerView
        value={'line 1\nline 2\nline 3\nline 4\nline 5\nline 6\nline 7\nline 8\nline 9'}
        placeholder="Ask something..."
        attachments={[]}
        attachmentLimitNotice=""
        selectedModel="gpt-4.1"
        selectedMode="agent"
        availableModels={[]}
        isModelsLoading={false}
        isModelsError={false}
        hasModels={true}
        isStreaming={false}
        isStopping={false}
        enableImageAttachments={false}
        modeLabels={{ ask: 'Ask', plan: 'Plan', agent: 'Agent' }}
        onValueChange={() => {}}
        onPickImages={() => {}}
        onPasteImages={() => {}}
        onRemoveAttachment={() => {}}
        onSelectedModelChange={() => {}}
        onSelectedModeChange={() => {}}
        onReloadModels={() => {}}
        onStop={() => {}}
        onSend={() => {}}
      />,
    )

    const input = screen.getByTestId('chat-composer-input')

    expect(input).toHaveStyle({ height: '160px', overflowY: 'auto' })

    if (originalScrollHeight) {
      Object.defineProperty(HTMLTextAreaElement.prototype, 'scrollHeight', originalScrollHeight)
    }
  })
})
