import { render, screen } from '@testing-library/react'
import { useChatContext, useChatStore } from '../../context/use-chat-context'
import { ChatContext } from '../../context/chat-context'
import { createChatStore } from '../../store/chat-store'
import axios from 'axios'
import { DEFAULT_AI_CHAT_LABELS } from '../../types'

const makeContextValue = () => ({
  store: createChatStore(),
  axios: axios.create(),
  apiBaseUrl: 'http://test',
  authToken: 'Bearer tok',
  labels: DEFAULT_AI_CHAT_LABELS,
})

describe('useChatContext', () => {
  it('throws when used outside ChatContext.Provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const Bad = () => {
      useChatContext()
      return null
    }
    expect(() => render(<Bad />)).toThrow('useChatContext must be used inside AiChatProvider')
    spy.mockRestore()
  })

  it('returns context value when inside provider', () => {
    const ctx = makeContextValue()
    const Good = () => {
      const { apiBaseUrl } = useChatContext()
      return <div>{apiBaseUrl}</div>
    }
    render(
      <ChatContext.Provider value={ctx}>
        <Good />
      </ChatContext.Provider>,
    )
    expect(screen.getByText('http://test')).toBeInTheDocument()
  })
})

describe('useChatStore', () => {
  it('selects state from the store', () => {
    const ctx = makeContextValue()
    const Consumer = () => {
      const sessions = useChatStore((s) => s.sessions)
      return <div data-testid="count">{sessions.length}</div>
    }
    render(
      <ChatContext.Provider value={ctx}>
        <Consumer />
      </ChatContext.Provider>,
    )
    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })
})
