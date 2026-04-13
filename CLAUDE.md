<!-- GSD:project-start source:PROJECT.md -->

## Project

**one-piece**

这是我自己持续积累的一套可复用前端资产 monorepo，核心目标是把常用能力沉淀成可以长期维护、独立发布到 npm 的库。它首先服务我自己的项目复用需求，同时所有成熟产物都可以对外发布和被外部开发者使用。

当前仓库覆盖的方向包括 `React hooks`、`UI components`、`AI/chat`、`eslint plugin` 和工程配置等能力，其中当前阶段的主线是优先补强 `compass-ui`，把它做成一套完整且可持续扩展的 React 组件库。

**Core Value:** 用尽可能低的重复建设成本，持续沉淀一套能在真实项目里稳定复用、可独立发布、带完整文档和 demo 的前端资产。

### Constraints

- **Tech stack**: 保持现有 monorepo 技术栈不大幅漂移 — 当前已建立 `pnpm workspace`、`turbo`、TypeScript、Jest、Changesets 的工作流基础，切换成本高且当前并非主要问题
- **Scope**: 当前阶段必须聚焦 `compass-ui` — 仓库能力面很广，如果不聚焦会导致各包都“半成品”
- **Documentation**: 对外发布的包必须具备完整文档和 demo — 这是你定义“做成了”的核心标准之一
- **Release**: 包需要能独立发布到 npm — 所有能力沉淀都应优先考虑包边界、导出面、版本管理与发布稳定性
- **Product strategy**: 当前不追求先做差异化 — 先向成熟框架学习，补齐常用能力，再决定是否继续走自有体系路线
- **Platform**: 当前不优先支持移动端组件体系 — 先把桌面端 React 复用场景打透
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->

## Technology Stack

## 语言

- TypeScript 5.x - 主体业务代码与库代码位于 `apps/docs/package.json`、`apps/ai-chat-demo/package.json`、`packages/ai-chat/package.json`、`packages/compass-hooks/package.json`、`packages/compass-ui/package.json`、`packages/eslint-plugin-fsd-lint/package.json`
- JavaScript - 工程配置与测试配置位于 `package.json`、`.eslintrc.js`、`packages/ai-chat/jest.config.js`、`packages/compass-hooks/jest.config.js`、`packages/compass-ui/jest.config.js`、`packages/eslint-plugin-fsd-lint/jest.config.js`
- Markdown - 包说明、开发说明与发布说明位于 `README.md`、`packages/ai-chat/README.md`、`packages/compass-ui/README.md`、`packages/compass-ui/docs/README.md`

## 运行时

- Node.js `>=18` - 根约束定义于 `package.json`
- 浏览器运行时 - React 应用与组件库面向 DOM 环境，目标配置位于 `apps/ai-chat-demo/tsconfig.json`、`apps/docs/tsconfig.json`、`packages/ai-chat/tsconfig.json`
- Next.js Node 服务运行时 - 文档站通过 `next dev` / `next build` / `next start` 运行，定义于 `apps/docs/package.json`
- pnpm `8.6.10` - 定义于 `package.json`
- Lockfile：已存在 `pnpm-lock.yaml`

## 框架与工具

- React 18 - 所有前端包和应用的基础 UI 运行时，定义于 `apps/docs/package.json`、`apps/ai-chat-demo/package.json`，并作为 peerDependency 出现在 `packages/ai-chat/package.json`、`packages/compass-hooks/package.json`、`packages/compass-ui/package.json`
- Next.js 13.5 - 文档站框架，定义于 `apps/docs/package.json`
- Vite 5 - demo 应用开发与打包框架，定义于 `apps/ai-chat-demo/package.json`，配置位于 `apps/ai-chat-demo/vite.config.ts`
- Jest 29 + ts-jest - 包级单元测试主框架，定义于 `packages/ai-chat/package.json`、`packages/compass-hooks/package.json`、`packages/compass-ui/package.json`、`packages/eslint-plugin-fsd-lint/package.json`
- Testing Library - React 组件测试工具，定义于 `packages/ai-chat/package.json`、`packages/compass-ui/package.json`、`packages/compass-hooks/package.json`
- Vitest 风格测试文件存在于 `apps/ai-chat-demo/src/lib/pde-plan-options-api.test.ts`、`apps/ai-chat-demo/src/lib/pde-stream-transform.test.ts`，但未检测到对应 `vitest` 依赖或独立配置文件
- Turborepo 1.10 - monorepo 任务编排，定义于 `package.json`，流水线配置位于 `turbo.json`
- tsup 7/8 - React 库构建器，定义于 `packages/ai-chat/package.json`、`packages/compass-hooks/package.json`、`packages/compass-ui/package.json`，配置位于 `packages/ai-chat/tsup.config.ts`
- TypeScript 5.x - 类型检查与声明文件输出，根依赖定义于 `package.json`，共享基线位于 `tools/tsconfig/base.json`
- Dumi 2.4 - `packages/compass-ui` 组件文档站生成，定义于 `packages/compass-ui/package.json`
- ESLint 8 + Prettier 3 - 代码规范与格式化，定义于 `package.json`，规则位于 `.eslintrc.js`
- Changesets - 版本编排与发布元数据，定义于 `package.json`，配置位于 `.changeset/config.json`
- Husky + lint-staged + commitlint - 本地提交质量门禁，定义于 `package.json`，hook 位于 `.husky/pre-commit`、`.husky/commit-msg`

## 关键依赖

- `@emotion/react` / `@emotion/styled` - `packages/compass-ui` 与 `packages/ai-chat` 的样式系统与 JSX runtime，定义于 `packages/compass-ui/package.json`、`packages/ai-chat/package.json`，`packages/ai-chat/tsconfig.json` 与 `packages/ai-chat/tsup.config.ts` 也直接依赖 Emotion 配置
- `axios` - `packages/ai-chat` 默认 HTTP 客户端，定义于 `packages/ai-chat/package.json`，使用位于 `packages/ai-chat/src/components/ai-chat-provider/index.tsx`、`packages/ai-chat/src/transport/default-chat-transport.ts`
- `zustand` - `packages/ai-chat` 的聊天状态管理，定义于 `packages/ai-chat/package.json`，上下文与 store 位于 `packages/ai-chat/src/context/use-chat-context.ts`、`packages/ai-chat/src/store/chat-store.ts`
- `react-markdown` + `remark-gfm` + `remark-math` + `rehype-katex` - `packages/ai-chat` 的消息渲染与 Markdown/数学公式支持，定义于 `packages/ai-chat/package.json`
- `@floating-ui/react`、`async-validator`、`date-fns`、`react-transition-group`、`react-window` - `packages/compass-ui` 的浮层、表单验证、日期处理、动效与长列表依赖，定义于 `packages/compass-ui/package.json`
- `turbo` - 根任务调度，定义于 `package.json`
- `@changesets/cli` - 根版本与发布工具，定义于 `package.json`
- `typescript` - 根类型系统，定义于 `package.json`
- `eslint` / `@typescript-eslint/*` / `eslint-plugin-react` / `eslint-plugin-react-hooks` - 根静态检查依赖，定义于 `package.json`

## Workspace 结构

- `apps/docs` - Next.js 文档站，注册于 `pnpm-workspace.yaml`，包清单位于 `apps/docs/package.json`
- `apps/ai-chat-demo` - Vite demo 应用，注册于 `pnpm-workspace.yaml`，包清单位于 `apps/ai-chat-demo/package.json`
- `packages/ai-chat` - AI 对话 React 组件库，包清单位于 `packages/ai-chat/package.json`
- `packages/compass-hooks` - 通用 React Hooks 库，包清单位于 `packages/compass-hooks/package.json`
- `packages/compass-ui` - React UI 组件库，包清单位于 `packages/compass-ui/package.json`
- `packages/eslint-plugin-fsd-lint` - FSD 结构校验 ESLint 插件，包清单位于 `packages/eslint-plugin-fsd-lint/package.json`
- `tools/tsconfig` - 共享 TypeScript 基线配置，文件位于 `tools/tsconfig/base.json`

## 配置

- Monorepo 包选择范围由 `pnpm-workspace.yaml` 定义，包含 `packages/*`、`apps/*`、`tools/*`
- Turbo 将 `**/.env.*local` 视为全局依赖，配置位于 `turbo.json`
- 检测到环境文件存在于 `apps/ai-chat-demo/.env` 与 `packages/ai-chat/.env`，内容未读取
- Demo 已知环境变量入口位于 `apps/ai-chat-demo/src/App.tsx` 与 `apps/ai-chat-demo/vite.config.ts`
- 根任务入口位于 `package.json`，统一通过 `turbo run build|dev|lint|test|clean` 调度
- Next.js 文档站配置入口位于 `apps/docs/package.json`
- Vite demo 构建入口位于 `apps/ai-chat-demo/package.json`，代理与 alias 配置位于 `apps/ai-chat-demo/vite.config.ts`
- `packages/ai-chat` 使用独立 `tsup` 配置文件 `packages/ai-chat/tsup.config.ts`
- `packages/compass-hooks` 与 `packages/compass-ui` 直接在 `package.json` 中内联 `tsup` 构建参数
- 测试配置分散在 `packages/ai-chat/jest.config.js`、`packages/compass-hooks/jest.config.js`、`packages/compass-ui/jest.config.js`、`packages/eslint-plugin-fsd-lint/jest.config.js`

## 平台要求

- 需要 Node.js `>=18` 与 pnpm `>=8`，约束位于 `package.json`
- 本地开发依赖 Turborepo、TypeScript、ESLint、Prettier、Jest；安装入口位于根 `package.json`
- 浏览器侧组件与 demo 依赖 DOM API、Fetch、ReadableStream、localStorage，对应实现位于 `packages/ai-chat/src/api/chat-stream.ts`、`packages/compass-hooks/README.md`
- 组件库产物以 `dist/` 形式输出并面向 npm 包消费，定义于 `packages/ai-chat/package.json`、`packages/compass-hooks/package.json`、`packages/compass-ui/package.json`、`packages/eslint-plugin-fsd-lint/package.json`
- 发布流程由根 `package.json` 的 `release` 脚本和 `.changeset/config.json` 驱动，目标是 npm registry
- `apps/docs` 产物是 Next.js `.next/` 目录，`apps/ai-chat-demo` 产物是 Vite `dist/` 目录；仓库内未检测到锁定的生产托管平台配置
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## 命名模式

- 业务源码文件与目录以 kebab-case 为主，典型路径见 `packages/compass-ui/src/button/button.tsx`、`packages/compass-hooks/src/use-local-storage/use-local-storage.ts`、`packages/ai-chat/src/components/chat-thread/components/questionnaire-card.tsx`。
- FSD ESLint 插件在 `packages/eslint-plugin-fsd-lint/src/rules/naming-convention.ts` 中明确校验 `src` 下文件/目录为 kebab-case，并允许 `index.*` 作为特例入口。
- 根仓库并没有统一自动校验所有包都接入这条规则；当前代码库存在框架约定文件名，例如 `apps/docs/pages/index.tsx`。
- 普通函数和 Hook 使用 camelCase，Hook 统一以 `use` 前缀命名，例如 `useChatContext`、`useChatStore`、`useLocalStorage`、`useAsync`，位置见 `packages/ai-chat/src/context/use-chat-context.ts`、`packages/compass-hooks/src/use-local-storage/use-local-storage.ts`。
- React 组件名使用 PascalCase，例如 `AiChatProvider`、`ConfigProvider`、`Button`，实现位置见 `packages/ai-chat/src/components/ai-chat-provider/index.tsx`、`packages/compass-ui/src/config-provider/config-provider.tsx`、`packages/compass-ui/src/button/button.tsx`。
- 普通变量使用 camelCase，布尔量常见 `is*` / `has*` 前缀，例如 `isStreaming`、`hasModels`，见 `packages/ai-chat/src/components/chat-composer/index.tsx`。
- 常量使用 SCREAMING_SNAKE_CASE，例如 `CHAT_COMPLETIONS_PATH`、`DEFAULT_AI_CHAT_LABELS`，见 `packages/ai-chat/src/api/chat-stream.ts`、`packages/ai-chat/src/types/index.ts`。
- 接口、类型别名、Props、泛型约束统一使用 PascalCase，并带语义后缀，例如 `AiChatProviderProps`、`ConfigProviderProps`、`ColumnType<DataType>`，见 `packages/ai-chat/src/components/ai-chat-provider/index.tsx`、`packages/compass-ui/src/table/table.test.tsx`。

## 代码风格

- 全仓库使用 Prettier，配置位于 `.prettierrc`。
- 当前格式设置：
- 提交前通过根目录 `package.json` 中的 `lint-staged` 对 `*.{js,jsx,ts,tsx,json,md,yml,yaml}` 执行 `prettier --write`。
- 根 ESLint 配置位于 `.eslintrc.js`，基于 `eslint:recommended`、`plugin:@typescript-eslint/recommended`、`plugin:react/recommended`、`plugin:react-hooks/recommended` 和 `prettier`。
- 当前显式规则：
- TypeScript 基线配置位于 `tools/tsconfig/base.json`，开启 `strict`、`strictNullChecks`、`declaration`、`declarationMap`、`esModuleInterop`、`forceConsistentCasingInFileNames`。

## Import 组织

- 包源码内部以相对路径为主，未检测到统一的根别名方案。
- `apps/ai-chat-demo/tsconfig.json` 单独声明了 `@xinghunm/ai-chat -> ../../packages/ai-chat/src/index.ts`，用于本地调试包源码。

## Index / Barrel 约束

- 包根入口和多数模块入口把 `index` 作为公共导出面，典型文件见 `packages/compass-hooks/src/index.ts`、`packages/compass-ui/src/index.ts`、`packages/ai-chat/src/transport/index.ts`、`packages/compass-ui/src/theme/index.ts`。
- Hooks 包的 `index` 基本是纯转发，例如 `packages/compass-hooks/src/use-async/index.ts`、`packages/compass-hooks/src/use-mounted/index.ts`。
- 代码库没有做到“所有 `index` 仅含 export”。以下 `index` 直接承载实现，不应被误判为纯 barrel：
- 以下 `index` 会做静态成员拼装，而不是纯转发：
- 新增目录优先继续使用“实现文件 + `index.ts` 作为公共出口”的方式，参考 `packages/compass-ui/src/button/button.tsx` + `packages/compass-ui/src/button/index.ts`。
- 如果确实需要在 `index` 上挂静态成员，沿用 `packages/compass-ui/src/modal/index.ts`、`packages/compass-ui/src/message/index.ts` 的做法，但不要把复杂业务逻辑塞进入口文件。

## 错误处理

- 边界型错误直接 `throw new Error(...)`，让调用方显式修复上下文使用方式，见 `packages/ai-chat/src/context/use-chat-context.ts`、`packages/ai-chat/src/components/ai-chat-provider/index.tsx`、`packages/compass-ui/src/select/context.ts`。
- I/O 或浏览器能力相关错误偏向 `try/catch` 后记录日志并降级，见 `packages/compass-hooks/src/use-local-storage/use-local-storage.ts`、`packages/compass-ui/src/form/form-item.tsx`、`packages/compass-ui/src/modal/confirm.tsx`。
- 解析/流式协议类代码倾向返回 `null` 跳过坏数据，再在真正异常时抛错，见 `packages/ai-chat/src/api/chat-stream.ts`。
- ESLint 插件提供统一安全包装，失败时返回回退值并 `console.warn`，见 `packages/eslint-plugin-fsd-lint/src/utils/safe.ts`。
- 运行时边界错误继续抛异常。
- 用户侧可恢复失败继续使用 `try/catch + console.error/warn + fallback`。
- 不要静默吞错；当前仓库至少会抛错、记录日志、或返回显式 `null`。

## 日志

- 未检测到统一日志库，主要使用 `console.error` 与 `console.warn`。
- UI/Hook 降级路径使用 `console.error`，例如 `packages/compass-hooks/src/use-local-storage/use-local-storage.ts`、`packages/ai-chat/src/components/chat-composer/hooks/use-chat-composer.ts`。
- 工具包安全兜底使用 `console.warn`，例如 `packages/eslint-plugin-fsd-lint/src/utils/safe.ts`。

## 注释

- 对外暴露的 Hook、Provider、transport API、规则文件常见 JSDoc/TSDoc，见 `packages/ai-chat/src/context/use-chat-context.ts`、`packages/ai-chat/src/api/chat-stream.ts`、`packages/eslint-plugin-fsd-lint/src/rules/naming-convention.ts`。
- 行内注释主要解释边界或兼容性决策，通常使用英文，见 `packages/ai-chat/src/components/ai-chat-provider/index.tsx`、`packages/compass-hooks/src/use-local-storage/use-local-storage.ts`。
- `ai-chat` 与 `eslint-plugin-fsd-lint` 的公开 API 注释最完整。
- `compass-ui`/`compass-hooks` 的组件与 Hook 注释密度较低；新增公共 API 时更适合按 `packages/ai-chat/src/context/use-chat-context.ts` 的粒度补齐注释。

## 函数设计

- Hook、工具函数多数保持短小，示例见 `packages/compass-hooks/src/use-async/use-async.ts`、`packages/ai-chat/src/context/use-chat-context.ts`。
- 复杂 UI 组件会集中在单文件中，尤其是 `packages/ai-chat/src/components/chat-composer/index.tsx`、`packages/compass-ui/src/select/select.tsx`、`packages/compass-ui/src/tree-select/tree-select.tsx`。
- 组件参数集中在 `Props` 接口里，优先使用对象参数。
- Hook 倾向显式泛型与默认参数，例如 `useAsync<TReturn>(fn, deps = [])`，见 `packages/compass-hooks/src/use-async/use-async.ts`。
- Hook 常返回元组或 selector 值，见 `packages/compass-hooks/src/use-local-storage/use-local-storage.ts`、`packages/ai-chat/src/context/use-chat-context.ts`。
- transport/API 工具返回 Promise，并通过回调暴露副作用，见 `packages/ai-chat/src/api/chat-stream.ts`。

## 模块设计

- `compass-ui` 以默认导出组件为主，再由包根做命名导出聚合，见 `packages/compass-ui/src/button/button.tsx`、`packages/compass-ui/src/index.ts`。
- `compass-hooks` 以命名导出为主，全部通过 `export *` 聚合，见 `packages/compass-hooks/src/index.ts`。
- `ai-chat` 混合使用命名导出与类型导出，包根入口显式列出公开 API，见 `packages/ai-chat/src/index.ts`。
- `eslint-plugin-fsd-lint` 对外使用 CommonJS 兼容导出 `export = plugin`，见 `packages/eslint-plugin-fsd-lint/src/index.ts`。
- 广泛使用，但当前并非全部纯导出。
- 新增模块优先保持 `index` 轻量，只负责公开 API；实现代码放在同目录的具名文件里。

## TypeScript / React 习惯

- 多数包开启 `strict: true`，并保留声明文件输出，见 `packages/compass-ui/tsconfig.json`、`packages/compass-hooks/tsconfig.json`、`packages/ai-chat/tsconfig.json`。
- React 组件以函数组件、`React.forwardRef`、Hooks 组合为主，见 `packages/compass-ui/src/button/button.tsx`、`packages/ai-chat/src/components/ai-chat-provider/index.tsx`。
- 样式层主要使用 Emotion，见 `packages/compass-ui/src/button/button.tsx`、`packages/ai-chat/src/components/ai-chat/index.tsx`。
- 状态管理未统一；`ai-chat` 使用 Zustand，见 `packages/ai-chat/src/context/use-chat-context.ts` 与 `packages/ai-chat/src/store/chat-store.ts`。
- 代码倾向不可变更新，尤其在 Zustand store 与复杂 state merge 中，见 `packages/ai-chat/src/store/chat-store.ts`、`packages/ai-chat/src/api/chat-stream.ts`。
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

## 模式概览

- 工作区边界由 `pnpm-workspace.yaml` 显式声明，只纳入 `apps/*`、`packages/*`、`tools/*`。
- 构建与任务调度集中在根目录 `package.json` 和 `turbo.json`，各 workspace 只实现自己的 `build`、`dev`、`test`、`lint`。
- 依赖方向以“应用消费包、上层包消费下层包、配置被复用”为主，当前未见循环依赖。
- 包级入口统一经由 `src/index.ts` 暴露，内部继续按目录分层，不要求消费者跨目录直连内部实现。
- 文档体系分成两条线：运行时文档站在 `apps/docs`，组件库自带 dumi 文档在 `packages/compass-ui/docs` 与 `packages/compass-ui/.dumirc.ts`。

## 分层结构

- Purpose: 统一管理 workspace、脚本、任务依赖、版本发布和提交钩子。
- Location: `package.json`、`pnpm-workspace.yaml`、`turbo.json`、`.changeset/config.json`、`.husky/pre-commit`、`.husky/commit-msg`
- Contains: 根脚本 `build/dev/lint/test/release`、workspace 声明、Turbo pipeline、Changesets、commit hook。
- Depends on: `pnpm`、`turbo`、`changesets`、`husky`、`commitlint`、`lint-staged`
- Used by: 所有 `apps/*`、`packages/*`、`tools/*`
- Purpose: 作为最终运行入口，组合内部包并提供演示或站点。
- Location: `apps/ai-chat-demo`、`apps/docs`
- Contains: Vite 应用入口 `apps/ai-chat-demo/src/main.tsx`、Next 页面入口 `apps/docs/pages/index.tsx`、应用级业务适配 `apps/ai-chat-demo/src/lib/*`
- Depends on: `packages/ai-chat`、`packages/compass-ui`、React 运行时
- Used by: 开发调试、组件演示、业务适配验证
- Purpose: 承载 monorepo 的核心可复用能力。
- Location: `packages/compass-hooks`、`packages/compass-ui`、`packages/ai-chat`、`packages/eslint-plugin-fsd-lint`
- Contains:
- Depends on:
- Used by: `apps/*` 或外部 npm 消费者
- Purpose: 提供跨包可复用的基础配置。
- Location: `tools/tsconfig/base.json`
- Contains: TypeScript 严格模式、声明输出、模块解析等基础编译选项。
- Depends on: TypeScript
- Used by: `packages/compass-hooks/tsconfig.json`、`packages/compass-ui/tsconfig.json`
- Purpose: 保存开发文档、实施计划与组件文档产物。
- Location: `docs/`、`docs/plans/`、`docs/superpowers/`、`packages/compass-ui/docs/`、`packages/compass-ui/docs-dist/`
- Contains: 项目规范、历史计划、架构设计稿、dumi 文档源码和静态产物。
- Depends on: Markdown 工具链与 `dumi`
- Used by: 人工阅读、文档站生成、实施计划沉淀

## 依赖方向

- `apps/ai-chat-demo/package.json`
- `apps/docs/package.json`
- `packages/ai-chat/package.json`
- `packages/compass-ui/package.json`

## 数据流

- `packages/ai-chat` 使用 `packages/ai-chat/src/store/chat-store.ts` 中的 `createChatStore()` 创建隔离 store。
- `packages/ai-chat/src/context/chat-context.ts` 持有 `store`、`transport`、标签和扩展点。
- UI 不直接请求后端；请求统一经 `transport` 与 `api/*` 完成，再由 store 驱动界面更新。
- `packages/compass-ui` 主要使用 React state/context；未见全局 store。

## 关键抽象

- Purpose: 把运行应用、复用库、共享配置、过程文档拆成独立目录。
- Examples: `apps/ai-chat-demo`、`packages/compass-ui`、`tools/tsconfig/base.json`、`docs/开发指南.md`
- Pattern: 根编排 + 子包自治
- Purpose: 为每个包定义稳定导出面。
- Examples: `packages/ai-chat/src/index.ts`、`packages/compass-hooks/src/index.ts`、`packages/compass-ui/src/index.ts`、`packages/eslint-plugin-fsd-lint/src/index.ts`
- Pattern: 顶层 barrel 导出，消费者不直接依赖深层文件
- Purpose: 把可变运行态从组件树中抽离，避免 props drilling。
- Examples: `packages/ai-chat/src/components/ai-chat-provider/index.tsx`、`packages/ai-chat/src/context/chat-context.ts`、`packages/compass-ui/src/config-provider/config-provider.tsx`
- Pattern: Provider 装配依赖，hooks/组件只消费上下文
- Purpose: 把后端协议与 UI 交互解耦。
- Examples: `packages/ai-chat/src/transport/default-chat-transport.ts`、`packages/ai-chat/src/api/chat-stream.ts`、`apps/ai-chat-demo/src/lib/pde-stream-transform.ts`
- Pattern: 默认 transport 提供通用 HTTP/SSE 适配，应用层通过 transform/render 扩展业务协议
- Purpose: 让每个组件目录内自带实现、类型、样式、测试。
- Examples: `packages/compass-ui/src/button/*`、`packages/compass-ui/src/form/*`、`packages/compass-ui/src/table/*`
- Pattern: “一个目录一个组件域”，必要时在目录内再拆 `styles`、`types`、`hooks`、`context`

## 入口点

- Location: `package.json`
- Triggers: `pnpm build`、`pnpm dev`、`pnpm lint`、`pnpm test`、`pnpm release`
- Responsibilities: 统一调度 Turbo pipeline 与发布命令
- Location: `apps/ai-chat-demo/src/main.tsx`
- Triggers: `pnpm --filter @one-piece/ai-chat-demo dev` 或根级 `pnpm dev`
- Responsibilities: 挂载 React 根节点并启动聊天演示应用
- Location: `apps/ai-chat-demo/src/App.tsx`
- Triggers: `main.tsx` 渲染
- Responsibilities: 装配 `AiChat`、配置 transport、绑定业务 block renderer 和问卷提交逻辑
- Location: `apps/docs/pages/index.tsx`
- Triggers: `pnpm --filter @one-piece/docs dev`
- Responsibilities: 提供独立 Next 文档站首页
- Location: `packages/ai-chat/src/index.ts`
- Triggers: 应用或外部消费者导入 `@xinghunm/ai-chat`
- Responsibilities: 暴露组件、provider、transport 和核心类型
- Location: `packages/compass-ui/src/index.ts`
- Triggers: 应用或外部消费者导入 `@xinghunm/compass-ui`
- Responsibilities: 暴露组件、主题能力和配置能力
- Location: `packages/compass-hooks/src/index.ts`
- Triggers: 其他包导入 `@xinghunm/compass-hooks`
- Responsibilities: 暴露 hooks 集合
- Location: `packages/compass-ui/.dumirc.ts`
- Triggers: `pnpm --filter @xinghunm/compass-ui docs:dev` 或 `docs:build`
- Responsibilities: 定义 dumi 站点导航、输出目录和 alias

## 错误处理

- `packages/ai-chat/src/api/chat-stream.ts` 在 SSE 读取、HTTP 状态异常、非流响应、后端错误包时抛出 `Error`，并通过 `onError` 回调上送。
- `packages/ai-chat/src/transport/default-chat-transport.ts` 只负责组装请求和转发回调，不在 UI 层散落 fetch 细节。
- `packages/ai-chat/src/store/chat-store.ts` 维护 `errorBySession`、`isStoppingBySession`、`isStreamingBySession`，把网络异常转为可渲染状态。
- `packages/ai-chat/src/components/chat-thread/index.tsx` 渲染错误态和 retry 按钮，而不是在深层消息组件里直接处理 transport 错误。
- `packages/compass-hooks/src/use-local-storage/use-local-storage.ts` 采用本地 `try/catch` 吞并记录 localStorage 错误，这是 hook 级边界处理。

## 横切关注点

<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.

<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.

<!-- GSD:profile-end -->
