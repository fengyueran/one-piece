import { useCallback, useEffect, useRef, useState } from 'react'
import { DEFAULT_CHAT_AGENT_MODE, type ChatAgentMode, type ChatModel } from '../../../types'
import { useChatContext, useChatStore } from '../../../context/use-chat-context'
import { getChatModels, terminateChat } from '../../../api'
import { startChatStream } from '../../../api/chat-stream'
import {
  canSendChatMessage,
  createAssistantStreamingMessage,
  createDraftChatSessionId,
  createUserMessage,
  isDraftChatSessionId,
  resolveSelectedChatModel,
  resolveSendSession,
} from '../lib/chat-composer'
import { useComposerAttachments } from './use-composer-attachments'

const nowIso = () => new Date().toISOString()
const ATTACHMENT_NOTICE_DURATION_MS = 3000
const STOP_WAIT_TIMEOUT_MS = 3000
type AttachmentNotice = 'limit_reached' | null

export const useChatComposer = () => {
  const { axios: axiosInstance, apiBaseUrl, authToken } = useChatContext()

  // -- Store state -----------------------------------------------------------
  const activeSessionId = useChatStore((s) => s.activeSessionId)
  const activeSession = useChatStore(
    (s) => s.sessions.find((x) => x.sessionId === s.activeSessionId) ?? null,
  )
  const preferredMode = useChatStore((s) => s.preferredMode)
  const streamingSessionId = useChatStore(
    (s) => Object.entries(s.isStreamingBySession).find(([, v]) => v)?.[0] ?? null,
  )
  const isStreaming = Boolean(streamingSessionId)
  const isStopping = useChatStore((s) =>
    streamingSessionId ? (s.isStoppingBySession[streamingSessionId] ?? false) : false,
  )

  // -- Store actions (stable references in Zustand) -------------------------
  const createSession = useChatStore((s) => s.createSession)
  const replaceSessionId = useChatStore((s) => s.replaceSessionId)
  const appendMessage = useChatStore((s) => s.appendMessage)
  const startStreamingMessage = useChatStore((s) => s.startStreamingMessage)
  const updateStreamingMessage = useChatStore((s) => s.updateStreamingMessage)
  const completeStreamingMessage = useChatStore((s) => s.completeStreamingMessage)
  const requestStopStreaming = useChatStore((s) => s.requestStopStreaming)
  const finalizeStoppedStreamingMessage = useChatStore((s) => s.finalizeStoppedStreamingMessage)
  const setSessionError = useChatStore((s) => s.setSessionError)
  const clearSessionError = useChatStore((s) => s.clearSessionError)
  const setPreferredMode = useChatStore((s) => s.setPreferredMode)
  const setSessionMode = useChatStore((s) => s.setSessionMode)

  // -- Models state ----------------------------------------------------------
  const [availableModels, setAvailableModels] = useState<ChatModel[]>([])
  const [isModelsLoading, setIsModelsLoading] = useState(true)
  const [isModelsError, setIsModelsError] = useState(false)

  const fetchModels = useCallback(async () => {
    setIsModelsLoading(true)
    setIsModelsError(false)
    try {
      // getChatModels returns ChatModelsResponse which has a `data` array field
      const modelsResponse = await getChatModels(axiosInstance)
      setAvailableModels(modelsResponse.data)
    } catch {
      setIsModelsError(true)
    } finally {
      setIsModelsLoading(false)
    }
  }, [axiosInstance])

  useEffect(() => {
    void fetchModels()
  }, [fetchModels])

  const hasModels = availableModels.length > 0

  // -- Local composer state --------------------------------------------------
  const [value, setValue] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedMode, setSelectedModeLocal] = useState<ChatAgentMode>(DEFAULT_CHAT_AGENT_MODE)
  const [attachmentNotice, setAttachmentNotice] = useState<AttachmentNotice>(null)

  const { attachments, appendFiles, removeAttachment, clearAttachments, createMessageAttachments } =
    useComposerAttachments()

  const abortControllerRef = useRef<AbortController | null>(null)
  const stopRequestRef = useRef<{
    sessionId: string
    timeoutId: number | null
    finalized: boolean
  } | null>(null)
  const lastRequestRef = useRef<{
    localSessionId: string
    sessionId?: string
    content: string
    model: string
    mode: ChatAgentMode
  } | null>(null)

  // Keep selectedModel in sync with available models
  useEffect(() => {
    setSelectedModel((current) =>
      resolveSelectedChatModel({ currentModel: current, availableModels, isModelsLoading }),
    )
  }, [availableModels, isModelsLoading])

  // Keep selectedMode in sync with active session or preferred mode
  useEffect(() => {
    if (activeSession) {
      setSelectedModeLocal(activeSession.mode ?? DEFAULT_CHAT_AGENT_MODE)
      return
    }
    setSelectedModeLocal(preferredMode ?? DEFAULT_CHAT_AGENT_MODE)
  }, [activeSession, preferredMode])

  // Auto-clear attachment notices after a short delay
  useEffect(() => {
    if (!attachmentNotice) return
    const timeoutId = window.setTimeout(
      () => setAttachmentNotice(null),
      ATTACHMENT_NOTICE_DURATION_MS,
    )
    return () => window.clearTimeout(timeoutId)
  }, [attachmentNotice])

  // -- Stop helpers ----------------------------------------------------------

  const clearStopTimeout = (sessionId?: string) => {
    if (!stopRequestRef.current) return
    if (sessionId && stopRequestRef.current.sessionId !== sessionId) return
    if (stopRequestRef.current.timeoutId !== null) {
      window.clearTimeout(stopRequestRef.current.timeoutId)
      stopRequestRef.current.timeoutId = null
    }
  }

  const clearStopRequest = (sessionId?: string) => {
    if (!stopRequestRef.current) return
    if (sessionId && stopRequestRef.current.sessionId !== sessionId) return
    clearStopTimeout(sessionId)
    stopRequestRef.current = null
  }

  const finalizeStop = (sessionId: string) => {
    if (stopRequestRef.current?.sessionId === sessionId) {
      if (stopRequestRef.current.finalized) return
      stopRequestRef.current.finalized = true
    }
    clearStopTimeout(sessionId)
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    finalizeStoppedStreamingMessage(sessionId)
    clearStopRequest(sessionId)
  }

  // -- Core stream runner ----------------------------------------------------

  const runStream = useCallback(
    async ({
      localSessionId,
      sessionId,
      content,
      model,
      mode,
    }: {
      localSessionId: string
      sessionId?: string
      content: string
      model: string
      mode: ChatAgentMode
    }) => {
      if (!authToken) return

      clearStopRequest()
      let currentSessionId = localSessionId

      clearSessionError(currentSessionId)

      const assistantMessage = createAssistantStreamingMessage({
        sessionId: currentSessionId,
        createdAt: nowIso(),
        createMessageId: () => `assistant-${Date.now()}`,
      })

      startStreamingMessage(currentSessionId, assistantMessage)

      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()
      lastRequestRef.current = { localSessionId, sessionId, content, model, mode }

      let accumulated = ''

      try {
        await startChatStream({
          apiBaseUrl,
          sessionId,
          authToken,
          model,
          mode,
          content,
          signal: abortControllerRef.current.signal,
          onSessionId: (nextSessionId) => {
            if (!nextSessionId || nextSessionId === currentSessionId) return
            replaceSessionId(currentSessionId, nextSessionId)
            currentSessionId = nextSessionId
            lastRequestRef.current = {
              localSessionId: nextSessionId,
              sessionId: nextSessionId,
              content,
              model,
              mode,
            }
          },
          onPacket: (packet) => {
            if (packet.type !== 'delta') return
            if (typeof packet.data === 'string' || !('payload' in packet.data)) return
            const delta = packet.data.payload[0]?.delta?.content ?? ''
            if (!delta) return
            accumulated += delta
            updateStreamingMessage(currentSessionId, accumulated)
          },
          onDone: () => {
            if (stopRequestRef.current?.sessionId === currentSessionId) {
              finalizeStop(currentSessionId)
              return
            }
            completeStreamingMessage(currentSessionId)
            abortControllerRef.current = null
            clearStopRequest(currentSessionId)
          },
          onError: (streamError) => {
            if (stopRequestRef.current?.sessionId === currentSessionId) {
              finalizeStop(currentSessionId)
              return
            }
            finalizeStoppedStreamingMessage(currentSessionId)
            setSessionError(currentSessionId, streamError.message)
            abortControllerRef.current = null
            clearStopRequest(currentSessionId)
          },
        })
      } catch {
        // startChatStream re-throws after calling onError; absorb here.
        abortControllerRef.current = null
      }
    },
    [
      authToken,
      apiBaseUrl,
      clearSessionError,
      startStreamingMessage,
      replaceSessionId,
      updateStreamingMessage,
      completeStreamingMessage,
      finalizeStoppedStreamingMessage,
      setSessionError,
    ],
  )

  // -- Send ------------------------------------------------------------------

  const send = useCallback(
    async (contentOverride?: string) => {
      const content = (contentOverride ?? value).trim()
      const hasText = Boolean(content)
      const hasAttachments = attachments.length > 0

      if (
        !canSendChatMessage({
          value: content,
          attachmentCount: attachments.length,
          isModelsLoading,
          isModelsError,
          hasModels,
        })
      ) {
        return
      }

      if (
        hasText &&
        (!authToken || !(selectedModel || activeSession?.model || availableModels[0]?.id))
      ) {
        return
      }

      const resolvedModel =
        selectedModel || activeSession?.model || availableModels[0]?.id || 'local-image'

      const { localSessionId, sessionId, session } = resolveSendSession({
        activeSessionId,
        selectedModel: resolvedModel,
        selectedMode,
        nowIso,
        createSessionId: createDraftChatSessionId,
      })

      if (session) createSession(session)

      const messageAttachments = createMessageAttachments()
      const userMessage = createUserMessage({
        sessionId: localSessionId,
        content,
        attachments: messageAttachments,
        localOnly: hasAttachments,
        createdAt: nowIso(),
        createMessageId: () => `user-${Date.now()}`,
      })

      appendMessage(localSessionId, userMessage)
      clearAttachments()
      setAttachmentNotice(null)
      setValue('')

      if (!hasText) return

      await runStream({
        localSessionId,
        sessionId,
        content,
        model: resolvedModel,
        mode: selectedMode,
      })
    },
    [
      value,
      attachments,
      isModelsLoading,
      isModelsError,
      hasModels,
      authToken,
      selectedModel,
      activeSession,
      availableModels,
      activeSessionId,
      selectedMode,
      createSession,
      createMessageAttachments,
      appendMessage,
      clearAttachments,
      runStream,
    ],
  )

  return {
    state: {
      value,
      attachments,
      attachmentNotice,
      isStreaming,
      isStopping,
      selectedModel,
      selectedMode,
      availableModels,
      isModelsLoading,
      isModelsError,
      hasModels,
    },
    actions: {
      setValue,
      send,
      pickImages: (files: FileList | File[]) => {
        const result = appendFiles(files)
        setAttachmentNotice(result.limitExceeded ? 'limit_reached' : null)
      },
      pasteImages: (files: File[]) => {
        const result = appendFiles(files)
        setAttachmentNotice(result.limitExceeded ? 'limit_reached' : null)
      },
      removeAttachment: (attachmentId: string) => {
        removeAttachment(attachmentId)
        setAttachmentNotice(null)
      },
      setSelectedModel,
      setSelectedMode: (mode: ChatAgentMode) => {
        setSelectedModeLocal(mode)
        setPreferredMode(mode)
        if (activeSessionId) setSessionMode(activeSessionId, mode)
        if (
          lastRequestRef.current &&
          activeSessionId &&
          (lastRequestRef.current.localSessionId === activeSessionId ||
            lastRequestRef.current.sessionId === activeSessionId)
        ) {
          lastRequestRef.current = { ...lastRequestRef.current, mode }
        }
      },
      reloadModels: () => void fetchModels(),
      stop: async () => {
        if (!streamingSessionId) return
        if (isStopping) return

        if (isDraftChatSessionId(streamingSessionId)) {
          finalizeStop(streamingSessionId)
          return
        }

        requestStopStreaming(streamingSessionId)
        stopRequestRef.current = {
          sessionId: streamingSessionId,
          timeoutId: window.setTimeout(() => {
            finalizeStop(streamingSessionId)
          }, STOP_WAIT_TIMEOUT_MS),
          finalized: false,
        }

        try {
          const result = await terminateChat(axiosInstance, streamingSessionId)
          if (!result.terminated) {
            console.error('Failed to terminate chat session: server returned not terminated')
          }
          finalizeStop(streamingSessionId)
        } catch (err) {
          console.error('Failed to terminate chat session', err)
          finalizeStop(streamingSessionId)
        }
      },
      retry: () => {
        if (!lastRequestRef.current) return
        void runStream(lastRequestRef.current)
      },
    },
  }
}
