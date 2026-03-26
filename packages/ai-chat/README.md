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

推荐通过 `transport` 接入，这样 `ai-chat` 只负责通用 UI，后端协议由接入层决定：

```tsx
import { AiChat, createDefaultChatTransport } from '@xinghunm/ai-chat'

const transport = createDefaultChatTransport({
  apiBaseUrl: '/ai-api',
  authToken: 'Bearer your-token-here',
})

export const App = () => <AiChat transport={transport} />
```

显示会话列表侧边栏：

```tsx
<AiChat transport={transport} showConversationList />
```

如果你还在使用内置默认协议，也可以继续传 `apiBaseUrl` 和 `authToken`。`AiChatProvider` 会在内部自动创建默认 transport，属于兼容模式。

如果只是路径不同，也不需要自己重写整个 transport，可以只覆盖默认 adapter 的 endpoints：

```tsx
const transport = createDefaultChatTransport({
  apiBaseUrl: '/ai-api',
  authToken: 'Bearer your-token-here',
  endpoints: {
    models: '/catalog/models',
    completions: '/chat/run',
    terminate: '/chat/stop',
  },
})
```

## 完整用法

如需最大灵活性，可在 `AiChatProvider` 内手动组合子组件：

```tsx
import { AiChatProvider, ChatConversationList, ChatThread, ChatComposer } from '@xinghunm/ai-chat'
import type { ChatTransport } from '@xinghunm/ai-chat'

const transport: ChatTransport = {
  async getModels() {
    return {
      data: [{ id: 'my-model', object: 'model' }],
    }
  },
  async startStream({
    sessionId,
    model,
    mode,
    content,
    onSessionId,
    onUpdate,
    onDone,
    onError,
    signal,
  }) {
    try {
      const response = await fetch('/custom-chat/stream', {
        method: 'POST',
        signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, model, mode, content }),
      })
      const data = await response.json()
      onSessionId?.(data.sessionId)
      onUpdate({ content: data.answer })
      onDone?.()
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Unknown stream error'))
    }
  },
  async terminateStream(sessionId) {
    await fetch('/custom-chat/terminate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
    return { terminated: true }
  },
}

export const CustomChat = () => (
  <AiChatProvider
    transport={transport}
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

| 属性                     | 类型            | 默认值    | 说明                                                                                            |
| ------------------------ | --------------- | --------- | ----------------------------------------------------------------------------------------------- |
| `transport`              | `ChatTransport` | —         | 推荐。由接入方提供的传输适配器。                                                                |
| `apiBaseUrl`             | `string`        | —         | 兼容模式。创建默认内置 transport。                                                              |
| `authToken`              | `string`        | —         | 兼容模式下默认 transport 使用的鉴权头。                                                         |
| `defaultMode`            | `ChatAgentMode` | `"agent"` | 新会话的初始 Agent 模式。                                                                       |
| `labels`                 | `AiChatLabels`  | —         | 可选的 UI 文案覆盖。                                                                            |
| `showConversationList`   | `boolean`       | `false`   | 为 `true` 时渲染会话列表侧边栏。                                                                |
| `enableImageAttachments` | `boolean`       | `true`    | 为 `false` 时隐藏上传按钮、禁用粘贴图片，并使程序化调用 `pickImages`/`pasteImages` 变为 no-op。 |

### `AiChatProviderProps`

`AiChatProvider` 上下文提供者组件的 Props。

`AiChatProvider` 有两种接入方式，二选一：

| 属性                     | 类型                       | 必填 | 说明                                                                                                         |
| ------------------------ | -------------------------- | ---- | ------------------------------------------------------------------------------------------------------------ |
| `transport`              | `ChatTransport`            | 是   | 推荐。完全自定义的传输层。                                                                                   |
| `defaultMode`            | `ChatAgentMode`            | 否   | 新会话的初始 Agent 模式。                                                                                    |
| `labels`                 | `AiChatLabels`             | 否   | 可选的 UI 文案覆盖。                                                                                         |
| `renderMessageBlock`     | `ChatMessageBlockRenderer` | 否   | 自定义消息 block 渲染器，用于承接 `type: "custom"` 等扩展。                                                  |
| `enableImageAttachments` | `boolean`                  | 否   | 为 `false` 时隐藏上传按钮、禁用粘贴图片，并使程序化调用 `pickImages`/`pasteImages` 变为 no-op。默认 `true`。 |
| `children`               | `ReactNode`                | 是   | Provider 内部渲染的子元素。                                                                                  |

兼容模式：

| 属性                     | 类型                        | 必填 | 说明                                                                                                         |
| ------------------------ | --------------------------- | ---- | ------------------------------------------------------------------------------------------------------------ |
| `apiBaseUrl`             | `string`                    | 是   | 默认 adapter 的基础 URL。                                                                                    |
| `authToken`              | `string`                    | 是   | 默认 adapter 使用的 Authorization 请求头值。                                                                 |
| `transformStreamPacket`  | `TransformChatStreamPacket` | 否   | 默认 adapter 的流式包归一化扩展点。                                                                          |
| `defaultMode`            | `ChatAgentMode`             | 否   | 新会话的初始 Agent 模式。                                                                                    |
| `labels`                 | `AiChatLabels`              | 否   | 可选的 UI 文案覆盖。                                                                                         |
| `renderMessageBlock`     | `ChatMessageBlockRenderer`  | 否   | 自定义消息 block 渲染器，用于承接 `type: "custom"` 等扩展。                                                  |
| `enableImageAttachments` | `boolean`                   | 否   | 为 `false` 时隐藏上传按钮、禁用粘贴图片，并使程序化调用 `pickImages`/`pasteImages` 变为 no-op。默认 `true`。 |
| `children`               | `ReactNode`                 | 是   | Provider 内部渲染的子元素。                                                                                  |

### `ChatTransport`

`ChatTransport` 是通用化后的核心扩展点：

| 方法                | 说明                                                     |
| ------------------- | -------------------------------------------------------- |
| `getModels()`       | 返回模型列表，用于填充模型选择器。                       |
| `startStream()`     | 发送用户消息并通过 `onUpdate` 推送归一化后的流式 patch。 |
| `terminateStream()` | 请求终止当前会话的流式响应。                             |

库内同时导出了 `createDefaultChatTransport()`，用于快速复用当前 `/models`、`/chat/completions`、`/chat/terminate` 协议。

`createDefaultChatTransport()` 同时支持 `endpoints` 覆盖：

| 键            | 默认值                | 说明                   |
| ------------- | --------------------- | ---------------------- |
| `models`      | `"/models"`           | 模型列表接口路径。     |
| `completions` | `"/chat/completions"` | 流式聊天接口路径。     |
| `terminate`   | `"/chat/terminate"`   | 停止流式响应接口路径。 |

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

// 获取完整上下文，包括 transport 和合并后的 labels
const { labels, transport } = useChatContext()
```

两个 hooks 在 `AiChatProvider` 外部调用时均会抛出异常。

## 扩展自定义 Block

`ai-chat` 现在支持把“通用聊天壳子”和“业务工作流卡片”解耦。推荐做法是：

1. 用 `transformStreamPacket` 把后端的自定义 packet 转成 `blocks`
2. 用 `renderMessageBlock` 渲染 `type: "custom"` 的 block

```tsx
import type { ChatMessageBlockRendererProps, TransformChatStreamPacket } from '@xinghunm/ai-chat'

const transformStreamPacket: TransformChatStreamPacket = ({ packet, defaultUpdate }) => {
  if (
    packet.type === 'message_complete' &&
    typeof packet.data === 'object' &&
    packet.data !== null &&
    'widget' in packet.data
  ) {
    return {
      ...defaultUpdate,
      blocks: [
        { type: 'custom', kind: 'widget', data: (packet.data as { widget: unknown }).widget },
      ],
    }
  }

  return defaultUpdate
}

const renderMessageBlock = ({ block }: ChatMessageBlockRendererProps) => {
  if (block.type !== 'custom' || block.kind !== 'widget') {
    return null
  }

  return <pre>{JSON.stringify(block.data, null, 2)}</pre>
}
```

这样业务卡片可以放在接入层或扩展包里，基础包继续只负责通用聊天体验。
