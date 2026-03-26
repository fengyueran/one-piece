import { render, screen } from '@testing-library/react'
import { AiChatProvider } from '../../components/ai-chat-provider'
import { useChatContext, useChatStore } from '../../context/use-chat-context'
import type { ChatTransport } from '../../types'

const TestConsumer = () => {
  const sessions = useChatStore((s) => s.sessions)
  return <div data-testid="count">{sessions.length}</div>
}

const makeTransport = (): ChatTransport => ({
  getModels: async () => ({ data: [{ id: 'gpt-4.1', object: 'model' }] }),
  startStream: async ({ onDone }) => {
    onDone?.()
  },
  terminateStream: async () => ({ terminated: true }),
})

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

  it('accepts a custom transport without requiring legacy api props', () => {
    const transport = makeTransport()

    const Consumer = () => {
      const { transport: currentTransport } = useChatContext()
      return <div data-testid="transport-ok">{String(currentTransport === transport)}</div>
    }

    render(
      <AiChatProvider transport={transport}>
        <Consumer />
      </AiChatProvider>,
    )

    expect(screen.getByTestId('transport-ok')).toHaveTextContent('true')
  })
})
