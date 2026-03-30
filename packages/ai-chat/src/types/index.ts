import type { ReactNode } from 'react'

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

/**
 * Represents a chat session with its metadata.
 */
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
 * The value type for a single questionnaire answer.
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
  | { type: 'custom'; kind: string; data: unknown }

/**
 * Supported message body render orders for mixed text and structured blocks.
 */
export const CHAT_MESSAGE_RENDER_ORDERS = ['blocks-first', 'timeline'] as const

export type ChatMessageRenderOrder = (typeof CHAT_MESSAGE_RENDER_ORDERS)[number]

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

/**
 * Message patch emitted while a streaming response is being assembled.
 */
export interface ChatStreamMessagePatch {
  content?: string
  blocks?: ChatMessageBlock[]
}

/**
 * Normalized update extracted from a single backend stream packet.
 */
export interface ChatStreamPacketUpdate {
  content?: string
  contentDelta?: string
  blocks?: ChatMessageBlock[]
}

/**
 * Parameters used by a transport implementation when starting a streaming response.
 */
export interface ChatTransportStartStreamArgs {
  /** Existing backend session ID. Omit for a brand new conversation. */
  sessionId?: string
  /** Model identifier currently selected in the UI. */
  model: string
  /** Agent mode selected in the UI. */
  mode: ChatAgentMode
  /** User message content that should be sent to the backend. */
  content: string
  /** Abort signal controlled by the chat composer stop action. */
  signal?: AbortSignal
  /** Emits normalized streaming patches that should update the assistant message. */
  onUpdate: (update: ChatStreamPacketUpdate) => void
  /** Emits the definitive backend session ID once the server creates or upgrades one. */
  onSessionId?: (sessionId: string) => void
  /** Called after the stream completes successfully. */
  onDone?: () => void
  /** Called when the stream fails and the UI should surface an error. */
  onError?: (error: Error) => void
}

/**
 * Transport interface implemented by host applications to connect chat UI to any backend.
 */
export interface ChatTransport {
  /** Loads the model list shown by the composer model selector. */
  getModels: () => Promise<ChatModelsResponse>
  /** Starts a single assistant response stream for the current user message. */
  startStream: (args: ChatTransportStartStreamArgs) => Promise<void>
  /** Requests termination of the active backend stream for a session. */
  terminateStream: (sessionId?: string) => Promise<ChatTerminateResponse>
}

/**
 * Arguments passed to custom stream packet transformers.
 */
export interface ChatStreamPacketTransformArgs {
  packet: ChatStreamPacket
  defaultUpdate: ChatStreamPacketUpdate | null
}

/**
 * Optional packet transformer supplied by integrators to adapt custom backend envelopes.
 */
export type TransformChatStreamPacket = (
  args: ChatStreamPacketTransformArgs,
) => ChatStreamPacketUpdate | null

/**
 * Arguments passed to custom block renderers.
 */
export interface ChatMessageBlockRendererProps {
  block: ChatMessageBlock
  index: number
  message: ChatMessage
  mode: ChatAgentMode
  onConfirmationSubmit?: (submission: ExecutionConfirmationSubmission) => void
  onQuestionnaireSubmit?: (submission: PlanQuestionnaireSubmission) => void
}

/**
 * Optional renderer used for custom block variants.
 */
export type ChatMessageBlockRenderer = (props: ChatMessageBlockRendererProps) => ReactNode

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

/**
 * Request payload for terminating an active streaming chat session.
 */
export interface ChatTerminateRequest {
  sessionId?: string
}

/**
 * Response payload returned after a terminate request has been processed.
 */
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

export interface ChatStructuredStreamPacketData {
  message?: string
  content?: string
  blocks?: ChatMessageBlock[]
}

export interface ChatStreamPacket {
  type: 'message_start' | 'delta' | 'message_complete' | 'stream_end' | 'error'
  data: ChatStreamPacketData | ChatStructuredStreamPacketData | string | { message?: string }
}

/**
 * Customizable UI label strings used throughout the chat components.
 */
export interface AiChatLabels {
  sendButton?: string
  stopButton?: string
  retryButton?: string
  placeholder?: string
  modeLabelAsk?: string
  modeLabelPlan?: string
  modeLabelAgent?: string
  newChat?: string
  emptyStateTitle?: string
  emptyStateSubtitle?: string
  attachmentLimitNotice?: string
  userRoleLabel?: string
  assistantRoleLabel?: string
  stoppedResponse?: string
  assistantStreamingAriaLabel?: string
  networkError?: string
  genericError?: string
}

/**
 * Default English label values used when no labels are provided.
 */
export const DEFAULT_AI_CHAT_LABELS: Required<AiChatLabels> = {
  sendButton: 'Send',
  stopButton: 'Stop',
  retryButton: 'Retry',
  placeholder: 'Ask something...',
  modeLabelAsk: 'Ask',
  modeLabelPlan: 'Plan',
  modeLabelAgent: 'Agent',
  newChat: 'New Chat',
  emptyStateTitle: 'How can I help you?',
  emptyStateSubtitle: 'Start a conversation',
  attachmentLimitNotice: 'Images exceeded the limit. Only the first 10 images were kept.',
  userRoleLabel: 'User',
  assistantRoleLabel: 'Assistant',
  stoppedResponse: 'Response stopped',
  assistantStreamingAriaLabel: 'assistant streaming',
  networkError: 'Network request failed. Please try again.',
  genericError: 'Something went wrong. Please try again.',
}
