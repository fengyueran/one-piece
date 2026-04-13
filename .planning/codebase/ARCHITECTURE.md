# 架构概览

**分析日期：** 2026-04-13

## 模式概览

**Overall:** 基于 `pnpm workspace` + `turbo` 的前端库优先型 monorepo。根目录负责工作区编排、统一脚本和发版；`packages/*` 提供可发布或可复用能力；`apps/*` 作为消费层应用；`tools/*` 提供共享配置；`docs/*` 承载过程文档与计划文档。

**Key Characteristics:**

- 工作区边界由 `pnpm-workspace.yaml` 显式声明，只纳入 `apps/*`、`packages/*`、`tools/*`。
- 构建与任务调度集中在根目录 `package.json` 和 `turbo.json`，各 workspace 只实现自己的 `build`、`dev`、`test`、`lint`。
- 依赖方向以“应用消费包、上层包消费下层包、配置被复用”为主，当前未见循环依赖。
- 包级入口统一经由 `src/index.ts` 暴露，内部继续按目录分层，不要求消费者跨目录直连内部实现。
- 文档体系分成两条线：运行时文档站在 `apps/docs`，组件库自带 dumi 文档在 `packages/compass-ui/docs` 与 `packages/compass-ui/.dumirc.ts`。

## 分层结构

**Root Orchestration Layer:**

- Purpose: 统一管理 workspace、脚本、任务依赖、版本发布和提交钩子。
- Location: `package.json`、`pnpm-workspace.yaml`、`turbo.json`、`.changeset/config.json`、`.husky/pre-commit`、`.husky/commit-msg`
- Contains: 根脚本 `build/dev/lint/test/release`、workspace 声明、Turbo pipeline、Changesets、commit hook。
- Depends on: `pnpm`、`turbo`、`changesets`、`husky`、`commitlint`、`lint-staged`
- Used by: 所有 `apps/*`、`packages/*`、`tools/*`

**Application Layer (`apps/*`):**

- Purpose: 作为最终运行入口，组合内部包并提供演示或站点。
- Location: `apps/ai-chat-demo`、`apps/docs`
- Contains: Vite 应用入口 `apps/ai-chat-demo/src/main.tsx`、Next 页面入口 `apps/docs/pages/index.tsx`、应用级业务适配 `apps/ai-chat-demo/src/lib/*`
- Depends on: `packages/ai-chat`、`packages/compass-ui`、React 运行时
- Used by: 开发调试、组件演示、业务适配验证

**Reusable Package Layer (`packages/*`):**

- Purpose: 承载 monorepo 的核心可复用能力。
- Location: `packages/compass-hooks`、`packages/compass-ui`、`packages/ai-chat`、`packages/eslint-plugin-fsd-lint`
- Contains:
  - `packages/compass-hooks/src/*`: 通用 React hooks
  - `packages/compass-ui/src/*`: 组件、主题、配置、样式与图标
  - `packages/ai-chat/src/*`: AI chat 领域 UI、状态、传输协议与类型
  - `packages/eslint-plugin-fsd-lint/src/*`: FSD 规则插件
- Depends on:
  - `packages/compass-ui` -> `packages/compass-hooks`
  - `packages/ai-chat` -> `packages/compass-ui`
  - `packages/eslint-plugin-fsd-lint` 独立于 UI 链路
- Used by: `apps/*` 或外部 npm 消费者

**Shared Tooling Layer (`tools/*`):**

- Purpose: 提供跨包可复用的基础配置。
- Location: `tools/tsconfig/base.json`
- Contains: TypeScript 严格模式、声明输出、模块解析等基础编译选项。
- Depends on: TypeScript
- Used by: `packages/compass-hooks/tsconfig.json`、`packages/compass-ui/tsconfig.json`

**Documentation Layer (`docs/*` 与包内 docs):**

- Purpose: 保存开发文档、实施计划与组件文档产物。
- Location: `docs/`、`docs/plans/`、`docs/superpowers/`、`packages/compass-ui/docs/`、`packages/compass-ui/docs-dist/`
- Contains: 项目规范、历史计划、架构设计稿、dumi 文档源码和静态产物。
- Depends on: Markdown 工具链与 `dumi`
- Used by: 人工阅读、文档站生成、实施计划沉淀

## 依赖方向

**Workspace graph:**

1. `apps/ai-chat-demo` -> `packages/ai-chat` -> `packages/compass-ui` -> `packages/compass-hooks`
2. `apps/ai-chat-demo` -> `packages/compass-ui`
3. `apps/docs` -> `packages/compass-ui`
4. `packages/eslint-plugin-fsd-lint` 独立存在，不被当前应用直接消费
5. `tools/tsconfig` 只被包级 `tsconfig.json` 继承，不反向依赖任何业务包

**Enforced by package manifests:**

- `apps/ai-chat-demo/package.json`
- `apps/docs/package.json`
- `packages/ai-chat/package.json`
- `packages/compass-ui/package.json`

**Practical rule:** 新代码应保持“应用只消费包、包只向下依赖更底层包、共享配置不依赖业务代码”的方向。当前结构下不应让 `packages/compass-hooks` 依赖 `packages/compass-ui`，也不应让 `packages/*` 依赖 `apps/*`。

## 数据流

**Root Task Flow:**

1. 根目录 `package.json` 通过 `turbo run <task>` 向下分发任务。
2. `turbo.json` 根据 `dependsOn` 和 `outputs` 决定任务顺序与缓存边界。
3. 各 workspace 执行本地脚本并向根任务返回结果。

**AI Chat Runtime Flow:**

1. `apps/ai-chat-demo/src/main.tsx` 挂载 `apps/ai-chat-demo/src/App.tsx`。
2. `apps/ai-chat-demo/src/App.tsx` 创建 `createDefaultChatTransport(...)`，同时注入 `pdeTransformStreamPacket` 与 `createPdePlanQuestionnaireSubmitHandler(...)`。
3. `packages/ai-chat/src/components/ai-chat/index.tsx` 作为装配层，组合 `ConfigProvider`、`AiChatProvider`、`ChatConversationList`、`ChatThread`、`ChatComposer`。
4. `packages/ai-chat/src/components/ai-chat-provider/index.tsx` 创建 `zustand` store、组装 transport、填充 `ChatContext`。
5. `packages/ai-chat/src/components/chat-composer/index.tsx` 读取上下文并发起发送；`packages/ai-chat/src/transport/default-chat-transport.ts` 调用 `packages/ai-chat/src/api/chat-stream.ts` 和 `packages/ai-chat/src/api/index.ts`。
6. SSE 数据经 `extractChatStreamUpdate(...)` 与可选 `transformStreamPacket(...)` 转换为统一 patch，再写入 `packages/ai-chat/src/store/chat-store.ts`。
7. `packages/ai-chat/src/components/chat-thread/index.tsx` 与其子组件读取 store，渲染消息、问卷、确认卡片、结果摘要等结构化块。
8. 业务层自定义块通过 `apps/ai-chat-demo/src/lib/pde-block-renderer.tsx` 和 `apps/ai-chat-demo/src/approval-required-card.tsx` 注入显示。

**UI Theme Flow (`compass-ui`):**

1. 消费方从 `packages/compass-ui/src/index.ts` 导入组件。
2. `packages/compass-ui/src/config-provider/config-provider.tsx` 同时建立 `ConfigContext` 与 `ThemeProvider`。
3. `packages/compass-ui/src/theme/theme-provider.tsx` 合并默认主题、亮暗主题和局部覆写。
4. 组件内部通过 `token-utils`、`useTheme` 或 Emotion theme 读取样式 token。

**Lint Rule Flow (`eslint-plugin-fsd-lint`):**

1. ESLint 从 `packages/eslint-plugin-fsd-lint/src/index.ts` 加载插件对象。
2. `packages/eslint-plugin-fsd-lint/src/plugin.ts` 注册规则集合和推荐配置。
3. 具体规则如 `packages/eslint-plugin-fsd-lint/src/rules/layer-dependency.ts`、`packages/eslint-plugin-fsd-lint/src/rules/public-api-only.ts` 解析导入路径并报告问题。

**State Management:**

- `packages/ai-chat` 使用 `packages/ai-chat/src/store/chat-store.ts` 中的 `createChatStore()` 创建隔离 store。
- `packages/ai-chat/src/context/chat-context.ts` 持有 `store`、`transport`、标签和扩展点。
- UI 不直接请求后端；请求统一经 `transport` 与 `api/*` 完成，再由 store 驱动界面更新。
- `packages/compass-ui` 主要使用 React state/context；未见全局 store。

## 关键抽象

**Workspace Boundary:**

- Purpose: 把运行应用、复用库、共享配置、过程文档拆成独立目录。
- Examples: `apps/ai-chat-demo`、`packages/compass-ui`、`tools/tsconfig/base.json`、`docs/开发指南.md`
- Pattern: 根编排 + 子包自治

**Public Package Entry:**

- Purpose: 为每个包定义稳定导出面。
- Examples: `packages/ai-chat/src/index.ts`、`packages/compass-hooks/src/index.ts`、`packages/compass-ui/src/index.ts`、`packages/eslint-plugin-fsd-lint/src/index.ts`
- Pattern: 顶层 barrel 导出，消费者不直接依赖深层文件

**Provider + Context Boundary:**

- Purpose: 把可变运行态从组件树中抽离，避免 props drilling。
- Examples: `packages/ai-chat/src/components/ai-chat-provider/index.tsx`、`packages/ai-chat/src/context/chat-context.ts`、`packages/compass-ui/src/config-provider/config-provider.tsx`
- Pattern: Provider 装配依赖，hooks/组件只消费上下文

**Transport Adapter Boundary:**

- Purpose: 把后端协议与 UI 交互解耦。
- Examples: `packages/ai-chat/src/transport/default-chat-transport.ts`、`packages/ai-chat/src/api/chat-stream.ts`、`apps/ai-chat-demo/src/lib/pde-stream-transform.ts`
- Pattern: 默认 transport 提供通用 HTTP/SSE 适配，应用层通过 transform/render 扩展业务协议

**Component Slice Boundary (`compass-ui`):**

- Purpose: 让每个组件目录内自带实现、类型、样式、测试。
- Examples: `packages/compass-ui/src/button/*`、`packages/compass-ui/src/form/*`、`packages/compass-ui/src/table/*`
- Pattern: “一个目录一个组件域”，必要时在目录内再拆 `styles`、`types`、`hooks`、`context`

## 入口点

**Monorepo Task Entry:**

- Location: `package.json`
- Triggers: `pnpm build`、`pnpm dev`、`pnpm lint`、`pnpm test`、`pnpm release`
- Responsibilities: 统一调度 Turbo pipeline 与发布命令

**Demo App Entry:**

- Location: `apps/ai-chat-demo/src/main.tsx`
- Triggers: `pnpm --filter @one-piece/ai-chat-demo dev` 或根级 `pnpm dev`
- Responsibilities: 挂载 React 根节点并启动聊天演示应用

**Demo Composition Entry:**

- Location: `apps/ai-chat-demo/src/App.tsx`
- Triggers: `main.tsx` 渲染
- Responsibilities: 装配 `AiChat`、配置 transport、绑定业务 block renderer 和问卷提交逻辑

**Docs App Entry:**

- Location: `apps/docs/pages/index.tsx`
- Triggers: `pnpm --filter @one-piece/docs dev`
- Responsibilities: 提供独立 Next 文档站首页

**Package Public Entry (`ai-chat`):**

- Location: `packages/ai-chat/src/index.ts`
- Triggers: 应用或外部消费者导入 `@xinghunm/ai-chat`
- Responsibilities: 暴露组件、provider、transport 和核心类型

**Package Public Entry (`compass-ui`):**

- Location: `packages/compass-ui/src/index.ts`
- Triggers: 应用或外部消费者导入 `@xinghunm/compass-ui`
- Responsibilities: 暴露组件、主题能力和配置能力

**Package Public Entry (`compass-hooks`):**

- Location: `packages/compass-hooks/src/index.ts`
- Triggers: 其他包导入 `@xinghunm/compass-hooks`
- Responsibilities: 暴露 hooks 集合

**Docs Build Entry (`compass-ui`):**

- Location: `packages/compass-ui/.dumirc.ts`
- Triggers: `pnpm --filter @xinghunm/compass-ui docs:dev` 或 `docs:build`
- Responsibilities: 定义 dumi 站点导航、输出目录和 alias

## 错误处理

**Strategy:** 错误处理以下沉到边界层为主。API/stream 层负责抛出或归一化错误，store 负责保存错误状态，UI 层按会话展示错误和重试入口。

**Patterns:**

- `packages/ai-chat/src/api/chat-stream.ts` 在 SSE 读取、HTTP 状态异常、非流响应、后端错误包时抛出 `Error`，并通过 `onError` 回调上送。
- `packages/ai-chat/src/transport/default-chat-transport.ts` 只负责组装请求和转发回调，不在 UI 层散落 fetch 细节。
- `packages/ai-chat/src/store/chat-store.ts` 维护 `errorBySession`、`isStoppingBySession`、`isStreamingBySession`，把网络异常转为可渲染状态。
- `packages/ai-chat/src/components/chat-thread/index.tsx` 渲染错误态和 retry 按钮，而不是在深层消息组件里直接处理 transport 错误。
- `packages/compass-hooks/src/use-local-storage/use-local-storage.ts` 采用本地 `try/catch` 吞并记录 localStorage 错误，这是 hook 级边界处理。

## 横切关注点

**Logging:** 当前没有统一日志模块。局部实现直接使用浏览器能力或默认错误对象，例如 `packages/compass-hooks/src/use-local-storage/use-local-storage.ts` 中的 `console.error(error)`。

**Validation:** 主要出现在运行时类型守卫与协议规范化逻辑中，例如 `apps/ai-chat-demo/src/lib/pde-stream-transform.ts`、`apps/ai-chat-demo/src/lib/pde-plan-options.ts`、`packages/ai-chat/src/api/chat-stream.ts`。

**Authentication:** `packages/ai-chat/src/components/ai-chat-provider/index.tsx` 和 `packages/ai-chat/src/transport/default-chat-transport.ts` 通过 `authToken`/Axios headers 传递授权信息；应用层在 `apps/ai-chat-demo/src/App.tsx` 通过环境变量注入。

**Theming:** `packages/compass-ui/src/config-provider/config-provider.tsx` + `packages/compass-ui/src/theme/theme-provider.tsx` 负责全局或局部主题注入；`packages/ai-chat/src/components/ai-chat/index.tsx` 在消费 UI 库时提供自己的 token 覆写。

**Documentation:** 过程性文档集中在 `docs/`，组件文档在 `packages/compass-ui/docs/`，静态构建产物在 `packages/compass-ui/docs-dist/`。这两条线当前并存。

---

_Architecture analysis: 2026-04-13_
