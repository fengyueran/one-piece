import { useEffect, useRef } from 'react'
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

export interface ChatComposerViewProps {
  value: string
  placeholder: string
  attachments: ChatImageAttachment[]
  attachmentNotice?: 'limit_reached' | null
  selectedModel: string
  selectedMode: ChatAgentMode
  availableModels: ChatModel[]
  isModelsLoading: boolean
  isModelsError: boolean
  hasModels: boolean
  isStreaming: boolean
  modeLabels: { ask: string; plan: string; agent: string }
  onValueChange: (value: string) => void
  onPickImages: (files: FileList | File[]) => void
  onPasteImages: (files: File[]) => void
  onRemoveAttachment: (attachmentId: string) => void
  onSelectedModelChange: (value: string) => void
  onSelectedModeChange: (value: ChatAgentMode) => void
  onReloadModels: () => void
  onStop: () => void | Promise<void>
  onSend: () => void | Promise<void>
}

export const ChatComposerView = ({
  value,
  placeholder,
  attachments,
  attachmentNotice,
  selectedModel,
  selectedMode,
  availableModels,
  isModelsLoading,
  isModelsError,
  hasModels,
  isStreaming,
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
  const canSend = canSendChatMessage({
    value,
    attachmentCount: attachments.length,
    isModelsLoading,
    isModelsError,
    hasModels,
  })

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
        <input
          ref={imageInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          hidden
          data-testid="chat-composer-image-input"
          onChange={handlePickImages}
        />
        <ChatComposerAttachmentList
          attachments={attachments}
          onRemoveAttachment={onRemoveAttachment}
        />
        {attachmentNotice === 'limit_reached' ? (
          <AttachmentNotice data-testid="chat-composer-attachment-notice">
            Images exceeded the limit. Only the first 10 images were kept.
          </AttachmentNotice>
        ) : null}
        <Input
          data-testid="chat-composer-input"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder}
        />
        <Footer>
          <Actions data-testid="chat-composer-actions">
            <AttachButton
              type="button"
              data-testid="chat-composer-attach-image"
              aria-label="Attach image"
              onClick={() => imageInputRef.current?.click()}
            >
              <PlusIcon />
            </AttachButton>
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
  const { labels, sendRef } = useChatContext()
  const { state, actions } = useChatComposer()

  // Keep sendRef current so ChatThread can trigger sends without importing ChatComposer
  useEffect(() => {
    sendRef.current = actions.send
  })

  const modeLabels = {
    ask: labels.modeLabelAsk ?? 'Ask',
    plan: labels.modeLabelPlan ?? 'Plan',
    agent: labels.modeLabelAgent ?? 'Agent',
  }

  return (
    <ChatComposerView
      value={state.value}
      attachments={state.attachments}
      attachmentNotice={state.attachmentNotice}
      placeholder={labels.placeholder ?? 'Ask something...'}
      selectedModel={state.selectedModel}
      selectedMode={state.selectedMode}
      availableModels={state.availableModels}
      isModelsLoading={state.isModelsLoading}
      isModelsError={state.isModelsError}
      hasModels={state.hasModels}
      isStreaming={state.isStreaming}
      modeLabels={modeLabels}
      onValueChange={actions.setValue}
      onPickImages={actions.pickImages}
      onPasteImages={actions.pasteImages}
      onRemoveAttachment={actions.removeAttachment}
      onSelectedModelChange={actions.setSelectedModel}
      onSelectedModeChange={actions.setSelectedMode}
      onReloadModels={actions.reloadModels}
      onStop={actions.stop}
      onSend={actions.send}
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
  width: 100%;
  min-height: 96px;
  resize: none;
  appearance: none;
  border: 0;
  outline: 0;
  background: transparent;
  padding: 8px 12px 12px 12px;
  font-weight: 400;
  font-size: 14px;
  color: var(--text-primary);
  line-height: 20px;

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
