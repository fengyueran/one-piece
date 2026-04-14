---
phase: 2
slug: docs-entry-verification-unification
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-14
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property               | Value                                                                                                                                                                                                                   |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**          | `jest` 29.x + `@testing-library/react` + dumi build                                                                                                                                                                     |
| **Config file**        | `packages/compass-ui/jest.config.js`, `packages/compass-ui/.dumirc.ts`                                                                                                                                                  |
| **Quick run command**  | `pnpm --filter @xinghunm/compass-ui test -- --runInBand src/button/button.test.tsx src/input-field/input-field.test.tsx src/select/select.test.tsx src/date-picker/date-picker.test.tsx src/dropdown/dropdown.test.tsx` |
| **Full suite command** | `pnpm run docs:verify:compass-ui && pnpm --filter @xinghunm/compass-ui test`                                                                                                                                            |
| **Estimated runtime**  | ~35 seconds                                                                                                                                                                                                             |

---

## Sampling Rate

- **After every task commit:** Run quick command or the task-local `<automated>` verify command
- **After every plan wave:** Run `pnpm run docs:verify:compass-ui`
- **Before `$gsd-verify-work`:** `pnpm run docs:verify:compass-ui && pnpm --filter @xinghunm/compass-ui test` must be green
- **Max feedback latency:** 45 seconds

---

## Per-Task Verification Map

| Task ID  | Plan | Wave | Requirement | Test Type    | Automated Command                                                                                                                                                                                                       | File Exists | Status     |
| -------- | ---- | ---- | ----------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------- | ------------------------------------------------------------------------------- | --- | ---------- |
| 02-01-01 | 01   | 1    | DOCS-01     | build        | `pnpm --filter @xinghunm/compass-ui docs:build`                                                                                                                                                                         | ✅          | ⬜ pending |
| 02-01-02 | 01   | 1    | DOCS-02     | static-check | `rg -n 'guide                                                                                                                                                                                                           | get-started | API        | 组件' packages/compass-ui/docs/{index.md,README.md,API.md,components/index.md}` | ✅  | ⬜ pending |
| 02-02-01 | 02   | 1    | DOCS-03     | smoke        | `node packages/compass-ui/scripts/verify-docs-public-imports.mjs`                                                                                                                                                       | ❌ W0       | ⬜ pending |
| 02-02-02 | 02   | 1    | DOCS-04     | integration  | `pnpm run docs:verify:compass-ui`                                                                                                                                                                                       | ❌ W0       | ⬜ pending |
| 02-03-01 | 03   | 2    | DOCS-05     | unit         | `pnpm --filter @xinghunm/compass-ui test -- --runInBand src/button/button.test.tsx src/input-field/input-field.test.tsx src/select/select.test.tsx src/date-picker/date-picker.test.tsx src/dropdown/dropdown.test.tsx` | ✅          | ⬜ pending |

_Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky_

---

## Wave 0 Requirements

- [ ] `packages/compass-ui/scripts/verify-docs-public-imports.mjs` — 文档公开导入路径 smoke 脚本
- [ ] `package.json` — 根级 `docs:verify:compass-ui` 命令

---

## Manual-Only Verifications

| Behavior                             | Requirement | Why Manual               | Test Instructions                                      |
| ------------------------------------ | ----------- | ------------------------ | ------------------------------------------------------ |
| 首页导航是否清晰指向安装、组件和 API | DOCS-01     | 信息架构质量仍需人工把关 | 打开 dumi 首页，确认 3 次点击内可到安装、组件总览、API |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 45s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
