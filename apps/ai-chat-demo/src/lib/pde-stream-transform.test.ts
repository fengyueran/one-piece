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
                { label: 'Classic numeric simulation', value: 'classic' },
                { label: 'Quantum simulation', value: 'quantum' },
              ],
            },
          ],
        },
      },
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
