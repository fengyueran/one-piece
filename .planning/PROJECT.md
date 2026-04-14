# one-piece

## What This Is

这是我自己持续积累的一套可复用前端资产 monorepo，核心目标是把常用能力沉淀成可以长期维护、独立发布到 npm 的库。它首先服务我自己的项目复用需求，同时所有成熟产物都可以对外发布和被外部开发者使用。

当前仓库覆盖的方向包括 `React hooks`、`UI components`、`AI/chat`、`eslint plugin` 和工程配置等能力，其中当前阶段的主线是优先补强 `compass-ui`，把它做成一套完整且可持续扩展的 React 组件库。

## Core Value

用尽可能低的重复建设成本，持续沉淀一套能在真实项目里稳定复用、可独立发布、带完整文档和 demo 的前端资产。

## Current State

- `v1.0` 已于 2026-04-14 完成并通过 milestone audit
- `@xinghunm/compass-ui` 已具备公开导出、真实 pack 验证、文档站、基础组件闭环和复杂交互基础层
- 当前里程碑已完成 `22 / 22` 个 v1 requirement

## Next Milestone Goals

- 继续提升发布质量，处理 `publint` 的 `exports["."].types` warning 和 package `"type"` 建议
- 继续补齐高频展示组件，如 `badge`、`tag`、`avatar`、`list`、`card`
- 继续打磨 overlay 基础层，例如更强的 focus trap、body scroll lock 和层级管理
- 评估下一个 milestone 是否继续深挖 `compass-ui`，还是开始回补 `hooks` / 工程工具的对外体验

## Requirements

### Validated

- ✓ 已具备基于 `pnpm workspace` + `turbo` 的多包仓库结构，可同时承载 `apps/*`、`packages/*`、`tools/*` 并统一执行构建、测试、发布流程 — 已存在
- ✓ 已存在可独立发布的 `@xinghunm/compass-ui` 组件库，并带有 dumi 文档源码与文档构建产物 — 已存在
- ✓ 已存在可独立发布的 `@xinghunm/compass-hooks` hooks 库，可作为 UI 与业务包的底层依赖 — 已存在
- ✓ 已存在可独立发布的 `@xinghunm/ai-chat` 包，并配有 demo 应用与业务适配层验证实际接入方式 — 已存在
- ✓ 已存在 `eslint-plugin-fsd-lint` 这类工程向包，说明仓库已经不止承载 UI 资产，而是承载可复用开发工具 — 已存在
- ✓ 已具备 `apps/docs` 与 `apps/ai-chat-demo` 两类应用层入口，可分别承担文档展示与包级能力演示 — 已存在
- ✓ 已接入 Changesets、Husky、commitlint 等发布与提交质量工具链，具备对外发布 npm 包的基础能力 — 已存在
- ✓ `compass-ui` 已具备公开导出、pack 校验、文档站、基础组件闭环与复杂交互基础层 — v1.0

### Active

- [ ] 继续打磨发布质量，消除 `publint` 与类型分发表层 warning
- [ ] 补齐高频展示组件，提升 `compass-ui` 的覆盖面与页面搭建效率
- [ ] 在现有复杂交互基础层之上继续增强 overlay 能力，而不是重新换底层
- [ ] 重新评估 `hooks`、`ai-chat`、工程工具在下一 milestone 中的投入优先级

### Out of Scope

- 不追求在当前阶段达到 Ant Design 级别的组件覆盖面 — 当前目标是高频复用和稳定交付，不是大而全
- 不优先投入移动端组件体系 — 当前仓库主要面向桌面端 React 复用场景
- 不先做复杂设计系统平台能力 — 例如 token 平台化、设计资产同步、重型规范平台，这些超出当前阶段价值密度
- 不把 `ai-chat` 作为当前阶段主线继续扩张 — 该包保留并维护，但当前资源优先投入 `compass-ui`
- 不急于追求组件库差异化定位 — 先补齐成熟框架中常用、稳定、真实可复用的基础能力

## Context

这个仓库已经是一个真实运行中的 brownfield monorepo，而不是从零开始的空项目。当前代码结构基于 `pnpm workspace`、`turbo` 和 Changesets，工作区下已有 `packages/compass-ui`、`packages/compass-hooks`、`packages/ai-chat`、`packages/eslint-plugin-fsd-lint`，以及 `apps/docs`、`apps/ai-chat-demo` 两个应用入口。

从现有代码地图来看，仓库已经具备“组件库 + hooks + AI/chat + 工程工具 + demo/docs” 的基础形态，但当前发展重点需要进一步聚焦，否则范围会过散。结合当前目标，这个项目接下来应把主要精力集中到 `packages/compass-ui`，优先补足成熟组件库中的高频常用组件，把文档、demo、测试、发布体验做扎实。

这个项目的定位不是纯粹的团队内部私有基础设施，也不是一开始就对标大型开源组件库的品牌化产品。更准确地说，它是“我自己的长期前端资产库”，但产物默认按公开 npm 包标准建设，也要求对外可安装、可阅读、可验证、可演示。

## Constraints

- **Tech stack**: 保持现有 monorepo 技术栈不大幅漂移 — 当前已建立 `pnpm workspace`、`turbo`、TypeScript、Jest、Changesets 的工作流基础，切换成本高且当前并非主要问题
- **Scope**: 当前阶段必须聚焦 `compass-ui` — 仓库能力面很广，如果不聚焦会导致各包都“半成品”
- **Documentation**: 对外发布的包必须具备完整文档和 demo — 这是你定义“做成了”的核心标准之一
- **Release**: 包需要能独立发布到 npm — 所有能力沉淀都应优先考虑包边界、导出面、版本管理与发布稳定性
- **Product strategy**: 当前不追求先做差异化 — 先向成熟框架学习，补齐常用能力，再决定是否继续走自有体系路线
- **Platform**: 当前不优先支持移动端组件体系 — 先把桌面端 React 复用场景打透

## Key Decisions

| Decision                                                                       | Rationale                                          | Outcome    |
| ------------------------------------------------------------------------------ | -------------------------------------------------- | ---------- |
| 仓库定位为个人长期复用资产库，但产物默认按公开 npm 包标准建设                  | 既满足自己复用，又不把资产封闭在内部项目里         | ✓ Good     |
| 当前阶段把 `compass-ui` 设为主线                                               | 现有包类型较多，必须先聚焦一个最能持续积累的核心包 | ✓ Good     |
| `compass-ui` 先按“完整组件库，尽量自给自足”的方向推进                          | 你希望掌握完整可复用能力，而不是先做轻封装集合     | ⚠️ Revisit |
| 组件能力优先参考成熟框架的常用组件覆盖                                         | 先解决高频复用需求，比提前追求独特性更有价值       | ✓ Good     |
| `ai-chat` 暂时保留，但不是当前优先投入对象                                     | 该能力已有基础沉淀，但当前主线不在这里             | ✓ Good     |
| 本阶段明确不追求 Ant Design 级覆盖、不优先做移动端、不先做复杂设计系统平台能力 | 通过明确边界避免范围失控                           | ✓ Good     |

## 演进规则

这个文档会在 phase 切换和 milestone 边界持续更新。

**每次 phase 切换后**（通过 `$gsd-transition`）：

1. 如果某些需求被证伪，移动到 `Out of Scope` 并写明原因
2. 如果某些需求被验证成立，移动到 `Validated` 并标注对应 phase
3. 如果出现新的需求，补充到 `Active`
4. 如果产生新的关键决策，补充到 `Key Decisions`
5. 如果 `What This Is` 已与实际方向漂移，及时更新

**每个 milestone 完成后**（通过 `$gsd-complete-milestone`）：

1. 全面复查所有章节
2. 重新检查 `Core Value` 是否仍然是正确优先级
3. 审查 `Out of Scope` 中的边界理由是否仍然成立
4. 用当前状态更新 `Context`

---

_最后更新：2026-04-14，完成 v1.0 milestone 后_
