# Phase 2: 文档入口与验证统一 - Research

**Researched:** 2026-04-14
**Domain:** dumi 组件文档、公开示例 smoke 校验与现有 Jest 交互验证扩展
**Confidence:** HIGH

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

- Phase 2 以 `packages/compass-ui` 下的 dumi 文档站作为 `compass-ui` 的唯一对外文档主入口，不在这个阶段把 `apps/docs` 建成第二套并行入口。
- 文档导航、安装说明、组件页和 API 说明都围绕 dumi 站点收口，避免用户在多个入口之间切换心智模型。
- 组件 demo 继续以内嵌在 dumi 文档页中的示例为主，示例代码与文档源码同目录维护，不为 `compass-ui` 再新建独立 demo app 或 Storybook 站点。
- 所有示例必须只使用 `@xinghunm/compass-ui` 及其已声明的公开子路径消费，不允许回退到内部 alias、源码路径或仅仓库内可用的导入方式。
- Phase 2 的文档验证基线建立在现有 `docs:build` 与 Phase 1 的公开 API 验证链路之上，优先补齐“文档示例可被构建和 smoke 校验”这一层，而不是直接引入新的重型 E2E 体系。
- 文档、demo 与测试应共享同一套真实公开消费方式；如果某个示例只能在源码直连或 alias 下工作，就视为不合格。
- 这一阶段的 a11y / 键盘覆盖先聚焦核心交互组件与文档示例中的关键路径，在现有 Jest + Testing Library 体系内补最小但真实的键盘与可访问性验证。
- 不在 Phase 2 引入新的浏览器 E2E 测试框架作为前置条件；是否引入 Playwright 或更重的文档站交互测试，留待后续阶段或验证缺口明确后再决定。

### the agent's Discretion

- 文档信息架构的具体层级、命名和排序
- smoke 检查脚本的具体组织方式与命令拆分
- 哪些组件应被纳入“核心组件”首批验证名单

### Deferred Ideas (OUT OF SCOPE)

- 把 `apps/docs` 演进成统一的跨包文档门户
- 为 `compass-ui` 单独引入 Storybook 作为第二套 demo 入口
- 为文档站引入新的浏览器级 E2E 基础设施

</user_constraints>

<research_summary>

## Summary

Phase 2 不需要引入新的文档框架或测试基础设施，最优路径是把现有 `packages/compass-ui` dumi 站点升级成真正的单一公开入口，并把 Phase 1 已建立的“公开导入唯一真相源”推进到文档、demo 和验证脚本层。仓库已经有 `.dumirc.ts`、组件文档、`docs:build`、`verify-public-api.mjs` 以及 colocated Jest 测试，这意味着文档统一的成本主要在于整理入口、补 smoke 脚本和把关键交互验证补到现有测试中。

标准做法不是再新建一套 Storybook 或 `apps/docs` 站点，而是先让 dumi 站承担安装、API、组件演示和验证入口四件事。文档 smoke 以“构建必须通过 + markdown 示例不得引用内部路径 + 公开示例能与 tarball 消费方式一致”为基线即可。交互验证则应优先复用现有 Jest + Testing Library，对文档中高频组件增加键盘操作和基础可访问性断言，而不是在当前阶段引入新框架。

**Primary recommendation:** 继续以包内 dumi 为唯一公开入口，新增一条专门的文档公开导入 smoke 脚本，并在现有 Jest 组件测试中补齐首批键盘/a11y 覆盖。
</research_summary>

<standard_stack>

## Standard Stack

The established libraries/tools for this domain:

### Core

| Library                           | Version               | Purpose                         | Why Standard                                          |
| --------------------------------- | --------------------- | ------------------------------- | ----------------------------------------------------- |
| `dumi`                            | `^2.4.21`             | 组件文档、demo 嵌入与静态站构建 | 仓库已有完整文档源码与 `docs:build`，继续复用成本最低 |
| `jest` + `@testing-library/react` | `^29.7.0` / `^16.3.0` | 组件交互与可访问性测试          | 仓库现有 `compass-ui` 测试基线已成熟，无需另起一套    |
| `verify-public-api.mjs`           | repo-local            | 真实 tarball 公开 API 验证      | Phase 1 已证明它适合作为公开消费真相源                |

### Supporting

| Library                       | Version    | Purpose                              | When to Use                      |
| ----------------------------- | ---------- | ------------------------------------ | -------------------------------- |
| `@testing-library/user-event` | `^14.6.1`  | 键盘和用户交互模拟                   | 为核心组件补键盘与焦点行为时使用 |
| `rg` / Node 脚本扫描          | repo-local | 检测 markdown 内部导入和文档路径违规 | 构建前后快速 smoke 校验          |

### Alternatives Considered

| Instead of         | Could Use                          | Tradeoff                              |
| ------------------ | ---------------------------------- | ------------------------------------- |
| dumi 作为唯一入口  | `apps/docs` Next 站                | 信息架构更大，但当前会形成第二套入口  |
| 现有 Jest 交互测试 | Playwright / Storybook test runner | 覆盖更强，但 Phase 2 成本和切换面过大 |

**Installation:**

```bash
# Phase 2 预计不需要新增文档或测试框架依赖
pnpm --filter @xinghunm/compass-ui docs:build
pnpm --filter @xinghunm/compass-ui test
```

</standard_stack>

<architecture_patterns>

## Architecture Patterns

### Recommended Project Structure

```text
packages/compass-ui/
├── docs/                      # dumi 文档源码与内嵌 demo
├── scripts/                   # 文档与公开导入 smoke 脚本
├── src/<component>/           # 组件实现与 colocated 测试
└── .dumirc.ts                 # 文档入口与公开 alias
```

### Pattern 1: 单一文档入口

**What:** 安装、API、组件目录、示例和开发说明都从 `packages/compass-ui/docs` 收口。
**When to use:** 当前阶段需要统一用户入口但不想引入第二套站点。
**Example:**

```ts
// packages/compass-ui/.dumirc.ts
export default defineConfig({
  title: 'Compass UI',
  outputPath: 'docs-dist',
  alias: {
    '@xinghunm/compass-ui$': path.join(__dirname, 'src/index.ts'),
    '@xinghunm/compass-ui/theme': path.join(__dirname, 'src/theme/index.ts'),
    '@xinghunm/compass-ui/locale': path.join(__dirname, 'src/locale/index.ts'),
    '@xinghunm/compass-ui/icons': path.join(__dirname, 'src/icons/index.ts'),
  },
})
```

### Pattern 2: 构建 + 规则扫描的双层 smoke

**What:** `docs:build` 负责证明文档与 demo 可编译，脚本扫描负责阻止 markdown 中回流到内部导入。
**When to use:** 需要低成本保证“示例能构建，且消费方式真实”。
**Example:**

```bash
pnpm --filter @xinghunm/compass-ui docs:build
node packages/compass-ui/scripts/verify-docs-public-imports.mjs
```

### Pattern 3: 文档驱动的交互验证

**What:** 对文档中最核心的组件，在已有 Jest 测试里增加键盘与 a11y 断言。
**When to use:** 还不需要浏览器 E2E，但必须证明文档链路不是“只会静态渲染”。
**Example:**

```tsx
await user.keyboard('{Tab}{Enter}{ArrowDown}')
expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true')
```

### Anti-Patterns to Avoid

- **双入口并行:** 同时把 dumi 和 `apps/docs` 都当公开入口，只会复制导航和示例维护成本。
- **只依赖人工浏览:** 文档 smoke 没有自动化守护时，最先回归的通常就是示例导入路径。
- **为 Phase 2 直接上新 E2E 框架:** 在目标尚未统一前先加框架，会把注意力从“入口统一”转移到“基础设施建设”。
  </architecture_patterns>

<dont_hand_roll>

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem              | Don't Build                              | Use Instead                 | Why                                        |
| -------------------- | ---------------------------------------- | --------------------------- | ------------------------------------------ |
| 第二套组件 demo 平台 | 新 Storybook / 自定义演示站              | 继续用 dumi 页内 demo       | 仓库已内建 dumi，重新建站会复制内容        |
| 新的浏览器测试基线   | 先接入整套 Playwright 文档站 E2E         | 现有 Jest + `user-event`    | 当前只需最小交互闭环                       |
| 复杂 snippet 编译器  | 自己抽取 markdown AST 并二次编译所有示例 | `docs:build` + 导入规则扫描 | dumi 已会实际编译 demo，重复造轮子性价比低 |

**Key insight:** Phase 2 的瓶颈不是缺工具，而是当前已有工具没有被组织成统一的公开入口和验证闭环。
</dont_hand_roll>

<common_pitfalls>

## Common Pitfalls

### Pitfall 1: 文档入口看似统一，实际内容分散

**What goes wrong:** 首页、API、组件列表和开发说明分布在多个站点或多个无明确跳转的页面里。
**Why it happens:** 先做了文档内容，但没有先定义“唯一入口”和导航层级。
**How to avoid:** 先确定 dumi 站是 Phase 2 唯一入口，再围绕它重排首页和目录页。
**Warning signs:** 用户需要同时打开 `packages/compass-ui/docs` 和 `apps/docs` 才能找到安装或示例。

### Pitfall 2: 示例能在仓库里跑，发布后却失效

**What goes wrong:** 文档 demo 实际依赖内部 alias、源码路径或未声明的子路径。
**Why it happens:** 文档环境和外部消费者环境不一致。
**How to avoid:** 用公开导入规则扫描 + `verify-public-api.mjs` 的消费者夹具约束示例。
**Warning signs:** markdown 中出现 `src/`、`dist/`、组件级私有子路径或仅本地 alias 可解析的导入。

### Pitfall 3: 把 Phase 2 变成大规模测试基础设施重构

**What goes wrong:** 一边统一入口，一边新接 Storybook、Playwright、Next 文档站，结果任何一个都没收口。
**Why it happens:** 把“统一入口”和“长期平台化”混成一个阶段。
**How to avoid:** Phase 2 只用已有 dumi 与 Jest，保留后续扩展空间但不提前建设。
**Warning signs:** 新增的脚本和配置比文档内容调整还多。
</common_pitfalls>

<code_examples>

## Code Examples

Verified patterns from repository sources:

### 公开包名与子路径 alias

```ts
// Source: packages/compass-ui/.dumirc.ts
alias: {
  '@xinghunm/compass-ui$': path.join(__dirname, 'src/index.ts'),
  '@xinghunm/compass-ui/theme': path.join(__dirname, 'src/theme/index.ts'),
  '@xinghunm/compass-ui/locale': path.join(__dirname, 'src/locale/index.ts'),
  '@xinghunm/compass-ui/icons': path.join(__dirname, 'src/icons/index.ts'),
}
```

### 公开 API 真实消费者验证

```ts
// Source: packages/compass-ui/test-consumer/src/index.tsx
import { Button, ConfigProvider, defaultTheme } from '@xinghunm/compass-ui'
import { SearchIcon } from '@xinghunm/compass-ui/icons'
import { zhCN } from '@xinghunm/compass-ui/locale'
```

### 组件交互测试基线

```tsx
// Source: packages/compass-ui/src/select/select.test.tsx
render(<Select options={[...]} />)
await user.click(screen.getByRole('combobox'))
expect(screen.getByRole('listbox')).toBeInTheDocument()
```

</code_examples>

<sota_updates>

## State of the Art (2024-2025)

What's changed recently:

| Old Approach         | Current Approach             | When Changed               | Impact                           |
| -------------------- | ---------------------------- | -------------------------- | -------------------------------- |
| 文档与 demo 分离维护 | 文档页内嵌 demo 成为默认体验 | 近年组件库文档工具链稳定后 | 让文档和示例天然保持同步         |
| 只做静态 docs build  | 构建 + 真实消费 smoke 更重要 | 包导出和 subpath 更复杂后  | 需要验证“示例是否按公开导出工作” |
| 重平台优先           | 先用现有工具做闭环           | 近年 monorepo 工具链更成熟 | 先收口用户入口比新增平台更有价值 |

**New tools/patterns to consider:**

- repo-local 文档规则扫描脚本：低成本补齐导入约束
- 在现有 Jest 中补 `user-event` 键盘覆盖：避免过早引入新 E2E 基线

**Deprecated/outdated:**

- 依赖内部源码路径的文档示例：会与 npm 实际消费脱节
- 双文档入口并行维护：当前阶段价值密度不足
  </sota_updates>

<open_questions>

## Open Questions

1. **`apps/docs` 的长期定位**
   - What we know: 仓库已有 `apps/docs`，但 `compass-ui` 当前文档实际在包内 dumi
   - What's unclear: 未来是否要把多包文档统一迁入 `apps/docs`
   - Recommendation: 先在 Phase 2 明确“不迁移”，后续作为单独信息架构 phase 处理

2. **首批纳入 a11y / 键盘覆盖的核心组件范围**
   - What we know: `select`、`date-picker`、`dropdown`、`button`、`input-field` 都有现成测试基础
   - What's unclear: 是否要把 overlay 类组件一次性全部纳入
   - Recommendation: 先覆盖文档中高频且用户最容易直接上手的组件，复杂 overlay 的统一行为仍放到 Phase 4
     </open_questions>

<sources>
## Sources

### Primary (HIGH confidence)

- `.planning/PROJECT.md` - 项目目标与阶段边界
- `.planning/REQUIREMENTS.md` - `DOCS-01` 到 `DOCS-05`
- `.planning/phases/02-docs-entry-verification-unification/02-CONTEXT.md` - Phase 2 锁定决策
- `.planning/phases/01-public-api-release-baseline/*-SUMMARY.md` - Phase 1 的公开导入与验证前置条件
- `packages/compass-ui/.dumirc.ts` - 当前 dumi 文档配置
- `packages/compass-ui/docs/*` - 当前文档入口与组件页
- `packages/compass-ui/scripts/verify-public-api.mjs` - 现有公开 API 验证脚本
- `packages/compass-ui/src/*/*.test.tsx` - 现有交互测试模式

### Secondary (MEDIUM confidence)

- `.planning/codebase/CONVENTIONS.md` - 代码与文档约定
- `.planning/codebase/STRUCTURE.md` - apps/packages 结构边界
- `.planning/codebase/TESTING.md` - Jest 与 Testing Library 现有测试基线

### Tertiary (LOW confidence - needs validation)

- None
  </sources>

<metadata>
## Metadata

**Research scope:**

- Core technology: dumi 文档站、公开导入 smoke、Jest 交互验证
- Ecosystem: 仓库现有工具链
- Patterns: 单一文档入口、构建 + 规则扫描双层 smoke、文档驱动交互测试
- Pitfalls: 双入口并行、内部路径示例回流、测试基础设施过度扩张

**Confidence breakdown:**

- Standard stack: HIGH - 全部基于仓库现状与已验证工具
- Architecture: HIGH - 与 Phase 1 决策直接相连
- Pitfalls: HIGH - 都是当前仓库已知风险
- Code examples: HIGH - 全部来自本仓库

**Research date:** 2026-04-14
**Valid until:** 2026-05-14
</metadata>

---

_Phase: 02-docs-entry-verification-unification_
_Research completed: 2026-04-14_
_Ready for planning: yes_
