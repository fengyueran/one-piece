# @xinghunm/ai-chat Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the AI chat feature from unitary-studio into a standalone `@xinghunm/ai-chat` npm package in the one-piece monorepo.

**Architecture:** New package at `one-piece/packages/ai-chat/`. Redux Toolkit replaced with Zustand (per-provider store isolation via React Context). SSE streaming logic migrated as-is. UI components migrated from unitary-studio `packages/business/src/` with Redux hooks replaced by `useChatStore()`.

**Tech Stack:** React 18, TypeScript, Zustand, Emotion, tsup, Jest + @testing-library/react, axios, native fetch (SSE)

**Source files location (read-only reference):** `/Users/xinghunm/hy-work/unitary-studio/packages/business/src/`

**Working directory for all new files:** `/Users/xinghunm/my-house/one-piece/packages/ai-chat/`

---

## File Map

```
packages/ai-chat/
├── src/
│   ├── types/
│   │   └── index.ts                  # All TS types (copied from entities/chat/model/types.ts)
│   ├── api/
│   │   ├── chat-stream.ts            # SSE streaming (migrated, apiBaseUrl passed as param)
│   │   ├── index.ts                  # axios instance factory + getChatModels + terminateChat
│   │   └── session-id.ts             # createDraftChatSessionId + isDraftChatSessionId utils
│   ├── store/
│   │   └── chat-store.ts             # Zustand store factory (createChatStore)
│   ├── context/
│   │   ├── chat-context.ts           # React Context holding store + config
│   │   └── use-chat-context.ts       # useChatContext() hook
│   ├── components/
│   │   ├── AiChatProvider/
│   │   │   └── index.tsx             # Creates store, provides context, creates axios instance
│   │   ├── AiChat/
│   │   │   └── index.tsx             # Top-level: AiChatProvider + layout
│   │   ├── ChatThread/
│   │   │   ├── index.tsx             # Thread scroll + layout
│   │   │   └── components/
│   │   │       ├── chat-message-item.tsx
│   │   │       ├── chat-thread-empty-state.tsx
│   │   │       ├── chat-thread-history-list.tsx
│   │   │       ├── image-viewer.tsx              # NEW: replaces FullscreenImageViewer
│   │   │       ├── pde-ai-notice-card.tsx
│   │   │       ├── pde-ai-parameter-summary-card.tsx
│   │   │       ├── pde-ai-execution-confirmation-card.tsx
│   │   │       ├── pde-ai-questionnaire-card.tsx
│   │   │       └── pde-ai-result-summary-card.tsx
│   │   ├── ChatComposer/
│   │   │   ├── index.tsx             # Reads store, drives send/stop
│   │   │   ├── use-composer-attachments.ts  # Attachment state (copied as-is)
│   │   │   ├── chat-composer.ts      # Helper lib (createUserMessage, etc.)
│   │   │   └── components/
│   │   │       ├── chat-model-control.tsx
│   │   │       ├── chat-mode-control.tsx
│   │   │       ├── chat-send-actions.tsx
│   │   │       └── chat-composer-attachment-list.tsx
│   │   └── ChatConversationList/
│   │       ├── index.tsx
│   │       └── components/
│   │           └── chat-session-item.tsx
│   └── index.ts                      # Public exports
├── src/__tests__/
│   ├── store/chat-store.test.ts
│   ├── api/chat-stream.test.ts
│   └── components/
│       ├── AiChatProvider.test.tsx
│       └── AiChat.smoke.test.tsx
├── package.json
├── tsup.config.ts
├── tsconfig.json
└── jest.config.js
```

---

## Task 1: Package Scaffold

**Files:**

- Create: `packages/ai-chat/package.json`
- Create: `packages/ai-chat/tsup.config.ts`
- Create: `packages/ai-chat/tsconfig.json`
- Create: `packages/ai-chat/jest.config.js`
- Create: `packages/ai-chat/src/index.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@xinghunm/ai-chat",
  "version": "0.1.0",
  "description": "AI chat React component library",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "jest",
    "lint": "eslint src --ext .ts,.tsx",
    "clean": "rm -rf dist"
  },
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18",
    "@xinghunm/compass-ui": ">=0.8.0",
    "@emotion/react": ">=11",
    "@emotion/styled": ">=11",
    "axios": ">=1.0",
    "zustand": ">=4",
    "react-markdown": ">=9",
    "remark-gfm": ">=4",
    "remark-math": ">=6",
    "rehype-katex": ">=7"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/jest": "^29.5.5",
    "@types/react": "^18.2.22",
    "@types/react-dom": "^18.2.7",
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@xinghunm/compass-ui": "workspace:^",
    "axios": "^1.9.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-markdown": "^9.0.0",
    "remark-gfm": "^4.0.0",
    "remark-math": "^6.0.0",
    "rehype-katex": "^7.0.0",
    "ts-jest": "^29.1.0",
    "tsup": "^8.0.0",
    "typescript": "^5.2.2",
    "zustand": "^5.0.0"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

- [ ] **Step 2: Create tsup.config.ts**

```ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@xinghunm/compass-ui',
    '@emotion/react',
    '@emotion/styled',
    'axios',
    'zustand',
    'react-markdown',
    'remark-gfm',
    'remark-math',
    'rehype-katex',
  ],
  esbuildOptions(options) {
    options.jsxImportSource = '@emotion/react'
  },
})
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    "jsxImportSource": "@emotion/react",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "declaration": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 4: Create jest.config.js**

```js
/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
}
```

- [ ] **Step 5: Create src/index.ts (empty stub)**

```ts
// Public exports - filled in Task 15
export {}
```

- [ ] **Step 6: Install dependencies**

```bash
cd /Users/xinghunm/my-house/one-piece
pnpm install
```

- [ ] **Step 7: Verify build succeeds**

```bash
pnpm build --filter @xinghunm/ai-chat
```

Expected: `dist/` created with `index.js`, `index.mjs`, `index.d.ts`

- [ ] **Step 8: Commit**

```bash
cd /Users/xinghunm/my-house/one-piece
git add packages/ai-chat
git commit -m "feat(ai-chat): scaffold package with tsup + jest"
```

---

## Task 2: Types Layer

**Files:**

- Create: `packages/ai-chat/src/types/index.ts`

Source reference: `/Users/xinghunm/hy-work/unitary-studio/packages/business/src/entities/chat/model/types.ts`

- [ ] **Step 1: Copy types.ts → src/types/index.ts**

Copy the entire file verbatim. It has no external imports, zero changes needed.

Key types exported:

- `ChatRole`, `ChatMessageStatus`, `ChatAgentMode`, `DEFAULT_CHAT_AGENT_MODE`
- `ChatSession`, `ChatMessage`, `ChatImageAttachment`
- `ChatMessageBlock` (union: markdown, notice, parameter_summary, confirmation_card, result_summary, questionnaire)
- `PlanQuestionnaire`, `PlanQuestion`, `PlanQuestionnaireSubmission`
- `ExecutionProposal`, `ExecutionConfirmationSubmission`
- `ResultSummary`, `ChatParameterSummaryItem`
- `ChatStreamPacket`, `ChatStreamDelta`, etc.

- [ ] **Step 2: Verify no TypeScript errors**

```bash
cd /Users/xinghunm/my-house/one-piece/packages/ai-chat
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add packages/ai-chat/src/types
git commit -m "feat(ai-chat): add types layer (migrated from unitary-studio)"
```

---

## Task 3: API Layer

**Files:**

- Create: `packages/ai-chat/src/api/chat-stream.ts`
- Create: `packages/ai-chat/src/api/index.ts`
- Create: `packages/ai-chat/src/__tests__/api/chat-stream.test.ts`

Source reference: `/Users/xinghunm/hy-work/unitary-studio/packages/business/src/entities/chat/lib/chat-stream.ts`

- [ ] **Step 1: Write failing test for chat-stream**

Create `src/__tests__/api/chat-stream.test.ts`:

```ts
import { startChatStream } from '../../api/chat-stream'

const mockFetch = jest.fn()
global.fetch = mockFetch

const makeStreamResponse = (lines: string[]) => {
  const text = lines.join('\n\n') + '\n\n'
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(text))
      controller.close()
    },
  })
  return {
    ok: true,
    status: 200,
    headers: new Headers({ 'content-type': 'text/event-stream', 'X-Session-ID': 'sess-123' }),
    body: stream,
  }
}

describe('startChatStream', () => {
  beforeEach(() => mockFetch.mockReset())

  it('calls onSessionId with the session ID from response headers', async () => {
    const deltaPacket = JSON.stringify({
      type: 'delta',
      data: {
        id: '1',
        object: 'chat',
        created: 0,
        model: 'm',
        payload: [{ index: 0, delta: { content: 'hi' }, finish_reason: null }],
      },
    })
    const donePacket = JSON.stringify({ type: 'stream_end', data: '[DONE]' })

    mockFetch.mockResolvedValueOnce(
      makeStreamResponse([`data: ${deltaPacket}`, `data: ${donePacket}`]),
    )

    const onSessionId = jest.fn()
    const onPacket = jest.fn()
    const onDone = jest.fn()

    await startChatStream({
      apiBaseUrl: 'http://api.test',
      authToken: 'Bearer tok',
      model: 'gpt-4',
      mode: 'ask',
      content: 'hello',
      onSessionId,
      onPacket,
      onDone,
    })

    expect(onSessionId).toHaveBeenCalledWith('sess-123')
    expect(onPacket).toHaveBeenCalledTimes(1)
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it('calls onError on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500, headers: new Headers(), body: null })
    const onError = jest.fn()
    await startChatStream({
      apiBaseUrl: 'http://api.test',
      authToken: 'Bearer tok',
      model: 'gpt-4',
      mode: 'ask',
      content: 'hello',
      onPacket: jest.fn(),
      onError,
    }).catch(() => {})
    expect(onError).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
cd /Users/xinghunm/my-house/one-piece/packages/ai-chat
pnpm test -- --testPathPattern=chat-stream
```

Expected: FAIL with "Cannot find module '../../api/chat-stream'"

- [ ] **Step 3: Create src/api/chat-stream.ts**

Copy from `/Users/xinghunm/hy-work/unitary-studio/packages/business/src/entities/chat/lib/chat-stream.ts`.

**Two changes required:**

1. Remove `import { CHAT_COMPLETIONS_PATH } from './endpoints'` and `import { AI_API_BASE_URL } from '@/shared/config'`
2. Add `apiBaseUrl` and `authToken` to `StartChatStreamOptions`, replace hardcoded URL:

```ts
import type { ChatAgentMode, ChatStreamPacket } from '../types'

export interface StartChatStreamOptions {
  apiBaseUrl: string // NEW: replaces AI_API_BASE_URL
  authToken: string // NEW: replaces token param, includes "Bearer " prefix
  sessionId?: string
  model: string
  mode: ChatAgentMode
  content: string
  signal?: AbortSignal
  onPacket: (packet: ChatStreamPacket) => void
  onSessionId?: (sessionId: string) => void
  onDone?: () => void
  onError?: (error: Error) => void
}

const CHAT_COMPLETIONS_PATH = '/v1/chat/completions'
const SSE_CONTENT_TYPE = 'text/event-stream'

// ... rest of parseSseEvent and startChatStream identical to source
// Replace:
//   `Authorization: \`Bearer \${token}\`` → `Authorization: authToken`
//   `\`\${AI_API_BASE_URL}\${CHAT_COMPLETIONS_PATH}\`` → `\`\${apiBaseUrl}\${CHAT_COMPLETIONS_PATH}\``
```

- [ ] **Step 4: Run test — expect PASS**

```bash
pnpm test -- --testPathPattern=chat-stream
```

Expected: 2 passing

- [ ] **Step 5: Create src/api/index.ts**

This replaces the RTK Query `api.ts`. Pure axios, no Redux.

```ts
import type { AxiosInstance } from 'axios'
import type { ChatModelsResponse, ChatTerminateResponse } from '../types'

const CHAT_MODELS_PATH = '/v1/models'
const CHAT_TERMINATE_PATH = '/v1/chat/terminate'

export const getChatModels = async (client: AxiosInstance): Promise<ChatModelsResponse> => {
  const response = await client.get<ChatModelsResponse>(CHAT_MODELS_PATH)
  return response.data
}

export const terminateChat = async (
  client: AxiosInstance,
  sessionId?: string,
): Promise<ChatTerminateResponse> => {
  const response = await client.post<ChatTerminateResponse>(
    CHAT_TERMINATE_PATH,
    sessionId ? { session_id: sessionId } : {},
    { headers: sessionId ? { 'X-Session-ID': sessionId } : undefined },
  )
  return response.data
}
```

- [ ] **Step 6: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 7: Commit**

```bash
git add packages/ai-chat/src/api packages/ai-chat/src/__tests__/api
git commit -m "feat(ai-chat): add API layer with SSE streaming and axios client"
```

---

## Task 4: Zustand Store

**Files:**

- Create: `packages/ai-chat/src/store/chat-store.ts`
- Create: `packages/ai-chat/src/__tests__/store/chat-store.test.ts`

Source reference: `/Users/xinghunm/hy-work/unitary-studio/packages/business/src/entities/chat/model/slice.ts`

- [ ] **Step 1: Write failing tests**

Create `src/__tests__/store/chat-store.test.ts`:

```ts
import { createChatStore } from '../../store/chat-store'

const makeStore = () => createChatStore()

describe('createChatStore', () => {
  it('starts with empty state', () => {
    const store = makeStore()
    const state = store.getState()
    expect(state.sessions).toEqual([])
    expect(state.activeSessionId).toBeNull()
    expect(state.preferredMode).toBe('agent')
  })

  it('createSession adds session and sets it active', () => {
    const store = makeStore()
    const session = { sessionId: 's1', title: 'Chat', createdAt: '', updatedAt: '', model: 'gpt-4' }
    store.getState().createSession(session)
    const state = store.getState()
    expect(state.sessions).toHaveLength(1)
    expect(state.activeSessionId).toBe('s1')
  })

  it('replaceSessionId migrates all session state', () => {
    const store = makeStore()
    const session = {
      sessionId: 'draft-1',
      title: 'Chat',
      createdAt: '',
      updatedAt: '',
      model: 'gpt-4',
    }
    store.getState().createSession(session)
    store.getState().replaceSessionId('draft-1', 'real-1')
    const state = store.getState()
    expect(state.activeSessionId).toBe('real-1')
    expect(state.sessions[0].sessionId).toBe('real-1')
  })

  it('appendMessage adds message to session', () => {
    const store = makeStore()
    const session = { sessionId: 's1', title: 'Chat', createdAt: '', updatedAt: '', model: 'gpt-4' }
    store.getState().createSession(session)
    store.getState().appendMessage('s1', {
      id: 'm1',
      sessionId: 's1',
      role: 'user',
      content: 'hello',
      status: 'done',
      createdAt: new Date().toISOString(),
    })
    expect(store.getState().messagesBySession['s1']).toHaveLength(1)
  })

  it('streaming lifecycle: start → update → complete', () => {
    const store = makeStore()
    const session = { sessionId: 's1', title: 'Chat', createdAt: '', updatedAt: '', model: 'gpt-4' }
    store.getState().createSession(session)

    const msg = {
      id: 'a1',
      sessionId: 's1',
      role: 'assistant' as const,
      content: '',
      status: 'streaming' as const,
      createdAt: '',
    }
    store.getState().startStreamingMessage('s1', msg)
    expect(store.getState().isStreamingBySession['s1']).toBe(true)

    store.getState().updateStreamingMessage('s1', 'hello world')
    expect(store.getState().streamingMessageBySession['s1']?.content).toBe('hello world')

    store.getState().completeStreamingMessage('s1')
    expect(store.getState().isStreamingBySession['s1']).toBe(false)
    expect(store.getState().messagesBySession['s1']).toHaveLength(1)
    expect(store.getState().messagesBySession['s1'][0].status).toBe('done')
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
pnpm test -- --testPathPattern=chat-store
```

Expected: FAIL with "Cannot find module '../../store/chat-store'"

- [ ] **Step 3: Create src/store/chat-store.ts**

Translate the Redux slice logic to Zustand. Key pattern: `createChatStore()` returns a Zustand store (not singleton — each call creates a new isolated instance).

```ts
import { createStore } from 'zustand/vanilla'
import type {
  ChatAgentMode,
  ChatImageAttachment,
  ChatMessage,
  ChatSession,
  PlanQuestionnaireAnswerValue,
} from '../types'
import { DEFAULT_CHAT_AGENT_MODE } from '../types'

export interface ChatState {
  activeSessionId: string | null
  preferredMode: ChatAgentMode
  sessions: ChatSession[]
  messagesBySession: Record<string, ChatMessage[]>
  streamingMessageBySession: Record<string, ChatMessage | undefined>
  isStreamingBySession: Record<string, boolean>
  errorBySession: Record<string, string | null>
}

export interface ChatActions {
  createSession: (session: ChatSession) => void
  setActiveSession: (sessionId: string | null) => void
  replaceSessionId: (previousSessionId: string, nextSessionId: string) => void
  setPreferredMode: (mode: ChatAgentMode) => void
  setSessionMode: (sessionId: string, mode: ChatAgentMode) => void
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

const DEFAULT_SESSION_TITLE = 'New Chat'

const ensureSession = (state: ChatState, sessionId: string) => {
  state.messagesBySession[sessionId] ??= []
  state.errorBySession[sessionId] ??= null
  state.isStreamingBySession[sessionId] ??= false
}

export const createChatStore = () =>
  createStore<ChatStore>((set) => ({
    // Initial state
    activeSessionId: null,
    preferredMode: DEFAULT_CHAT_AGENT_MODE,
    sessions: [],
    messagesBySession: {},
    streamingMessageBySession: {},
    isStreamingBySession: {},
    errorBySession: {},

    // Actions — mirror the Redux slice reducers exactly
    createSession: (session) =>
      set((state) => {
        const exists = state.sessions.some((s) => s.sessionId === session.sessionId)
        const sessions = exists
          ? state.sessions
          : [{ ...session, mode: session.mode ?? DEFAULT_CHAT_AGENT_MODE }, ...state.sessions]
        const messagesBySession = {
          ...state.messagesBySession,
          [session.sessionId]: state.messagesBySession[session.sessionId] ?? [],
        }
        const errorBySession = {
          ...state.errorBySession,
          [session.sessionId]: state.errorBySession[session.sessionId] ?? null,
        }
        const isStreamingBySession = {
          ...state.isStreamingBySession,
          [session.sessionId]: state.isStreamingBySession[session.sessionId] ?? false,
        }
        return {
          sessions,
          activeSessionId: session.sessionId,
          messagesBySession,
          errorBySession,
          isStreamingBySession,
        }
      }),

    setActiveSession: (sessionId) => set({ activeSessionId: sessionId }),

    replaceSessionId: (previousSessionId, nextSessionId) =>
      set((state) => {
        if (!previousSessionId || !nextSessionId || previousSessionId === nextSessionId)
          return state
        const sessions = state.sessions.map((s) =>
          s.sessionId === previousSessionId ? { ...s, sessionId: nextSessionId } : s,
        )
        const messagesBySession = { ...state.messagesBySession }
        if (messagesBySession[previousSessionId]) {
          messagesBySession[nextSessionId] = messagesBySession[previousSessionId].map((m) => ({
            ...m,
            sessionId: nextSessionId,
          }))
          delete messagesBySession[previousSessionId]
        }
        const streamingMessageBySession = { ...state.streamingMessageBySession }
        if (streamingMessageBySession[previousSessionId]) {
          streamingMessageBySession[nextSessionId] = {
            ...streamingMessageBySession[previousSessionId]!,
            sessionId: nextSessionId,
          }
        }
        delete streamingMessageBySession[previousSessionId]
        const isStreamingBySession = {
          ...state.isStreamingBySession,
          [nextSessionId]: state.isStreamingBySession[previousSessionId] ?? false,
        }
        delete isStreamingBySession[previousSessionId]
        const errorBySession = {
          ...state.errorBySession,
          [nextSessionId]: state.errorBySession[previousSessionId] ?? null,
        }
        delete errorBySession[previousSessionId]
        const activeSessionId =
          state.activeSessionId === previousSessionId ? nextSessionId : state.activeSessionId
        return {
          sessions,
          messagesBySession,
          streamingMessageBySession,
          isStreamingBySession,
          errorBySession,
          activeSessionId,
        }
      }),

    setPreferredMode: (mode) => set({ preferredMode: mode }),

    setSessionMode: (sessionId, mode) =>
      set((state) => ({
        sessions: state.sessions.map((s) => (s.sessionId === sessionId ? { ...s, mode } : s)),
      })),

    appendMessage: (sessionId, message) =>
      set((state) => {
        const messages = [...(state.messagesBySession[sessionId] ?? []), message]
        const sessions = state.sessions.map((s) => {
          if (s.sessionId !== sessionId) return s
          const title =
            message.role === 'user' && s.title === DEFAULT_SESSION_TITLE
              ? message.content.trim().slice(0, 30) ||
                (message.attachments?.length ? 'Image message' : DEFAULT_SESSION_TITLE)
              : s.title
          return { ...s, updatedAt: message.createdAt, title }
        })
        return {
          sessions,
          messagesBySession: { ...state.messagesBySession, [sessionId]: messages },
        }
      }),

    startStreamingMessage: (sessionId, message) =>
      set((state) => ({
        streamingMessageBySession: { ...state.streamingMessageBySession, [sessionId]: message },
        isStreamingBySession: { ...state.isStreamingBySession, [sessionId]: true },
        errorBySession: { ...state.errorBySession, [sessionId]: null },
      })),

    updateStreamingMessage: (sessionId, content) =>
      set((state) => {
        const msg = state.streamingMessageBySession[sessionId]
        if (!msg) return state
        return {
          streamingMessageBySession: {
            ...state.streamingMessageBySession,
            [sessionId]: { ...msg, content },
          },
        }
      }),

    completeStreamingMessage: (sessionId) =>
      set((state) => {
        const msg = state.streamingMessageBySession[sessionId]
        const hasPayload = Boolean(msg?.content || msg?.blocks?.length)
        const messages =
          msg && hasPayload
            ? [...(state.messagesBySession[sessionId] ?? []), { ...msg, status: 'done' as const }]
            : (state.messagesBySession[sessionId] ?? [])
        return {
          messagesBySession: { ...state.messagesBySession, [sessionId]: messages },
          streamingMessageBySession: { ...state.streamingMessageBySession, [sessionId]: undefined },
          isStreamingBySession: { ...state.isStreamingBySession, [sessionId]: false },
        }
      }),

    finalizeStoppedStreamingMessage: (sessionId) =>
      set((state) => {
        const msg = state.streamingMessageBySession[sessionId]
        const hasPayload = Boolean(msg?.content || msg?.blocks?.length)
        const messages =
          msg && hasPayload
            ? [
                ...(state.messagesBySession[sessionId] ?? []),
                { ...msg, status: 'stopped' as const },
              ]
            : (state.messagesBySession[sessionId] ?? [])
        return {
          messagesBySession: { ...state.messagesBySession, [sessionId]: messages },
          streamingMessageBySession: { ...state.streamingMessageBySession, [sessionId]: undefined },
          isStreamingBySession: { ...state.isStreamingBySession, [sessionId]: false },
          errorBySession: { ...state.errorBySession, [sessionId]: null },
        }
      }),

    setSessionError: (sessionId, error) =>
      set((state) => ({ errorBySession: { ...state.errorBySession, [sessionId]: error } })),

    clearSessionError: (sessionId) =>
      set((state) => ({ errorBySession: { ...state.errorBySession, [sessionId]: null } })),

    updateQuestionnaireAnswers: (sessionId, messageId, questionnaireId, answers) =>
      set((state) => {
        const updateBlocks = (msg: ChatMessage): ChatMessage => ({
          ...msg,
          blocks: msg.blocks?.map((block) =>
            block.type === 'questionnaire' &&
            block.questionnaire.questionnaireId === questionnaireId
              ? { ...block, questionnaire: { ...block.questionnaire, answers } }
              : block,
          ),
        })
        const messages = (state.messagesBySession[sessionId] ?? []).map((m) =>
          m.id === messageId ? updateBlocks(m) : m,
        )
        const streaming = state.streamingMessageBySession[sessionId]
        const updatedStreaming = streaming?.id === messageId ? updateBlocks(streaming) : streaming
        return {
          messagesBySession: { ...state.messagesBySession, [sessionId]: messages },
          streamingMessageBySession: {
            ...state.streamingMessageBySession,
            [sessionId]: updatedStreaming,
          },
        }
      }),
  }))

export type ChatStoreInstance = ReturnType<typeof createChatStore>
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
pnpm test -- --testPathPattern=chat-store
```

Expected: 5 passing

- [ ] **Step 5: Commit**

```bash
git add packages/ai-chat/src/store packages/ai-chat/src/__tests__/store
git commit -m "feat(ai-chat): add Zustand store (migrated from Redux slice)"
```

---

## Task 5: Chat Context

**Files:**

- Create: `packages/ai-chat/src/context/chat-context.ts`
- Create: `packages/ai-chat/src/context/use-chat-context.ts`
- Create: `packages/ai-chat/src/__tests__/context/use-chat-context.test.tsx`

- [ ] **Step 1: Write failing test for useChatContext**

Create `src/__tests__/context/use-chat-context.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { createContext } from 'react'
import { useChatContext, useChatStore } from '../../context/use-chat-context'
import { ChatContext } from '../../context/chat-context'
import { createChatStore } from '../../store/chat-store'
import axios from 'axios'
import { DEFAULT_AI_CHAT_LABELS } from '../../types'

const makeContextValue = () => ({
  store: createChatStore(),
  axios: axios.create(),
  apiBaseUrl: 'http://test',
  authToken: 'Bearer tok',
  labels: DEFAULT_AI_CHAT_LABELS,
})

describe('useChatContext', () => {
  it('throws when used outside ChatContext.Provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const Bad = () => {
      useChatContext()
      return null
    }
    expect(() => render(<Bad />)).toThrow('useChatContext must be used inside AiChatProvider')
    spy.mockRestore()
  })

  it('returns context value when inside provider', () => {
    const ctx = makeContextValue()
    const Good = () => {
      const { apiBaseUrl } = useChatContext()
      return <div>{apiBaseUrl}</div>
    }
    render(
      <ChatContext.Provider value={ctx}>
        <Good />
      </ChatContext.Provider>,
    )
    expect(screen.getByText('http://test')).toBeInTheDocument()
  })
})

describe('useChatStore', () => {
  it('selects state from the store', () => {
    const ctx = makeContextValue()
    const Consumer = () => {
      const sessions = useChatStore((s) => s.sessions)
      return <div data-testid="count">{sessions.length}</div>
    }
    render(
      <ChatContext.Provider value={ctx}>
        <Consumer />
      </ChatContext.Provider>,
    )
    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
pnpm test -- --testPathPattern=use-chat-context
```

Expected: FAIL with module not found

- [ ] **Step 3: Create src/context/chat-context.ts**

```ts
import { createContext } from 'react'
import type { AxiosInstance } from 'axios'
import type { ChatStoreInstance } from '../store/chat-store'
import type { AiChatLabels } from '../types'

export interface ChatContextValue {
  store: ChatStoreInstance
  axios: AxiosInstance
  apiBaseUrl: string
  authToken: string
  labels: Required<AiChatLabels>
}

export const ChatContext = createContext<ChatContextValue | null>(null)
```

- [ ] **Step 4: Create src/context/use-chat-context.ts**

```ts
import { useContext } from 'react'
import { useStore } from 'zustand'
import { ChatContext } from './chat-context'
import type { ChatStore } from '../store/chat-store'

export const useChatContext = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChatContext must be used inside AiChatProvider')
  return ctx
}

export const useChatStore = <T>(selector: (state: ChatStore) => T): T => {
  const { store } = useChatContext()
  return useStore(store, selector)
}
```

- [ ] **Step 5: Run tests — expect PASS**

```bash
pnpm test -- --testPathPattern=use-chat-context
```

Expected: 3 passing

- [ ] **Step 6: Add AiChatLabels type to src/types/index.ts**

Append to the types file:

```ts
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
}
```

- [ ] **Step 7: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 8: Commit**

```bash
git add packages/ai-chat/src/context packages/ai-chat/src/types packages/ai-chat/src/__tests__/context
git commit -m "feat(ai-chat): add chat context and useChatStore hook"
```

---

## Task 6: AiChatProvider

**Files:**

- Create: `packages/ai-chat/src/components/AiChatProvider/index.tsx`
- Create: `packages/ai-chat/src/__tests__/components/AiChatProvider.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { AiChatProvider } from '../../components/AiChatProvider'
import { useChatStore } from '../../context/use-chat-context'

const TestConsumer = () => {
  const sessions = useChatStore((s) => s.sessions)
  return <div data-testid="count">{sessions.length}</div>
}

describe('AiChatProvider', () => {
  it('renders children and provides store context', () => {
    render(
      <AiChatProvider apiBaseUrl="http://api.test" authToken="Bearer tok">
        <TestConsumer />
      </AiChatProvider>,
    )
    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })

  it('throws when useChatStore used outside provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<TestConsumer />)).toThrow(
      'useChatContext must be used inside AiChatProvider',
    )
    spy.mockRestore()
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
pnpm test -- --testPathPattern=AiChatProvider
```

Expected: FAIL with module not found

- [ ] **Step 3: Create src/components/AiChatProvider/index.tsx**

```tsx
import { useRef, useMemo, type ReactNode } from 'react'
import axios from 'axios'
import { ChatContext, type ChatContextValue } from '../../context/chat-context'
import { createChatStore } from '../../store/chat-store'
import { DEFAULT_AI_CHAT_LABELS, type AiChatLabels } from '../../types'

export interface AiChatProviderProps {
  apiBaseUrl: string
  authToken: string
  defaultMode?: import('../../types').ChatAgentMode
  labels?: AiChatLabels
  children: ReactNode
}

export const AiChatProvider = ({
  apiBaseUrl,
  authToken,
  labels,
  children,
}: AiChatProviderProps) => {
  const storeRef = useRef(createChatStore())

  const axiosInstance = useMemo(
    () => axios.create({ baseURL: apiBaseUrl, headers: { Authorization: authToken } }),
    [apiBaseUrl, authToken],
  )

  const contextValue: ChatContextValue = useMemo(
    () => ({
      store: storeRef.current,
      axios: axiosInstance,
      apiBaseUrl,
      authToken,
      labels: { ...DEFAULT_AI_CHAT_LABELS, ...labels },
    }),
    [axiosInstance, apiBaseUrl, authToken, labels],
  )

  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
pnpm test -- --testPathPattern=AiChatProvider
```

Expected: 2 passing

- [ ] **Step 5: Commit**

```bash
git add packages/ai-chat/src/components/AiChatProvider packages/ai-chat/src/__tests__/components/AiChatProvider.test.tsx
git commit -m "feat(ai-chat): add AiChatProvider with Zustand store and axios context"
```

---

## Task 7: ImageViewer (new component)

**Files:**

- Create: `packages/ai-chat/src/components/ChatThread/components/image-viewer.tsx`

Replaces the unitary-studio `FullscreenImageViewer` dependency.

- [ ] **Step 1: Create image-viewer.tsx**

```tsx
import styled from '@emotion/styled'
import { useEffect, type MouseEvent } from 'react'

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: zoom-out;
`

const Img = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 4px;
`

interface ImageViewerProps {
  src: string
  alt?: string
  onClose: () => void
}

export const ImageViewer = ({ src, alt, onClose }: ImageViewerProps) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const stopPropagation = (e: MouseEvent) => e.stopPropagation()

  return (
    <Overlay onClick={onClose}>
      <Img src={src} alt={alt ?? ''} onClick={stopPropagation} />
    </Overlay>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add packages/ai-chat/src/components/ChatThread/components/image-viewer.tsx
git commit -m "feat(ai-chat): add lightweight ImageViewer component"
```

---

## Task 8: Structured Message Cards

**Files to create** (migrate from `features/chat-thread/ui/components/` in unitary-studio):

- `src/components/ChatThread/components/pde-ai-notice-card.tsx`
- `src/components/ChatThread/components/pde-ai-parameter-summary-card.tsx`
- `src/components/ChatThread/components/pde-ai-execution-confirmation-card.tsx`
- `src/components/ChatThread/components/pde-ai-questionnaire-card.tsx`
- `src/components/ChatThread/components/pde-ai-result-summary-card.tsx`
- `src/components/ChatThread/components/chat-thread-empty-state.tsx`

Source reference: `/Users/xinghunm/hy-work/unitary-studio/packages/business/src/features/chat-thread/ui/components/`

- [ ] **Step 1: Read all source files, then migrate each one**

For each file:

1. Read the source file
2. Copy to the new location
3. Update imports:
   - `from '@/entities/chat'` or `from '../../../entities/chat'` → `from '../../../types'`
   - `from '@xinghunm/compass-ui'` → unchanged (peerDependency)
   - `from '@emotion/styled'` → unchanged
   - Remove any `useTranslation()` calls, replace with `useChatContext().labels` for text
4. For `pde-ai-questionnaire-card.tsx`: this is the most complex — read it carefully

- [ ] **Step 2: Verify no TypeScript errors after all cards migrated**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add packages/ai-chat/src/components/ChatThread/components
git commit -m "feat(ai-chat): migrate structured message cards from unitary-studio"
```

---

## Task 9: ChatMessageItem + ChatThread List

**Files:**

- Create: `packages/ai-chat/src/components/ChatThread/components/chat-message-item.tsx`
- Create: `packages/ai-chat/src/components/ChatThread/components/chat-thread-history-list.tsx`

Source reference: `/Users/xinghunm/hy-work/unitary-studio/packages/business/src/features/chat-thread/ui/`

- [ ] **Step 1: Read and migrate chat-message-item.tsx**

Key changes:

- Replace `import { FullscreenImageViewer } from '@/features/job-result-viewer/...'` → `import { ImageViewer } from './image-viewer'`
- Remove `useTranslation()`, any i18n strings replaced with hardcoded English or via `useChatContext().labels`
- Keep react-markdown, rehype-katex, remark-gfm imports unchanged (peerDependencies)

- [ ] **Step 2: Read and migrate chat-thread-history-list.tsx**

No Redux hooks to replace in this component, primarily structural.

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add packages/ai-chat/src/components/ChatThread/components/chat-message-item.tsx \
        packages/ai-chat/src/components/ChatThread/components/chat-thread-history-list.tsx
git commit -m "feat(ai-chat): migrate ChatMessageItem with ImageViewer integration"
```

---

## Task 10: ChatThread Component

**Files:**

- Create: `packages/ai-chat/src/components/ChatThread/index.tsx`

Source reference: `/Users/xinghunm/hy-work/unitary-studio/packages/business/src/features/chat-thread/ui/chat-thread.tsx`

- [ ] **Step 1: Read source and create ChatThread/index.tsx**

Key changes:

- Replace `useAppSelector(selectors.selectXxx)` → `useChatStore((s) => s.xxx)`
- Replace `useAppDispatch()` + dispatch calls → `useChatStore((s) => s.updateQuestionnaireAnswers)`
- Remove Redux imports

The thread reads:

```ts
const messages = useChatStore((s) => s.messagesBySession[s.activeSessionId ?? ''] ?? [])
const streamingMessage = useChatStore((s) => s.streamingMessageBySession[s.activeSessionId ?? ''])
const error = useChatStore((s) => s.errorBySession[s.activeSessionId ?? ''])
const updateQA = useChatStore((s) => s.updateQuestionnaireAnswers)
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add packages/ai-chat/src/components/ChatThread
git commit -m "feat(ai-chat): add ChatThread component"
```

---

## Task 11: ChatComposer Sub-components

**Files to create** (migrate from `features/chat-composer/ui/components/`):

- `src/components/ChatComposer/components/chat-model-control.tsx`
- `src/components/ChatComposer/components/chat-mode-control.tsx`
- `src/components/ChatComposer/components/chat-send-actions.tsx`
- `src/components/ChatComposer/components/chat-composer-attachment-list.tsx`

Source reference: `/Users/xinghunm/hy-work/unitary-studio/packages/business/src/features/chat-composer/ui/components/`

- [ ] **Step 1: Read and migrate each sub-component**

Key changes for all:

- Replace `useTranslation()` → receive label strings as props (the parent ChatComposer passes them from `useChatContext().labels`)
- Update type imports to `from '../../types'` or `from '../../../types'`

For `chat-mode-control.tsx`: `getChatModeLabel` function in the source uses a `TFunction`. In the new version, receive mode labels directly as props:

```ts
interface ChatModeControlProps {
  value: ChatAgentMode
  labels: { ask: string; plan: string; agent: string }
  onChange: (mode: ChatAgentMode) => void
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add packages/ai-chat/src/components/ChatComposer/components
git commit -m "feat(ai-chat): migrate ChatComposer sub-components"
```

---

## Task 12: ChatComposer Component

**Files:**

- Create: `packages/ai-chat/src/components/ChatComposer/index.tsx`

Source references:

- `/Users/xinghunm/hy-work/unitary-studio/packages/business/src/features/chat-composer/model/use-chat-composer.ts`
- `/Users/xinghunm/hy-work/unitary-studio/packages/business/src/features/chat-composer/ui/chat-composer.tsx`
- `/Users/xinghunm/hy-work/unitary-studio/packages/business/src/features/chat-composer/lib/chat-composer.ts`
- `/Users/xinghunm/hy-work/unitary-studio/packages/business/src/features/chat-composer/model/use-composer-attachments.ts`
- `/Users/xinghunm/hy-work/unitary-studio/packages/business/src/entities/chat/lib/session-id.ts`

- [ ] **Step 1: Read all source files**

- [ ] **Step 2: Copy use-composer-attachments.ts → src/components/ChatComposer/use-composer-attachments.ts**

No changes needed (no Redux or external imports).

- [ ] **Step 3: Copy session-id.ts → src/api/session-id.ts**

Copy `createDraftChatSessionId` and `isDraftChatSessionId` utils.

- [ ] **Step 4: Copy chat-composer.ts helper lib → src/components/ChatComposer/chat-composer.ts**

Update imports: `from '@/entities/chat'` → `from '../../types'`

- [ ] **Step 5: Create ChatComposer/index.tsx**

Inline the `useChatComposer` logic directly in the component (no separate hook file needed for a package). Key changes vs source:

- Replace `const dispatch = useAppDispatch()` and all `dispatch(action(...))` calls with direct `store.getState().action(...)` calls via `useChatStore`
- Replace `const { token } = useSession()` → `const { authToken } = useChatContext()`
- Replace `chatApi.useGetChatModelsQuery()` → local `useEffect` with `getChatModels(axiosInstance)`
- Replace `chatApi.useTerminateChatMutation()` → direct `terminateChat(axiosInstance, sessionId)` call
- Replace `dispatch(setSessionError(...))` → `store.getState().setSessionError(...)`

The `runStream` function receives `authToken` and `apiBaseUrl` from context instead of `token` from `useSession()`.

- [ ] **Step 6: Verify TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 7: Commit**

```bash
git add packages/ai-chat/src/components/ChatComposer packages/ai-chat/src/api/session-id.ts
git commit -m "feat(ai-chat): add ChatComposer (Redux → Zustand + context)"
```

---

## Task 13: ChatConversationList

**Files:**

- Create: `src/components/ChatConversationList/index.tsx`
- Create: `src/components/ChatConversationList/components/chat-session-item.tsx`

Source reference: `/Users/xinghunm/hy-work/unitary-studio/packages/business/src/features/chat-conversation-list/`

- [ ] **Step 1: Read source files and migrate**

Key changes:

- Replace `useAppSelector` + `useAppDispatch` → `useChatStore`
- The list reads `sessions`, `activeSessionId`, `preferredMode` from store
- Actions: `createSession`, `setActiveSession` from store

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add packages/ai-chat/src/components/ChatConversationList
git commit -m "feat(ai-chat): add ChatConversationList"
```

---

## Task 14: AiChat Top-level Component

**Files:**

- Create: `src/components/AiChat/index.tsx`

Source reference: `/Users/xinghunm/hy-work/unitary-studio/packages/business/src/widgets/chat-workbench/`

- [ ] **Step 1: Read chat-workbench source**

- [ ] **Step 2: Create AiChat/index.tsx**

`AiChat` = `AiChatProvider` + the workbench layout. All props from `AiChatProvider` forwarded.

```tsx
import { AiChatProvider, type AiChatProviderProps } from '../AiChatProvider'
import { ChatConversationList } from '../ChatConversationList'
import { ChatThread } from '../ChatThread'
import { ChatComposer } from '../ChatComposer'
import styled from '@emotion/styled'

const Layout = styled.div`
  display: flex;
  height: 100%;
  overflow: hidden;
`
const Sidebar = styled.div`
  width: 240px;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
`
const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

type AiChatProps = Omit<AiChatProviderProps, 'children'>

export const AiChat = (props: AiChatProps) => (
  <AiChatProvider {...props}>
    <Layout>
      <Sidebar>
        <ChatConversationList />
      </Sidebar>
      <Main>
        <ChatThread />
        <ChatComposer />
      </Main>
    </Layout>
  </AiChatProvider>
)
```

- [ ] **Step 3: Write smoke test**

Create `src/__tests__/components/AiChat.smoke.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import { AiChat } from '../../components/AiChat'

// Mock peerDependencies that are heavy
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}))

describe('AiChat smoke test', () => {
  it('renders without crashing', () => {
    expect(() =>
      render(<AiChat apiBaseUrl="http://api.test" authToken="Bearer tok" />),
    ).not.toThrow()
  })
})
```

- [ ] **Step 4: Run smoke test**

```bash
pnpm test -- --testPathPattern=AiChat.smoke
```

Expected: 1 passing

- [ ] **Step 5: Verify TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add packages/ai-chat/src/components/AiChat packages/ai-chat/src/__tests__/components/AiChat.smoke.test.tsx
git commit -m "feat(ai-chat): add AiChat top-level component with smoke test"
```

---

## Task 15: Public Exports

**Files:**

- Modify: `packages/ai-chat/src/index.ts`

- [ ] **Step 1: Write the final index.ts**

```ts
// Components
export { AiChat } from './components/AiChat'
export { AiChatProvider } from './components/AiChatProvider'
export { ChatThread } from './components/ChatThread'
export { ChatComposer } from './components/ChatComposer'
export { ChatConversationList } from './components/ChatConversationList'

// Types
export type {
  ChatMessage,
  ChatSession,
  ChatAgentMode,
  ChatMessageStatus,
  ChatMessageBlock,
  ChatImageAttachment,
  AiChatLabels,
  AiChatConfig,
  PlanQuestionnaire,
  PlanQuestion,
  PlanQuestionnaireSubmission,
  ExecutionConfirmationSubmission,
  ExecutionProposal,
  ResultSummary,
} from './types'

export type { AiChatProviderProps } from './components/AiChatProvider'
```

Add `AiChatConfig` to `src/types/index.ts`:

```ts
export interface AiChatConfig {
  apiBaseUrl: string
  authToken: string
  defaultMode?: ChatAgentMode
  labels?: AiChatLabels
}
```

- [ ] **Step 2: Build the package**

```bash
pnpm build --filter @xinghunm/ai-chat
```

Expected: `dist/` with index.js, index.mjs, index.d.ts — no errors

- [ ] **Step 3: Run all tests**

```bash
pnpm test --filter @xinghunm/ai-chat
```

Expected: all passing

- [ ] **Step 4: Commit**

```bash
git add packages/ai-chat/src/index.ts packages/ai-chat/src/types
git commit -m "feat(ai-chat): finalize public exports and build"
```

---

## Task 16: Demo App

**Files:**

- Create: `apps/ai-chat-demo/` (new Vite + React app)

- [ ] **Step 1: Create the demo app**

```bash
cd /Users/xinghunm/my-house/one-piece/apps
mkdir ai-chat-demo && cd ai-chat-demo
```

Create minimal `package.json`:

```json
{
  "name": "ai-chat-demo",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "@xinghunm/ai-chat": "workspace:*",
    "@xinghunm/compass-ui": "workspace:^",
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "axios": "^1.9.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-markdown": "^9.0.0",
    "remark-gfm": "^4.0.0",
    "remark-math": "^6.0.0",
    "rehype-katex": "^7.0.0",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.2.0",
    "vite": "^5.0.0"
  }
}
```

- [ ] **Step 2: Create vite.config.ts**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({ jsxImportSource: '@emotion/react' })],
})
```

- [ ] **Step 3: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>AI Chat Demo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Create src/main.tsx**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 5: Create src/App.tsx**

```tsx
import { AiChat } from '@xinghunm/ai-chat'

export const App = () => (
  <div style={{ height: '100vh' }}>
    <AiChat
      apiBaseUrl={import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'}
      authToken={`Bearer ${import.meta.env.VITE_AUTH_TOKEN ?? 'dev-token'}`}
    />
  </div>
)
```

- [ ] **Step 6: Install and run dev server**

```bash
cd /Users/xinghunm/my-house/one-piece
pnpm install
pnpm dev --filter ai-chat-demo
```

Expected: Vite dev server starts, `AiChat` renders in browser

- [ ] **Step 7: Commit**

```bash
git add apps/ai-chat-demo
git commit -m "feat(ai-chat): add demo app for local verification"
```

---

## Final Verification

- [ ] **Build all packages**

```bash
cd /Users/xinghunm/my-house/one-piece
pnpm build --filter @xinghunm/ai-chat
```

- [ ] **Run all tests**

```bash
pnpm test --filter @xinghunm/ai-chat
```

Expected: all tests pass

- [ ] **TypeScript check**

```bash
cd packages/ai-chat && npx tsc --noEmit
```

Expected: no errors
