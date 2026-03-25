/**
 * Chat role values accepted by the frontend chat domain.
 */
export const CHAT_ROLES = ['user', 'assistant', 'system'] as const

export type ChatRole = (typeof CHAT_ROLES)[number]

/**
 * Supported message lifecycle states for optimistic UI rendering.
 */
export const CHAT_MESSAGE_STATUSES = ['pending', 'streaming', 'done', 'error', 'stopped'] as const

export type ChatMessageStatus = (typeof CHAT_MESSAGE_STATUSES)[number]

/**
 * Supported agent interaction modes exposed by the v2 chat API.
 */
export const CHAT_AGENT_MODES = ['ask', 'plan', 'agent'] as const

export type ChatAgentMode = (typeof CHAT_AGENT_MODES)[number]

/**
 * Default agent mode used for new sessions and legacy sessions without mode metadata.
 */
export const DEFAULT_CHAT_AGENT_MODE: ChatAgentMode = 'agent'

export interface ChatSession {
  sessionId: string
  title: string
  createdAt: string
  updatedAt: string
  model: string
  mode?: ChatAgentMode
}

/**
 * Client-side image attachment metadata kept in chat messages.
 */
export interface ChatImageAttachment {
  id: string
  name: string
  mimeType: string
  size: number
  previewUrl: string
}

/**
 * Select option metadata used by plan questionnaires.
 */
export interface PlanQuestionOption {
  label: string
  value: string
}

/**
 * Answer value collected from a plan questionnaire.
 */
export type PlanQuestionnaireAnswerValue = string | string[] | number | boolean

interface PlanQuestionBase {
  id: string
  label: string
  required?: boolean
}

/**
 * Single-choice question shown in a plan questionnaire.
 */
export interface PlanSingleSelectQuestion extends PlanQuestionBase {
  kind: 'single_select'
  allowOther?: boolean
  options: PlanQuestionOption[]
}

/**
 * Multiple-choice question shown in a plan questionnaire.
 */
export interface PlanMultiSelectQuestion extends PlanQuestionBase {
  kind: 'multi_select'
  options: PlanQuestionOption[]
}

/**
 * Free-text question shown in a plan questionnaire.
 */
export interface PlanTextQuestion extends PlanQuestionBase {
  kind: 'text'
  placeholder?: string
}

/**
 * Numeric question shown in a plan questionnaire.
 */
export interface PlanNumberQuestion extends PlanQuestionBase {
  kind: 'number'
  placeholder?: string
  unit?: string
}

/**
 * Boolean question shown in a plan questionnaire.
 */
export interface PlanBooleanQuestion extends PlanQuestionBase {
  kind: 'boolean'
  trueLabel?: string
  falseLabel?: string
}

/**
 * Supported question variants in a plan questionnaire.
 */
export type PlanQuestion =
  | PlanSingleSelectQuestion
  | PlanMultiSelectQuestion
  | PlanTextQuestion
  | PlanNumberQuestion
  | PlanBooleanQuestion

/**
 * Structured question form emitted for plan-mode clarification flows.
 */
export interface PlanQuestionnaire {
  questionnaireId: string
  title?: string
  description?: string
  submitLabel?: string
  questions: PlanQuestion[]
  answers?: Partial<Record<string, PlanQuestionnaireAnswerValue>>
}

/**
 * Submission payload emitted by a questionnaire card.
 */
export interface PlanQuestionnaireSubmission {
  questionnaireId: string
  answers: Record<string, PlanQuestionnaireAnswerValue>
  content: string
  sourceMessageId?: string
}

/**
 * Submission payload emitted when a user confirms an execution proposal.
 */
export interface ExecutionConfirmationSubmission {
  proposalId: string
  content: string
  sourceMessageId?: string
}

/**
 * Summary item used by structured assistant cards to describe parameter changes.
 */
export interface ChatParameterSummaryItem {
  label: string
  value: string
  fieldPath?: string
}

/**
 * Executable proposal metadata surfaced by structured assistant confirmation cards.
 */
export interface ExecutionProposal {
  proposalId: string
  equationKey: string
  equationName: string
  solverName?: string
  parameterSummary: ChatParameterSummaryItem[]
  warnings?: string[]
  requiresConfirmation: true
}

/**
 * Structured result summary emitted after a PDE task has started or completed.
 */
export interface ResultSummary {
  taskId: string
  status: 'completed' | 'failed' | 'running' | 'pending'
  headline: string
  details: string[]
}

/**
 * Structured assistant block variants rendered by the chat thread.
 */
export type ChatMessageBlock =
  | { type: 'markdown'; text: string }
  | { type: 'notice'; tone: 'info' | 'warning' | 'success'; text: string }
  | { type: 'parameter_summary'; items: ChatParameterSummaryItem[] }
  | { type: 'confirmation_card'; proposal: ExecutionProposal }
  | { type: 'result_summary'; summary: ResultSummary }
  | { type: 'questionnaire'; questionnaire: PlanQuestionnaire }

/**
 * Chat message stored in the UI state and rendered by the chat thread.
 */
export interface ChatMessage {
  id: string
  sessionId: string
  role: ChatRole
  content: string
  blocks?: ChatMessageBlock[]
  attachments?: ChatImageAttachment[]
  localOnly?: boolean
  status?: ChatMessageStatus
  createdAt: string
}

export interface SendMessageParams {
  sessionId: string
  model: string
  mode: ChatAgentMode
  content: string
}

export interface ChatHealthResponse {
  status: string
  model: string
}

export interface ChatModel {
  id: string
  object: string
}

export interface ChatModelsResponse {
  data: ChatModel[]
}

export interface ChatCompletionChoice {
  index: number
  message: {
    role: ChatRole
    content: string
  }
  finish_reason: string | null
}

export interface ChatCompletionUsage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

export interface ChatCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: ChatCompletionChoice[]
  usage: ChatCompletionUsage
}

export interface ChatTerminateRequest {
  sessionId?: string
}

export interface ChatTerminateResponse {
  terminated: boolean
}

export interface ChatStreamDelta {
  role?: ChatRole
  content?: string
}

export interface ChatStreamPayloadItem {
  index: number
  delta: ChatStreamDelta
  finish_reason: string | null
}

export interface ChatStreamPacketData {
  id: string
  object: string
  created: number
  model: string
  payload: ChatStreamPayloadItem[]
}

export interface ChatStreamPacket {
  type: 'message_start' | 'delta' | 'message_complete' | 'stream_end' | 'error'
  data: ChatStreamPacketData | string | { message?: string }
}

export interface AiChatLabels {
  sendButton?: string
  stopButton?: string
  placeholder?: string
  modeLabelAsk?: string
  modeLabelPlan?: string
  modeLabelAgent?: string
  newChat?: string
  emptyStateTitle?: string
  emptyStateSubtitle?: string
  attachmentLimitNotice?: string
}

export const DEFAULT_AI_CHAT_LABELS: Required<AiChatLabels> = {
  sendButton: 'Send',
  stopButton: 'Stop',
  placeholder: 'Ask something...',
  modeLabelAsk: 'Ask',
  modeLabelPlan: 'Plan',
  modeLabelAgent: 'Agent',
  newChat: 'New Chat',
  emptyStateTitle: 'How can I help you?',
  emptyStateSubtitle: 'Start a conversation',
  attachmentLimitNotice: 'Images exceeded the limit. Only the first 10 images were kept.',
}
