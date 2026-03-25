# @xinghunm/ai-chat

A React component library that provides a fully-featured AI chat UI, including conversation management, streaming responses, agent modes, and image attachments.

## Installation

```bash
npm install @xinghunm/ai-chat
# or
pnpm add @xinghunm/ai-chat
```

### Peer Dependencies

The following packages must be installed in your project:

```bash
npm install @emotion/react @emotion/styled @xinghunm/compass-ui axios react react-dom react-markdown rehype-katex remark-gfm remark-math zustand
```

## Quick Start

Use the all-in-one `AiChat` component for the simplest integration:

```tsx
import { AiChat } from '@xinghunm/ai-chat'

export const App = () => (
  <AiChat apiBaseUrl="https://your-api.example.com" authToken="Bearer your-token-here" />
)
```

To also show the conversation list sidebar:

```tsx
<AiChat
  apiBaseUrl="https://your-api.example.com"
  authToken="Bearer your-token-here"
  showConversationList
/>
```

## Full Usage

For maximum flexibility, compose the sub-components manually inside `AiChatProvider`:

```tsx
import { AiChatProvider, ChatConversationList, ChatThread, ChatComposer } from '@xinghunm/ai-chat'

export const CustomChat = () => (
  <AiChatProvider
    apiBaseUrl="https://your-api.example.com"
    authToken="Bearer your-token-here"
    defaultMode="agent"
    labels={{
      sendButton: 'Submit',
      placeholder: 'Type your question…',
      newChat: 'New conversation',
    }}
  >
    <div style={{ display: 'flex', height: '100vh' }}>
      <ChatConversationList />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ChatThread />
        <ChatComposer />
      </div>
    </div>
  </AiChatProvider>
)
```

## Props API

### `AiChatProps`

Props for the all-in-one `AiChat` component. Extends all `AiChatProviderProps` (excluding `children`).

| Prop                   | Type            | Default   | Description                                           |
| ---------------------- | --------------- | --------- | ----------------------------------------------------- |
| `apiBaseUrl`           | `string`        | —         | Base URL of the AI chat backend API.                  |
| `authToken`            | `string`        | —         | Authorization header value (e.g. `"Bearer <token>"`). |
| `defaultMode`          | `ChatAgentMode` | `"agent"` | Initial agent mode for new sessions.                  |
| `labels`               | `AiChatLabels`  | —         | Optional label overrides for UI strings.              |
| `showConversationList` | `boolean`       | `false`   | When true, renders the conversation list sidebar.     |

### `AiChatProviderProps`

Props for the `AiChatProvider` context provider component.

| Prop          | Type            | Required | Description                                           |
| ------------- | --------------- | -------- | ----------------------------------------------------- |
| `apiBaseUrl`  | `string`        | Yes      | Base URL of the AI chat backend API.                  |
| `authToken`   | `string`        | Yes      | Authorization header value (e.g. `"Bearer <token>"`). |
| `defaultMode` | `ChatAgentMode` | No       | Initial agent mode for new sessions.                  |
| `labels`      | `AiChatLabels`  | No       | Optional label overrides for UI strings.              |
| `children`    | `ReactNode`     | Yes      | Child elements rendered inside the provider.          |

### `AiChatLabels`

All fields are optional. Unspecified fields fall back to the English defaults defined in `DEFAULT_AI_CHAT_LABELS`.

| Key                     | Default                        | Description                                        |
| ----------------------- | ------------------------------ | -------------------------------------------------- |
| `sendButton`            | `"Send"`                       | Label for the send button.                         |
| `stopButton`            | `"Stop"`                       | Label for the stop/abort button.                   |
| `placeholder`           | `"Ask something..."`           | Textarea placeholder text.                         |
| `modeLabelAsk`          | `"Ask"`                        | Label for the Ask agent mode.                      |
| `modeLabelPlan`         | `"Plan"`                       | Label for the Plan agent mode.                     |
| `modeLabelAgent`        | `"Agent"`                      | Label for the Agent agent mode.                    |
| `newChat`               | `"New Chat"`                   | Label for the new conversation button.             |
| `emptyStateTitle`       | `"How can I help you?"`        | Heading shown in the empty thread state.           |
| `emptyStateSubtitle`    | `"Start a conversation"`       | Sub-heading shown in the empty thread state.       |
| `attachmentLimitNotice` | `"Images exceeded the limit…"` | Notice shown when the attachment limit is reached. |

## Store

For advanced scenarios (e.g. reading streaming state, programmatically switching sessions), you can access the underlying Zustand store via the provided hooks inside any component that is a descendant of `AiChatProvider`:

```tsx
import { useChatStore, useChatContext } from '@xinghunm/ai-chat'

// Select a slice of the chat store (re-renders only when the slice changes)
const activeSessionId = useChatStore((s) => s.activeSessionId)

// Access the full context including the axios instance and merged labels
const { labels, axios: chatClient } = useChatContext()
```

Both hooks throw if called outside of `AiChatProvider`.
