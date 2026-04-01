import type {
  ChatParameterSummaryItem,
  ExecutionProposal,
  ResultSummary,
  TransformChatStreamPacket,
} from '@xinghunm/ai-chat'
import { createPdePlanOptionsQuestionnaire } from './pde-plan-options'

export interface ApprovalRequiredPayload {
  request_id: string
  session_id: string
  mode: string
  tool_name: string
  tool_input: string
  timeout_sec: number
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isApprovalRequiredPayload = (value: unknown): value is ApprovalRequiredPayload =>
  isRecord(value) &&
  typeof value.request_id === 'string' &&
  typeof value.session_id === 'string' &&
  typeof value.mode === 'string' &&
  typeof value.tool_name === 'string' &&
  typeof value.tool_input === 'string' &&
  typeof value.timeout_sec === 'number'

const normalizeParameterSummary = (value: unknown): ChatParameterSummaryItem[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((item) => {
    if (!isRecord(item) || typeof item.label !== 'string' || typeof item.value !== 'string') {
      return []
    }

    return [
      {
        label: item.label,
        value: item.value,
        ...(typeof item.field_path === 'string' ? { fieldPath: item.field_path } : {}),
      } satisfies ChatParameterSummaryItem,
    ]
  })
}

const createExecutionProposal = (value: unknown): ExecutionProposal | null => {
  if (!isRecord(value)) {
    return null
  }

  if (
    typeof value.proposal_id !== 'string' ||
    typeof value.resource_key !== 'string' ||
    typeof value.resource_name !== 'string'
  ) {
    return null
  }

  const parameterSummary = normalizeParameterSummary(value.parameter_summary)

  return {
    proposalId: value.proposal_id,
    resourceKey: value.resource_key,
    resourceName: value.resource_name,
    ...(typeof value.executor_name === 'string' ? { executorName: value.executor_name } : {}),
    parameterSummary,
    ...(Array.isArray(value.warnings)
      ? {
          warnings: value.warnings.filter(
            (warning): warning is string => typeof warning === 'string' && warning.trim() !== '',
          ),
        }
      : {}),
    requiresConfirmation: true,
  }
}

const createResultSummary = (value: unknown): ResultSummary | null => {
  if (!isRecord(value)) {
    return null
  }

  if (
    typeof value.summary_id !== 'string' ||
    typeof value.status !== 'string' ||
    typeof value.headline !== 'string' ||
    !Array.isArray(value.details)
  ) {
    return null
  }

  const details = value.details.filter(
    (detail): detail is string => typeof detail === 'string' && detail.trim() !== '',
  )

  if (
    value.status !== 'completed' &&
    value.status !== 'failed' &&
    value.status !== 'running' &&
    value.status !== 'pending'
  ) {
    return null
  }

  return {
    summaryId: value.summary_id,
    status: value.status,
    headline: value.headline,
    details,
  }
}

export const pdeTransformStreamPacket: TransformChatStreamPacket = ({ packet, defaultUpdate }) => {
  const packetType = String(packet.type)

  if (packetType === 'approval_required') {
    if (!isApprovalRequiredPayload(packet.data)) {
      return defaultUpdate
    }

    return {
      ...defaultUpdate,
      blocks: [
        ...(defaultUpdate?.blocks ?? []),
        {
          type: 'custom',
          kind: 'approval-required',
          data: packet.data,
        },
      ],
    }
  }

  if (packetType === 'PLAN_OPTIONS' || packetType === 'plan_options') {
    const questionnaire = createPdePlanOptionsQuestionnaire(packet.data)

    if (!questionnaire) {
      return defaultUpdate
    }

    return {
      ...defaultUpdate,
      blocks: [
        ...(defaultUpdate?.blocks ?? []),
        {
          type: 'questionnaire',
          questionnaire,
        },
      ],
    }
  }

  if (packetType === 'EXECUTION_PROPOSAL' || packetType === 'execution_proposal') {
    const proposal = createExecutionProposal(packet.data)

    if (!proposal) {
      return defaultUpdate
    }

    return {
      ...defaultUpdate,
      blocks: [
        ...(defaultUpdate?.blocks ?? []),
        {
          type: 'confirmation_card',
          proposal,
        },
      ],
    }
  }

  if (packetType === 'RESULT_SUMMARY' || packetType === 'result_summary') {
    const summary = createResultSummary(packet.data)

    if (!summary) {
      return defaultUpdate
    }

    return {
      ...defaultUpdate,
      blocks: [
        ...(defaultUpdate?.blocks ?? []),
        {
          type: 'result_summary',
          summary,
        },
      ],
    }
  }

  return defaultUpdate
}
