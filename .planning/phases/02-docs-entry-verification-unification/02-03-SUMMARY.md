---
phase: 02-docs-entry-verification-unification
plan: 03
subsystem: docs-a11y-baseline
tags: [a11y, keyboard, jest, testing-library, docs]
requires: [02-01, 02-02]
provides:
  - docs-keyboard-baseline
  - representative-a11y-tests
  - component-a11y-notes
affects: [button, input-field, select, dropdown, date-picker]
key-files:
  modified:
    [
      packages/compass-ui/src/button/button.test.tsx,
      packages/compass-ui/src/input-field/input-field.test.tsx,
      packages/compass-ui/src/select/select.test.tsx,
      packages/compass-ui/src/dropdown/dropdown.test.tsx,
      packages/compass-ui/src/date-picker/date-picker.test.tsx,
      packages/compass-ui/docs/components/button.md,
      packages/compass-ui/docs/components/input-field.md,
      packages/compass-ui/docs/components/select.md,
      packages/compass-ui/docs/components/dropdown.md,
      packages/compass-ui/docs/components/date-picker.md,
    ]
requirements-completed: [DOCS-05]
completed: 2026-04-14
implementation_commit: e51cbd2
---

# Phase 2: 文档入口与验证统一 03 总结

**5 个高频组件已经补上第一批键盘与可访问性自动化断言，组件文档也同步声明了这些已验证行为。**

## Accomplishments

- `Button`：补充 Enter 激活触发回调的断言
- `InputField`：补充清除按钮不进入 Tab 顺序且清除后焦点回到输入框的断言
- `Select`：补充 `showSearch` 打开后搜索输入框自动聚焦的断言
- `Dropdown`：补充 `trigger="click"` 时键盘激活触发元素可展开下拉层的断言
- `DatePicker`：补充通过 Tab 导航聚焦输入框的断言
- 5 个组件文档新增“键盘与可访问性”小节，只记录已有自动化验证支撑的行为

## Verification

- `pnpm --filter @xinghunm/compass-ui test -- --runInBand src/button/button.test.tsx src/input-field/input-field.test.tsx src/select/select.test.tsx src/dropdown/dropdown.test.tsx src/date-picker/date-picker.test.tsx`
- `pnpm run docs:verify:compass-ui`

## Notes

- 本计划只补高频组件的基础键盘与 a11y 契约，没有扩展到更复杂的 overlay 导航和统一焦点策略；这部分仍留在 Phase 4。
