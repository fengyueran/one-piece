import styled from '@emotion/styled'
import { Button, Select } from '@xinghunm/compass-ui'
import type { ChatModel } from '../../../types'

interface ChatModelControlProps {
  selectedModel: string
  availableModels: ChatModel[]
  isModelsLoading: boolean
  isModelsError: boolean
  hasModels: boolean
  onSelectedModelChange: (value: string) => void
  onReloadModels: () => void
}

export const ChatModelControl = ({
  selectedModel,
  availableModels,
  isModelsLoading,
  isModelsError,
  hasModels,
  onSelectedModelChange,
  onReloadModels,
}: ChatModelControlProps) => {
  if (isModelsError) {
    return (
      <ModelReloadButton
        type="button"
        data-testid="chat-model-reload"
        aria-label="Reload"
        onClick={onReloadModels}
      >
        <span>Failed to load models</span>
        <ReloadGlyph aria-hidden="true" />
      </ModelReloadButton>
    )
  }

  if (isModelsLoading) {
    return <ModelBadge>Loading models...</ModelBadge>
  }

  if (hasModels && selectedModel) {
    if (availableModels.length > 1) {
      return (
        <ModelSelect
          data-testid="chat-model-select"
          aria-label="Select model"
          value={selectedModel}
          onChange={(value: unknown) => onSelectedModelChange(String(value))}
          options={availableModels.map((model) => ({
            label: model.id,
            value: model.id,
          }))}
        />
      )
    }

    return <ModelBadge>{selectedModel}</ModelBadge>
  }

  return <ModelBadge>No model available</ModelBadge>
}

const ModelBadge = styled.span`
  border-radius: 999px;
  border: 1px solid var(--border-hover);
  padding: 5px 12px;
  font-weight: 400;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 12px;
`

const ModelReloadButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  height: 24px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.04);
  padding: 5px 12px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
  line-height: 12px;

  transition:
    background 160ms ease,
    border-color 160ms ease,
    color 160ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08) !important;
    border-color: rgba(255, 255, 255, 0.22) !important;
    color: rgba(255, 255, 255, 0.88) !important;
  }
`

const ReloadGlyph = styled.span`
  position: relative;
  width: 11px;
  height: 11px;
  flex-shrink: 0;
  border: 1.5px solid currentColor;
  border-right-color: transparent;
  border-radius: 999px;
  transform: rotate(40deg);

  &::after {
    content: '';
    position: absolute;
    top: -2px;
    right: -1px;
    width: 4px;
    height: 4px;
    border-top: 1.5px solid currentColor;
    border-right: 1.5px solid currentColor;
    transform: rotate(12deg);
  }
`

const ModelSelect = styled(Select)`
  && {
    flex: 0 1 220px;
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
