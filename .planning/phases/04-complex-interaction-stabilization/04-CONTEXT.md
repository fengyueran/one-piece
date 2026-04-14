# Phase 4: 复杂交互稳态化 - Context

**Gathered:** 2026-04-14
**Status:** Ready for planning

<domain>
## Phase Boundary

把 `compass-ui` 里最脆弱的复杂交互组件收口成一套一致的键盘、焦点和关闭行为模型。这个阶段既要补齐 `Select` 的完整键盘导航，也要统一 `tree-select`、`date-picker`、`dropdown`、`tooltip` 的 overlay 行为；同时补上 `popover`、`popconfirm`、`drawer` 这些当前还不存在但 roadmap 已锁定的复杂交互组件。

这个阶段不是继续横向补普通基础组件，也不是一次性重构到新的 headless/UI primitive 体系。目标是让现有 `Floating UI` 路线变得稳定、可解释、可测试，并形成一份明确的基础层策略说明。

</domain>

<decisions>
## Implementation Decisions

### 范围边界

- **D-01:** Phase 4 只覆盖 `INTR-01` 到 `INTR-05`，也就是 `Select`、现有 overlay 组件的一致性，以及 `Popover` / `Popconfirm` / `Drawer` 三个新组件。
- **D-02:** 这一阶段不再补新的展示型组件或表单基础组件，所有实现都围绕复杂交互和 overlay 基础层展开。

### 基础层策略

- **D-03:** Phase 4 优先在现有 `@floating-ui/react` 基础上抽取共享交互约定或 helper，而不是在同一阶段整体迁移到 Radix、React Aria 等新体系。
- **D-04:** 新增的 `Popover`、`Popconfirm`、`Drawer` 必须建立在这套共享约定上，而不是各自复制一份打开/关闭/焦点逻辑。
- **D-05:** 这一阶段必须产出一份可读的“复杂交互基础层策略”说明，明确哪些能力继续自研、哪些继续依赖 `Floating UI`、哪些暂时不做。

### 交互与无障碍约束

- **D-06:** `Select` 必须补齐键盘打开、上下导航、选择、关闭和基础 `aria-*` 语义，不能只在鼠标场景可用。
- **D-07:** `tree-select`、`date-picker`、`dropdown`、`tooltip` 的焦点流和关闭条件要统一到可预测模型，例如外部点击、Escape、触发器失焦、overlay 内部点击等。
- **D-08:** `Tooltip` 继续保持“轻量提示”定位，不扩成可编辑/可交互内容容器；可交互浮层应优先落在 `Popover` / `Popconfirm`。
- **D-09:** `Drawer` 作为侧边 overlay，需要和 `Modal` 在 portal、mask、关闭和焦点约束上保持一致，但不要求在本阶段抽成统一 super-component。

### 文档与验证

- **D-10:** Phase 4 的文档承诺只写已经被自动化验证覆盖的交互行为，避免再次出现“文档说能用，键盘实际不通”的情况。
- **D-11:** 新增复杂交互组件和已有组件的交互修复，都必须接入 `docs:verify:compass-ui` 和 targeted Jest 测试，不引入新的测试框架。

### the agent's Discretion

- 共享 overlay helper 的具体组织方式与文件名
- `Popover` / `Popconfirm` 的 API 形态是否贴近 `Dropdown` / `Tooltip`
- `Drawer` 与 `Modal` 共享多少样式和内部结构

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 项目与阶段边界

- `.planning/PROJECT.md` — 项目定位与演进规则
- `.planning/REQUIREMENTS.md` — `INTR-01` 到 `INTR-05`
- `.planning/ROADMAP.md` — Phase 4 的目标、依赖和成功标准
- `.planning/STATE.md` — 当前焦点与阶段上下文

### 前置阶段产物

- `.planning/phases/03-basic-components-completion/03-01-SUMMARY.md` — 布尔控件和 Form 绑定协议已稳定
- `.planning/phases/03-basic-components-completion/03-02-SUMMARY.md` — `Input` / `Textarea` 门面已完成收口
- `.planning/phases/03-basic-components-completion/03-03-SUMMARY.md` — 页面状态组件已补齐，不再是复杂交互阻塞项
- `.planning/phases/03-basic-components-completion/03-VERIFICATION.md` — Phase 3 已 passed，可把注意力完全转向复杂交互

### 当前脆弱区域与实现入口

- `.planning/codebase/CONCERNS.md` — 复杂组件、Floating UI 相关实现和测试缺口
- `packages/compass-ui/src/select/select.tsx`
- `packages/compass-ui/src/tree-select/tree-select.tsx`
- `packages/compass-ui/src/dropdown/dropdown.tsx`
- `packages/compass-ui/src/tooltip/tooltip.tsx`
- `packages/compass-ui/src/date-picker/date-picker.tsx`
- `packages/compass-ui/src/date-picker/date-range-picker.tsx`
- `packages/compass-ui/src/modal/modal.tsx`

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `Select`、`TreeSelect`、`Dropdown`、`Tooltip`、`DatePicker` 当前都已基于 `@floating-ui/react`，说明共享基础层有现实价值。
- `Modal` 已经提供 portal + mask + 关闭控制的实现，可作为 `Drawer` 的结构参考。
- 现有测试已经覆盖鼠标打开/关闭、受控状态和部分 aria 暴露，Phase 4 可以在这些测试上继续补键盘与焦点行为。

### Established Patterns

- 组件目录继续采用 `src/<component>/index.ts + <component>.tsx + <component>.styles.ts + types.ts + <component>.test.tsx`
- 根 `src/index.ts` 是唯一公开门面；新复杂交互组件也应从根入口导出
- dumi 文档页和 `API.md` 是唯一对外入口，Phase 4 不新增 Storybook 或第二文档壳

### Integration Points

- `select` 的键盘语义会影响 `auto-complete` / `tree-select` 等类似组件的后续心智模型
- `Dropdown` / `Tooltip` / `Popover` / `Popconfirm` 之间需要共享触发与关闭模型
- `Drawer` 与 `Modal` 之间需要共享 mask、焦点和 portal 约束

</code_context>

<specifics>
## Specific Ideas

- 把 `Select` 单独拆成第一条计划线，避免它和 overlay 基础层抽取互相绞在一起。
- 先稳定现有 `Dropdown` / `Tooltip` / `TreeSelect` / `DatePicker`，再在这套基础上补 `Popover` / `Popconfirm`。
- `Drawer` 与“基础层策略文档”一起收尾，可以强迫实现和架构结论对齐。

</specifics>

<deferred>
## Deferred Ideas

- 整体迁移到新的 headless component primitive 体系
- 大规模重做 `Modal` / `Drawer` / `Popover` 的动画系统
- 在 Phase 4 内处理移动端手势或触屏特化交互

</deferred>

---

_Phase: 04-complex-interaction-stabilization_
_Context gathered: 2026-04-14_
