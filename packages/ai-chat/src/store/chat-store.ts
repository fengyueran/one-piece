import { createStore } from 'zustand/vanilla'
import {
  DEFAULT_CHAT_AGENT_MODE,
  type ChatAgentMode,
  type ChatMessage,
  type ChatSession,
  type PlanQuestionnaireAnswerValue,
} from '../types'

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

export interface ChatState {
  activeSessionId: string | null
  preferredMode: ChatAgentMode
  sessions: ChatSession[]
  messagesBySession: Record<string, ChatMessage[]>
  streamingMessageBySession: Record<string, ChatMessage | undefined>
  isStreamingBySession: Record<string, boolean>
  errorBySession: Record<string, string | null>
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export interface ChatActions {
  // Session management
  createSession: (session: ChatSession) => void
  setActiveSession: (sessionId: string | null) => void
  replaceSessionId: (previousSessionId: string, nextSessionId: string) => void
  setPreferredMode: (mode: ChatAgentMode) => void
  setSessionMode: (sessionId: string, mode: ChatAgentMode) => void

  // Message operations
  appendMessage: (sessionId: string, message: ChatMessage) => void
  startStreamingMessage: (sessionId: string, message: ChatMessage) => void
  updateStreamingMessage: (sessionId: string, content: string) => void
  completeStreamingMessage: (sessionId: string) => void
  finalizeStoppedStreamingMessage: (sessionId: string) => void
  setSessionError: (sessionId: string, error: string | null) => void
  clearSessionError: (sessionId: string) => void
  updateQuestionnaireAnswers: (
    sessionId: string,
    messageId: string,
    questionnaireId: string,
    answers: Record<string, PlanQuestionnaireAnswerValue>,
  ) => void
}

export type ChatStore = ChatState & ChatActions

export type ChatStoreInstance = ReturnType<typeof createChatStore>

// ---------------------------------------------------------------------------
// Internal constants & helpers
// ---------------------------------------------------------------------------

const DEFAULT_CHAT_SESSION_TITLE = 'New Chat'
const IMAGE_MESSAGE_SESSION_TITLE = 'Image message'

const resolveSessionTitleFromMessage = (message: ChatMessage): string => {
  const trimmedContent = message.content.trim()
  if (trimmedContent) {
    return trimmedContent.slice(0, 30)
  }
  if ((message.attachments?.length ?? 0) > 0) {
    return IMAGE_MESSAGE_SESSION_TITLE
  }
  return DEFAULT_CHAT_SESSION_TITLE
}

const ensureSessionState = (state: ChatState, sessionId: string): void => {
  if (state.messagesBySession[sessionId] === undefined) {
    state.messagesBySession[sessionId] = []
  }
  if (state.errorBySession[sessionId] === undefined) {
    state.errorBySession[sessionId] = null
  }
  if (state.isStreamingBySession[sessionId] === undefined) {
    state.isStreamingBySession[sessionId] = false
  }
}

const finalizeStreamingMessage = (
  state: ChatState,
  sessionId: string,
  status?: 'done' | 'stopped',
  clearError = false,
): ChatState => {
  const message = state.streamingMessageBySession[sessionId]
  const hasRenderableMessagePayload = Boolean(
    message?.content || message?.blocks?.length || message?.attachments?.length,
  )

  const nextMessages = [...(state.messagesBySession[sessionId] ?? [])]
  if (message && (!status || hasRenderableMessagePayload)) {
    nextMessages.push({ ...message, status: status ?? message.status })
  }

  return {
    ...state,
    messagesBySession: {
      ...state.messagesBySession,
      [sessionId]: nextMessages,
    },
    streamingMessageBySession: {
      ...state.streamingMessageBySession,
      [sessionId]: undefined,
    },
    isStreamingBySession: {
      ...state.isStreamingBySession,
      [sessionId]: false,
    },
    errorBySession: clearError
      ? { ...state.errorBySession, [sessionId]: null }
      : state.errorBySession,
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

const initialState: ChatState = {
  activeSessionId: null,
  preferredMode: DEFAULT_CHAT_AGENT_MODE,
  sessions: [],
  messagesBySession: {},
  streamingMessageBySession: {},
  isStreamingBySession: {},
  errorBySession: {},
}

export const createChatStore = () =>
  createStore<ChatStore>((set, get) => ({
    ...initialState,

    // ---- Session management ------------------------------------------------

    createSession: (session: ChatSession) => {
      const state = get()
      const exists = state.sessions.some((s) => s.sessionId === session.sessionId)
      const nextSession: ChatSession = {
        ...session,
        mode: session.mode ?? DEFAULT_CHAT_AGENT_MODE,
      }

      // Mutable-style copies
      const nextSessions = exists ? state.sessions : [nextSession, ...state.sessions]
      const nextMessagesBySession = { ...state.messagesBySession }
      const nextErrorBySession = { ...state.errorBySession }
      const nextIsStreamingBySession = { ...state.isStreamingBySession }

      const sid = session.sessionId
      if (nextMessagesBySession[sid] === undefined) nextMessagesBySession[sid] = []
      if (nextErrorBySession[sid] === undefined) nextErrorBySession[sid] = null
      if (nextIsStreamingBySession[sid] === undefined) nextIsStreamingBySession[sid] = false

      set({
        sessions: nextSessions,
        activeSessionId: sid,
        messagesBySession: nextMessagesBySession,
        errorBySession: nextErrorBySession,
        isStreamingBySession: nextIsStreamingBySession,
      })
    },

    setActiveSession: (sessionId: string | null) => {
      set({ activeSessionId: sessionId })
    },

    replaceSessionId: (previousSessionId: string, nextSessionId: string) => {
      if (!previousSessionId || !nextSessionId || previousSessionId === nextSessionId) {
        return
      }

      const state = get()

      // Migrate sessions array
      const nextSessions = state.sessions.map((s) =>
        s.sessionId === previousSessionId ? { ...s, sessionId: nextSessionId } : s,
      )

      // Migrate messagesBySession
      const nextMessagesBySession = { ...state.messagesBySession }
      if (previousSessionId in nextMessagesBySession) {
        nextMessagesBySession[nextSessionId] = (nextMessagesBySession[previousSessionId] ?? []).map(
          (m) => ({ ...m, sessionId: nextSessionId }),
        )
        delete nextMessagesBySession[previousSessionId]
      }

      // Migrate streamingMessageBySession
      const nextStreamingMessageBySession = { ...state.streamingMessageBySession }
      if (previousSessionId in nextStreamingMessageBySession) {
        const prev = nextStreamingMessageBySession[previousSessionId]
        if (prev) {
          nextStreamingMessageBySession[nextSessionId] = { ...prev, sessionId: nextSessionId }
        } else if (!(nextSessionId in nextStreamingMessageBySession)) {
          nextStreamingMessageBySession[nextSessionId] = undefined
        }
        delete nextStreamingMessageBySession[previousSessionId]
      }

      // Migrate isStreamingBySession
      const nextIsStreamingBySession = { ...state.isStreamingBySession }
      if (previousSessionId in nextIsStreamingBySession) {
        nextIsStreamingBySession[nextSessionId] =
          nextIsStreamingBySession[previousSessionId] ?? false
        delete nextIsStreamingBySession[previousSessionId]
      }

      // Migrate errorBySession
      const nextErrorBySession = { ...state.errorBySession }
      if (previousSessionId in nextErrorBySession) {
        nextErrorBySession[nextSessionId] = nextErrorBySession[previousSessionId] ?? null
        delete nextErrorBySession[previousSessionId]
      }

      // Migrate activeSessionId
      const nextActiveSessionId =
        state.activeSessionId === previousSessionId ? nextSessionId : state.activeSessionId

      set({
        sessions: nextSessions,
        messagesBySession: nextMessagesBySession,
        streamingMessageBySession: nextStreamingMessageBySession,
        isStreamingBySession: nextIsStreamingBySession,
        errorBySession: nextErrorBySession,
        activeSessionId: nextActiveSessionId,
      })
    },

    setPreferredMode: (mode: ChatAgentMode) => {
      set({ preferredMode: mode })
    },

    setSessionMode: (sessionId: string, mode: ChatAgentMode) => {
      const state = get()
      const nextSessions = state.sessions.map((s) =>
        s.sessionId === sessionId ? { ...s, mode } : s,
      )
      set({ sessions: nextSessions })
    },

    // ---- Message operations ------------------------------------------------

    appendMessage: (sessionId: string, message: ChatMessage) => {
      const state = get()

      // Ensure session state maps are initialised
      const nextMessagesBySession = { ...state.messagesBySession }
      if (!nextMessagesBySession[sessionId]) {
        nextMessagesBySession[sessionId] = []
      }
      nextMessagesBySession[sessionId] = [...nextMessagesBySession[sessionId], message]

      const nextSessions = state.sessions.map((s) => {
        if (s.sessionId !== sessionId) return s
        const updated: ChatSession = { ...s, updatedAt: message.createdAt }
        if (message.role === 'user' && s.title === DEFAULT_CHAT_SESSION_TITLE) {
          updated.title = resolveSessionTitleFromMessage(message)
        }
        return updated
      })

      const nextErrorBySession =
        state.errorBySession[sessionId] === undefined
          ? { ...state.errorBySession, [sessionId]: null }
          : state.errorBySession

      const nextIsStreamingBySession =
        state.isStreamingBySession[sessionId] === undefined
          ? { ...state.isStreamingBySession, [sessionId]: false }
          : state.isStreamingBySession

      set({
        messagesBySession: nextMessagesBySession,
        sessions: nextSessions,
        errorBySession: nextErrorBySession,
        isStreamingBySession: nextIsStreamingBySession,
      })
    },

    startStreamingMessage: (sessionId: string, message: ChatMessage) => {
      const state = get()
      set({
        streamingMessageBySession: {
          ...state.streamingMessageBySession,
          [sessionId]: message,
        },
        isStreamingBySession: {
          ...state.isStreamingBySession,
          [sessionId]: true,
        },
        errorBySession: {
          ...state.errorBySession,
          [sessionId]: null,
        },
      })
    },

    updateStreamingMessage: (sessionId: string, content: string) => {
      const state = get()
      const target = state.streamingMessageBySession[sessionId]
      if (!target) return
      set({
        streamingMessageBySession: {
          ...state.streamingMessageBySession,
          [sessionId]: { ...target, content },
        },
      })
    },

    completeStreamingMessage: (sessionId: string) => {
      set((state) => finalizeStreamingMessage(state, sessionId, 'done'))
    },

    finalizeStoppedStreamingMessage: (sessionId: string) => {
      set((state) => finalizeStreamingMessage(state, sessionId, 'stopped', true))
    },

    setSessionError: (sessionId: string, error: string | null) => {
      const state = get()
      set({
        errorBySession: { ...state.errorBySession, [sessionId]: error },
      })
    },

    clearSessionError: (sessionId: string) => {
      const state = get()
      set({
        errorBySession: { ...state.errorBySession, [sessionId]: null },
      })
    },

    updateQuestionnaireAnswers: (
      sessionId: string,
      messageId: string,
      questionnaireId: string,
      answers: Record<string, PlanQuestionnaireAnswerValue>,
    ) => {
      const state = get()
      const sessionMessages = state.messagesBySession[sessionId]

      const updateBlocks = (message: ChatMessage): ChatMessage => {
        if (!message.blocks?.length) return message
        let hasUpdatedBlock = false
        const nextBlocks = message.blocks.map((block) => {
          if (
            block.type !== 'questionnaire' ||
            block.questionnaire.questionnaireId !== questionnaireId
          ) {
            return block
          }
          hasUpdatedBlock = true
          return {
            ...block,
            questionnaire: { ...block.questionnaire, answers: { ...answers } },
          }
        })
        if (!hasUpdatedBlock) return message
        return { ...message, blocks: nextBlocks }
      }

      const nextMessagesBySession = { ...state.messagesBySession }
      if (sessionMessages) {
        nextMessagesBySession[sessionId] = sessionMessages.map((m) =>
          m.id === messageId ? updateBlocks(m) : m,
        )
      }

      const currentStreaming = state.streamingMessageBySession[sessionId]
      const nextStreamingMessageBySession = { ...state.streamingMessageBySession }
      if (currentStreaming && currentStreaming.id === messageId) {
        nextStreamingMessageBySession[sessionId] = updateBlocks(currentStreaming)
      }

      set({
        messagesBySession: nextMessagesBySession,
        streamingMessageBySession: nextStreamingMessageBySession,
      })
    },
  }))
