---
phase: 4
slug: complex-interaction-stabilization
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-14
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for complex interaction stabilization.

---

## Test Infrastructure

| Property               | Value                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**          | `jest` + `@testing-library/react` + `@testing-library/user-event` + dumi smoke                                                                                                                                                                                                                                                                                                                                              |
| **Config file**        | `packages/compass-ui/jest.config.js`, `packages/compass-ui/.dumirc.ts`                                                                                                                                                                                                                                                                                                                                                      |
| **Quick run command**  | `pnpm --filter @xinghunm/compass-ui test -- --runInBand src/select/select.test.tsx src/tree-select/tree-select.test.tsx src/dropdown/dropdown.test.tsx src/tooltip/tooltip.test.tsx src/date-picker/date-picker.test.tsx src/date-picker/date-range-picker.test.tsx src/modal/modal.test.tsx src/popover/popover.test.tsx src/popconfirm/popconfirm.test.tsx src/drawer/drawer.test.tsx`                                    |
| **Full suite command** | `pnpm run docs:verify:compass-ui && pnpm --filter @xinghunm/compass-ui test -- --runInBand src/select/select.test.tsx src/tree-select/tree-select.test.tsx src/dropdown/dropdown.test.tsx src/tooltip/tooltip.test.tsx src/date-picker/date-picker.test.tsx src/date-picker/date-range-picker.test.tsx src/modal/modal.test.tsx src/popover/popover.test.tsx src/popconfirm/popconfirm.test.tsx src/drawer/drawer.test.tsx` |
| **Estimated runtime**  | ~80 seconds                                                                                                                                                                                                                                                                                                                                                                                                                 |

---

## Sampling Rate

- **After every task commit:** Run the task-local `<automated>` verify command
- **After every plan wave:** Run `pnpm run docs:verify:compass-ui`
- **Before phase verification:** Full suite command must be green
- **Max feedback latency:** 90 seconds

---

## Per-Task Verification Map

| Task ID  | Plan | Wave | Requirement | Test Type  | Automated Command                                                                                                                                                                                                                         | File Exists                                                                                                    | Status     |
| -------- | ---- | ---- | ----------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------- |
| 04-01-01 | 01   | 1    | INTR-01     | unit       | `pnpm --filter @xinghunm/compass-ui test -- --runInBand src/select/select.test.tsx`                                                                                                                                                       | ✅                                                                                                             | ⬜ pending |
| 04-01-02 | 01   | 1    | INTR-01     | smoke      | `pnpm run docs:verify:compass-ui && rg -n '键盘                                                                                                                                                                                           | Arrow                                                                                                          | Enter      | Escape                                                                                            | combobox' packages/compass-ui/docs/components/select.md`                                                                                                                                             | ✅         | ⬜ pending |
| 04-02-01 | 02   | 2    | INTR-02     | unit       | `pnpm --filter @xinghunm/compass-ui test -- --runInBand src/tree-select/tree-select.test.tsx src/dropdown/dropdown.test.tsx src/tooltip/tooltip.test.tsx src/date-picker/date-picker.test.tsx src/date-picker/date-range-picker.test.tsx` | ✅                                                                                                             | ⬜ pending |
| 04-02-02 | 02   | 2    | INTR-02     | smoke      | `pnpm run docs:verify:compass-ui && rg -n 'Escape                                                                                                                                                                                         | 焦点                                                                                                           | 关闭       | aria-expanded' packages/compass-ui/docs/components/{tree-select,dropdown,tooltip,date-picker}.md` | ✅                                                                                                                                                                                                   | ⬜ pending |
| 04-03-01 | 03   | 3    | INTR-03     | unit       | `pnpm --filter @xinghunm/compass-ui test -- --runInBand src/popover/popover.test.tsx src/popconfirm/popconfirm.test.tsx src/tooltip/tooltip.test.tsx`                                                                                     | ❌ W3                                                                                                          | ⬜ pending |
| 04-03-02 | 03   | 3    | INTR-03     | smoke      | `pnpm run docs:verify:compass-ui && rg -n 'popover                                                                                                                                                                                        | popconfirm' packages/compass-ui/docs/components/{index,popover,popconfirm}.md packages/compass-ui/docs/API.md` | ❌ W3      | ⬜ pending                                                                                        |
| 04-04-01 | 04   | 4    | INTR-04     | unit       | `pnpm --filter @xinghunm/compass-ui test -- --runInBand src/drawer/drawer.test.tsx src/modal/modal.test.tsx`                                                                                                                              | ❌ W4                                                                                                          | ⬜ pending |
| 04-04-02 | 04   | 4    | INTR-05     | docs-check | `pnpm run docs:verify:compass-ui && rg -n '基础层                                                                                                                                                                                         | Floating UI                                                                                                    | Popover    | Drawer                                                                                            | Tooltip' packages/compass-ui/docs/API.md packages/compass-ui/docs/components/{drawer,popover,popconfirm,tooltip,dropdown,date-picker,tree-select,select}.md packages/compass-ui/docs/DEVELOPMENT.md` | ❌ W4      | ⬜ pending |

_Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky_

---

## Wave 0 Requirements

- None. Phase 4 starts on top of the public API, docs, and test baseline completed in Phase 1 to Phase 3.

---

## Manual-Only Verifications

| Behavior                                            | Requirement | Why Manual                               | Test Instructions                                                      |
| --------------------------------------------------- | ----------- | ---------------------------------------- | ---------------------------------------------------------------------- |
| 键盘在 `Select` 中的导航体验是否自然                | INTR-01     | 自动化能判定正确性，难完全判定体验流畅度 | 本地打开文档示例，连续使用 `Enter / ArrowDown / ArrowUp / Escape` 操作 |
| `Tooltip`、`Popover`、`Dropdown` 的角色分层是否清晰 | INTR-02/03  | 需要人工判断心智模型是否混淆             | 浏览三者文档页，确认“什么时候用谁”一眼可懂                             |
| `Drawer` 与 `Modal` 的关闭/聚焦行为是否一致         | INTR-04     | 自动化覆盖有限，仍需人工看交互连续性     | 手动打开并关闭 `Drawer`，检查 mask、Escape、关闭按钮、焦点回收         |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 90s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
