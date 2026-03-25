# @xinghunm/ai-chat

提供完整 AI 对话 UI 的 React 组件库，支持会话管理、流式响应、Agent 模式和图片附件。

## 安装

```bash
npm install @xinghunm/ai-chat
# 或
pnpm add @xinghunm/ai-chat
```

### Peer Dependencies

需在项目中单独安装：

```bash
npm install @emotion/react @emotion/styled @xinghunm/compass-ui axios react react-dom react-markdown rehype-katex remark-gfm remark-math zustand
```

## 快速开始

使用一体化 `AiChat` 组件，最简单的接入方式：

```tsx
import { AiChat } from '@xinghunm/ai-chat'

export const App = () => (
  <AiChat apiBaseUrl="https://your-api.example.com" authToken="Bearer your-token-here" />
)
```

显示会话列表侧边栏：

```tsx
<AiChat
  apiBaseUrl="https://your-api.example.com"
  authToken="Bearer your-token-here"
  showConversationList
/>
```

## 完整用法

如需最大灵活性，可在 `AiChatProvider` 内手动组合子组件：

```tsx
import { AiChatProvider, ChatConversationList, ChatThread, ChatComposer } from '@xinghunm/ai-chat'

export const CustomChat = () => (
  <AiChatProvider
    apiBaseUrl="https://your-api.example.com"
    authToken="Bearer your-token-here"
    defaultMode="agent"
    labels={{
      sendButton: '发送',
      placeholder: '输入你的问题…',
      newChat: '新建对话',
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

一体化 `AiChat` 组件的 Props，继承全部 `AiChatProviderProps`（不含 `children`）。

| 属性                   | 类型            | 默认值    | 说明                                            |
| ---------------------- | --------------- | --------- | ----------------------------------------------- |
| `apiBaseUrl`           | `string`        | —         | AI 对话后端 API 的基础 URL。                    |
| `authToken`            | `string`        | —         | Authorization 请求头值，如 `"Bearer <token>"`。 |
| `defaultMode`          | `ChatAgentMode` | `"agent"` | 新会话的初始 Agent 模式。                       |
| `labels`               | `AiChatLabels`  | —         | 可选的 UI 文案覆盖。                            |
| `showConversationList` | `boolean`       | `false`   | 为 `true` 时渲染会话列表侧边栏。                |

### `AiChatProviderProps`

`AiChatProvider` 上下文提供者组件的 Props。

| 属性          | 类型            | 必填 | 说明                                            |
| ------------- | --------------- | ---- | ----------------------------------------------- |
| `apiBaseUrl`  | `string`        | 是   | AI 对话后端 API 的基础 URL。                    |
| `authToken`   | `string`        | 是   | Authorization 请求头值，如 `"Bearer <token>"`。 |
| `defaultMode` | `ChatAgentMode` | 否   | 新会话的初始 Agent 模式。                       |
| `labels`      | `AiChatLabels`  | 否   | 可选的 UI 文案覆盖。                            |
| `children`    | `ReactNode`     | 是   | Provider 内部渲染的子元素。                     |

### `AiChatLabels`

所有字段均为可选，未指定的字段回退到 `DEFAULT_AI_CHAT_LABELS` 中的英文默认值。

| 键                      | 默认值                         | 说明                           |
| ----------------------- | ------------------------------ | ------------------------------ |
| `sendButton`            | `"Send"`                       | 发送按钮文案。                 |
| `stopButton`            | `"Stop"`                       | 停止/中止按钮文案。            |
| `placeholder`           | `"Ask something..."`           | 输入框占位文本。               |
| `modeLabelAsk`          | `"Ask"`                        | Ask 模式标签。                 |
| `modeLabelPlan`         | `"Plan"`                       | Plan 模式标签。                |
| `modeLabelAgent`        | `"Agent"`                      | Agent 模式标签。               |
| `newChat`               | `"New Chat"`                   | 新建对话按钮文案。             |
| `emptyStateTitle`       | `"How can I help you?"`        | 空消息状态的主标题。           |
| `emptyStateSubtitle`    | `"Start a conversation"`       | 空消息状态的副标题。           |
| `attachmentLimitNotice` | `"Images exceeded the limit…"` | 达到附件数量上限时的提示文案。 |

## Store

在高级场景下（如读取流式状态、以编程方式切换会话），可在 `AiChatProvider` 的子孙组件内通过内置 hooks 访问底层 Zustand store：

```tsx
import { useChatStore, useChatContext } from '@xinghunm/ai-chat'

// 选取 store 的某个切片（仅在该切片变化时触发重渲染）
const activeSessionId = useChatStore((s) => s.activeSessionId)

// 获取完整上下文，包括 axios 实例和合并后的 labels
const { labels, axios: chatClient } = useChatContext()
```

两个 hooks 在 `AiChatProvider` 外部调用时均会抛出异常。
