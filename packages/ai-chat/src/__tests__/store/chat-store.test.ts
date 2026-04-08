import { createChatStore } from '../../store/chat-store'

const makeStore = () => createChatStore()
const placeholderQuestion = {
  id: 'placeholder-question',
  label: '占位问题',
  kind: 'text' as const,
}

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

  it('replaces questionnaires that share the same questionnaire id while streaming', () => {
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
          type: 'questionnaire',
          questionnaire: {
            questionnaireId: 'req-1',
            title: '请选择方案',
            question: {
              id: 'selected_index',
              label: '请选择方案',
              kind: 'single_select',
              options: [
                {
                  label: '方案 A',
                  value: '0',
                },
              ],
            },
          },
        },
      ],
    })

    store.getState().patchStreamingMessage('s1', {
      blocks: [
        {
          type: 'questionnaire',
          questionnaire: {
            questionnaireId: 'req-1',
            title: '请选择方案',
            status: 'expired',
            statusMessage: '选择已超时，请重新开始。',
            question: {
              id: 'selected_index',
              label: '请选择方案',
              kind: 'single_select',
              options: [
                {
                  label: '方案 A',
                  value: '0',
                },
              ],
            },
          },
        },
      ],
    })

    expect(store.getState().streamingMessageBySession['s1']?.blocks).toEqual([
      {
        type: 'questionnaire',
        questionnaire: {
          questionnaireId: 'req-1',
          title: '请选择方案',
          status: 'expired',
          statusMessage: '选择已超时，请重新开始。',
          question: {
            id: 'selected_index',
            label: '请选择方案',
            kind: 'single_select',
            options: [
              {
                label: '方案 A',
                value: '0',
              },
            ],
          },
        },
      },
    ])
  })

  it('appends questionnaires that reuse questionnaire id when block keys differ', () => {
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
          type: 'questionnaire',
          questionnaire: {
            questionnaireId: 'req-1',
            blockKey: 'plan:req-1:step-1',
            mergePolicy: 'replace',
            title: '第一个计划',
            question: placeholderQuestion,
          },
        },
      ],
    })

    store.getState().patchStreamingMessage('s1', {
      blocks: [
        {
          type: 'questionnaire',
          questionnaire: {
            questionnaireId: 'req-1',
            blockKey: 'plan:req-1:step-2',
            mergePolicy: 'replace',
            title: '第二个计划',
            question: placeholderQuestion,
          },
        },
      ],
    })

    expect(store.getState().streamingMessageBySession['s1']?.blocks).toEqual([
      {
        type: 'questionnaire',
        questionnaire: {
          questionnaireId: 'req-1',
          blockKey: 'plan:req-1:step-1',
          mergePolicy: 'replace',
          title: '第一个计划',
          question: placeholderQuestion,
        },
      },
      {
        type: 'questionnaire',
        questionnaire: {
          questionnaireId: 'req-1',
          blockKey: 'plan:req-1:step-2',
          mergePolicy: 'replace',
          title: '第二个计划',
          question: placeholderQuestion,
        },
      },
    ])
  })

  it('replaces questionnaires that share the same block key when merge policy is replace', () => {
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
          type: 'questionnaire',
          questionnaire: {
            questionnaireId: 'req-1',
            blockKey: 'plan:req-1',
            mergePolicy: 'replace',
            title: '请选择方案',
            question: placeholderQuestion,
          },
        },
      ],
    })

    store.getState().patchStreamingMessage('s1', {
      blocks: [
        {
          type: 'questionnaire',
          questionnaire: {
            questionnaireId: 'req-1',
            blockKey: 'plan:req-1',
            mergePolicy: 'replace',
            title: '请选择方案',
            status: 'expired',
            statusMessage: '选择已超时，请重新开始。',
            question: placeholderQuestion,
          },
        },
      ],
    })

    expect(store.getState().streamingMessageBySession['s1']?.blocks).toEqual([
      {
        type: 'questionnaire',
        questionnaire: {
          questionnaireId: 'req-1',
          blockKey: 'plan:req-1',
          mergePolicy: 'replace',
          title: '请选择方案',
          status: 'expired',
          statusMessage: '选择已超时，请重新开始。',
          question: placeholderQuestion,
        },
      },
    ])
  })

  it('replaces custom blocks that share the same block key when merge policy is replace', () => {
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
          type: 'custom',
          kind: 'approval-card',
          blockKey: 'approval:req-1',
          mergePolicy: 'replace',
          data: { requestId: 'req-1', timeoutSec: 120 },
        },
      ],
    })

    store.getState().patchStreamingMessage('s1', {
      blocks: [
        {
          type: 'custom',
          kind: 'approval-card',
          blockKey: 'approval:req-1',
          mergePolicy: 'replace',
          data: { requestId: 'req-1', timeoutSec: 60 },
        },
      ],
    })

    expect(store.getState().streamingMessageBySession['s1']?.blocks).toEqual([
      {
        type: 'custom',
        kind: 'approval-card',
        blockKey: 'approval:req-1',
        mergePolicy: 'replace',
        data: { requestId: 'req-1', timeoutSec: 60 },
      },
    ])
  })

  it('ignores duplicate custom blocks that share the same block key when merge policy is ignore-duplicate', () => {
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
          type: 'custom',
          kind: 'approval-card',
          blockKey: 'approval:req-1',
          mergePolicy: 'ignore-duplicate',
          data: { requestId: 'req-1', timeoutSec: 120 },
        },
      ],
    })

    store.getState().patchStreamingMessage('s1', {
      blocks: [
        {
          type: 'custom',
          kind: 'approval-card',
          blockKey: 'approval:req-1',
          mergePolicy: 'ignore-duplicate',
          data: { requestId: 'req-1', timeoutSec: 60 },
        },
      ],
    })

    expect(store.getState().streamingMessageBySession['s1']?.blocks).toEqual([
      {
        type: 'custom',
        kind: 'approval-card',
        blockKey: 'approval:req-1',
        mergePolicy: 'ignore-duplicate',
        data: { requestId: 'req-1', timeoutSec: 120 },
      },
    ])
  })

  it('replaces keyed custom blocks even when the renderer kind changes', () => {
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
          type: 'custom',
          kind: 'approval-card',
          blockKey: 'approval:req-1',
          mergePolicy: 'replace',
          data: { requestId: 'req-1', state: 'pending' },
        },
      ],
    })

    store.getState().patchStreamingMessage('s1', {
      blocks: [
        {
          type: 'custom',
          kind: 'approval-card-settled',
          blockKey: 'approval:req-1',
          mergePolicy: 'replace',
          data: { requestId: 'req-1', state: 'approved' },
        },
      ],
    })

    expect(store.getState().streamingMessageBySession['s1']?.blocks).toEqual([
      {
        type: 'custom',
        kind: 'approval-card-settled',
        blockKey: 'approval:req-1',
        mergePolicy: 'replace',
        data: { requestId: 'req-1', state: 'approved' },
      },
    ])
  })
})
