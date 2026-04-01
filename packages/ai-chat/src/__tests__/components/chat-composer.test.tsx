import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ChatComposerView } from '../../components/chat-composer'

const getExpectedExpandedComposerHeight = () =>
  Math.floor(Math.min(60 * 20 + 20, window.innerHeight * 0.7 - 96))

const createProps = () => ({
  value: 'line 1\nline 2',
  placeholder: 'Ask something...',
  attachments: [],
  attachmentLimitNotice: '',
  selectedModel: 'gpt-4.1',
  selectedMode: 'agent' as const,
  availableModels: [],
  isModelsLoading: false,
  isModelsError: false,
  hasModels: true,
  isStreaming: false,
  isStopping: false,
  enableImageAttachments: false,
  modeLabels: { ask: 'Ask', plan: 'Plan', agent: 'Agent' },
  expandComposerAriaLabel: '展开输入框',
  collapseComposerAriaLabel: '收起输入框',
  onValueChange: () => {},
  onPickImages: () => {},
  onPasteImages: () => {},
  onRemoveAttachment: () => {},
  onSelectedModelChange: () => {},
  onSelectedModeChange: () => {},
  onReloadModels: () => {},
  onStop: () => {},
  onSend: () => {},
})

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
        {...createProps()}
        value={'line 1\nline 2\nline 3\nline 4\nline 5\nline 6'}
      />,
    )

    const input = screen.getByTestId('chat-composer-input')

    expect(input).toHaveStyle({ height: '120px', overflowY: 'hidden' })
    expect(screen.queryByTestId('chat-composer-expand-toggle')).not.toBeInTheDocument()

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
        {...createProps()}
        value={'line 1\nline 2\nline 3\nline 4\nline 5\nline 6\nline 7\nline 8\nline 9'}
      />,
    )

    const input = screen.getByTestId('chat-composer-input')

    expect(input).toHaveStyle({ height: '160px', overflowY: 'auto' })
    expect(screen.getByLabelText('展开输入框')).toHaveAttribute('aria-expanded', 'false')

    if (originalScrollHeight) {
      Object.defineProperty(HTMLTextAreaElement.prototype, 'scrollHeight', originalScrollHeight)
    }
  })

  it('expands the composer height on demand and collapses back to auto sizing', () => {
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

    render(<ChatComposerView {...createProps()} />)

    const input = screen.getByTestId('chat-composer-input')
    const expandButton = screen.getByLabelText('展开输入框')

    expect(input).toHaveStyle({ height: '160px', overflowY: 'auto' })

    fireEvent.click(expandButton)

    expect(screen.getByLabelText('收起输入框')).toHaveAttribute('aria-expanded', 'true')
    expect(input).toHaveAttribute('data-expanded', 'true')
    expect(input).toHaveStyle({
      height: `${getExpectedExpandedComposerHeight()}px`,
      overflowY: 'hidden',
    })

    fireEvent.click(screen.getByLabelText('收起输入框'))

    expect(screen.getByLabelText('展开输入框')).toHaveAttribute('aria-expanded', 'false')
    expect(input).toHaveAttribute('data-expanded', 'false')
    expect(input).toHaveStyle({ height: '160px', overflowY: 'auto' })

    if (originalScrollHeight) {
      Object.defineProperty(HTMLTextAreaElement.prototype, 'scrollHeight', originalScrollHeight)
    }
  })

  it('collapses the expanded composer as soon as a message send starts', async () => {
    const originalScrollHeight = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      'scrollHeight',
    )
    let resolveSend: (() => void) | undefined
    const onSend = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSend = resolve
        }),
    )

    Object.defineProperty(HTMLTextAreaElement.prototype, 'scrollHeight', {
      configurable: true,
      get() {
        return 240
      },
    })

    render(<ChatComposerView {...createProps()} onSend={onSend} />)

    fireEvent.click(screen.getByLabelText('展开输入框'))

    expect(screen.getByLabelText('收起输入框')).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(screen.getByTestId('chat-composer-send'))

    await waitFor(() => expect(onSend).toHaveBeenCalledTimes(1))
    expect(screen.getByLabelText('展开输入框')).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByTestId('chat-composer-input')).toHaveAttribute('data-expanded', 'false')

    resolveSend?.()
    await waitFor(() => expect(onSend).toHaveBeenCalledTimes(1))

    if (originalScrollHeight) {
      Object.defineProperty(HTMLTextAreaElement.prototype, 'scrollHeight', originalScrollHeight)
    }
  })
})
