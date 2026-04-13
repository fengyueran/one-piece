# 代码库结构

**分析日期：** 2026-04-13

## 目录布局

```text
one-piece/
├── apps/                     # 运行态应用与示例入口
│   ├── ai-chat-demo/         # Vite 示例应用，消费 `@xinghunm/ai-chat`
│   └── docs/                 # Next 文档站点
├── packages/                 # 可复用包与可发布产物
│   ├── ai-chat/              # AI chat 组件与传输层
│   ├── compass-hooks/        # 基础 React hooks
│   ├── compass-ui/           # React 组件库、主题与 dumi 文档
│   └── eslint-plugin-fsd-lint/ # FSD 约束 ESLint 插件
├── tools/
│   └── tsconfig/             # 共享 TypeScript 配置
├── docs/                     # 项目文档、计划、设计稿
├── .changeset/               # 发版元数据
├── .husky/                   # Git hooks
├── .planning/codebase/       # 代码地图产物
├── package.json              # 根脚本与开发依赖
├── pnpm-workspace.yaml       # workspace 声明
└── turbo.json                # pipeline 定义
```

## 目录职责

**`apps/`:**

- Purpose: 放置最终可运行应用、示例和站点。
- Contains:
  - `apps/ai-chat-demo/src/*`: demo UI 与业务协议适配
  - `apps/docs/pages/*`: Next 页面
- Key files: `apps/ai-chat-demo/src/main.tsx`、`apps/ai-chat-demo/src/App.tsx`、`apps/ai-chat-demo/vite.config.ts`、`apps/docs/pages/index.tsx`

**`packages/`:**

- Purpose: 放置 monorepo 核心可复用库与插件。
- Contains:
  - `packages/ai-chat/src/*`: 组件、context、store、api、transport、types
  - `packages/compass-hooks/src/*`: hook 目录切片
  - `packages/compass-ui/src/*`: 组件库与主题系统
  - `packages/eslint-plugin-fsd-lint/src/*`: ESLint 规则与工具
- Key files: `packages/ai-chat/src/index.ts`、`packages/compass-ui/src/index.ts`、`packages/compass-hooks/src/index.ts`、`packages/eslint-plugin-fsd-lint/src/plugin.ts`

**`tools/`:**

- Purpose: 放置共享配置与开发工具。
- Contains: 当前只有 `tools/tsconfig/base.json`
- Key files: `tools/tsconfig/base.json`

**`docs/`:**

- Purpose: 放置人工维护的项目说明、实现计划、设计文档。
- Contains: `docs/开发指南.md`、`docs/Git Commit 规范.md`、`docs/plans/*`、`docs/superpowers/*`
- Key files: `docs/开发指南.md`、`docs/plans/2026-03-31-ai-chat-generic-business-split.md`

**`packages/compass-ui/docs/`:**

- Purpose: 放置 dumi 组件文档源码。
- Contains: `packages/compass-ui/docs/components/*`、`packages/compass-ui/docs/guide/*`
- Key files: `packages/compass-ui/.dumirc.ts`、`packages/compass-ui/docs/index.md`

**`packages/compass-ui/docs-dist/`:**

- Purpose: 放置 dumi 构建后的静态产物。
- Contains: JS chunk、CSS chunk、静态文档页面产物
- Key files: `packages/compass-ui/docs-dist/umi.f6839bb7.js`

**`.changeset/`:**

- Purpose: 放置 changesets 配置与版本变更记录。
- Contains: `README.md`、`config.json`
- Key files: `.changeset/config.json`

**`.husky/`:**

- Purpose: 放置提交前钩子与 commitlint 入口。
- Contains: `pre-commit`、`commit-msg`
- Key files: `.husky/pre-commit`、`.husky/commit-msg`

## 关键文件位置

**Entry Points:**

- `package.json`: 根任务入口，负责 `turbo run` 与发布脚本。
- `apps/ai-chat-demo/src/main.tsx`: Vite 示例应用挂载点。
- `apps/ai-chat-demo/src/App.tsx`: 示例应用装配点。
- `apps/docs/pages/index.tsx`: Next 文档站首页。
- `packages/ai-chat/src/index.ts`: `@xinghunm/ai-chat` 对外导出入口。
- `packages/compass-hooks/src/index.ts`: `@xinghunm/compass-hooks` 对外导出入口。
- `packages/compass-ui/src/index.ts`: `@xinghunm/compass-ui` 对外导出入口。
- `packages/eslint-plugin-fsd-lint/src/index.ts`: ESLint 插件入口。

**Configuration:**

- `pnpm-workspace.yaml`: workspace 边界定义。
- `turbo.json`: pipeline 与缓存输出定义。
- `tools/tsconfig/base.json`: 共享 TS 编译选项。
- `packages/compass-ui/.dumirc.ts`: dumi 文档站配置。
- `apps/ai-chat-demo/vite.config.ts`: demo 应用构建配置。
- `packages/ai-chat/tsup.config.ts`: `ai-chat` 打包入口配置。

**Core Logic:**

- `packages/ai-chat/src/components/`: 聊天 UI 组件树。
- `packages/ai-chat/src/store/chat-store.ts`: 会话与消息状态。
- `packages/ai-chat/src/transport/default-chat-transport.ts`: 通用 transport 适配层。
- `packages/ai-chat/src/api/chat-stream.ts`: SSE 流读取与解析。
- `packages/compass-ui/src/theme/`: 主题 token、Provider 与工具。
- `packages/compass-ui/src/config-provider/`: locale 与主题装配层。
- `packages/eslint-plugin-fsd-lint/src/rules/`: 架构规则实现。

**Testing:**

- `packages/ai-chat/src/__tests__/`: `ai-chat` 测试目录
- `packages/compass-ui/src/*/*.test.tsx`: 组件目录内就地测试
- `packages/eslint-plugin-fsd-lint/test-project/`: 插件集成测试用例工程
- `apps/ai-chat-demo/src/lib/*.test.ts`: demo 业务适配测试

## 包结构模式

**`packages/ai-chat`:**

- 顶层按职责切分为 `components/`、`context/`、`store/`、`api/`、`transport/`、`types/`。
- `components/` 再按 UI 领域切为 `ai-chat/`、`ai-chat-provider/`、`chat-thread/`、`chat-composer/`、`chat-conversation-list/`。
- 每个复杂组件目录内部再拆 `components/`、`hooks/`、`lib/`，例如 `packages/ai-chat/src/components/chat-thread/` 与 `packages/ai-chat/src/components/chat-composer/`。
- 新的聊天功能代码优先落在对应组件域目录，而不是回填到 `src/index.ts`。

**`packages/compass-ui`:**

- 组件目录采用“一组件一目录”模式，例如 `packages/compass-ui/src/button/`、`packages/compass-ui/src/table/`、`packages/compass-ui/src/form/`。
- 典型目录包含 `index.ts`、`<component>.tsx`、`types.ts`、`*.styles.ts`、`*.test.tsx`。
- 横向基础设施集中在 `packages/compass-ui/src/theme/`、`packages/compass-ui/src/config-provider/`、`packages/compass-ui/src/icons/`、`packages/compass-ui/src/locale/`。
- 组件之间允许通过公共入口或近邻模块复用，例如 `table` 依赖 `pagination`，`date-picker` 依赖 `input-field`、`button` 与 `config-provider`。

**`packages/compass-hooks`:**

- 每个 hook 独立成目录，例如 `packages/compass-hooks/src/use-async/`、`packages/compass-hooks/src/use-local-storage/`。
- 每个目录使用 `index.ts` 转发真正实现文件，根 `src/index.ts` 再统一导出全部 hook。
- 新 hook 按相同目录粒度新增，不直接把多个 hook 堆在根目录。

**`packages/eslint-plugin-fsd-lint`:**

- 入口与装配在 `packages/eslint-plugin-fsd-lint/src/index.ts` 和 `packages/eslint-plugin-fsd-lint/src/plugin.ts`。
- 规则实现集中在 `packages/eslint-plugin-fsd-lint/src/rules/`。
- 规则共享逻辑集中在 `packages/eslint-plugin-fsd-lint/src/utils/`。
- 集成验证样例放在 `packages/eslint-plugin-fsd-lint/test-project/`。

## 命名约定

**Files:**

- 工作区目录使用 kebab-case: `apps/ai-chat-demo`、`packages/compass-ui`、`packages/eslint-plugin-fsd-lint`
- 包内功能目录也以 kebab-case 为主: `chat-thread`、`chat-conversation-list`、`input-number`
- 组件实现文件并不完全统一，当前既有 kebab-case 文件，也有框架习惯名:
  - kebab-case: `packages/ai-chat/src/components/chat-thread/components/result-summary-card.tsx`
  - Pascal 风格入口文件: `apps/ai-chat-demo/src/App.tsx`
- 文档文件存在中文文件名与空格，例如 `docs/Git Commit 规范.md`

**Directories:**

- workspace 级目录固定为 `apps`、`packages`、`tools`、`docs`
- 包内二级目录通常表达职责而不是技术类型，例如 `components`、`transport`、`theme`
- 组件/能力切片目录优先使用语义名称，例如 `button-base`、`config-provider`、`use-local-storage`

## 导入导出约定

**Package boundary:**

- 外部消费统一从包入口导入，例如 `@xinghunm/ai-chat`、`@xinghunm/compass-ui`。
- workspace 依赖不通过相对路径穿透其他包内部实现。

**Index files:**

- 包根入口 `src/index.ts` 用于汇总导出。
- 组件目录中的 `index.ts` / `index.tsx` 通常作为该目录公共 API，例如 `packages/compass-ui/src/button/index.ts`、`packages/ai-chat/src/components/ai-chat/index.tsx`。
- 复杂目录允许 `index` 内含装配逻辑，而不是纯 barrel。例如 `packages/ai-chat/src/components/ai-chat/index.tsx` 直接组合 provider 与子组件；`packages/compass-ui/src/form/index.ts` 负责给 `Form` 挂载静态成员。
- 新增目录时，应延续当前目录级入口习惯：对外导出的目录保留 `index`，内部实现放在同目录其他文件。

## 新代码放置规则

**New Application:**

- Primary code: `apps/<app-name>/`
- Entry files: `apps/<app-name>/src/main.tsx` 或框架默认入口
- Config: `apps/<app-name>/package.json`、`apps/<app-name>/tsconfig.json`

**New Demo-Specific Business Adapter:**

- Implementation: `apps/ai-chat-demo/src/lib/`
- UI rendering extension: `apps/ai-chat-demo/src/lib/*.tsx`
- App shell wiring: `apps/ai-chat-demo/src/App.tsx`

**New Reusable React Package:**

- Primary code: `packages/<package-name>/src/`
- Public entry: `packages/<package-name>/src/index.ts`
- Build config: `packages/<package-name>/package.json`、`packages/<package-name>/tsconfig.json`

**New `ai-chat` Capability:**

- Context/store changes: `packages/ai-chat/src/context/`、`packages/ai-chat/src/store/`
- Protocol changes: `packages/ai-chat/src/transport/`、`packages/ai-chat/src/api/`
- UI changes: `packages/ai-chat/src/components/<feature>/`
- Public exports: `packages/ai-chat/src/index.ts`

**New `compass-ui` Component:**

- Implementation: `packages/compass-ui/src/<component-name>/`
- Typical files:
  - `index.ts`
  - `<component-name>.tsx`
  - `types.ts`
  - `<component-name>.styles.ts`
  - `<component-name>.test.tsx`
- Public export registration: `packages/compass-ui/src/index.ts`
- Docs: `packages/compass-ui/docs/components/<component-name>.md`

**New Shared Hook:**

- Implementation: `packages/compass-hooks/src/<hook-name>/`
- Directory entry: `packages/compass-hooks/src/<hook-name>/index.ts`
- Root export: `packages/compass-hooks/src/index.ts`

**New ESLint Rule:**

- Rule file: `packages/eslint-plugin-fsd-lint/src/rules/<rule-name>.ts`
- Shared helpers: `packages/eslint-plugin-fsd-lint/src/utils/`
- Plugin registration: `packages/eslint-plugin-fsd-lint/src/plugin.ts`
- Integration sample: `packages/eslint-plugin-fsd-lint/test-project/`

**Utilities and Shared Config:**

- TypeScript shared settings: `tools/tsconfig/`
- Root-level process docs or plans: `docs/`

## 特殊目录

**`packages/compass-ui/docs-dist/`:**

- Purpose: dumi 静态构建输出
- Generated: Yes
- Committed: Yes

**`packages/compass-ui/.dumi/`:**

- Purpose: dumi 中间产物与临时目录
- Generated: Yes
- Committed: Yes

**`.turbo/`:**

- Purpose: Turbo 缓存与守护进程数据
- Generated: Yes
- Committed: No

**`.planning/codebase/`:**

- Purpose: 代码地图与分析文档
- Generated: Yes
- Committed: 按工作流决定，当前目录用于 GSD 产物

**`docs/plans/` 与 `docs/superpowers/`:**

- Purpose: 实施计划、架构设计稿与技能文档
- Generated: No
- Committed: Yes

## 放置规则

**Prefer package-local cohesion:**

- 与某个包强绑定的代码，放进对应包内部，不要塞到根目录 `tools/` 或 `docs/`。

**Prefer feature directory over global bucket:**

- `packages/ai-chat` 的 UI 逻辑优先放到 `components/<feature>/` 及其子目录，不要新增泛化的 `utils/` 目录承载本该归属某个组件域的代码。

**Prefer app-level adapters for business protocols:**

- 业务协议转换、业务块渲染和业务文案优先放在 `apps/ai-chat-demo/src/lib/` 一类应用目录，而不是写进 `packages/ai-chat/src/types/` 或 `packages/ai-chat/src/components/` 的通用层。

**Keep public surface explicit:**

- 任何需要给外部 workspace 或 npm 消费的模块，都要在对应包的 `src/index.ts` 注册；只供内部使用的实现留在子目录，不额外暴露。

---

_Structure analysis: 2026-04-13_
