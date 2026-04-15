# 技术栈

**分析日期：** 2026-04-13

## 语言

**主要语言：**

- TypeScript 5.x - 主体业务代码与库代码位于 `apps/docs/package.json`、`apps/ai-chat-demo/package.json`、`packages/ai-chat/package.json`、`packages/compass-hooks/package.json`、`packages/compass-ui/package.json`、`packages/eslint-plugin-fsd-lint/package.json`

**次要语言：**

- JavaScript - 工程配置与测试配置位于 `package.json`、`.eslintrc.js`、`packages/ai-chat/jest.config.js`、`packages/compass-hooks/jest.config.js`、`packages/compass-ui/jest.config.js`、`packages/eslint-plugin-fsd-lint/jest.config.js`
- Markdown - 包说明、开发说明与发布说明位于 `README.md`、`packages/ai-chat/README.md`、`packages/compass-ui/README.md`、`packages/compass-ui/docs/README.md`

## 运行时

**环境：**

- Node.js `>=18` - 根约束定义于 `package.json`
- 浏览器运行时 - React 应用与组件库面向 DOM 环境，目标配置位于 `apps/ai-chat-demo/tsconfig.json`、`apps/docs/tsconfig.json`、`packages/ai-chat/tsconfig.json`
- Next.js Node 服务运行时 - 文档站通过 `next dev` / `next build` / `next start` 运行，定义于 `apps/docs/package.json`

**包管理器：**

- pnpm `8.6.10` - 定义于 `package.json`
- Lockfile：已存在 `pnpm-lock.yaml`

## 框架与工具

**核心框架：**

- React 18 - 所有前端包和应用的基础 UI 运行时，定义于 `apps/docs/package.json`、`apps/ai-chat-demo/package.json`，并作为 peerDependency 出现在 `packages/ai-chat/package.json`、`packages/compass-hooks/package.json`、`packages/compass-ui/package.json`
- Next.js 13.5 - 文档站框架，定义于 `apps/docs/package.json`
- Vite 5 - demo 应用开发与打包框架，定义于 `apps/ai-chat-demo/package.json`，配置位于 `apps/ai-chat-demo/vite.config.ts`

**测试框架：**

- Jest 29 + ts-jest - 包级单元测试主框架，定义于 `packages/ai-chat/package.json`、`packages/compass-hooks/package.json`、`packages/compass-ui/package.json`、`packages/eslint-plugin-fsd-lint/package.json`
- Testing Library - React 组件测试工具，定义于 `packages/ai-chat/package.json`、`packages/compass-ui/package.json`、`packages/compass-hooks/package.json`
- Vitest 风格测试文件存在于 `apps/ai-chat-demo/src/lib/pde-plan-options-api.test.ts`、`apps/ai-chat-demo/src/lib/pde-stream-transform.test.ts`，但未检测到对应 `vitest` 依赖或独立配置文件

**构建/开发工具：**

- Turborepo 1.10 - monorepo 任务编排，定义于 `package.json`，流水线配置位于 `turbo.json`
- tsup 7/8 - React 库构建器，定义于 `packages/ai-chat/package.json`、`packages/compass-hooks/package.json`、`packages/compass-ui/package.json`，配置位于 `packages/ai-chat/tsup.config.ts`
- TypeScript 5.x - 类型检查与声明文件输出，根依赖定义于 `package.json`，共享基线位于 `tools/tsconfig/base.json`
- Dumi 2.4 - `packages/compass-ui` 组件文档站生成，定义于 `packages/compass-ui/package.json`
- ESLint 8 + Prettier 3 - 代码规范与格式化，定义于 `package.json`，规则位于 `.eslintrc.js`
- Changesets - 版本编排与发布元数据，定义于 `package.json`，配置位于 `.changeset/config.json`
- Husky + lint-staged + commitlint - 本地提交质量门禁，定义于 `package.json`，hook 位于 `.husky/pre-commit`、`.husky/commit-msg`

## 关键依赖

**关键依赖：**

- `@emotion/react` / `@emotion/styled` - `packages/compass-ui` 与 `packages/ai-chat` 的样式系统与 JSX runtime，定义于 `packages/compass-ui/package.json`、`packages/ai-chat/package.json`，`packages/ai-chat/tsconfig.json` 与 `packages/ai-chat/tsup.config.ts` 也直接依赖 Emotion 配置
- `axios` - `packages/ai-chat` 默认 HTTP 客户端，定义于 `packages/ai-chat/package.json`，使用位于 `packages/ai-chat/src/components/ai-chat-provider/index.tsx`、`packages/ai-chat/src/transport/default-chat-transport.ts`
- `zustand` - `packages/ai-chat` 的聊天状态管理，定义于 `packages/ai-chat/package.json`，上下文与 store 位于 `packages/ai-chat/src/context/use-chat-context.ts`、`packages/ai-chat/src/store/chat-store.ts`
- `react-markdown` + `remark-gfm` + `remark-math` + `rehype-katex` - `packages/ai-chat` 的消息渲染与 Markdown/数学公式支持，定义于 `packages/ai-chat/package.json`
- `@floating-ui/react`、`async-validator`、`date-fns`、`react-transition-group`、`react-window` - `packages/compass-ui` 的浮层、表单验证、日期处理、动效与长列表依赖，定义于 `packages/compass-ui/package.json`

**基础设施依赖：**

- `turbo` - 根任务调度，定义于 `package.json`
- `@changesets/cli` - 根版本与发布工具，定义于 `package.json`
- `typescript` - 根类型系统，定义于 `package.json`
- `eslint` / `@typescript-eslint/*` / `eslint-plugin-react` / `eslint-plugin-react-hooks` - 根静态检查依赖，定义于 `package.json`

## Workspace 结构

**已注册 workspace：**

- `apps/docs` - Next.js 文档站，注册于 `pnpm-workspace.yaml`，包清单位于 `apps/docs/package.json`
- `apps/ai-chat-demo` - Vite demo 应用，注册于 `pnpm-workspace.yaml`，包清单位于 `apps/ai-chat-demo/package.json`
- `packages/ai-chat` - AI 对话 React 组件库，包清单位于 `packages/ai-chat/package.json`
- `packages/compass-hooks` - 通用 React Hooks 库，包清单位于 `packages/compass-hooks/package.json`
- `packages/compass-ui` - React UI 组件库，包清单位于 `packages/compass-ui/package.json`
- `packages/eslint-plugin-fsd-lint` - FSD 结构校验 ESLint 插件，包清单位于 `packages/eslint-plugin-fsd-lint/package.json`
- `tools/tsconfig` - 共享 TypeScript 基线配置，文件位于 `tools/tsconfig/base.json`

## 配置

**环境配置：**

- Monorepo 包选择范围由 `pnpm-workspace.yaml` 定义，包含 `packages/*`、`apps/*`、`tools/*`
- Turbo 将 `**/.env.*local` 视为全局依赖，配置位于 `turbo.json`
- 检测到环境文件存在于 `apps/ai-chat-demo/.env` 与 `packages/ai-chat/.env`，内容未读取
- Demo 已知环境变量入口位于 `apps/ai-chat-demo/src/App.tsx` 与 `apps/ai-chat-demo/vite.config.ts`

**构建配置：**

- 根任务入口位于 `package.json`，统一通过 `turbo run build|dev|lint|test|clean` 调度
- Next.js 文档站配置入口位于 `apps/docs/package.json`
- Vite demo 构建入口位于 `apps/ai-chat-demo/package.json`，代理与 alias 配置位于 `apps/ai-chat-demo/vite.config.ts`
- `packages/ai-chat` 使用独立 `tsup` 配置文件 `packages/ai-chat/tsup.config.ts`
- `packages/compass-hooks` 与 `packages/compass-ui` 直接在 `package.json` 中内联 `tsup` 构建参数
- 测试配置分散在 `packages/ai-chat/jest.config.js`、`packages/compass-hooks/jest.config.js`、`packages/compass-ui/jest.config.js`、`packages/eslint-plugin-fsd-lint/jest.config.js`

## 平台要求

**开发环境：**

- 需要 Node.js `>=18` 与 pnpm `>=8`，约束位于 `package.json`
- 本地开发依赖 Turborepo、TypeScript、ESLint、Prettier、Jest；安装入口位于根 `package.json`
- 浏览器侧组件与 demo 依赖 DOM API、Fetch、ReadableStream、localStorage，对应实现位于 `packages/ai-chat/src/api/chat-stream.ts`、`packages/compass-hooks/README.md`

**生产环境：**

- 组件库产物以 `dist/` 形式输出并面向 npm 包消费，定义于 `packages/ai-chat/package.json`、`packages/compass-hooks/package.json`、`packages/compass-ui/package.json`、`packages/eslint-plugin-fsd-lint/package.json`
- 发布流程由根 `package.json` 的 `release` 脚本和 `.changeset/config.json` 驱动，目标是 npm registry
- `apps/docs` 产物是 Next.js `.next/` 目录，`apps/ai-chat-demo` 产物是 Vite `dist/` 目录；仓库内未检测到锁定的生产托管平台配置

---

_技术栈分析：2026-04-13_
