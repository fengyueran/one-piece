import styled from '@emotion/styled'
import { Select } from '@xinghunm/compass-ui'
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
        <ReloadIcon
          aria-hidden="true"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.5 6A4.5 4.5 0 1 1 6 1.5a4.47 4.47 0 0 1 3 1.148"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <path
            d="M9 1.5h1.5V3"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </ReloadIcon>
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

const ModelReloadButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  height: 24px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.04);
  padding: 5px 10px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
  line-height: 12px;
  cursor: pointer;

  transition:
    background 160ms ease,
    border-color 160ms ease,
    color 160ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.22);
    color: rgba(255, 255, 255, 0.88);
  }
`

const ReloadIcon = styled.svg`
  flex-shrink: 0;
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
