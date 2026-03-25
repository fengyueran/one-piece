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
          viewBox="0 0 1024 1024"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M895.469672 511.745197c0-146.498562-82.099856-273.805016-202.788589-338.470805l22.072715-46.630017c-4.50664-12.609179-18.382673-19.176758-30.991852-14.670118l-92.436272 33.040511c-12.609179 4.50664-19.176758 18.382673-14.670118 30.991852l33.040511 92.436272c4.50664 12.609179 18.382673 19.176758 30.991852 14.670118l24.581861-51.92972c99.069343 54.335513 166.240185 159.596881 166.240185 280.561907 0 165.56685-125.817544 301.747415-287.057855 318.14692l0 0.022513c-17.730826 0-32.105209 14.374382-32.105209 32.105209 0 17.730826 14.374382 32.105209 32.105209 32.105209 2.098801 0 4.149507-0.207731 6.135744-0.592494C744.270041 874.039593 895.469672 710.564381 895.469672 511.745197z" />
          <path d="M480.616222 129.23948c-0.041956 0-0.082888 0.00307-0.124843 0.00307l0-0.00307c-0.01535 0.001023-0.031722 0.00307-0.047072 0.004093-1.892093 0.010233-3.744277 0.189312-5.545296 0.5137-194.674794 18.529005-346.957083 182.459588-346.957083 381.987924 0 147.431817 83.146699 275.42798 205.097168 339.700819l-24.814152 52.419883c4.50664 12.609179 18.382673 19.176758 30.991852 14.670118l92.436272-33.040511c12.609179-4.50664 19.176758-18.382673 14.670118-30.991852l-33.040511-92.436272c-4.50664-12.609179-18.382673-19.176758-30.991852-14.670118l-21.853727 46.167482c-100.326986-53.964052-168.535461-159.920246-168.535461-281.81955 0-166.089759 126.616746-302.591643 288.588721-318.284043l0-0.014326c0.041956 0 0.082888 0.00307 0.124843 0.00307 17.730826 0 32.105209-14.374382 32.105209-32.105209C512.721431 143.613862 498.347049 129.23948 480.616222 129.23948z" />
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
