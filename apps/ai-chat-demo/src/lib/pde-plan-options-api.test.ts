import { afterEach, describe, expect, it, vi } from 'vitest'
import { createPdePlanQuestionnaireSubmitHandler } from './pde-plan-options-api'

describe('createPdePlanQuestionnaireSubmitHandler', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('prefers questionnaire blockKey when resolving the pending plan option', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          session_id: 'session-1',
          count: 2,
          items: [
            {
              option_request_id: 'opt-method',
              request_id: 'req-1',
              session_id: 'session-1',
              mode: 'plan',
              question: '请选择求解热方程的主要数值方法：',
              options: [{ title: '有限差分法 (FDM)' }],
              created_ts: 1774330000,
            },
            {
              option_request_id: 'opt-boundary',
              request_id: 'req-1',
              session_id: 'session-1',
              mode: 'plan',
              question: '请选择边界条件类型：',
              options: [{ title: '狄利克雷边界条件' }],
              created_ts: 1774330001,
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          option_request_id: 'opt-boundary',
          session_id: 'session-1',
          selected_index: 0,
        }),
      })

    vi.stubGlobal('fetch', fetchMock)

    const submitHandler = createPdePlanQuestionnaireSubmitHandler('/ai-api', 'Bearer token-1')

    await submitHandler(
      {
        questionnaireId: 'req-1',
        blockKey: 'plan:req-1:opt-boundary',
        answers: {
          selected_index: '0',
        },
        content: '请选择边界条件类型：\n- 请选择边界条件类型：: 狄利克雷边界条件',
      },
      {
        sessionId: 'session-1',
        mode: 'plan',
      },
    )

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/ai-api/chat/plan/options/decide',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          option_request_id: 'opt-boundary',
          selected_index: 0,
        }),
      }),
    )
  })
})
