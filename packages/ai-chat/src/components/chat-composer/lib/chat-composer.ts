import {
  DEFAULT_CHAT_AGENT_MODE,
  type ChatAgentMode,
  type ChatImageAttachment,
  type ChatMessage,
  type ChatModel,
  type ChatSession,
} from '../../../types'

// ---------------------------------------------------------------------------
// Draft session helpers
// ---------------------------------------------------------------------------

const DRAFT_CHAT_SESSION_ID_PREFIX = 'draft-session-'

/** Creates a client-only draft session id before the backend returns the persisted id. */
export const createDraftChatSessionId = () => `${DRAFT_CHAT_SESSION_ID_PREFIX}${Date.now()}`

/** Returns true if the session id is still a client-only draft id. */
export const isDraftChatSessionId = (sessionId: string | null | undefined) =>
  Boolean(sessionId?.startsWith(DRAFT_CHAT_SESSION_ID_PREFIX))

interface CreateDraftChatSessionArgs {
  model: string
  mode?: ChatAgentMode
  nowIso: () => string
  createSessionId: () => string
}

/** Creates a frontend draft chat session before the backend confirms the final id. */
export const createDraftChatSession = ({
  model,
  mode = DEFAULT_CHAT_AGENT_MODE,
  nowIso,
  createSessionId,
}: CreateDraftChatSessionArgs): ChatSession => {
  const iso = nowIso()
  return {
    sessionId: createSessionId(),
    title: 'New Chat',
    createdAt: iso,
    updatedAt: iso,
    model,
    mode,
  }
}

// ---------------------------------------------------------------------------
// Message builders
// ---------------------------------------------------------------------------

interface CreateUserMessageArgs {
  sessionId: string
  content: string
  attachments?: ChatImageAttachment[]
  localOnly?: boolean
  createdAt: string
  createMessageId: () => string
}

interface CreateAssistantStreamingMessageArgs {
  sessionId: string
  createdAt: string
  createMessageId: () => string
}

interface CanSendChatMessageArgs {
  value: string
  attachmentCount?: number
  isModelsLoading: boolean
  isModelsError: boolean
  hasModels: boolean
}

interface ShouldSubmitChatComposerArgs {
  key: string
  shiftKey: boolean
  canSend: boolean
}

interface ShouldStopChatComposerArgs {
  key: string
  shiftKey: boolean
  isStreaming: boolean
}

interface ResolveSelectedModelArgs {
  currentModel: string
  availableModels: ChatModel[]
  isModelsLoading: boolean
}

interface ResolveSendSessionArgs {
  activeSessionId: string | null
  selectedModel: string
  selectedMode: ChatAgentMode
  nowIso: () => string
  createSessionId: () => string
}

interface ResolveSendSessionResult {
  localSessionId: string
  sessionId?: string
  session?: ChatSession
}

/**
 * Builds the optimistic user message appended before the streaming response starts.
 */
export const createUserMessage = ({
  sessionId,
  content,
  attachments,
  localOnly,
  createdAt,
  createMessageId,
}: CreateUserMessageArgs): ChatMessage => ({
  id: createMessageId(),
  sessionId,
  role: 'user',
  content,
  attachments,
  localOnly,
  createdAt,
})

/**
 * Builds the optimistic assistant placeholder while the server stream is still running.
 */
export const createAssistantStreamingMessage = ({
  sessionId,
  createdAt,
  createMessageId,
}: CreateAssistantStreamingMessageArgs): ChatMessage => ({
  id: createMessageId(),
  sessionId,
  role: 'assistant',
  content: '',
  status: 'streaming',
  createdAt,
})

/**
 * Whether the current composer state is allowed to submit a message.
 */
export const canSendChatMessage = ({
  value,
  attachmentCount = 0,
  isModelsLoading,
  isModelsError,
  hasModels,
}: CanSendChatMessageArgs) => {
  const hasText = Boolean(value.trim())
  const hasAttachments = attachmentCount > 0

  if (!hasText && !hasAttachments) return false
  if (!hasText && hasAttachments) return true

  return !isModelsLoading && !isModelsError && hasModels
}

/**
 * Whether an Enter key press should submit instead of inserting a newline.
 */
export const shouldSubmitChatComposer = ({
  key,
  shiftKey,
  canSend,
}: ShouldSubmitChatComposerArgs) => key === 'Enter' && !shiftKey && canSend

/**
 * Whether an Enter key press should stop the active streaming response.
 */
export const shouldStopChatComposer = ({
  key,
  shiftKey,
  isStreaming,
}: ShouldStopChatComposerArgs) => key === 'Enter' && !shiftKey && isStreaming

/**
 * Chooses the active model value that should stay selected in the composer.
 */
export const resolveSelectedChatModel = ({
  currentModel,
  availableModels,
  isModelsLoading,
}: ResolveSelectedModelArgs) => {
  if (!availableModels.length) {
    return isModelsLoading ? currentModel : ''
  }
  if (currentModel && availableModels.some((model) => model.id === currentModel)) {
    return currentModel
  }
  return availableModels[0]!.id
}

/**
 * Resolves the local and server session identifiers used for the next send action.
 */
export const resolveSendSession = ({
  activeSessionId,
  selectedModel,
  selectedMode,
  nowIso,
  createSessionId,
}: ResolveSendSessionArgs): ResolveSendSessionResult => {
  if (activeSessionId) {
    return {
      localSessionId: activeSessionId,
      sessionId: isDraftChatSessionId(activeSessionId) ? undefined : activeSessionId,
    }
  }

  const session = createDraftChatSession({
    model: selectedModel,
    mode: selectedMode ?? DEFAULT_CHAT_AGENT_MODE,
    nowIso,
    createSessionId,
  })

  return { session, localSessionId: session.sessionId, sessionId: undefined }
}
