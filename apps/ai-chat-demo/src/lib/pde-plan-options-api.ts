import type {
  ChatQuestionnaireSubmitHandler,
  ChatSubmissionContext,
  PlanQuestionnaireSubmission,
} from '@xinghunm/ai-chat'

interface PdePlanPendingOption {
  title: string
  description?: string
}

interface PdePlanPendingItem {
  option_request_id: string
  request_id: string
  session_id: string
  mode: string
  question: string
  options: PdePlanPendingOption[]
  created_ts: number
}

interface PdePlanPendingResponse {
  session_id: string
  count: number
  items: PdePlanPendingItem[]
}

interface PdePlanDecisionResponse {
  option_request_id: string
  session_id: string
  selected_index: number
  title: string
  description?: string
}

const PLAN_PENDING_PATH = '/chat/plan/options/pending'
const PLAN_DECIDE_PATH = '/chat/plan/options/decide'

const getSelectedIndex = (submission: PlanQuestionnaireSubmission): number => {
  const selectedValue = Object.values(submission.answers)[0]

  if (typeof selectedValue !== 'string') {
    throw new Error('Plan options require a single selected value.')
  }

  const selectedIndex = Number.parseInt(selectedValue, 10)

  if (!Number.isInteger(selectedIndex) || selectedIndex < 0) {
    throw new Error('Plan option selection is invalid.')
  }

  return selectedIndex
}

const fetchPendingPlanOptions = async (
  apiBaseUrl: string,
  authToken: string,
  sessionId: string,
): Promise<PdePlanPendingResponse> => {
  const response = await fetch(
    `${apiBaseUrl}${PLAN_PENDING_PATH}?session_id=${encodeURIComponent(sessionId)}`,
    {
      method: 'GET',
      headers: {
        Authorization: authToken,
      },
    },
  )

  if (!response.ok) {
    throw new Error(`Failed to load pending plan options: HTTP ${response.status}`)
  }

  return (await response.json()) as PdePlanPendingResponse
}

const decidePendingPlanOption = async (
  apiBaseUrl: string,
  authToken: string,
  optionRequestId: string,
  selectedIndex: number,
): Promise<PdePlanDecisionResponse> => {
  const response = await fetch(`${apiBaseUrl}${PLAN_DECIDE_PATH}`, {
    method: 'POST',
    headers: {
      Authorization: authToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      option_request_id: optionRequestId,
      selected_index: selectedIndex,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to submit plan option decision: HTTP ${response.status}`)
  }

  return (await response.json()) as PdePlanDecisionResponse
}

const extractOptionRequestIdFromBlockKey = (
  submission: PlanQuestionnaireSubmission,
): string | null => {
  if (!submission.blockKey) {
    return null
  }

  const expectedPrefix = `plan:${submission.questionnaireId}:`
  if (!submission.blockKey.startsWith(expectedPrefix)) {
    return null
  }

  const optionRequestId = submission.blockKey.slice(expectedPrefix.length).trim()
  return optionRequestId || null
}

const extractSubmissionQuestionLabel = (submission: PlanQuestionnaireSubmission): string | null => {
  const questionLine = submission.content
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.startsWith('- '))

  if (!questionLine) {
    return null
  }

  const separatorIndex = questionLine.indexOf(':')
  if (separatorIndex === -1) {
    return null
  }

  const label = questionLine.slice(2, separatorIndex).trim()
  return label || null
}

const resolvePendingPlanItem = (
  response: PdePlanPendingResponse,
  submission: PlanQuestionnaireSubmission,
) => {
  const optionRequestId = extractOptionRequestIdFromBlockKey(submission)
  const questionLabel = extractSubmissionQuestionLabel(submission)

  return (
    (optionRequestId
      ? response.items.find((item) => item.option_request_id === optionRequestId)
      : null) ??
    response.items.find((item) => item.option_request_id === submission.questionnaireId) ??
    response.items.find(
      (item) =>
        item.request_id === submission.questionnaireId &&
        questionLabel !== null &&
        item.question.trim() === questionLabel,
    ) ??
    response.items.find((item) => item.request_id === submission.questionnaireId) ??
    response.items[0] ??
    null
  )
}

export const createPdePlanQuestionnaireSubmitHandler = (
  apiBaseUrl: string,
  authToken: string,
): ChatQuestionnaireSubmitHandler => {
  return async (
    submission: PlanQuestionnaireSubmission,
    context: ChatSubmissionContext,
  ): Promise<void> => {
    const sessionId = context.sessionId?.trim()

    if (!sessionId) {
      throw new Error('Plan option submission requires an active session ID.')
    }

    const selectedIndex = getSelectedIndex(submission)
    const pending = await fetchPendingPlanOptions(apiBaseUrl, authToken, sessionId)
    const pendingItem = resolvePendingPlanItem(pending, submission)

    if (!pendingItem) {
      throw new Error('No pending plan options were found for this session.')
    }

    await decidePendingPlanOption(
      apiBaseUrl,
      authToken,
      pendingItem.option_request_id,
      selectedIndex,
    )
  }
}
