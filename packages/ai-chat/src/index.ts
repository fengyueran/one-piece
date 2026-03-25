// ---------------------------------------------------------------------------
// Top-level component
// ---------------------------------------------------------------------------
export { AiChat } from './components/AiChat'
export type { AiChatProps } from './components/AiChat'

// ---------------------------------------------------------------------------
// Provider (for custom layouts)
// ---------------------------------------------------------------------------
export { AiChatProvider } from './components/AiChatProvider'
export type { AiChatProviderProps } from './components/AiChatProvider'

// ---------------------------------------------------------------------------
// Individual components (for custom layouts)
// ---------------------------------------------------------------------------
export { ChatThread } from './components/ChatThread'
export { ChatComposer } from './components/ChatComposer'
export type { ChatComposerViewProps } from './components/ChatComposer'
export { ChatConversationList } from './components/ChatConversationList'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type {
  AiChatLabels,
  ChatAgentMode,
  ChatImageAttachment,
  ChatMessage,
  ChatMessageBlock,
  ChatMessageStatus,
  ChatModel,
  ChatRole,
  ChatSession,
  ExecutionConfirmationSubmission,
  ExecutionProposal,
  PlanQuestionnaire,
  PlanQuestionnaireSubmission,
  ResultSummary,
} from './types'
export { CHAT_AGENT_MODES, DEFAULT_CHAT_AGENT_MODE, DEFAULT_AI_CHAT_LABELS } from './types'
