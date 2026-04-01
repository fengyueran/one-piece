import { describe, expect, it } from 'vitest'
import { pdeTransformStreamPacket } from './pde-stream-transform'

describe('pdeTransformStreamPacket', () => {
  it('maps plan options events into questionnaire blocks', () => {
    const update = pdeTransformStreamPacket({
      packet: {
        type: 'plan_options' as never,
        data: {
          id: 'plan-1',
          title: 'Choose a direction',
          question: 'Which route should we use?',
          options: [
            { id: 'classic', label: 'Classic numeric simulation' },
            { id: 'quantum', label: 'Quantum simulation' },
          ],
        } as never,
      },
      defaultUpdate: null,
    })

    expect(update?.blocks).toEqual([
      {
        type: 'questionnaire',
        questionnaire: {
          questionnaireId: 'plan-1',
          blockKey: 'plan:plan-1:which-route-should-we-use',
          mergePolicy: 'replace',
          title: 'Choose a direction',
          description: 'Select the planning path you want the assistant to use next.',
          submitLabel: 'Continue',
          questions: [
            {
              id: 'plan-direction',
              label: 'Which route should we use?',
              kind: 'single_select',
              required: true,
              options: [
                { label: 'Classic numeric simulation', value: '0' },
                { label: 'Quantum simulation', value: '1' },
              ],
            },
          ],
        },
      },
    ])
  })

  it('creates distinct questionnaire block keys for plan options that share request_id', () => {
    const firstUpdate = pdeTransformStreamPacket({
      packet: {
        type: 'plan_options' as never,
        data: {
          request_id: 'req-1',
          question: '请选择求解热方程的主要数值方法：',
          options: [{ title: '有限差分法 (FDM)' }, { title: '有限元法 (FEM)' }],
        } as never,
      },
      defaultUpdate: null,
    })

    const secondUpdate = pdeTransformStreamPacket({
      packet: {
        type: 'plan_options' as never,
        data: {
          request_id: 'req-1',
          question: '请选择边界条件类型：',
          options: [{ title: '狄利克雷边界条件' }, { title: '诺伊曼边界条件' }],
        } as never,
      },
      defaultUpdate: null,
    })

    expect(firstUpdate?.blocks).toEqual([
      expect.objectContaining({
        type: 'questionnaire',
        questionnaire: expect.objectContaining({
          questionnaireId: 'req-1',
          blockKey: 'plan:req-1:请选择求解热方程的主要数值方法',
          mergePolicy: 'replace',
        }),
      }),
    ])
    expect(secondUpdate?.blocks).toEqual([
      expect.objectContaining({
        type: 'questionnaire',
        questionnaire: expect.objectContaining({
          questionnaireId: 'req-1',
          blockKey: 'plan:req-1:请选择边界条件类型',
          mergePolicy: 'replace',
        }),
      }),
    ])
  })

  it('prefers option_request_id when creating a plan questionnaire block key', () => {
    const update = pdeTransformStreamPacket({
      packet: {
        type: 'plan_options' as never,
        data: {
          request_id: 'req-1',
          option_request_id: 'opt-1',
          question: '请选择边界条件类型：',
          options: [{ title: '狄利克雷边界条件' }, { title: '诺伊曼边界条件' }],
        } as never,
      },
      defaultUpdate: null,
    })

    expect(update?.blocks).toEqual([
      expect.objectContaining({
        type: 'questionnaire',
        questionnaire: expect.objectContaining({
          questionnaireId: 'req-1',
          blockKey: 'plan:req-1:opt-1',
          mergePolicy: 'replace',
        }),
      }),
    ])
  })

  it('maps execution proposal events into confirmation card blocks', () => {
    const update = pdeTransformStreamPacket({
      packet: {
        type: 'execution_proposal' as never,
        data: {
          proposal_id: 'proposal-1',
          resource_key: 'heat-equation',
          resource_name: 'Heat Equation',
          executor_name: 'Finite Difference',
          parameter_summary: [{ label: 'dt', value: '0.01' }],
          warnings: ['Stability condition required'],
        } as never,
      },
      defaultUpdate: null,
    })

    expect(update?.blocks).toEqual([
      {
        type: 'confirmation_card',
        proposal: {
          proposalId: 'proposal-1',
          resourceKey: 'heat-equation',
          resourceName: 'Heat Equation',
          executorName: 'Finite Difference',
          parameterSummary: [{ label: 'dt', value: '0.01' }],
          warnings: ['Stability condition required'],
          requiresConfirmation: true,
        },
      },
    ])
  })

  it('maps result summary events into result summary blocks', () => {
    const update = pdeTransformStreamPacket({
      packet: {
        type: 'result_summary' as never,
        data: {
          summary_id: 'task-1',
          status: 'completed',
          headline: 'Simulation completed',
          details: ['128 timesteps', 'Max temperature 310K'],
        } as never,
      },
      defaultUpdate: null,
    })

    expect(update?.blocks).toEqual([
      {
        type: 'result_summary',
        summary: {
          summaryId: 'task-1',
          status: 'completed',
          headline: 'Simulation completed',
          details: ['128 timesteps', 'Max temperature 310K'],
        },
      },
    ])
  })
})
