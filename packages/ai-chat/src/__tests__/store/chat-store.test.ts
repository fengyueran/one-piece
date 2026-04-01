import { createChatStore } from '../../store/chat-store'

const makeStore = () => createChatStore()

describe('createChatStore', () => {
  it('starts with empty state', () => {
    const store = makeStore()
    const state = store.getState()
    expect(state.sessions).toEqual([])
    expect(state.activeSessionId).toBeNull()
    expect(state.preferredMode).toBe('agent')
  })

  it('createSession adds session and sets it active', () => {
    const store = makeStore()
    const session = { sessionId: 's1', title: 'Chat', createdAt: '', updatedAt: '', model: 'gpt-4' }
    store.getState().createSession(session)
    const state = store.getState()
    expect(state.sessions).toHaveLength(1)
    expect(state.activeSessionId).toBe('s1')
  })

  it('replaceSessionId migrates all session state', () => {
    const store = makeStore()
    const session = {
      sessionId: 'draft-1',
      title: 'Chat',
      createdAt: '',
      updatedAt: '',
      model: 'gpt-4',
    }
    store.getState().createSession(session)
    store.getState().replaceSessionId('draft-1', 'real-1')
    const state = store.getState()
    expect(state.activeSessionId).toBe('real-1')
    expect(state.sessions[0].sessionId).toBe('real-1')
  })

  it('appendMessage adds message to session', () => {
    const store = makeStore()
    const session = { sessionId: 's1', title: 'Chat', createdAt: '', updatedAt: '', model: 'gpt-4' }
    store.getState().createSession(session)
    store.getState().appendMessage('s1', {
      id: 'm1',
      sessionId: 's1',
      role: 'user',
      content: 'hello',
      status: 'done',
      createdAt: new Date().toISOString(),
    })
    expect(store.getState().messagesBySession['s1']).toHaveLength(1)
  })

  it('streaming lifecycle: start → update → complete', () => {
    const store = makeStore()
    const session = { sessionId: 's1', title: 'Chat', createdAt: '', updatedAt: '', model: 'gpt-4' }
    store.getState().createSession(session)

    const msg = {
      id: 'a1',
      sessionId: 's1',
      role: 'assistant' as const,
      content: '',
      status: 'streaming' as const,
      createdAt: '',
    }
    store.getState().startStreamingMessage('s1', msg)
    expect(store.getState().isStreamingBySession['s1']).toBe(true)

    store.getState().updateStreamingMessage('s1', 'hello world')
    expect(store.getState().streamingMessageBySession['s1']?.content).toBe('hello world')

    store.getState().completeStreamingMessage('s1')
    expect(store.getState().isStreamingBySession['s1']).toBe(false)
    expect(store.getState().messagesBySession['s1']).toHaveLength(1)
    expect(store.getState().messagesBySession['s1'][0].status).toBe('done')
  })

  it('appends streaming blocks instead of replacing earlier blocks', () => {
    const store = makeStore()
    const session = { sessionId: 's1', title: 'Chat', createdAt: '', updatedAt: '', model: 'gpt-4' }
    store.getState().createSession(session)

    store.getState().startStreamingMessage('s1', {
      id: 'a1',
      sessionId: 's1',
      role: 'assistant',
      content: '',
      status: 'streaming',
      createdAt: '',
      blocks: [],
    })

    store.getState().patchStreamingMessage('s1', {
      blocks: [
        {
          type: 'notice',
          tone: 'info',
          text: 'first block',
        },
      ],
    })

    store.getState().patchStreamingMessage('s1', {
      blocks: [
        {
          type: 'notice',
          tone: 'warning',
          text: 'second block',
        },
      ],
    })

    expect(store.getState().streamingMessageBySession['s1']?.blocks).toEqual([
      {
        type: 'notice',
        tone: 'info',
        text: 'first block',
      },
      {
        type: 'notice',
        tone: 'warning',
        text: 'second block',
      },
    ])
  })
})
