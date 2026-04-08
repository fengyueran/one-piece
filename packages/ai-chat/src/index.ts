// ---------------------------------------------------------------------------
// Top-level component
// ---------------------------------------------------------------------------
export { AiChat } from './components/ai-chat'
export type { AiChatProps } from './components/ai-chat'

// ---------------------------------------------------------------------------
// Provider (for custom layouts)
// ---------------------------------------------------------------------------
export { AiChatProvider } from './components/ai-chat-provider'
export type { AiChatProviderProps } from './components/ai-chat-provider'

// ---------------------------------------------------------------------------
// Transport
// ---------------------------------------------------------------------------
export { createDefaultChatTransport } from './transport'
export type {
  ChatToolExecutionPolicy,
  CreateDefaultChatTransportOptions,
  DefaultChatTransportEndpoints,
} from './transport'

// ---------------------------------------------------------------------------
// Individual components (for custom layouts)
// ---------------------------------------------------------------------------
export { ChatThread } from './components/chat-thread'
export { ChatComposer } from './components/chat-composer'
export type { ChatComposerViewProps } from './components/chat-composer'
export { ChatConversationList } from './components/chat-conversation-list'
export { useChatContext, useChatStore } from './context/use-chat-context'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type {
  AiChatLabels,
  ChatAgentMode,
  ChatConfirmationSubmitHandler,
  ChatImageAttachment,
  ChatMessage,
  ChatMessageBlock,
  ChatParameterSummaryItem,
  ChatQuestionnaireSubmitHandler,
  ChatSubmissionContext,
  ChatMessageBlockRenderer,
  ChatMessageBlockRendererProps,
  ChatMessageRenderOrder,
  ChatMessageStatus,
  ChatModel,
  ChatRole,
  ChatSession,
  ChatTransport,
  ChatTransportStartStreamArgs,
  ChatStreamMessagePatch,
  ChatStreamPacketTransformArgs,
  ChatStreamPacketUpdate,
  ExecutionConfirmationSubmission,
  ExecutionProposal,
  PlanQuestionOption,
  PlanQuestionSubmissionDetail,
  PlanQuestionnaire,
  PlanQuestionnaireSubmission,
  ResultSummary,
  TransformChatStreamPacket,
} from './types'
export {
  CHAT_AGENT_MODES,
  CHAT_MESSAGE_RENDER_ORDERS,
  DEFAULT_CHAT_AGENT_MODE,
  DEFAULT_AI_CHAT_LABELS,
} from './types'
