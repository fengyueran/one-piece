# Phase 1 Research: 公开契约与发布基线

**阶段：** 1  
**阶段名：** 公开契约与发布基线  
**日期：** 2026-04-13  
**研究目标：** 回答“为了把 `@xinghunm/compass-ui` 的公开导出、消费方式、类型分发、发布验证和 npm 发布流程收口成一套稳定基线，规划阶段必须先知道什么？”

## 执行摘要

Phase 1 的关键不是改组件实现，而是把“对外承诺”收口成单一真相源。当前仓库已经具备 `pnpm workspace + turbo + Changesets + tsup` 的底座，但 `packages/compass-ui` 仍存在几类公开契约风险：

1. `package.json.exports` 只暴露根入口，而文档与 dumi 配置仍引用 `src/*` / `dist/*` 内部路径。
2. `publishConfig.access = "public"` 与根 `.changeset/config.json` 的 `"access": "restricted"` 冲突，发布意图不唯一。
3. peer/runtime 基线偏宽：`react` / `react-dom` 仍是 `>=16.8.0`，根 `engines` 仍是 Node `>=18`、pnpm `>=8`。
4. 发布前缺少面向“公开消费者”的自动校验链，当前只有 `lint / test / build`，没有 `npm pack`、导出面校验、包安装 smoke test。

这一步应优先建立四条基线：

- **导出基线**：所有公开能力必须通过 `exports` 显式声明，文档和 demo 只允许走公开导出。
- **类型基线**：`types`、`declarationMap`、导出条件顺序和 CJS/ESM 分发表达要能通过工具校验。
- **发布基线**：明确 Changesets / npm access / trusted publishing 的唯一方案。
- **验证基线**：每次发布前都能自动证明“打出来的包，外部项目真的能装、能导、能跑、能拿到类型”。

## 当前仓库现状

### 已有基础

- 根仓库已有 `turbo run lint test build --filter=./packages/* && changeset publish`，说明已经有统一发布入口，见 `package.json`。
- `packages/compass-ui/package.json` 已定义根导出：
  - `"main": "dist/index.js"`
  - `"module": "dist/index.mjs"`
  - `"types": "dist/index.d.ts"`
  - `"exports": { ".": { "types": "./dist/index.d.ts", "import": "./dist/index.mjs", "require": "./dist/index.js" } }`
- `packages/compass-ui/tsconfig.json` 已开启 `declaration` 和 `declarationMap`，这对公开类型体验是正确方向。
- `packages/compass-ui` 已声明 `"files": ["dist"]`，具备基本打包边界。

### 明确问题

- 文档直接依赖内部路径：
  - `packages/compass-ui/docs/components/tree-select.md`
  - `packages/compass-ui/docs/components/date-picker.md`
  - `packages/compass-ui/docs/components/auto-complete.md`
  - `packages/compass-ui/docs/components/config-provider.md`
- dumi alias 直接把 `@xinghunm/compass-ui/dist/locale` 指回源码，见 `packages/compass-ui/.dumirc.ts`。
- `publishConfig.access: "public"` 与 `.changeset/config.json` 的 `"access": "restricted"` 冲突。
- peer 依赖过宽：
  - `packages/compass-ui/package.json` 中 `react` / `react-dom` 是 `>=16.8.0`
- 引擎基线偏旧：
  - 根 `package.json` 中 `node >=18`、`pnpm >=8`

## 相关官方与主工具规则

### Node `exports` / subpath exports

根据 Node 官方包文档：

- `exports` 是比 `main` 更强的入口声明方式，可同时定义主入口和 subpath exports。
- 当定义了 `exports` 后，消费者只能导入被显式声明的入口。
- `exports` 目标路径必须以 `./` 开头，且不能越过包根目录。
- Node 官方也建议包作者显式声明 `type` 字段，避免 `.js` 文件在 CJS/ESM 间产生歧义。

这对当前项目的直接含义是：

1. `compass-ui` 后续若要公开 `theme`、`locale`、`icons` 等子路径，必须在 `exports` 里显式列出。
2. 文档与 demo 不能再假设 `src/*` / `dist/*` 可以直接导入，因为一旦发布，只有 `exports` 中声明的入口才是契约。
3. 如果继续保留 `main` / `module` / `types`，也要确保它们和 `exports` 指向一致，不出现“双重入口定义”。

### TypeScript `declarationMap`

TypeScript 官方说明：`declarationMap` 会为 `.d.ts` 生成对应映射，让编辑器能从声明跳回源码。  
当前 `packages/compass-ui/tsconfig.json` 已开启它，这应保留，不应回退。

对当前 phase 的意义：

- `declarationMap` 本身不是问题，问题是声明文件、CJS/ESM 入口和导出条件是否一致。
- Phase 1 更应补的是“打包后类型分发是否仍正确”的自动校验，而不是只看 `tsc` 是否成功。

### publint 规则

`publint` 对当前项目最相关的几条规则是：

- `exports.types` 条件要放在前面，避免 TypeScript 解析顺序问题。
- `exports` 的值必须是以 `./` 开头的相对路径。
- CJS/ESM 的类型和运行时代码要保持一致，避免“看起来能导入，类型却按另一种模块语义解释”的情况。

当前 `compass-ui` 的根导出已经把 `types` 放在 `import` / `require` 前，这是正确的；Phase 1 需要做的是把这套规则扩展到所有未来公开 subpath。

### npm Trusted Publishing

npm 官方文档当前推荐使用 OIDC trusted publishing：

- 通过 CI/CD 的 OIDC 直接发布 npm 包，避免长期存在的 write token。
- 官方文档明确写到：trusted publishing 需要 npm CLI `11.5.1+` 和 Node `22.14.0+`。
- GitHub Actions 场景至少需要：
  - `permissions.id-token: write`
  - `permissions.contents: read`

对当前项目的直接含义：

1. 如果要切 OIDC trusted publishing，根引擎基线就不能长期停在 Node 18。
2. 发布策略需要从“本地人工发布为主”转成“CI 可重复发布为主”，否则 trusted publishing 没有真正发挥价值。
3. 由于每个 npm package 一次只能配置一个 trusted publisher，必须先确定最终发布仓库与工作流文件名。

## 当前 phase 应采用的设计结论

### 1. 公开导出策略

Phase 1 应先把 `compass-ui` 的公开导出收成“少量、稳定、必要”的集合，不要一次把所有内部目录都暴露出去。

推荐首批公开入口：

- `.`：组件库根入口
- `./theme`：主题类型、provider、默认主题相关能力
- `./locale`：统一 locale 入口，而不是 `dist/locale/xx`
- `./icons`：如果确有对外需要，可作为单独子路径

当前阶段**不要**做：

- 不公开每个组件的 `./button`、`./table`、`./date-picker` 子路径
- 不公开 `types` 内部目录
- 不公开任何 `src/*` 对应映射

原因：

- 先收一个小而稳的导出面，更容易做发布验证。
- 一旦公开了大量 subpath，后续重构成本会被锁死。

### 2. 模块与类型分发策略

建议 Phase 1 采用“保持现有双产物输出，但补齐显式模块语义”：

- 保留 `dist/index.js` + `dist/index.mjs`
- 保留 `exports` 中的 `import` / `require`
- 明确决定是否给 `package.json` 增加 `"type"` 字段

倾向建议：

- 如果 `dist/index.js` 继续作为 CJS，且源码/构建链暂不准备全面切换 ESM 语义，则**不要**轻易把包顶层 `type` 改成 `module`。
- 先以 `exports` + 产物扩展名策略保证兼容性，再用 `publint` / `arethetypeswrong` 类工具核验。

### 3. peer / engines 基线策略

当前建议在 Phase 1 明确收口为：

- `react`: `^18.2.0 || ^19.0.0`
- `react-dom`: `^18.2.0 || ^19.0.0`
- Node 基线：如果准备切 OIDC trusted publishing，则同步提升到 `>=22.14.0`
- pnpm 基线：建议提升到 `>=10`

如果本 phase 不立刻上 OIDC，也至少应：

- 在计划中先拆成两个层次：
  - 先收口 peer 依赖范围和发布验证
  - 再决定是否同步升级 Node/pnpm 并切 trusted publishing

### 4. 发布策略唯一真相源

当前最危险的不是“发布功能缺失”，而是“发布规则冲突”。

必须在本 phase 明确：

- `.changeset/config.json` 的 `access`
- 每个 package 的 `publishConfig.access`
- 发布入口到底是根 `release` 脚本，还是未来改为 CI workflow

推荐方向：

- 若 `compass-ui` 明确是公开 npm 包，则 Changesets 层应与包层保持一致，不应继续 `restricted/public` 混用。
- 长期以 CI trusted publishing 为主，本地发布只保留为应急路径。

## 建议的验证命令

Phase 1 的计划里应优先引入以下验证命令：

### 包构建与导出验证

```bash
pnpm --filter @xinghunm/compass-ui build
pnpm pack --pack-destination /tmp/one-piece-pack-test --filter @xinghunm/compass-ui
```

### 静态导出/类型检查

```bash
pnpm exec publint packages/compass-ui
pnpm --filter @xinghunm/compass-ui test
pnpm --filter @xinghunm/compass-ui lint
```

### 消费者 smoke test

至少应有一个最小消费者夹具，验证：

- `import { Button } from '@xinghunm/compass-ui'`
- `import { ThemeProvider } from '@xinghunm/compass-ui/theme'`（如果该 subpath 被公开）
- `tsc --noEmit` 可通过
- 最小运行时 bundling 可通过

建议单独建立夹具目录，例如：

- `packages/compass-ui/test-consumer/`
- 或 `apps/compass-ui-consumer-smoke/`

但此 phase 更推荐用轻量夹具，而不是再拉一个完整 demo。

## 当前仓库最可能踩的坑

### 1. 文档先修不彻底

只改文档文案，不改 `dumi` alias 和真实导出，会让 Phase 1 看起来完成，实际 npm 用户仍然不能用。

### 2. 只做 `exports`，不做 smoke test

`exports` 写对不等于发布后可用。缺少 `npm pack + consumer fixture`，很容易出现：

- 路径声明存在，但文件未打进 tarball
- 类型路径存在，但 bundler / tsserver 解析失败
- demo 能跑，外部项目不能装

### 3. 一次性公开太多 subpath

这会在后续 Phase 2/3/4 锁死重构空间。Phase 1 的目标是“收口”，不是“暴露更多”。

### 4. 把 OIDC trusted publishing 和基础导出治理绑死在一个提交里

trusted publishing 依赖 CI、Node 基线、npm 配置和仓库工作流文件。导出治理则主要是包内契约。  
两者可以在同一 phase，但应该拆成不同 plan，而不是一锅端。

## 建议给 planner 的拆分思路

Phase 1 更适合拆成 3 个 plan：

1. **导出与消费路径收口**
   - 清理文档和配置中的内部路径依赖
   - 设计并实现首批公开 subpath exports
   - 建立公开入口唯一真相源

2. **发布验证与消费者 smoke test**
   - 引入 `publint`
   - 建立 `npm pack` 校验
   - 建立最小消费者夹具
   - 验证类型分发和最小运行时可用性

3. **发布策略与运行时基线收口**
   - 统一 Changesets / `publishConfig.access`
   - 收口 peer 依赖与 Node/pnpm 基线
   - 评估并落地 trusted publishing（或明确拆到后续子计划）

## Validation Architecture

Phase 1 的验证架构应按“静态契约 → 打包产物 → 消费者接入 → 发布流程”四层展开：

1. **静态契约层**
   - 校验 `package.json.exports`
   - 校验 `types` / `main` / `module` 一致性
   - 校验 `publishConfig.access` 与 Changesets 配置一致

2. **打包产物层**
   - 构建 `compass-ui`
   - 执行 `npm pack`
   - 检查 tarball 中是否包含预期导出文件与类型文件

3. **消费者接入层**
   - 在最小夹具中安装/引用打包产物
   - 执行 `tsc --noEmit`
   - 验证最小 bundling 或运行时引入成功

4. **发布流程层**
   - 发布命令可重复执行
   - CI 权限/工作流配置明确
   - 若启用 OIDC，验证 workflow 权限和版本基线满足 npm 官方要求

## 规划前仍需保持的边界

- 本 phase 不处理新组件实现
- 本 phase 不处理 Storybook / docs 最终单入口形态
- 本 phase 不治理 `select` / `tree-select` 等复杂交互细节
- 本 phase 不引入大规模样式体系重构

---

_Phase 1 research completed: 2026-04-13_
