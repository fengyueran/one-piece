import { act, renderHook, waitFor } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { ChatContext } from '../../context/chat-context'
import { useChatComposer } from '../../components/chat-composer/hooks/use-chat-composer'
import { createChatStore } from '../../store/chat-store'
import { DEFAULT_AI_CHAT_LABELS, type ChatMessageBlock, type ChatTransport } from '../../types'

describe('useChatComposer', () => {
  it('loads models and streams messages through the injected transport', async () => {
    const blocks: ChatMessageBlock[] = [{ type: 'notice', tone: 'info', text: 'Structured ready' }]
    const transport: ChatTransport = {
      getModels: jest.fn(async () => ({
        data: [{ id: 'gpt-4.1', object: 'model' }],
      })),
      startStream: jest.fn(async ({ onSessionId, onUpdate, onDone }) => {
        onSessionId?.('session-1')
        onUpdate({ content: 'Done', blocks })
        onDone?.()
      }),
      terminateStream: jest.fn(async () => ({ terminated: true })),
    }

    const store = createChatStore()
    const wrapper = ({ children }: PropsWithChildren) => (
      <ChatContext.Provider
        value={{
          store,
          transport,
          labels: DEFAULT_AI_CHAT_LABELS,
          enableImageAttachments: true,
          sendRef: { current: async (_content: string) => {} },
          retryRef: { current: async () => {} },
        }}
      >
        {children}
      </ChatContext.Provider>
    )

    const { result } = renderHook(() => useChatComposer(), { wrapper })

    await waitFor(() => expect(result.current.state.hasModels).toBe(true))

    await act(async () => {
      await result.current.actions.send('hello')
    })

    expect(transport.getModels).toHaveBeenCalledTimes(1)
    expect(transport.startStream).toHaveBeenCalledTimes(1)

    const sessionMessages = store.getState().messagesBySession['session-1'] ?? []
    const assistantMessage = sessionMessages.find((message) => message.role === 'assistant')

    expect(assistantMessage).toMatchObject({
      role: 'assistant',
      content: 'Done',
      blocks,
      status: 'done',
    })
  })

  it('maps raw fetch failures to the localized network error message', async () => {
    const transport: ChatTransport = {
      getModels: jest.fn(async () => ({
        data: [{ id: 'gpt-4.1', object: 'model' }],
      })),
      startStream: jest.fn(async ({ onError }) => {
        onError?.(new Error('Failed to fetch'))
      }),
      terminateStream: jest.fn(async () => ({ terminated: true })),
    }

    const store = createChatStore()
    const wrapper = ({ children }: PropsWithChildren) => (
      <ChatContext.Provider
        value={{
          store,
          transport,
          labels: {
            ...DEFAULT_AI_CHAT_LABELS,
            networkError: '网络请求失败，请稍后重试。',
          },
          enableImageAttachments: true,
          sendRef: { current: async (_content: string) => {} },
          retryRef: { current: async () => {} },
        }}
      >
        {children}
      </ChatContext.Provider>
    )

    const { result } = renderHook(() => useChatComposer(), { wrapper })

    await waitFor(() => expect(result.current.state.hasModels).toBe(true))

    await act(async () => {
      await result.current.actions.send('hello')
    })

    await waitFor(() => {
      expect(Object.values(store.getState().errorBySession)).toContain('网络请求失败，请稍后重试。')
    })
  })
})
