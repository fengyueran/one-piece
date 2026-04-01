import { useEffect, useLayoutEffect, useRef } from 'react'
import styled from '@emotion/styled'
import type { ChatAgentMode, ChatImageAttachment, ChatModel } from '../../types'
import { useChatContext } from '../../context/use-chat-context'
import {
  canSendChatMessage,
  shouldStopChatComposer,
  shouldSubmitChatComposer,
} from './lib/chat-composer'
import { useChatComposer } from './hooks/use-chat-composer'
import { ChatComposerAttachmentList } from './components/chat-composer-attachment-list'
import { ChatModelControl } from './components/chat-model-control'
import { ChatModeControl } from './components/chat-mode-control'
import { ChatSendActions } from './components/chat-send-actions'

const CHAT_COMPOSER_LINE_HEIGHT_PX = 20
const CHAT_COMPOSER_MAX_ROWS = 7
const CHAT_COMPOSER_PADDING_TOP_PX = 8
const CHAT_COMPOSER_PADDING_BOTTOM_PX = 12
const CHAT_COMPOSER_PADDING_BLOCK_PX =
  CHAT_COMPOSER_PADDING_TOP_PX + CHAT_COMPOSER_PADDING_BOTTOM_PX
const CHAT_COMPOSER_MIN_ROWS = 4
const CHAT_COMPOSER_MAX_HEIGHT_PX =
  CHAT_COMPOSER_MAX_ROWS * CHAT_COMPOSER_LINE_HEIGHT_PX + CHAT_COMPOSER_PADDING_BLOCK_PX

/** Inline plus icon (replaces SVG file import). */
const PlusIcon = () => (
  <svg
    aria-hidden="true"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
)

/**
 * Props for the presentational `ChatComposerView` component.
 */
export interface ChatComposerViewProps {
  value: string
  placeholder: string
  attachments: ChatImageAttachment[]
  attachmentNotice?: 'limit_reached' | null
  attachmentLimitNotice: string
  selectedModel: string
  selectedMode: ChatAgentMode
  availableModels: ChatModel[]
  isModelsLoading: boolean
  isModelsError: boolean
  hasModels: boolean
  /** Whether a streaming response is currently in progress. */
  isStreaming: boolean
  /** Whether a stop request has been sent but not yet finalized. */
  isStopping: boolean
  /** Whether image attachment uploads are enabled. */
  enableImageAttachments: boolean
  modeLabels: { ask: string; plan: string; agent: string }
  onValueChange: (value: string) => void
  onPickImages: (files: FileList | File[]) => void
  onPasteImages: (files: File[]) => void
  onRemoveAttachment: (attachmentId: string) => void
  onSelectedModelChange: (value: string) => void
  onSelectedModeChange: (value: ChatAgentMode) => void
  onReloadModels: () => void
  /** Called to abort the active streaming response. */
  onStop: () => void | Promise<void>
  /** Called to send a new user message. */
  onSend: () => void | Promise<void>
}

export const ChatComposerView = ({
  value,
  placeholder,
  attachments,
  attachmentNotice,
  attachmentLimitNotice,
  selectedModel,
  selectedMode,
  availableModels,
  isModelsLoading,
  isModelsError,
  hasModels,
  isStreaming,
  isStopping,
  enableImageAttachments,
  modeLabels,
  onValueChange,
  onPickImages,
  onPasteImages,
  onRemoveAttachment,
  onSelectedModelChange,
  onSelectedModeChange,
  onReloadModels,
  onStop,
  onSend,
}: ChatComposerViewProps) => {
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  const canSend = canSendChatMessage({
    value,
    attachmentCount: attachments.length,
    isModelsLoading,
    isModelsError,
    hasModels,
  })

  useLayoutEffect(() => {
    const element = inputRef.current

    if (!element) {
      return
    }

    element.style.height = '0px'
    const scrollHeight = element.scrollHeight
    const nextHeight = Math.min(scrollHeight, CHAT_COMPOSER_MAX_HEIGHT_PX)

    element.style.height = `${nextHeight}px`
    element.style.overflowY = scrollHeight > CHAT_COMPOSER_MAX_HEIGHT_PX ? 'auto' : 'hidden'
  }, [value])

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (shouldStopChatComposer({ key: event.key, shiftKey: event.shiftKey, isStreaming })) {
      event.preventDefault()
      void onStop()
      return
    }
    if (!shouldSubmitChatComposer({ key: event.key, shiftKey: event.shiftKey, canSend })) return
    event.preventDefault()
    void onSend()
  }

  const handlePickImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) onPickImages(event.target.files)
    event.target.value = ''
  }

  const handlePaste: React.ClipboardEventHandler<HTMLTextAreaElement> = (event) => {
    const imageFiles = Array.from(event.clipboardData.items)
      .filter((item) => item.kind === 'file' && item.type.startsWith('image/'))
      .map((item) => item.getAsFile())
      .filter((file): file is File => Boolean(file))
    if (!imageFiles.length) return
    event.preventDefault()
    onPasteImages(imageFiles)
  }

  return (
    <Container>
      <Surface data-testid="chat-composer-surface">
        {enableImageAttachments ? (
          <input
            ref={imageInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            hidden
            data-testid="chat-composer-image-input"
            onChange={handlePickImages}
          />
        ) : null}
        <ChatComposerAttachmentList
          attachments={attachments}
          onRemoveAttachment={onRemoveAttachment}
        />
        {attachmentNotice === 'limit_reached' ? (
          <AttachmentNotice data-testid="chat-composer-attachment-notice">
            {attachmentLimitNotice}
          </AttachmentNotice>
        ) : null}
        <Input
          ref={inputRef}
          data-testid="chat-composer-input"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={enableImageAttachments ? handlePaste : undefined}
          placeholder={placeholder}
        />
        <Footer>
          <Actions data-testid="chat-composer-actions">
            {enableImageAttachments ? (
              <AttachButton
                type="button"
                data-testid="chat-composer-attach-image"
                aria-label="Attach image"
                onClick={() => imageInputRef.current?.click()}
              >
                <PlusIcon />
              </AttachButton>
            ) : null}
            <ChatModeControl
              value={selectedMode}
              disabled={isStreaming}
              labels={modeLabels}
              onChange={onSelectedModeChange}
            />
            <ChatModelControl
              selectedModel={selectedModel}
              availableModels={availableModels}
              isModelsLoading={isModelsLoading}
              isModelsError={isModelsError}
              hasModels={hasModels}
              onSelectedModelChange={onSelectedModelChange}
              onReloadModels={onReloadModels}
            />
            <ChatSendActions
              canSend={canSend}
              isStreaming={isStreaming}
              isStopping={isStopping}
              onStop={onStop}
              onSend={onSend}
            />
          </Actions>
        </Footer>
      </Surface>
    </Container>
  )
}

export const ChatComposer = () => {
  const { labels, sendRef, retryRef, enableImageAttachments } = useChatContext()
  const { state, actions } = useChatComposer()
  const { send, retry } = actions

  useEffect(() => {
    sendRef.current = send
    retryRef.current = async () => {
      retry()
    }
  }, [retry, retryRef, send, sendRef])

  const modeLabels = {
    ask: labels.modeLabelAsk,
    plan: labels.modeLabelPlan,
    agent: labels.modeLabelAgent,
  }

  return (
    <ChatComposerView
      value={state.value}
      attachments={state.attachments}
      attachmentNotice={state.attachmentNotice}
      attachmentLimitNotice={labels.attachmentLimitNotice}
      placeholder={labels.placeholder}
      selectedModel={state.selectedModel}
      selectedMode={state.selectedMode}
      availableModels={state.availableModels}
      isModelsLoading={state.isModelsLoading}
      isModelsError={state.isModelsError}
      hasModels={state.hasModels}
      isStreaming={state.isStreaming}
      isStopping={state.isStopping}
      enableImageAttachments={enableImageAttachments}
      modeLabels={modeLabels}
      onValueChange={actions.setValue}
      onPickImages={actions.pickImages}
      onPasteImages={actions.pasteImages}
      onRemoveAttachment={actions.removeAttachment}
      onSelectedModelChange={actions.setSelectedModel}
      onSelectedModeChange={actions.setSelectedMode}
      onReloadModels={actions.reloadModels}
      onStop={actions.stop}
      onSend={send}
    />
  )
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const Container = styled.div`
  padding: 0 16px 16px;
`

const Surface = styled.div`
  background: var(--border-color);
  border-radius: 20px;
  border: 1px solid var(--border-hover);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 12px 36px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
`

const AttachmentNotice = styled.div`
  margin: 10px 12px 0;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(255, 196, 87, 0.12);
  border: 1px solid rgba(255, 196, 87, 0.28);
  color: rgba(255, 220, 148, 0.95);
  font-size: 12px;
  line-height: 1.4;
`

const Input = styled.textarea`
  --textarea-line-height: ${CHAT_COMPOSER_LINE_HEIGHT_PX}px;
  --textarea-min-rows: ${CHAT_COMPOSER_MIN_ROWS};
  --textarea-max-rows: ${CHAT_COMPOSER_MAX_ROWS};
  --textarea-padding-top: ${CHAT_COMPOSER_PADDING_TOP_PX}px;
  --textarea-padding-bottom: ${CHAT_COMPOSER_PADDING_BOTTOM_PX}px;
  --textarea-padding-block: calc(var(--textarea-padding-top) + var(--textarea-padding-bottom));
  --textarea-max-height: calc(
    var(--textarea-max-rows) * var(--textarea-line-height) + var(--textarea-padding-block)
  );
  width: 100%;
  min-height: calc(
    var(--textarea-min-rows) * var(--textarea-line-height) + var(--textarea-padding-block)
  );
  max-height: var(--textarea-max-height);
  box-sizing: border-box;
  resize: none;
  appearance: none;
  border: 0;
  outline: 0;
  background: transparent;
  padding: var(--textarea-padding-top) 12px var(--textarea-padding-bottom) 12px;
  font-weight: 400;
  font-size: 14px;
  color: var(--text-primary);
  line-height: var(--textarea-line-height);
  overflow-y: hidden;

  &::placeholder {
    color: var(--text-secondary);
  }

  &::-webkit-resizer {
    display: none;
  }
`

const Footer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: stretch;
  gap: 16px;
  padding: 0 14px 14px;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  min-width: 0;
  justify-content: flex-end;
  gap: 8px;
`

const AttachButton = styled.button`
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: rgba(255, 255, 255, 0.82);
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`
