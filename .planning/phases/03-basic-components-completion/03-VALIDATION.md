---
phase: 3
slug: basic-components-completion
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-14
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property               | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**          | `jest` 29.x + `@testing-library/react` + `@testing-library/user-event` + dumi smoke                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Config file**        | `packages/compass-ui/jest.config.js`, `packages/compass-ui/.dumirc.ts`                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Quick run command**  | `pnpm --filter @xinghunm/compass-ui test -- --runInBand src/checkbox/checkbox.test.tsx src/radio/radio.test.tsx src/switch/switch.test.tsx src/input/input.test.tsx src/textarea/textarea.test.tsx src/alert/alert.test.tsx src/empty/empty.test.tsx src/skeleton/skeleton.test.tsx src/spin-loading/spin-loading.test.tsx`                                                                                                                                                                  |
| **Full suite command** | `pnpm run docs:verify:compass-ui && pnpm --filter @xinghunm/compass-ui test -- --runInBand src/checkbox/checkbox.test.tsx src/radio/radio.test.tsx src/switch/switch.test.tsx src/input/input.test.tsx src/textarea/textarea.test.tsx src/alert/alert.test.tsx src/empty/empty.test.tsx src/skeleton/skeleton.test.tsx src/spin-loading/spin-loading.test.tsx src/form/form.test.tsx src/auto-complete/auto-complete.test.tsx src/date-picker/date-picker.test.tsx src/table/table.test.tsx` |
| **Estimated runtime**  | ~70 seconds                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

---

## Sampling Rate

- **After every task commit:** Run the task-local `<automated>` verify command
- **After every plan wave:** Run `pnpm run docs:verify:compass-ui`
- **Before `$gsd-verify-work`:** Full suite command must be green
- **Max feedback latency:** 90 seconds

---

## Per-Task Verification Map

| Task ID  | Plan | Wave | Requirement | Test Type | Automated Command                                                                                                                                                                                                                   | File Exists | Status                                                                                                           |
| -------- | ---- | ---- | ----------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------- |
| 03-01-01 | 01   | 1    | COMP-01     | unit      | `pnpm --filter @xinghunm/compass-ui test -- --runInBand src/checkbox/checkbox.test.tsx src/radio/radio.test.tsx src/switch/switch.test.tsx src/form/form.test.tsx`                                                                  | ❌ W1       | ⬜ pending                                                                                                       |
| 03-01-02 | 01   | 1    | COMP-02     | smoke     | `pnpm run docs:verify:compass-ui && rg -n 'checkbox                                                                                                                                                                                 | radio       | switch' packages/compass-ui/docs/components/{index,checkbox,radio,switch}.md packages/compass-ui/docs/API.md`    | ❌ W1                                                                                                                           | ⬜ pending |
| 03-02-01 | 02   | 2    | COMP-04     | unit      | `pnpm --filter @xinghunm/compass-ui test -- --runInBand src/input/input.test.tsx src/textarea/textarea.test.tsx src/input-field/input-field.test.tsx src/auto-complete/auto-complete.test.tsx src/date-picker/date-picker.test.tsx` | ❌ W2       | ⬜ pending                                                                                                       |
| 03-02-02 | 02   | 2    | COMP-05     | smoke     | `pnpm run docs:verify:compass-ui && rg -n 'Input                                                                                                                                                                                    | Textarea    | InputField' packages/compass-ui/docs/components/{input,textarea,input-field}.md packages/compass-ui/docs/API.md` | ❌ W2                                                                                                                           | ⬜ pending |
| 03-03-01 | 03   | 3    | COMP-06     | unit      | `pnpm --filter @xinghunm/compass-ui test -- --runInBand src/alert/alert.test.tsx src/empty/empty.test.tsx src/skeleton/skeleton.test.tsx src/spin-loading/spin-loading.test.tsx src/table/table.test.tsx`                           | ❌ W3       | ⬜ pending                                                                                                       |
| 03-03-02 | 03   | 3    | COMP-07     | smoke     | `pnpm run docs:verify:compass-ui && rg -n 'alert                                                                                                                                                                                    | empty       | skeleton                                                                                                         | spin-loading' packages/compass-ui/docs/components/{index,alert,empty,skeleton,spin-loading}.md packages/compass-ui/docs/API.md` | ❌ W3      | ⬜ pending |

_Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky_

---

## Wave 0 Requirements

- None. Phase 3 can start directly from the current public API and docs verification baseline established in Phase 1 and Phase 2.

---

## Manual-Only Verifications

| Behavior                                                    | Requirement | Why Manual                 | Test Instructions                                                          |
| ----------------------------------------------------------- | ----------- | -------------------------- | -------------------------------------------------------------------------- |
| 基础组件视觉密度与现有主题是否明显割裂                      | COMP-01-07  | 自动化难以判断视觉一致性   | 本地打开 dumi 文档，检查新组件与现有 `Button` / `InputNumber` 风格是否跳脱 |
| `Input` 作为推荐门面后，文档迁移叙事是否清晰                | COMP-04     | 需要人工判断文案与信息架构 | 检查 `Input`、`InputField`、API 页是否能让用户一眼看懂推荐写法             |
| `Empty` / `Skeleton` / `SpinLoading` 的使用场景是否重叠过度 | COMP-07     | 需要人工判断产品语义边界   | 浏览组件页，确认三个组件描述的场景边界清晰                                 |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 90s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
