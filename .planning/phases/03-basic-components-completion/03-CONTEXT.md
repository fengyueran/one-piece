# Phase 3: 基础组件补齐 - Context

**Gathered:** 2026-04-14
**Status:** Ready for planning

<domain>
## Phase Boundary

把 `compass-ui` 补齐成一个能覆盖常见布尔选择、文本输入、页面反馈、空态和加载态的基础组件库闭环。这个阶段的重点是提供外部用户真正高频会直接拿来用的基础组件，并让它们遵循已经在 Phase 1 和 Phase 2 收口好的公开 API、文档和验证链路。

这个阶段不解决复杂 overlay、选择器键盘导航或更大范围的展示型组件扩张。`select`、`tree-select`、`date-picker`、`dropdown` 等复杂交互的一致性问题继续留在 Phase 4。

</domain>

<decisions>
## Implementation Decisions

### 基础组件范围

- **D-01:** Phase 3 只覆盖 roadmap 已锁定的 `checkbox`、`radio`、`switch`、`input`、`textarea`、`alert`、`empty`、`skeleton`、`spin-loading`，不额外扩展示型组件。
- **D-02:** `checkbox`、`radio`、`switch` 被视为一组“布尔选择控件”，需要共享一致的尺寸、禁用、错误、受控/非受控和文档叙事，但不在这个阶段重做整套表单引擎。

### Input 标准化策略

- **D-03:** `COMP-04` 的核心不是从零再造一个输入框，而是把现有 `InputField` 收口成语义更清晰的 `Input` 门面组件。
- **D-04:** `InputField` 允许在一个阶段内继续作为兼容导出保留，但新文档、新示例和公开推荐写法必须以 `Input` 为主。
- **D-05:** `Textarea` 需要和 `Input` 共享尽可能一致的状态与尺寸 API，例如 `size`、`status`、`disabled`、`invalid` 一类输入语义。

### 页面状态组件策略

- **D-06:** `alert`、`empty`、`skeleton`、`spin-loading` 是页面内或区块级基础反馈组件，不承担 `message`、`modal`、`drawer` 这类 overlay / portal 角色。
- **D-07:** `spin-loading` 采用独立公开组件而不是只作为某个组件内部私有 loading 表现，命名与目录保持 `SpinLoading` / `spin-loading` 对应关系。

### 文档与验证约束

- **D-08:** Phase 3 新增组件必须同步提供公开 API 文档、可运行示例和自动化验证；不允许先落实现再把文档和测试留到后面补。
- **D-09:** 文档继续只走 `@xinghunm/compass-ui` 及已声明公开子路径；Phase 3 不新增新的公开子路径，所有基础组件都应从根入口消费。

### the agent's Discretion

- `Input` 与 `InputField` 的兼容层是“别名重导出”还是“包装组件”
- `checkbox` / `radio` 是否需要独立 group 组件以及其 API 细节
- `empty`、`skeleton`、`spin-loading` 与 `table`、`form` 的最小集成点

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 项目与阶段边界

- `.planning/PROJECT.md` — 项目定位、对外发布目标和“文档 + demo + 可发布”的成功标准
- `.planning/REQUIREMENTS.md` — Phase 3 对应的 `COMP-01` 到 `COMP-07`
- `.planning/ROADMAP.md` — Phase 3 的目标、依赖和成功标准
- `.planning/STATE.md` — 当前项目状态与阶段位置

### 前置阶段约束

- `.planning/phases/01-public-api-release-baseline/01-01-SUMMARY.md` — 公开导出与消费边界
- `.planning/phases/01-public-api-release-baseline/01-02-SUMMARY.md` — 真实消费者校验基线
- `.planning/phases/02-docs-entry-verification-unification/02-02-SUMMARY.md` — 文档 smoke 与 `docs:verify:compass-ui`
- `.planning/phases/02-docs-entry-verification-unification/02-03-SUMMARY.md` — 核心组件文档与测试必须共享真实公开消费方式

### 当前组件与文档入口

- `packages/compass-ui/src/index.ts` — 根入口导出面
- `packages/compass-ui/src/input-field/` — 现有输入组件实现与测试
- `packages/compass-ui/src/form/` — 表单集成边界
- `packages/compass-ui/src/table/` — 当前已有空态与 loading 场景的代表性消费点
- `packages/compass-ui/docs/components/index.md` — 当前组件目录页
- `packages/compass-ui/docs/API.md` — 当前公开 API 说明

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `packages/compass-ui/src/input-field/*`：已经提供文本输入的样式、交互和测试基线，适合作为 `Input` 标准化的实现基础。
- `packages/compass-ui/src/form/*`：已经有 `Form` / `FormItem` / 校验体系，布尔选择控件优先与现有表单语义兼容，而不是重建一套提交机制。
- `packages/compass-ui/src/table/*`：已经存在空态和 loading 场景，是 `Empty` 与 `SpinLoading` 的天然首批复用点。
- `packages/compass-ui/docs/components/*.md` 与 `docs:verify:compass-ui`：意味着新组件从第一天起就必须按公开导入路径提供文档和 smoke 校验。

### Established Patterns

- `compass-ui` 的组件目录通常遵循 `src/<component>/index.ts + <component>.tsx + <component>.styles.ts + types.ts + <component>.test.tsx`。
- 根 `src/index.ts` 是唯一门面入口，新基础组件都应从这里导出，而不是新增新的根级子路径。
- 文档和 README 当前都已经围绕公开导入方式组织，新组件应直接接入这套叙事。

### Integration Points

- `src/index.ts`：所有新基础组件最终都需要接入根入口
- `docs/components/index.md` 与 `docs/API.md`：Phase 3 结束后需要反映新的基础组件能力
- `docs:verify:compass-ui`：必须纳入每个 plan 的文档 smoke 验证

</code_context>

<specifics>
## Specific Ideas

- `checkbox` / `radio` / `switch` 最适合先做成表单兼容的基础控件，而不是加太多视觉变体。
- `Input` 应优先解决命名语义、文档推荐用法和下游组件复用，而不是追求大规模新特性。
- `alert`、`empty`、`skeleton`、`spin-loading` 应重点覆盖页面状态闭环，先服务真实消费场景，再考虑更复杂的组合能力。

</specifics>

<deferred>
## Deferred Ideas

- 在 Phase 3 内统一所有复杂选择器和 overlay 的焦点/键盘基础层
- 为基础组件引入额外公开子路径，如 `@xinghunm/compass-ui/feedback`
- 追求 Ant Design 级别的尺寸、主题和视觉变体覆盖面

</deferred>

---

_Phase: 03-basic-components-completion_
_Context gathered: 2026-04-14_
