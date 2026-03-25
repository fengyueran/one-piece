import { render, screen } from '@testing-library/react'
import { AiChatProvider } from '../../components/ai-chat-provider'
import { useChatStore } from '../../context/use-chat-context'

const TestConsumer = () => {
  const sessions = useChatStore((s) => s.sessions)
  return <div data-testid="count">{sessions.length}</div>
}

describe('AiChatProvider', () => {
  it('renders children and provides store context', () => {
    render(
      <AiChatProvider apiBaseUrl="http://api.test" authToken="Bearer tok">
        <TestConsumer />
      </AiChatProvider>,
    )
    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })

  it('throws when useChatStore used outside provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<TestConsumer />)).toThrow(
      'useChatContext must be used inside AiChatProvider',
    )
    spy.mockRestore()
  })
})
