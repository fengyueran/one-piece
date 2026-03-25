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
// Individual components (for custom layouts)
// ---------------------------------------------------------------------------
export { ChatThread } from './components/chat-thread'
export { ChatComposer } from './components/chat-composer'
export type { ChatComposerViewProps } from './components/chat-composer'
export { ChatConversationList } from './components/chat-conversation-list'

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
