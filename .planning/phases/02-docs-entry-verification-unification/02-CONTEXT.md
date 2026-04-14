# Phase 2: 文档入口与验证统一 - Context

**Gathered:** 2026-04-14
**Status:** Ready for planning

<domain>
## Phase Boundary

把 `compass-ui` 的对外文档入口、组件 demo 和自动化验证统一到同一条真实公开消费链路上。这个阶段只解决“如何让外部用户看得到、跑得通、验得到”的问题，不扩新组件能力，也不引入新的独立文档产品线。

</domain>

<decisions>
## Implementation Decisions

### 文档主入口

- **D-01:** Phase 2 以 `packages/compass-ui` 下的 dumi 文档站作为 `compass-ui` 的唯一对外文档主入口，不在这个阶段把 `apps/docs` 建成第二套并行入口。
- **D-02:** 文档导航、安装说明、组件页和 API 说明都围绕 dumi 站点收口，避免用户在多个入口之间切换心智模型。

### Demo 承载方式

- **D-03:** 组件 demo 继续以内嵌在 dumi 文档页中的示例为主，示例代码与文档源码同目录维护，不为 `compass-ui` 再新建独立 demo app 或 Storybook 站点。
- **D-04:** 所有示例必须只使用 `@xinghunm/compass-ui` 及其已声明的公开子路径消费，不允许回退到内部 alias、源码路径或仅仓库内可用的导入方式。

### 验证链路

- **D-05:** Phase 2 的文档验证基线建立在现有 `docs:build` 与 Phase 1 的公开 API 验证链路之上，优先补齐“文档示例可被构建和 smoke 校验”这一层，而不是直接引入新的重型 E2E 体系。
- **D-06:** 文档、demo 与测试应共享同一套真实公开消费方式；如果某个示例只能在源码直连或 alias 下工作，就视为不合格。

### 可访问性与交互覆盖

- **D-07:** 这一阶段的 a11y / 键盘覆盖先聚焦核心交互组件与文档示例中的关键路径，在现有 Jest + Testing Library 体系内补最小但真实的键盘与可访问性验证。
- **D-08:** 不在 Phase 2 引入新的浏览器 E2E 测试框架作为前置条件；是否引入 Playwright 或更重的文档站交互测试，留待后续阶段或验证缺口明确后再决定。

### the agent's Discretion

- 文档信息架构的具体层级、命名和排序
- smoke 检查脚本的具体组织方式与命令拆分
- 哪些组件应被纳入“核心组件”首批验证名单

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 项目与需求边界

- `.planning/PROJECT.md` — 项目定位、核心价值和“文档完整 + demo + 可发布”的成功标准
- `.planning/REQUIREMENTS.md` — Phase 2 对应的 `DOCS-01` 到 `DOCS-05`
- `.planning/ROADMAP.md` — Phase 2 的目标、依赖和成功标准

### 前置阶段约束

- `.planning/phases/01-public-api-release-baseline/01-01-SUMMARY.md` — 已确定公开子路径、dumi alias 和文档导入必须走公开 API
- `.planning/phases/01-public-api-release-baseline/01-02-SUMMARY.md` — 已确定 `verify-public-api.mjs` 与 `test-consumer` 作为真实消费者验证基线
- `.planning/phases/01-public-api-release-baseline/01-03-SUMMARY.md` — 已确定根级 `release:verify:compass-ui` 和发布前校验的唯一入口

### 当前文档与验证入口

- `packages/compass-ui/.dumirc.ts` — 当前 dumi 文档站配置、导航和公开导入 alias
- `packages/compass-ui/docs/index.md` — 文档首页入口
- `packages/compass-ui/docs/guide/getting-started.md` — 安装与公开导入示例
- `packages/compass-ui/docs/DEVELOPMENT.md` — 当前文档与发布流程说明

### 当前公开消费验证

- `packages/compass-ui/scripts/verify-public-api.mjs` — 真实 tarball 级别的公开 API 验证脚本
- `packages/compass-ui/test-consumer/src/index.tsx` — 最小消费者夹具，展示当前公共 API 消费方式

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `packages/compass-ui/docs/components/*.md` 与 `packages/compass-ui/docs/guide/*.md`：现成的 dumi 文档源码，可直接作为 Phase 2 的统一入口基础
- `packages/compass-ui/.dumirc.ts`：已经具备公开包名与子路径的 alias，可继续作为文档示例真实消费链路
- `packages/compass-ui/scripts/verify-public-api.mjs`：可复用来校验文档示例与最小消费者是否仍符合公开导出约束
- `packages/compass-ui/src/*/*.test.tsx`：现有 Jest + Testing Library 组件测试体系，适合扩充键盘与可访问性覆盖

### Established Patterns

- `compass-ui` 当前文档是包内 dumi 站点，不是 `apps/docs` 驱动的统一站点
- 公开示例必须只走 `package.json.exports` 暴露的入口，这是 Phase 1 已锁定的前提
- 发布前验证已经通过根级 `release:verify:compass-ui` 收口，Phase 2 应该在其之上补文档与 demo 验证，而不是重造第二套入口

### Integration Points

- `packages/compass-ui/docs/`：需要继续清理、统一和补示例
- `packages/compass-ui/package.json` 与根 `package.json`：可能需要补充文档 smoke 命令并接入根级验证链路
- `packages/compass-ui/src/*/*.test.tsx`：适合作为键盘与文档示例行为验证的落点

</code_context>

<specifics>
## Specific Ideas

- Phase 2 优先解决“单一入口 + 示例真实可跑 + smoke 可验证”，不要在这个阶段并行建设 `apps/docs`、Storybook 或新的展示壳
- 文档示例应尽量采用外部消费者最自然的导入方式；高频门面能力可以从根入口获取，资源型能力继续保留在公开子路径

</specifics>

<deferred>
## Deferred Ideas

- 把 `apps/docs` 演进成统一的跨包文档门户 — 这属于更高层级的信息架构工作，不是当前 Phase 2 的最短路径
- 为 `compass-ui` 单独引入 Storybook 作为第二套 demo 入口 — 会增加双份维护成本，应等现有 dumi 站稳定后再评估
- 为文档站引入新的浏览器级 E2E 基础设施 — 当前先用现有测试体系补齐最小闭环

</deferred>

---

_Phase: 02-docs-entry-verification-unification_
_Context gathered: 2026-04-14_
