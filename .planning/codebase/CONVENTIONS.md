# 编码约定

**分析日期：** 2026-04-13

## 命名模式

**文件：**

- 业务源码文件与目录以 kebab-case 为主，典型路径见 `packages/compass-ui/src/button/button.tsx`、`packages/compass-hooks/src/use-local-storage/use-local-storage.ts`、`packages/ai-chat/src/components/chat-thread/components/questionnaire-card.tsx`。
- FSD ESLint 插件在 `packages/eslint-plugin-fsd-lint/src/rules/naming-convention.ts` 中明确校验 `src` 下文件/目录为 kebab-case，并允许 `index.*` 作为特例入口。
- 根仓库并没有统一自动校验所有包都接入这条规则；当前代码库存在框架约定文件名，例如 `apps/docs/pages/index.tsx`。

**函数：**

- 普通函数和 Hook 使用 camelCase，Hook 统一以 `use` 前缀命名，例如 `useChatContext`、`useChatStore`、`useLocalStorage`、`useAsync`，位置见 `packages/ai-chat/src/context/use-chat-context.ts`、`packages/compass-hooks/src/use-local-storage/use-local-storage.ts`。
- React 组件名使用 PascalCase，例如 `AiChatProvider`、`ConfigProvider`、`Button`，实现位置见 `packages/ai-chat/src/components/ai-chat-provider/index.tsx`、`packages/compass-ui/src/config-provider/config-provider.tsx`、`packages/compass-ui/src/button/button.tsx`。

**变量：**

- 普通变量使用 camelCase，布尔量常见 `is*` / `has*` 前缀，例如 `isStreaming`、`hasModels`，见 `packages/ai-chat/src/components/chat-composer/index.tsx`。
- 常量使用 SCREAMING_SNAKE_CASE，例如 `CHAT_COMPLETIONS_PATH`、`DEFAULT_AI_CHAT_LABELS`，见 `packages/ai-chat/src/api/chat-stream.ts`、`packages/ai-chat/src/types/index.ts`。

**类型：**

- 接口、类型别名、Props、泛型约束统一使用 PascalCase，并带语义后缀，例如 `AiChatProviderProps`、`ConfigProviderProps`、`ColumnType<DataType>`，见 `packages/ai-chat/src/components/ai-chat-provider/index.tsx`、`packages/compass-ui/src/table/table.test.tsx`。

## 代码风格

**格式化：**

- 全仓库使用 Prettier，配置位于 `.prettierrc`。
- 当前格式设置：
  - 单引号：`singleQuote: true`
  - 无分号：`semi: false`
  - 尾随逗号：`trailingComma: all`
  - 行宽：`printWidth: 100`
  - 缩进：`tabWidth: 2`
- 提交前通过根目录 `package.json` 中的 `lint-staged` 对 `*.{js,jsx,ts,tsx,json,md,yml,yaml}` 执行 `prettier --write`。

**Lint：**

- 根 ESLint 配置位于 `.eslintrc.js`，基于 `eslint:recommended`、`plugin:@typescript-eslint/recommended`、`plugin:react/recommended`、`plugin:react-hooks/recommended` 和 `prettier`。
- 当前显式规则：
  - 关闭 `react/react-in-jsx-scope`
  - 关闭 `@typescript-eslint/explicit-module-boundary-types`
  - `@typescript-eslint/no-explicit-any` 为 `warn`
  - `@typescript-eslint/no-unused-vars` 为 `error`，但允许 `_` 前缀参数/变量
  - 测试文件 `*.test.ts(x)` 允许 `any`
- TypeScript 基线配置位于 `tools/tsconfig/base.json`，开启 `strict`、`strictNullChecks`、`declaration`、`declarationMap`、`esModuleInterop`、`forceConsistentCasingInFileNames`。

## Import 组织

**顺序：**

1. React、Emotion、axios、zustand 等外部依赖，见 `packages/compass-ui/src/button/button.tsx`、`packages/ai-chat/src/components/ai-chat-provider/index.tsx`。
2. 仓库内相对路径模块，通常先近后远，见 `packages/ai-chat/src/context/use-chat-context.ts`、`packages/compass-hooks/src/use-async/use-async.ts`。
3. 类型导入使用 `import type` 或内联 `type` 修饰，见 `packages/ai-chat/src/context/use-chat-context.ts`、`packages/ai-chat/src/components/ai-chat-provider/index.tsx`。

**路径别名：**

- 包源码内部以相对路径为主，未检测到统一的根别名方案。
- `apps/ai-chat-demo/tsconfig.json` 单独声明了 `@xinghunm/ai-chat -> ../../packages/ai-chat/src/index.ts`，用于本地调试包源码。

## Index / Barrel 约束

**当前主模式：**

- 包根入口和多数模块入口把 `index` 作为公共导出面，典型文件见 `packages/compass-hooks/src/index.ts`、`packages/compass-ui/src/index.ts`、`packages/ai-chat/src/transport/index.ts`、`packages/compass-ui/src/theme/index.ts`。
- Hooks 包的 `index` 基本是纯转发，例如 `packages/compass-hooks/src/use-async/index.ts`、`packages/compass-hooks/src/use-mounted/index.ts`。

**当前例外：**

- 代码库没有做到“所有 `index` 仅含 export”。以下 `index` 直接承载实现，不应被误判为纯 barrel：
  - `packages/ai-chat/src/components/ai-chat-provider/index.tsx`
  - `packages/ai-chat/src/components/ai-chat/index.tsx`
  - `packages/ai-chat/src/components/chat-composer/index.tsx`
- 以下 `index` 会做静态成员拼装，而不是纯转发：
  - `packages/compass-ui/src/form/index.ts`
  - `packages/compass-ui/src/modal/index.ts`
  - `packages/compass-ui/src/message/index.ts`

**新增代码建议：**

- 新增目录优先继续使用“实现文件 + `index.ts` 作为公共出口”的方式，参考 `packages/compass-ui/src/button/button.tsx` + `packages/compass-ui/src/button/index.ts`。
- 如果确实需要在 `index` 上挂静态成员，沿用 `packages/compass-ui/src/modal/index.ts`、`packages/compass-ui/src/message/index.ts` 的做法，但不要把复杂业务逻辑塞进入口文件。

## 错误处理

**模式：**

- 边界型错误直接 `throw new Error(...)`，让调用方显式修复上下文使用方式，见 `packages/ai-chat/src/context/use-chat-context.ts`、`packages/ai-chat/src/components/ai-chat-provider/index.tsx`、`packages/compass-ui/src/select/context.ts`。
- I/O 或浏览器能力相关错误偏向 `try/catch` 后记录日志并降级，见 `packages/compass-hooks/src/use-local-storage/use-local-storage.ts`、`packages/compass-ui/src/form/form-item.tsx`、`packages/compass-ui/src/modal/confirm.tsx`。
- 解析/流式协议类代码倾向返回 `null` 跳过坏数据，再在真正异常时抛错，见 `packages/ai-chat/src/api/chat-stream.ts`。
- ESLint 插件提供统一安全包装，失败时返回回退值并 `console.warn`，见 `packages/eslint-plugin-fsd-lint/src/utils/safe.ts`。

**使用建议：**

- 运行时边界错误继续抛异常。
- 用户侧可恢复失败继续使用 `try/catch + console.error/warn + fallback`。
- 不要静默吞错；当前仓库至少会抛错、记录日志、或返回显式 `null`。

## 日志

**框架：**

- 未检测到统一日志库，主要使用 `console.error` 与 `console.warn`。

**模式：**

- UI/Hook 降级路径使用 `console.error`，例如 `packages/compass-hooks/src/use-local-storage/use-local-storage.ts`、`packages/ai-chat/src/components/chat-composer/hooks/use-chat-composer.ts`。
- 工具包安全兜底使用 `console.warn`，例如 `packages/eslint-plugin-fsd-lint/src/utils/safe.ts`。

## 注释

**何时写注释：**

- 对外暴露的 Hook、Provider、transport API、规则文件常见 JSDoc/TSDoc，见 `packages/ai-chat/src/context/use-chat-context.ts`、`packages/ai-chat/src/api/chat-stream.ts`、`packages/eslint-plugin-fsd-lint/src/rules/naming-convention.ts`。
- 行内注释主要解释边界或兼容性决策，通常使用英文，见 `packages/ai-chat/src/components/ai-chat-provider/index.tsx`、`packages/compass-hooks/src/use-local-storage/use-local-storage.ts`。

**JSDoc/TSDoc：**

- `ai-chat` 与 `eslint-plugin-fsd-lint` 的公开 API 注释最完整。
- `compass-ui`/`compass-hooks` 的组件与 Hook 注释密度较低；新增公共 API 时更适合按 `packages/ai-chat/src/context/use-chat-context.ts` 的粒度补齐注释。

## 函数设计

**规模：**

- Hook、工具函数多数保持短小，示例见 `packages/compass-hooks/src/use-async/use-async.ts`、`packages/ai-chat/src/context/use-chat-context.ts`。
- 复杂 UI 组件会集中在单文件中，尤其是 `packages/ai-chat/src/components/chat-composer/index.tsx`、`packages/compass-ui/src/select/select.tsx`、`packages/compass-ui/src/tree-select/tree-select.tsx`。

**参数：**

- 组件参数集中在 `Props` 接口里，优先使用对象参数。
- Hook 倾向显式泛型与默认参数，例如 `useAsync<TReturn>(fn, deps = [])`，见 `packages/compass-hooks/src/use-async/use-async.ts`。

**返回值：**

- Hook 常返回元组或 selector 值，见 `packages/compass-hooks/src/use-local-storage/use-local-storage.ts`、`packages/ai-chat/src/context/use-chat-context.ts`。
- transport/API 工具返回 Promise，并通过回调暴露副作用，见 `packages/ai-chat/src/api/chat-stream.ts`。

## 模块设计

**导出方式：**

- `compass-ui` 以默认导出组件为主，再由包根做命名导出聚合，见 `packages/compass-ui/src/button/button.tsx`、`packages/compass-ui/src/index.ts`。
- `compass-hooks` 以命名导出为主，全部通过 `export *` 聚合，见 `packages/compass-hooks/src/index.ts`。
- `ai-chat` 混合使用命名导出与类型导出，包根入口显式列出公开 API，见 `packages/ai-chat/src/index.ts`。
- `eslint-plugin-fsd-lint` 对外使用 CommonJS 兼容导出 `export = plugin`，见 `packages/eslint-plugin-fsd-lint/src/index.ts`。

**Barrel 文件：**

- 广泛使用，但当前并非全部纯导出。
- 新增模块优先保持 `index` 轻量，只负责公开 API；实现代码放在同目录的具名文件里。

## TypeScript / React 习惯

- 多数包开启 `strict: true`，并保留声明文件输出，见 `packages/compass-ui/tsconfig.json`、`packages/compass-hooks/tsconfig.json`、`packages/ai-chat/tsconfig.json`。
- React 组件以函数组件、`React.forwardRef`、Hooks 组合为主，见 `packages/compass-ui/src/button/button.tsx`、`packages/ai-chat/src/components/ai-chat-provider/index.tsx`。
- 样式层主要使用 Emotion，见 `packages/compass-ui/src/button/button.tsx`、`packages/ai-chat/src/components/ai-chat/index.tsx`。
- 状态管理未统一；`ai-chat` 使用 Zustand，见 `packages/ai-chat/src/context/use-chat-context.ts` 与 `packages/ai-chat/src/store/chat-store.ts`。
- 代码倾向不可变更新，尤其在 Zustand store 与复杂 state merge 中，见 `packages/ai-chat/src/store/chat-store.ts`、`packages/ai-chat/src/api/chat-stream.ts`。

---

_约定分析：2026-04-13_
