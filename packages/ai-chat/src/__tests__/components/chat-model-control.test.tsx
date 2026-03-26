import { render, screen } from '@testing-library/react'
import { ChatModelControl } from '../../components/chat-composer/components/chat-model-control'

describe('ChatModelControl', () => {
  it('renders a larger reload icon in the error state', () => {
    render(
      <ChatModelControl
        selectedModel=""
        availableModels={[]}
        isModelsLoading={false}
        isModelsError
        hasModels={false}
        onSelectedModelChange={() => {}}
        onReloadModels={() => {}}
      />,
    )

    const reloadIcon = screen.getByTestId('chat-model-reload-icon')

    expect(reloadIcon).toHaveAttribute('width', '16')
    expect(reloadIcon).toHaveAttribute('height', '16')
  })
})
