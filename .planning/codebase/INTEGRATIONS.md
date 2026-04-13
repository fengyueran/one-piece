# 外部集成

**分析日期：** 2026-04-13

## API 与外部服务

**AI 对话后端协议：**

- 自定义 HTTP + SSE 聊天后端 - `packages/ai-chat` 默认 transport 通过模型列表、流式补全、终止会话三个端点接入任意后端
  - SDK/Client：`axios` + 原生 `fetch`，实现位于 `packages/ai-chat/src/transport/default-chat-transport.ts`、`packages/ai-chat/src/api/index.ts`、`packages/ai-chat/src/api/chat-stream.ts`
  - Auth：调用方提供 Bearer Token；demo 环境变量入口位于 `apps/ai-chat-demo/src/App.tsx`，Provider 入参定义位于 `packages/ai-chat/src/components/ai-chat-provider/index.tsx`
- PDE 计划决策后端 - demo 额外访问待选项与确认接口 `/chat/plan/options/pending`、`/chat/plan/options/decide`
  - SDK/Client：原生 `fetch`，实现位于 `apps/ai-chat-demo/src/lib/pde-plan-options-api.ts`
  - Auth：`Authorization` 请求头，由 `createPdePlanQuestionnaireSubmitHandler()` 注入，代码位于 `apps/ai-chat-demo/src/lib/pde-plan-options-api.ts`
- npm Registry - 包发布目标
  - SDK/Client：`changeset publish`，触发入口位于根 `package.json`
  - Auth：仓库中未检测到发布令牌来源；通常由开发机或 CI 的 npm 登录态提供

## 数据存储

**数据库：**

- 未检测到数据库客户端、ORM 或迁移工具；`apps/*` 与 `packages/*` 中未发现 Prisma、TypeORM、Drizzle、Mongoose、Supabase 等依赖
  - Connection：未检测到
  - Client：未检测到

**文件存储：**

- 无远程文件存储服务接入
- `packages/ai-chat` 支持图片附件 UI，但仓库内未实现对象存储上传客户端；相关开关与上下文位于 `packages/ai-chat/src/components/ai-chat-provider/index.tsx`
- 构建产物仅写入本地目录：`apps/ai-chat-demo/dist`、`packages/ai-chat/dist`、`packages/compass-hooks/dist`、`packages/compass-ui/dist`、`packages/eslint-plugin-fsd-lint/dist`

**缓存：**

- 外部缓存服务：未检测到 Redis、Memcached 或 CDN SDK
- 本地任务缓存：Turborepo 本地缓存位于 `.turbo/`，策略定义于 `turbo.json`
- 浏览器本地持久化：`packages/compass-hooks` 提供 `useLocalStorage`，说明位于 `packages/compass-hooks/README.md`

## 认证与身份

**认证提供方：**

- 自定义 Bearer Token 透传
  - 实现方式：`AiChatProvider` 接收 `authToken` 后创建 `axios` 实例并传给默认 transport，代码位于 `packages/ai-chat/src/components/ai-chat-provider/index.tsx`
  - 流式请求：`startChatStream()` 直接把 `Authorization` 头写入 `fetch` 请求，代码位于 `packages/ai-chat/src/api/chat-stream.ts`
  - Demo 配置：`VITE_AI_CHAT_AUTH_TOKEN` 通过 `apps/ai-chat-demo/src/App.tsx` 注入
- 未检测到内建身份系统；仓库内没有 OAuth、NextAuth、Auth0、Firebase Auth 或自研登录服务实现

## 监控与可观测性

**错误追踪：**

- 未检测到 Sentry、LogRocket、Datadog、Bugsnag 等前后端错误采集 SDK

**日志：**

- 运行时日志方案未集中配置
- 错误通常通过抛出 `Error` 由调用方处理，例如 `packages/ai-chat/src/api/chat-stream.ts` 与 `apps/ai-chat-demo/src/lib/pde-plan-options-api.ts`

## CI/CD 与发布

**托管：**

- `apps/docs` 使用 Next.js 脚本 `next build` / `next start`，定义于 `apps/docs/package.json`；仓库未检测到 Vercel、Netlify、Docker、Kubernetes 等托管配置
- `apps/ai-chat-demo` 使用 Vite 构建产物 `dist/`，脚本定义于 `apps/ai-chat-demo/package.json`；生产部署平台未检测到

**CI 流水线：**

- 未检测到 `.github/workflows/*` 或其他 CI 配置文件
- 本地质量门禁依赖 Husky + lint-staged + commitlint，配置位于 `.husky/pre-commit`、`.husky/commit-msg`、`package.json`
- 包发布前置步骤是根 `release` 脚本：`turbo run lint test build --filter=./packages/* && changeset publish`，定义于 `package.json`

## 环境配置

**必需环境变量：**

- `VITE_AI_CHAT_API_BASE_URL` - demo 运行时的 AI 后端基础地址，读取位于 `apps/ai-chat-demo/src/App.tsx`
- `VITE_AI_CHAT_AUTH_TOKEN` - demo 运行时的 Bearer Token，读取位于 `apps/ai-chat-demo/src/App.tsx`
- `AI_CHAT_DEMO_PROXY_TARGET` - Vite 开发代理目标，读取位于 `apps/ai-chat-demo/vite.config.ts`

**Secrets 位置：**

- 检测到环境文件：`apps/ai-chat-demo/.env`、`packages/ai-chat/.env`
- `turbo.json` 将 `**/.env.*local` 纳入缓存失效依赖，说明本地环境分层配置是预期路径
- 仓库中未检测到集中 secrets manager 集成

## Webhooks 与回调

**入站：**

- 无 Webhook 入口
- 流式聊天通过 SSE 响应处理，而非 Webhook；实现位于 `packages/ai-chat/src/api/chat-stream.ts`

**出站：**

- `POST {apiBaseUrl}/chat/completions` - SSE 流式对话请求，定义于 `packages/ai-chat/src/api/chat-stream.ts`
- `GET {apiBaseUrl}/models` - 模型列表请求，定义于 `packages/ai-chat/src/api/index.ts`
- `POST {apiBaseUrl}/chat/terminate` - 终止流式对话请求，定义于 `packages/ai-chat/src/api/index.ts`
- `GET {apiBaseUrl}/chat/plan/options/pending` - demo 计划选项拉取，定义于 `apps/ai-chat-demo/src/lib/pde-plan-options-api.ts`
- `POST {apiBaseUrl}/chat/plan/options/decide` - demo 计划选项确认，定义于 `apps/ai-chat-demo/src/lib/pde-plan-options-api.ts`

## 集成契约细节

**请求头与会话协定：**

- `Authorization` - 所有默认聊天请求与 demo 计划接口均使用 Bearer Token，请求构造位于 `packages/ai-chat/src/api/chat-stream.ts`、`packages/ai-chat/src/components/ai-chat-provider/index.tsx`、`apps/ai-chat-demo/src/lib/pde-plan-options-api.ts`
- `X-Session-ID` - 流式会话复用和终止时传递，定义于 `packages/ai-chat/src/api/chat-stream.ts`、`packages/ai-chat/src/api/index.ts`
- `X-Tool-Approval-Required` / `X-Tool-Approval-Timeout` - AI Chat transport 支持工具执行审批协议，定义于 `packages/ai-chat/src/transport/default-chat-transport.ts`

**端点可覆写能力：**

- `packages/ai-chat` 允许通过 `createDefaultChatTransport({ endpoints })` 覆写 `models`、`completions`、`terminate` 路径，接口定义位于 `packages/ai-chat/src/transport/default-chat-transport.ts`
- `apps/ai-chat-demo` 开发时通过 Vite 代理把 `/ai-api` 转发到 `AI_CHAT_DEMO_PROXY_TARGET`，配置位于 `apps/ai-chat-demo/vite.config.ts`

---

_集成审计：2026-04-13_
