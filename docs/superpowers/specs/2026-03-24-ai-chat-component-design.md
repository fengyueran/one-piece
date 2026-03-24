# @xinghunm/ai-chat 设计文档

**日期：** 2026-03-24
**状态：** 已批准
**来源项目：** unitary-studio (`packages/business/src/` 中的 AI 聊天模块)

---

## 背景

unitary-studio 已实现完整的 AI 聊天功能，包含流式对话、多 Agent 模式、结构化消息卡片等。现将其提取为独立 npm 包，以便在多个项目中复用。

---

## 目标

发布 `@xinghunm/ai-chat` npm 包，满足以下要求：

1. **完整封装**：UI、状态管理、API 调用全部内置，消费方只需传入配置
2. **两种使用方式**：开箱即用的 `<AiChat />` + 可组合子组件
3. **零 Redux 依赖**：使用 Zustand 替代 Redux Toolkit
4. **样式方案**：`@emotion/styled`，`@xinghunm/compass-ui` 作 peerDependency

---

## 包信息

| 字段     | 值                            |
| -------- | ----------------------------- |
| 包名     | `@xinghunm/ai-chat`           |
| 位置     | `one-piece/packages/ai-chat/` |
| 初始版本 | `0.1.0`                       |
| 构建工具 | tsup                          |
| 产物格式 | ESM + CJS + `.d.ts`           |

---

## 第一节：整体架构

### 目录结构

```
packages/ai-chat/
├── src/
│   ├── store/                  # Zustand store（内部，不对外导出）
│   │   └── chat-store.ts
│   ├── api/                    # axios 实例 + SSE 流式处理
│   │   ├── chat-stream.ts
│   │   └── index.ts
│   ├── types/                  # TypeScript 类型（对外导出）
│   │   └── index.ts
│   ├── components/
│   │   ├── AiChat/             # 开箱即用顶层组件
│   │   │   └── index.tsx
│   │   ├── AiChatProvider/     # Context + store 根节点
│   │   │   └── index.tsx
│   │   ├── ChatThread/         # 消息列表（含所有结构化卡片）
│   │   │   ├── index.tsx
│   │   │   └── components/
│   │   ├── ChatComposer/       # 输入框（含模型/模式选择、附件）
│   │   │   ├── index.tsx
│   │   │   └── components/
│   │   └── ChatConversationList/  # 会话列表
│   │       └── index.tsx
│   └── index.ts                # 统一导出入口
├── package.json
└── tsup.config.ts
```

### peerDependencies

```json
{
  "react": ">=18",
  "@xinghunm/compass-ui": ">=0.8.0",
  "@emotion/react": ">=11",
  "@emotion/styled": ">=11",
  "axios": ">=1.0",
  "zustand": ">=4",
  "react-markdown": ">=9",
  "remark-gfm": ">=4",
  "remark-math": ">=6",
  "rehype-katex": ">=7"
}
```

---

## 第二节：公开 API

### 开箱即用

```tsx
import { AiChat } from '@xinghunm/ai-chat'
;<AiChat
  apiBaseUrl="https://api.example.com"
  authToken="Bearer xxx"
  defaultMode="ask" // 可选，默认 'ask'
  onError={(err) => {}} // 可选
  labels={{
    // 可选，覆盖默认文案
    sendButton: 'Send',
    stopButton: 'Stop',
    placeholder: 'Ask something...',
    modeLabelAsk: 'Ask',
    modeLabelPlan: 'Plan',
    modeLabelAgent: 'Agent',
  }}
/>
```

### i18n 策略

包内不依赖 `react-i18next`，所有 UI 文案内置英文默认值。消费方通过 `labels` prop 传入任意语言的覆盖文案。`AiChatProvider` 和各子组件均接受 `labels` prop（可选），未传则使用默认英文文案。

### 可组合方式

```tsx
import { AiChatProvider, ChatConversationList, ChatThread, ChatComposer } from '@xinghunm/ai-chat'
;<AiChatProvider apiBaseUrl="..." authToken="...">
  <div className="my-layout">
    <ChatConversationList />
    <div className="main">
      <ChatThread />
      <ChatComposer />
    </div>
  </div>
</AiChatProvider>
```

### 导出清单

| 导出                   | 类型 | 说明                             |
| ---------------------- | ---- | -------------------------------- |
| `AiChat`               | 组件 | 开箱即用入口                     |
| `AiChatProvider`       | 组件 | 可组合根节点，提供 store context |
| `ChatThread`           | 组件 | 消息列表，含所有结构化卡片       |
| `ChatComposer`         | 组件 | 输入框，含模型/模式选择和附件    |
| `ChatConversationList` | 组件 | 会话列表                         |
| `ChatMessage`          | 类型 | 消息类型                         |
| `ChatSession`          | 类型 | 会话类型                         |
| `ChatAgentMode`        | 类型 | `'ask' \| 'plan' \| 'agent'`     |
| `ChatMessageStatus`    | 类型 | 消息状态枚举                     |
| `ChatMessageBlock`     | 类型 | 结构化消息块类型                 |
| `AiChatConfig`         | 类型 | 配置类型（含 labels）            |
| `AiChatLabels`         | 类型 | 文案覆盖 prop 类型               |

---

## 第三节：状态管理

### Zustand Store

每个 `AiChatProvider` 创建一个独立 store 实例，通过 React Context 向下传递，多实例互不干扰。

```ts
interface ChatStore {
  // 状态
  activeSessionId: string | null
  preferredMode: ChatAgentMode
  sessions: ChatSession[]
  messagesBySession: Record<string, ChatMessage[]>
  streamingMessageBySession: Record<string, ChatMessage | undefined>
  isStreamingBySession: Record<string, boolean>
  errorBySession: Record<string, string | null>

  // Session 管理
  createSession: (session: ChatSession) => void // 创建新会话（含草稿会话）
  setActiveSession: (id: string) => void
  replaceSessionId: (draftId: string, realId: string) => void // 草稿 → 真实 ID 替换
  setPreferredMode: (mode: ChatAgentMode) => void
  setSessionMode: (sessionId: string, mode: ChatAgentMode) => void

  // 消息操作
  appendMessage: (sessionId: string, message: ChatMessage) => void
  startStreamingMessage: (sessionId: string, message: ChatMessage) => void
  updateStreamingMessage: (sessionId: string, delta: string) => void
  completeStreamingMessage: (sessionId: string) => void
  finalizeStoppedStreamingMessage: (sessionId: string) => void
  updateQuestionnaireAnswers: (
    sessionId: string,
    messageId: string,
    answers: Record<string, unknown>,
  ) => void

  // 错误 & 流控
  clearSessionError: (sessionId: string) => void

  // 高阶 actions（调用上述底层 actions）
  send: (content: string, attachments?: Attachment[]) => Promise<void>
  stop: () => void
}
```

### 请求流程

```
用户调用 send()
  → 乐观写入用户消息到 store
  → axios POST /chat/completion
  → 接收 SSE 流：逐包 updateStreamingMessage
  → 完成：completeStreamingMessage
  → 错误/中止：写入 error 状态
```

### 配置注入与 authToken 流向

`AiChatProvider` 接收配置，创建共享 axios 实例和 SSE 请求参数，并存入 store context，供所有内部请求使用：

```ts
// AiChatProvider 内部
const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: { Authorization: authToken },
})

// SSE 流请求也从 context 读取 authToken，不再依赖 useSession()
// startChatStream({ url, authToken, ... })
```

`authToken` 生命周期：`AiChatProvider` props → store context → axios headers / SSE fetch headers。消费方更新 `authToken` prop 时，Provider 重新创建 axios 实例。

### 图片预览

移除对 unitary-studio 专有 `FullscreenImageViewer` 的依赖，在包内实现轻量级图片全屏预览组件（`ImageViewer`），仅依赖 `@emotion/styled`，不引入额外依赖。

---

## 第四节：构建与发布

### tsup 配置

```ts
// tsup.config.ts
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

### package.json 关键字段

```json
{
  "name": "@xinghunm/ai-chat",
  "version": "0.1.0",
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
  "publishConfig": { "access": "public" }
}
```

### 发布流程

```bash
pnpm build --filter @xinghunm/ai-chat
pnpm changeset
pnpm changeset version
pnpm changeset publish
```

### 本地验证

在 `one-piece/apps/` 下新建 demo app，通过 `workspace:*` 引用本地包：

```json
{
  "dependencies": {
    "@xinghunm/ai-chat": "workspace:*"
  }
}
```

---

## 第五节：迁移策略

### 迁移顺序

```
1. types/          ← 直接复制 entities/chat/model/types.ts，零改动
2. api/            ← 迁移 chat-stream.ts，RTK Query → 纯 axios
3. store/          ← Redux slice → Zustand store（核心重写）
4. components/     ← 迁移各 feature UI，替换 Redux hooks → useChatStore
5. AiChat/         ← 顶层组合，最后组装
6. apps/demo/      ← 验证
```

### 改动量评估

| 现有代码                                | 迁移后                           | 改动量 |
| --------------------------------------- | -------------------------------- | ------ |
| `entities/chat/model/types.ts`          | `types/index.ts`                 | 无     |
| `entities/chat/lib/chat-stream.ts`      | `api/chat-stream.ts`             | 极小   |
| `entities/chat/api/api.ts`（RTK Query） | `api/index.ts`（纯 axios）       | 中     |
| `entities/chat/model/slice.ts`（Redux） | `store/chat-store.ts`（Zustand） | 重写   |
| `features/*/model/use-*.ts`             | 直接访问 Zustand store           | 小     |
| `features/*/ui/**`                      | `components/` 下，替换 hooks     | 小     |
| `widgets/chat-workbench/`               | `components/AiChat/`             | 小     |

### 不迁移内容

- Redux store 配置、root-reducer
- RTK Query baseQuery
- `store/hooks.ts`（useAppDispatch/useAppSelector）

---

## 迁移功能范围

迁移现有全部功能：

- 多 Agent 模式（ask / plan / agent）
- SSE 流式响应渲染
- Markdown + 数学公式渲染
- 结构化消息卡片（notice、parameter_summary、confirmation_card、result_summary、questionnaire）
- 图片附件（最多 10 个）
- 会话管理（草稿会话 → 真实会话）
- 错误处理与流中止
