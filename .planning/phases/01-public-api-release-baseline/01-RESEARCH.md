# Phase 1: 公开契约与发布基线 - Research

**Researched:** 2026-04-13
**Domain:** `packages/compass-ui` 的公开导出、类型分发、发布验证与 npm 发布流程
**Confidence:** HIGH

## User Constraints

- 未发现 `.planning/phases/01-public-api-release-baseline/*-CONTEXT.md`，因此本阶段没有额外的 phase-level locked decisions。
- 仍需遵守当前仓库已经确定的约束：
  - 先收口公开 API、`exports`、peer/runtime 与发布基线，再继续扩组件能力。
  - 文档、demo 与测试必须共享真实公开消费路径，不能继续依赖内部 alias 或源码路径。
  - 当前阶段聚焦 `packages/compass-ui`，不做大幅技术栈漂移。
  - 产物默认按公开 npm 包标准建设，必须可独立发布、可安装、可验证。
  - 项目文档必须使用中文；新增文件名与目录名必须保持 kebab-case；`index.*` 只能做 barrel 导出。

<phase_requirements>

## Phase Requirements

| ID      | Description                                                                                                                    | Research Support                                                                                         |
| ------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| PUBL-01 | 外部用户可以只通过 `package.json.exports` 中声明的公开入口使用 `@xinghunm/compass-ui`，不需要引用 `src/*` 或 `dist/*` 内部路径 | `exports` 必须成为唯一公开契约；现有 `src/*`/`dist/*` 文档引用与 README/导出不一致已被定位               |
| PUBL-02 | `@xinghunm/compass-ui` 的 peer 依赖、Node 与 pnpm 基线、包访问级别和版本发布策略在仓库内只有一套权威配置                       | 当前 `.changeset/config.json` 与包级 `publishConfig.access` 冲突，peer/engines 也过宽，需要统一权威来源  |
| PUBL-03 | 每次发布前都可以自动校验 `npm pack` 产物、类型分发和公开导出是否可用                                                           | 已验证 `publint`、tarball 检查、subpath/type smoke test 是必要门禁，且当前仓库能复现真实失败             |
| PUBL-04 | 消费者项目可以通过公开包名安装并完成最小接入验证，而不依赖仓库内 alias 或源码直连                                              | 已验证 `pnpm pack` tarball + 外部临时消费者可做真实 smoke；当前 `npm pack` 路径会暴露 workspace 协议问题 |
| PUBL-05 | 仓库可以用稳定、可重复的发布流程把 `compass-ui` 发布到 npm，而不依赖人工经验记忆                                               | 已确认需要收口到单一 publish baseline、Changesets 策略、GitHub Actions OIDC trusted publishing           |

</phase_requirements>

## Summary

这个 phase 不是“补几个字段”这么简单，而是要把 `compass-ui` 的对外契约从“仓内能跑”改成“外部消费者按 npm 包方式也能稳定用”。当前仓库最关键的事实有四个。第一，`@xinghunm/compass-ui` 现在只开放根入口，`docs` 与 README 却已经依赖了未公开的深层路径和未导出的成员。第二，发布产物的真相源不统一：`.changeset/config.json` 仍是 `"access": "restricted"`，包级却写了 `"publishConfig.access": "public"`。第三，类型分发还没有达到双模块入口的标准形态；`publint` 已经明确给出 `types` 条件歧义警告。第四，仓库还没有 CI 级的 OIDC trusted publishing，也没有自动化的 tarball/消费者 smoke gate。

当前仓库已经能提供足够强的“现状证据”，planner 不需要再猜。2026-04-13 本地验证结果如下：

- `pnpm dlx publint packages/compass-ui` 报出 `pkg.exports["."].types` 在 `import` 条件下类型歧义，并建议显式拆分 `import.types` 与 `require.types`；同时建议补 `"type"` 字段。
- `npm pack --json` 产物中的 `package/package.json` 仍保留 `"@xinghunm/compass-hooks": "workspace:^"`；用这个 tarball 做临时消费者安装会直接得到 `EUNSUPPORTEDPROTOCOL`。
- `pnpm pack` 产物会把同一依赖重写成 `^0.1.0`，说明在 pnpm workspace 里，**实际发布物验证必须区分 `npm pack` 和 `pnpm pack`**。
- 基于 `pnpm pack` tarball 的外部临时消费者，根入口 `import { Button, ConfigProvider } from '@xinghunm/compass-ui'` 在补齐 `react`、`@types/react` 与 `tsc` lib 参数后可以通过 TypeScript smoke。
- 同样的外部消费者里，`import enUS from '@xinghunm/compass-ui/locale/en_US'` 会失败，说明当前 locale 深层路径不是“文档写法不优雅”，而是**根本没有进入公开契约**。
- README 的 quick start 使用 `defaultTheme`，但 `@xinghunm/compass-ui` 根入口并未导出它；`import { ThemeProvider, defaultTheme } from '@xinghunm/compass-ui'` 的消费者 smoke 失败。

**Primary recommendation:** 先把 `compass-ui` 的公开面收敛成“根入口 + 极少数明确子路径”的显式 `exports` 契约，并以 `pnpm pack`/真实消费者 smoke 作为发布物真相源，再把 `publint`、Changesets、OIDC trusted publishing 和基线校验串成一条固定发布链。

## Project Constraints

来自当前仓库工作约束，对 planner 有直接影响：

- 保持现有 `pnpm workspace + turbo + TypeScript + Jest + Changesets` 主链，不做重型换栈。
- Phase 1 不扩组件覆盖面，优先处理公开契约、消费方式、类型分发和发布流程。
- 文档与示例必须回到真实公开消费路径，不能继续依赖 `src/*`、`dist/*` 或 workspace alias。
- 任何新增脚本、fixture、workflow 文件都必须遵守 kebab-case。

## Standard Stack

### Core

| Library / Tool         | Version                                                 | Purpose                                     | Why Standard                                                                             |
| ---------------------- | ------------------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `package.json.exports` | Node.js `exports` 规范                                  | 定义唯一公开入口与 subpath 契约             | Node 官方推荐用它替代仅靠 `main` 的旧做法，并通过显式映射封装公开接口                    |
| `pnpm pack`            | pnpm `8.6.10`（仓库当前）                               | 生成 **workspace-aware** tarball 真正发布物 | pnpm 官方明确会在 pack/publish 时把 `workspace:` 重写成真实 semver；当前仓库已验证这一点 |
| `publint`              | `0.3.18`（2026-03-01）                                  | 检查导出、类型、包元数据问题                | 比手写校验更擅长发现 `exports/types` 歧义与生态兼容性问题                                |
| `@changesets/cli`      | 仓库当前 `2.29.5`；registry 最新 `2.30.0`（2026-03-03） | 版本编排、changelog、发布协调               | 这是当前仓库已采用的标准版本发布工具，不需要自造 release orchestration                   |
| npm Trusted Publishing | npm Docs 当前方案                                       | 用 OIDC 完成无长期 token 的发布             | npm 官方当前推荐方案；适合收口到可重复 CI 发布基线                                       |

### Supporting

| Library / Tool       | Version                                               | Purpose                                                  | When to Use                                                                     |
| -------------------- | ----------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `npm pack --json`    | npm `11.6.2`（本机）                                  | 看 packlist、大小、README/LICENSE 等是否正确进入 tarball | 用来做 packlist/体积诊断；**不要**单独把它当成 pnpm workspace 发布真相源        |
| TypeScript           | 仓库当前 `5.2.2`；registry 最新 `6.0.2`（2026-03-23） | 类型分发、消费者编译 smoke、`exports` 类型条件解析       | 本 phase 不要求升级到最新，只要求公开类型策略符合 TS 4.7+ 的 `exports` 解析规则 |
| `actions/setup-node` | npm OIDC 示例使用 `24`                                | 发布 workflow 的 Node 基线                               | 如果 Phase 1 引入 GitHub Actions OIDC，这里应与仓库最终 Node baseline 对齐      |

### Alternatives Considered

| Instead of                          | Could Use                                                        | Tradeoff                                                                                     |
| ----------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 以 `npm pack` 作为唯一 tarball 验证 | 以 `pnpm pack` 作为发布物真相源，再保留 `npm pack --json` 做诊断 | 当前仓库使用 pnpm workspace；`npm pack` 不会重写 `workspace:` 依赖，单独使用会得到误导性结果 |
| 长期 `NPM_TOKEN` 发布               | OIDC trusted publishing                                          | token 方案接入快，但长期凭证和 2FA 例外都更脆弱                                              |
| 一次性开放大量组件级 subpath        | 先开放少量稳定子路径（`theme`、`locale/*`、必要时 `icons`）      | 大量 subpath 会迅速放大维护面，Phase 1 不适合把组件级 API surface 一次性做宽                 |

**Installation:**

```bash
pnpm add -Dw publint
```

**Version verification:** 本 phase 不建议为了“追最新”而升级整条工具链，但建议 planner 明确区分“仓库当前版本”与“已核实的 registry 最新版本”：

```bash
npm view publint version
npm view @changesets/cli version
npm view typescript version
npm view tsup version
npm view react version
```

已核实结果（2026-04-13）：

- `publint`: `0.3.18`，发布于 2026-03-01
- `@changesets/cli`: `2.30.0`，发布于 2026-03-03
- `typescript`: `6.0.2`，发布于 2026-03-23
- `tsup`: `8.5.1`，发布于 2025-11-12
- `react`: `19.2.5`，发布于 2026-04-08

## Architecture Patterns

### Recommended Project Structure

```text
packages/compass-ui/
├── src/                         # 组件实现与对外 barrel
├── package.json                 # 唯一公开契约与发布元数据
├── tsconfig.json                # 类型输出基线
└── dist/                        # 可发布构建产物

scripts/release/
├── assert-public-exports.mjs    # 校验 docs/README 只能引用公开入口
├── verify-compass-ui-tarball.mjs
├── smoke-consumer-install.mjs
└── check-release-baseline.mjs

.github/workflows/
└── release.yml                  # OIDC trusted publishing
```

### Pattern 1: 公开导出清单先小后稳

**What:** `exports` 只开放 Phase 1 真正需要长期承诺的入口。根入口 `.` 保留全部主消费入口；第一波只补最有明确证据的子路径，比如：

- `./theme`
- `./locale/en_US`
- `./locale/zh_CN`
- `./icons`（仅当外部确实需要独立导入）

**When to use:** 需要把现有文档里的深层依赖改成稳定公开路径，但又不想在本 phase 一次性开放全部组件级 subpath。

**Why this pattern:** 当前 docs 中真正越界的主要是 theme/locale/type deep import，不是每个组件都需要独立 subpath。先做小而明确的公开面，后续组件级 subpath 可以在真实需求出现后再扩。

**Example:**

```json
{
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.mts",
        "default": "./dist/index.mjs"
      },
      "require": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    },
    "./theme": {
      "import": {
        "types": "./dist/theme/index.d.mts",
        "default": "./dist/theme/index.mjs"
      },
      "require": {
        "types": "./dist/theme/index.d.ts",
        "default": "./dist/theme/index.js"
      }
    },
    "./locale/en_US": {
      "types": "./dist/locale/en_US.d.ts",
      "default": "./dist/locale/en_US.js"
    }
  },
  "types": "./dist/index.d.ts",
  "main": "./dist/index.js"
}
```

Source: Node.js packages docs + TypeScript modules reference  
https://nodejs.org/api/packages.html  
https://www.typescriptlang.org/docs/handbook/modules/reference

### Pattern 2: 双入口必须拆分 `types`

**What:** 如果包继续同时发布 CJS (`require`) 和 ESM (`import`)，就不要让它们共享同一个顶层 `types` 映射。TypeScript 4.7+ 与 `publint` 都要求按 `import` / `require` 分开声明类型入口。

**When to use:** 当前 `compass-ui` 保持 `dist/index.js` + `dist/index.mjs` 双产物时。

**Current evidence:** `pnpm dlx publint packages/compass-ui` 已经对现状发出警告：`pkg.exports["."].types` 在 `import` 条件下会被解释成 CJS 类型，导致默认导入歧义。

**Example:**

```json
{
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.mts",
        "default": "./dist/index.mjs"
      },
      "require": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    }
  }
}
```

Source: TypeScript 4.7 release notes  
https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html

### Pattern 3: 发布物验证必须对齐真实 pack/publish 语义

**What:** 在 pnpm workspace 中，`pnpm pack` 才会把 `workspace:` 依赖改写成真正的 semver；`npm pack` 只适合做 packlist 诊断。

**When to use:** 仓库内任何有 workspace 依赖的可发布包。

**Current evidence:**

- `npm pack --json` 导出的 tarball `package.json` 里仍然是 `"@xinghunm/compass-hooks": "workspace:^"`
- `pnpm pack` 导出的 tarball `package.json` 里已经被重写成 `"@xinghunm/compass-hooks": "^0.1.0"`

**Implication for planner:** 如果 Phase 1 继续沿用 `changeset publish`，必须显式验证最终 publish 链到底用哪种 pack/publish 语义；否则“本地 pack 验证通过”与“真正发布成功”可能不是一回事。

### Anti-Patterns to Avoid

- **让 docs/README 成为未声明 API 的入口：** 当前 README 直接写了 `defaultTheme` 根导入，但根入口没导出它；这种文档先行、导出缺席的状态必须消灭。
- **继续允许 `src/*` / `dist/*` deep import：** `exports` 一旦存在，未列出的子路径就会被 Node/TS 阻断，文档继续写深层路径只会把故障外溢给消费者。
- **在双模块产物上只写一个裸 `types`：** 这正是 `publint` 当前报的坑。
- **用一次性 shell 命令人工检查发布：** planner 应把 pack、publint、消费者 smoke、changeset 状态检查变成脚本和 CI gate，而不是记忆性命令。

## Don't Hand-Roll

| Problem          | Don't Build                                   | Use Instead                                              | Why                                                          |
| ---------------- | --------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------ |
| 包公开面 lint    | 自写字符串 grep 判断 `exports`/types 是否完整 | `publint`                                                | 它已经覆盖常见的 `exports` / `types` / `type` / 条件分支陷阱 |
| tarball 内容检查 | 手工 `ls dist` 或只看 `files` 字段            | `pnpm pack` + 解包 tarball；必要时辅以 `npm pack --json` | 真正发布看的不是源码目录，而是打包后的 tarball               |
| 消费者验证       | 在 monorepo app 里直接 alias 到源码           | 外部临时 fixture / tarball smoke                         | 只有脱离 workspace alias 的安装才是真消费者路径              |
| 发布鉴权         | 长期 `NPM_TOKEN` + 人工 OTP                   | npm OIDC trusted publishing                              | 减少长期凭证、降低 2FA 例外与凭证泄露风险                    |
| 版本发布编排     | 自写 version/changelog 脚本                   | Changesets                                               | 当前仓库已采用；继续手写只会制造第二套真相源                 |

**Key insight:** Phase 1 最容易犯的错误不是“工具不够”，而是“明明已有成熟工具，却仍然让 README、`package.json`、手工命令和 CI 各自说不同的话”。

## Common Pitfalls

### Pitfall 1: 只看 `npm pack`，误判 workspace 包可发布

**What goes wrong:** 在 pnpm workspace 里，`npm pack` 产物保留 `workspace:^`，外部 `npm install` 直接失败。  
**Why it happens:** `npm pack` 不理解 pnpm 的 workspace 发布重写语义；pnpm 官方只保证 `pnpm pack` / `pnpm publish` 会转换。  
**How to avoid:** 把 `pnpm pack` 作为发布物真相源；如果仍保留 `npm pack --json`，只把它当 packlist/体积诊断。  
**Warning signs:** tarball 解包后的 `package.json` 仍出现 `workspace:`。

### Pitfall 2: `exports` 已开启，但 docs 还在教用户导 `src/*` 或 `dist/*`

**What goes wrong:** 外部用户照抄文档后，TypeScript/Node 直接解析失败。  
**Why it happens:** `exports` 的存在会阻断所有未列出的子路径，哪怕磁盘里文件真实存在。  
**How to avoid:** 建立脚本扫描 docs/README/stories，只允许引用 `exports` 白名单。  
**Warning signs:** 当前已存在：

- `packages/compass-ui/docs/components/date-picker.md` 使用 `@xinghunm/compass-ui/dist/locale/en_US`
- `packages/compass-ui/docs/components/config-provider.md` 使用 `@xinghunm/compass-ui/dist/locale/*`
- `packages/compass-ui/docs/components/tree-select.md` 使用 `@xinghunm/compass-ui/src/tree-select/types`
- `packages/compass-ui/docs/components/auto-complete.md` 使用 `@xinghunm/compass-ui/src/auto-complete/types`

### Pitfall 3: README 和根导出清单脱节

**What goes wrong:** 用户跟 README quick start 走，第一步就编译失败。  
**Why it happens:** 文档在引用 `defaultTheme`，但根 `src/index.ts` 没有导出它。  
**How to avoid:** Phase 1 必须把 README 也纳入 smoke；不是只校验 `dist`。  
**Warning signs:** 当前消费者 smoke 已验证 `defaultTheme` 根导入失败。

### Pitfall 4: 继续声明过宽 peer 范围

**What goes wrong:** `peerDependencies` 写成 `>=16.8.0`，但仓库实际只在 React 18 开发测试；未来外部用户在 React 16/17/19 的问题会全部变成你对外承诺的一部分。  
**Why it happens:** 想“看起来兼容更多版本”，但没有真实测试矩阵。  
**How to avoid:** peer 范围只能覆盖已验证矩阵。Phase 1 可以先收紧到已验证版本，再决定是否补 React 19 smoke。  
**Warning signs:** `package.json` peer 声明明显宽于 devDependencies 与 CI 测试矩阵。

### Pitfall 5: `declarationMap` 配了，但发布物没有 `.d.ts.map`

**What goes wrong:** 维护者以为编辑器能跳回源码，实际 tarball 里没有 declaration maps。  
**Why it happens:** `tsconfig.json` 打开 `declarationMap` 不等于 bundler 最终会把 `.d.ts.map` 带进发布物。当前 `tsup` 产物只有 `index.d.ts` / `index.d.mts`，没有 `.d.ts.map`。  
**How to avoid:** 把“是否真的产出并打包 `.d.ts.map`”变成可执行校验；如果 `tsup` 方案不满足，就把 declaration emit 切回 `tsc --emitDeclarationOnly`。  
**Warning signs:** `dist/` 中看不到 `.d.ts.map`，但团队仍假设 declarationMap 已生效。

### Pitfall 6: Changesets access 与包级 publishConfig 双重真相源

**What goes wrong:** 发布时到底按 public 还是 restricted，依赖调用链优先级和操作者经验。  
**Why it happens:** 当前 `.changeset/config.json` 是 `"restricted"`，但 `packages/compass-ui/package.json` 写了 `"publishConfig.access": "public"`。  
**How to avoid:** planner 必须指定一个唯一权威配置源，并让脚本校验另一个来源不得漂移。  
**Warning signs:** 修改 access 时只改了一个地方。

### Pitfall 7: 没有 OIDC workflow，却把 trusted publishing 写进文档

**What goes wrong:** 文档说支持无 token 发布，仓库里却没有 `.github/workflows/release.yml`。  
**Why it happens:** 发布流程停留在口头约定，没有进入仓库。  
**How to avoid:** workflow 文件、npm Trusted Publisher 页面配置、包名/工作流文件名要一起落地并验证。  
**Warning signs:** 仓库里不存在 `.github/workflows/`，但团队默认“之后再配”。

## Code Examples

官方模式的最小形态，建议直接作为 planner 的实现参考。

### 双入口 + 分离 `types`

```json
{
  "type": "module",
  "exports": {
    ".": {
      "import": {
        "types": "./types/esm/index.d.ts",
        "default": "./esm/index.js"
      },
      "require": {
        "types": "./types/commonjs/index.d.cts",
        "default": "./commonjs/index.cjs"
      }
    }
  },
  "types": "./types/index.d.ts",
  "main": "./commonjs/index.cjs"
}
```

Source:  
https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html

### GitHub Actions OIDC trusted publishing

```yaml
name: Publish Package

on:
  push:
    tags:
      - 'v*'

permissions:
  id-token: write
  contents: read

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: '24'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build --if-present
      - run: npm test
      - run: npm publish
```

Source:  
https://docs.npmjs.com/trusted-publishers/

## State of the Art

| Old Approach                     | Current Approach                      | When Changed                             | Impact                                               |
| -------------------------------- | ------------------------------------- | ---------------------------------------- | ---------------------------------------------------- |
| 只靠 `main` + 磁盘深层路径可见性 | 显式 `exports` / subpath exports      | Node.js 从 v12.7 起支持并推荐            | 未声明子路径会被彻底阻断，公开面必须显式建模         |
| 双入口共享单个 `.d.ts`           | `import.types` / `require.types` 分离 | TypeScript 4.7                           | 避免 ESM/CJS 类型判定歧义                            |
| 长期 `NPM_TOKEN` 发布            | npm trusted publishing（OIDC）        | npm 当前官方推荐流程                     | 减少长期凭证与 2FA 例外依赖                          |
| “monorepo 内能跑”就算消费者验证  | tarball + 外部临时消费者 smoke        | 当前组件库/包生态普遍采用的 release gate | 能提前暴露 workspace 协议、peer、类型与 exports 漏洞 |

**Deprecated/outdated:**

- 继续在公开文档中使用 `@xinghunm/compass-ui/src/*` 或 `@xinghunm/compass-ui/dist/*`：这不是向后兼容策略，而是直接泄漏内部结构。
- 在双 CJS/ESM 产物上只写单一顶层 `types`：`publint` 与 TS 4.7+ 都会把它视为高风险配置。

## Open Questions

1. **Phase 1 的首批 subpath 到底开放多宽？**
   - What we know: 现有证据明确指向 `theme`、`locale/*` 至少需要稳定公开路径；组件级 subpath 目前没有同等强度的需求证据。
   - What's unclear: 是否要在本 phase 一次性开放组件级入口。
   - Recommendation: Phase 1 只开放已经被文档/README/消费者明确需要的稳定子路径，不做组件级 surface 扩张。

2. **`defaultTheme` / `darkTheme` 应该留在根入口还是下沉到 `./theme`？**
   - What we know: README 当前假设根入口有 `defaultTheme`，但实现没有。
   - What's unclear: 对外产品定位是“根入口尽量全量”，还是“theme 独立子路径”。
   - Recommendation: 二选一并形成单一契约；不要让 README 和 `exports` 各说各话。若走 `./theme`，README 必须同步改。

3. **发布命令最终以 `changeset publish` 还是显式 `pnpm publish`/CI workflow 为准？**
   - What we know: pnpm 官方 pack/publish 会正确改写 `workspace:`，`npm pack` 不会；当前仓库 release 脚本是 `changeset publish`。
   - What's unclear: 当前 release 实际最终调用链是否满足 pnpm workspace 包的发布预期。
   - Recommendation: planner 把“明确最终发布命令语义并用同一语义做 dry-run/pack 验证”列为显式任务，不要默认它已经正确。

## Environment Availability

| Dependency              | Required By                                                         | Available | Version                             | Fallback                                              |
| ----------------------- | ------------------------------------------------------------------- | --------- | ----------------------------------- | ----------------------------------------------------- |
| Node.js                 | 本地构建、消费者 smoke、未来 release workflow 对齐                  | ✓         | `v24.13.0`                          | 若 CI 要求 LTS，可在 workflow 单独 pin 到最终决定版本 |
| pnpm                    | workspace-aware pack / install / script baseline                    | ✓         | `8.6.10`                            | 无；这是当前仓库主包管理器                            |
| npm CLI                 | registry 交互、`npm view`、`npm pack --json` 诊断、消费者安装 smoke | ✓         | `11.6.2`                            | 无                                                    |
| `publint`               | 包装 lint gate                                                      | △         | `0.3.18` 可通过 `pnpm dlx` 临时执行 | 建议加入根 devDependencies 和脚本                     |
| GitHub Actions workflow | OIDC trusted publishing                                             | ✗         | —                                   | 手工发布可临时继续，但不满足稳定可重复发布基线        |

**Missing dependencies with no fallback:**

- 仓库内缺少 `.github/workflows/release.yml`；如果要在 Phase 1 完成 OIDC trusted publishing，这一项没有真正等价的仓库内替代物。

**Missing dependencies with fallback:**

- `publint` 尚未固定到仓库依赖，但当前可用 `pnpm dlx publint packages/compass-ui` 先验证。

## Validation Architecture

### Test Framework

| Property           | Value                                                                                                                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework          | Jest `29.x`（现有单元测试） + 命令式 packaging/consumer smoke（Phase 1 需新增）                                                                                                                |
| Config file        | `packages/compass-ui/jest.config.js`                                                                                                                                                           |
| Quick run command  | `pnpm --filter @xinghunm/compass-ui build && pnpm dlx publint packages/compass-ui`                                                                                                             |
| Full suite command | `pnpm --filter @xinghunm/compass-ui test && pnpm --filter @xinghunm/compass-ui build && node scripts/release/verify-compass-ui-tarball.mjs && node scripts/release/smoke-consumer-install.mjs` |

### Phase Requirements → Test Map

| Req ID  | Behavior                                                  | Test Type     | Automated Command                                                   | File Exists? |
| ------- | --------------------------------------------------------- | ------------- | ------------------------------------------------------------------- | ------------ |
| PUBL-01 | README/docs/examples 只使用 `exports` 中声明的路径        | 静态契约检查  | `node scripts/release/assert-public-exports.mjs`                    | ❌ Wave 0    |
| PUBL-02 | peer / engines / access / packageManager 只有一套权威配置 | 策略断言      | `node scripts/release/check-release-baseline.mjs`                   | ❌ Wave 0    |
| PUBL-03 | tarball、类型分发、`exports` 与 `publint` 全部通过        | 集成          | `node scripts/release/verify-compass-ui-tarball.mjs`                | ❌ Wave 0    |
| PUBL-04 | 外部消费者可安装 tarball 并通过最小 TS smoke              | 消费者 smoke  | `node scripts/release/smoke-consumer-install.mjs`                   | ❌ Wave 0    |
| PUBL-05 | 发布流程可在 CI 中稳定重复执行并使用 OIDC                 | CI / 流程验证 | `pnpm changeset status --verbose` + `.github/workflows/release.yml` | ❌ Wave 0    |

### Sampling Rate

- **Per task commit:** `pnpm --filter @xinghunm/compass-ui build && pnpm dlx publint packages/compass-ui`
- **Per wave merge:** `pnpm --filter @xinghunm/compass-ui test && node scripts/release/verify-compass-ui-tarball.mjs`
- **Phase gate:** 完整 tarball 校验 + 外部消费者 smoke + release workflow 静态审查全部通过后再进入 `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `scripts/release/assert-public-exports.mjs` — 扫描 README/docs/stories，阻止 `src/*` / `dist/*` / 未声明 subpath
- [ ] `scripts/release/check-release-baseline.mjs` — 收口 `peerDependencies`、`engines`、`packageManager`、`publishConfig.access`、`.changeset/config.json`
- [ ] `scripts/release/verify-compass-ui-tarball.mjs` — 同时覆盖 `pnpm pack` tarball 解包、`publint`、`d.ts(.map)`、公开成员 smoke
- [ ] `scripts/release/smoke-consumer-install.mjs` — 用临时目录安装 tarball，验证根入口与首批 subpath
- [ ] `.github/workflows/release.yml` — OIDC trusted publishing 与发布前验证
- [ ] 根 `package.json` scripts — 把上述校验串成单一 `verify:compass-ui-release` 入口

## Sources

### Primary (HIGH confidence)

- Node.js Packages 文档：`exports`、subpath exports、conditional exports、`type` 字段  
  https://nodejs.org/api/packages.html
- TypeScript Modules Reference：`exports` 解析、显式 `types` 条件、subpath pattern、`exports` 阻断未声明子路径  
  https://www.typescriptlang.org/docs/handbook/modules/reference
- TypeScript 4.7 Release Notes：双入口分离 `types`、`types` 条件应优先出现  
  https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html
- npm Docs：scoped public package 的 `--access public` 发布方式  
  https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/
- npm Docs：`publishConfig` 在发布时覆盖 `access`/`tag`/`registry` 等配置  
  https://docs.npmjs.com/cli/v11/configuring-npm/package-json/
- npm Docs：Trusted Publishers / OIDC / GitHub Actions `id-token: write`  
  https://docs.npmjs.com/trusted-publishers/
- pnpm Workspace 文档：`workspace:` 协议在 `pnpm pack` / `pnpm publish` 时会被重写成真实 semver  
  https://pnpm.io/workspaces

### Secondary (MEDIUM confidence)

- Changesets 官方 README：`.changeset/config.json.access` 与包级 `publishConfig` 的优先级说明，以及标准 `version` / `publish` 工作流  
  https://github.com/changesets/changesets/blob/main/packages/cli/README.md
- publint 官方 README：包装错误 lint 工具与 CLI 用法  
  https://github.com/publint/publint

### Tertiary (LOW confidence)

- 无。当前关键结论都已有官方文档或本地可复现实证支撑。

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - 关键建议都由官方文档与本地 tarball/消费者验证共同支持。
- Architecture: HIGH - 当前仓库已实证暴露 `exports`、README、docs、workspace pack 行为的具体失败。
- Pitfalls: HIGH - 大部分不是抽象推断，而是 2026-04-13 本地命令已复现。

**Research date:** 2026-04-13  
**Valid until:** 2026-05-13
