---
phase: 1
slug: public-api-release-baseline
status: complete
nyquist_compliant: true
wave_0_complete: false
created: 2026-04-13
updated: 2026-04-14
---

# Phase 1 — Validation Strategy

> Phase 1 关注公开导出、打包产物、消费者接入与发布流程，不以新增 UI 组件为主。

---

## Test Infrastructure

| Property               | Value                                                                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**          | Jest 29.x + TypeScript build checks + package publishing checks                                                                  |
| **Config file**        | `packages/compass-ui/jest.config.js`                                                                                             |
| **Quick run command**  | `pnpm --filter @xinghunm/compass-ui lint && pnpm --filter @xinghunm/compass-ui build`                                            |
| **Full suite command** | `pnpm --filter @xinghunm/compass-ui lint && pnpm --filter @xinghunm/compass-ui test && pnpm --filter @xinghunm/compass-ui build` |
| **Estimated runtime**  | ~90 seconds                                                                                                                      |

---

## Sampling Rate

- **After every task commit:** Run `pnpm --filter @xinghunm/compass-ui lint && pnpm --filter @xinghunm/compass-ui build`
- **After every plan wave:** Run `pnpm --filter @xinghunm/compass-ui lint && pnpm --filter @xinghunm/compass-ui test && pnpm --filter @xinghunm/compass-ui build`
- **Before `$gsd-verify-work`:** Full suite must be green, and package artifact validation commands must pass
- **Max feedback latency:** 120 seconds

---

## Per-Task Verification Map

| Task ID  | Plan | Wave | Requirement | Test Type   | Automated Command                                                                                                                                                                       | File Exists | Status   |
| -------- | ---- | ---- | ----------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | -------- |
| 01-01-01 | 01   | 1    | PUBL-01     | static      | `pnpm --filter @xinghunm/compass-ui build`                                                                                                                                              | ✅          | ✅ green |
| 01-01-02 | 01   | 1    | PUBL-04     | integration | `pnpm run release:verify:compass-ui`                                                                                                                                                    | ✅          | ✅ green |
| 01-02-01 | 02   | 1    | PUBL-03     | static      | `pnpm run release:verify:compass-ui`                                                                                                                                                    | ✅          | ✅ green |
| 01-02-02 | 02   | 2    | PUBL-04     | integration | `pnpm run release:verify:compass-ui`                                                                                                                                                    | ✅          | ✅ green |
| 01-03-01 | 03   | 1    | PUBL-02     | static      | `node -e "const root=require('./package.json'); const pkg=require('./packages/compass-ui/package.json'); console.log(root.engines.node, root.engines.pnpm, pkg.publishConfig?.access)"` | ✅          | ✅ green |
| 01-03-02 | 03   | 2    | PUBL-05     | process     | `test -f .github/workflows/release.yml`                                                                                                                                                 | ✅          | ✅ green |

_Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky_

---

## Wave 0 Requirements

- [ ] `packages/compass-ui/test-consumer/package.json` — 最小消费者夹具
- [ ] `packages/compass-ui/test-consumer/tsconfig.json` — 消费者类型检查配置
- [ ] `packages/compass-ui/test-consumer/src/index.tsx` — 公开导出接入样例
- [ ] `publint` — 发布契约静态校验工具
- [ ] `.github/workflows/release.yml` 或等价 CI 发布工作流 — 若本 phase 决定落地 trusted publishing

---

## Manual-Only Verifications

| Behavior                              | Requirement       | Why Manual                                              | Test Instructions                                                                                           |
| ------------------------------------- | ----------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 文档示例不再引用 `src/*` / `dist/*`   | PUBL-01           | 文档内容与对外示例通常分散在多个 Markdown 和配置文件中  | 抽查 `packages/compass-ui/docs/components/*.md` 与 `packages/compass-ui/.dumirc.ts`，确认仅使用公开导出路径 |
| 公开导出面是否足够小且稳定            | PUBL-01 / PUBL-02 | 是否公开某个 subpath 属于产品契约决策，不应只靠脚本决定 | 检查 `packages/compass-ui/package.json` 的 `exports`，确认只公开本 phase 决定支持的入口                     |
| Changesets 与 npm access 策略是否唯一 | PUBL-02 / PUBL-05 | 配置一致性可脚本辅助，但“策略是否正确”仍需人工判断      | 同时检查 `.changeset/config.json` 与 `packages/*/package.json`，确认无冲突或冲突已被明确消除                |

---

## Final Execution Evidence

- `pnpm run release:verify:compass-ui`：通过
- 结果：`44` 个 test suite、`563` 个测试全部通过
- `tsup` build 与 DTS 分发通过
- `publint`、`pnpm pack`、临时消费者安装和类型检查通过
- 非阻断 warning：
  - `publint` 仍提示 `exports["."].types` 歧义
  - 包缺少 `"type"` 字段的建议提示仍存在

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 120s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** complete
