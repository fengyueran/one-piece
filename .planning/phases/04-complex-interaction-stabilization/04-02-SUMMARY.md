---
phase: 04-complex-interaction-stabilization
plan: 02
subsystem: ui
tags: [react, overlay, dropdown, tooltip, tree-select, date-picker, floating-ui]
requires:
  - phase: 04-complex-interaction-stabilization
    provides: Select 的键盘模型与 aria 契约
provides:
  - 现有 overlay 组件共享的 aria 与关闭约定
  - Dropdown / Tooltip / TreeSelect / DatePicker 的回归测试补强
  - 复杂交互文档中明确的关闭与焦点说明
affects: [04-03, 04-04, popover, popconfirm, drawer]
tech-stack:
  added: []
  patterns:
    - 触发器统一使用 aria-expanded 和 aria-controls 暴露浮层状态
    - 浮层表面统一阻止内部点击冒泡成 outside press
key-files:
  created:
    - .planning/phases/04-complex-interaction-stabilization/04-02-SUMMARY.md
    - packages/compass-ui/src/internal/overlay-utils.ts
  modified:
    - packages/compass-ui/src/dropdown/dropdown.tsx
    - packages/compass-ui/src/dropdown/dropdown.test.tsx
    - packages/compass-ui/src/tooltip/tooltip.tsx
    - packages/compass-ui/src/tooltip/tooltip.test.tsx
    - packages/compass-ui/src/tree-select/tree-select.tsx
    - packages/compass-ui/src/tree-select/tree-select.test.tsx
    - packages/compass-ui/src/date-picker/date-picker.tsx
    - packages/compass-ui/src/date-picker/date-picker.test.tsx
    - packages/compass-ui/src/date-picker/date-range-picker.tsx
    - packages/compass-ui/src/date-picker/date-range-picker.test.tsx
    - packages/compass-ui/docs/components/dropdown.md
    - packages/compass-ui/docs/components/tooltip.md
    - packages/compass-ui/docs/components/tree-select.md
    - packages/compass-ui/docs/components/date-picker.md
    - packages/compass-ui/docs/API.md
key-decisions:
  - 现阶段不迁移到底层 primitives 库，只在 `Floating UI` 之上收口共享交互约束
  - Tooltip 继续保持轻量提示边界，仅补 `aria-describedby` 与关闭行为，不提升成可交互浮层
patterns-established:
  - 最小共享 helper 只负责 aria 与 surface 事件约束，不提前抽象更重的 overlay 框架
  - 文档只说明已被测试覆盖的 Escape、外部关闭、焦点入口和 aria 行为
requirements-completed: [INTR-02]
duration: 19min
completed: 2026-04-14
---

# Phase 4: 复杂交互稳态化 Summary

**现有 Dropdown、Tooltip、TreeSelect 与日期类浮层已经对齐到同一套 aria、关闭和内部点击保留约束**

## Performance

- **Duration:** 19 min
- **Started:** 2026-04-14T05:06:00Z
- **Completed:** 2026-04-14T05:25:33Z
- **Tasks:** 2
- **Files modified:** 16

## Accomplishments

- 为现有 overlay 组件补了最小共享 helper，统一了 `aria-expanded`、`aria-controls` 和内部点击保留逻辑。
- 为 `Dropdown`、`Tooltip`、`TreeSelect`、`DatePicker` / `RangePicker` 增加了 Escape 关闭与 aria 断言回归。
- 在组件页和 API 页显式写出了现有 overlay 的关闭、焦点入口和职责边界。

## Task Commits

Each task was committed atomically:

1. **Task 1: 抽出并应用现有 overlay 组件的共享交互约定** - `d95976c` (feat)
2. **Task 2: 回写现有 overlay 组件文档与 API 行为说明** - `e705067` (docs)

**Plan metadata:** `pending`

## Files Created/Modified

- `.planning/phases/04-complex-interaction-stabilization/04-02-SUMMARY.md` - 记录本 plan 的交付、偏差和后续可复用约束。
- `packages/compass-ui/src/internal/overlay-utils.ts` - 提供共享的触发器 aria 和浮层表面事件 helper。
- `packages/compass-ui/src/dropdown/dropdown.tsx` - 接入统一的 aria-controls / aria-expanded 契约。
- `packages/compass-ui/src/tooltip/tooltip.tsx` - 在点击模式下补齐 `aria-describedby` 与统一的 surface 事件约束。
- `packages/compass-ui/src/tree-select/tree-select.tsx` - 对齐搜索态与非搜索态的 combobox 语义，并接入浮层 id 契约。
- `packages/compass-ui/src/date-picker/date-picker.tsx` - 为日期面板输入框补齐 `aria-expanded` / `aria-controls`。
- `packages/compass-ui/src/date-picker/date-range-picker.tsx` - 让双输入框共享同一浮层状态表达。
- `packages/compass-ui/docs/components/{dropdown,tooltip,tree-select,date-picker}.md` - 记录已验证的关闭、焦点和边界说明。
- `packages/compass-ui/docs/API.md` - 新增现有 overlay 契约说明。

## Decisions Made

- 共享层保持在 helper 级别，避免在本阶段过早引入新的抽象层级或重写现有 overlay 组件结构。
- `TreeSelect` 在 `showSearch` 模式下由输入框承担 `combobox` 语义，根节点不再重复暴露第二个同角色节点。

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Floating UI 会覆盖我们手写的浮层 id**

- **Found during:** Task 1（抽出并应用现有 overlay 组件的共享交互约定）
- **Issue:** `getFloatingProps()` 会写入自己的内部 id，导致触发器上的 `aria-controls` 无法稳定对应真实浮层节点。
- **Fix:** 把公开浮层 id 放到 spread 之后，确保最终 DOM 以文档和测试约定的 id 为准。
- **Files modified:** `packages/compass-ui/src/dropdown/dropdown.tsx`, `packages/compass-ui/src/tooltip/tooltip.tsx`, `packages/compass-ui/src/tree-select/tree-select.tsx`, `packages/compass-ui/src/date-picker/date-picker.tsx`, `packages/compass-ui/src/date-picker/date-range-picker.tsx`
- **Verification:** `pnpm --filter @xinghunm/compass-ui test -- --runInBand src/tree-select/tree-select.test.tsx src/dropdown/dropdown.test.tsx src/tooltip/tooltip.test.tsx src/date-picker/date-picker.test.tsx src/date-picker/date-range-picker.test.tsx`
- **Committed in:** `d95976c`

**2. [Rule 1 - Bug] TreeSelect 搜索态出现双重 combobox 语义**

- **Found during:** Task 1（抽出并应用现有 overlay 组件的共享交互约定）
- **Issue:** 根容器和搜索输入同时暴露 `combobox`，导致测试查询和可访问性语义都变得含混。
- **Fix:** 在 `showSearch` 模式下移除根容器的重复角色，只保留输入框承担 `combobox` 语义。
- **Files modified:** `packages/compass-ui/src/tree-select/tree-select.tsx`, `packages/compass-ui/src/tree-select/tree-select.test.tsx`
- **Verification:** `pnpm --filter @xinghunm/compass-ui test -- --runInBand src/tree-select/tree-select.test.tsx src/dropdown/dropdown.test.tsx src/tooltip/tooltip.test.tsx src/date-picker/date-picker.test.tsx src/date-picker/date-range-picker.test.tsx`
- **Committed in:** `d95976c`

---

**Total deviations:** 2 auto-fixed（1 blocking, 1 bug）
**Impact on plan:** 两个偏差都属于现有 overlay 语义收口时必须处理的实现细节，没有引入额外产品范围。

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `Popover` / `Popconfirm` 可以直接复用现有的 overlay 触发器与 surface 约定，不必再从零定义 aria 和关闭规则。
- `Drawer` 阶段可以继续沿着同一套“触发器状态表达 + surface 保留 + 外部关闭”模型扩展到侧边浮层。

---

_Phase: 04-complex-interaction-stabilization_
_Completed: 2026-04-14_
