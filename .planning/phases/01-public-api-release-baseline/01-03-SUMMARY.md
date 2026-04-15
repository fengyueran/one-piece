---
phase: 01-public-api-release-baseline
plan: 03
subsystem: release-governance
tags: [changesets, github-actions, publishing]
requires:
  - phase: 01-public-api-release-baseline
    provides: verify-public-api-script
provides:
  - root-release-verification-entry
  - trusted-publishing-workflow
  - public-access-alignment
affects: [phase-2-docs-entry, release-process]
tech-stack:
  added: [github-actions-release-workflow]
  patterns: [root-owned-release-entry, changesets-access-alignment]
key-files:
  created: [.github/workflows/release.yml]
  modified:
    [
      package.json,
      .changeset/config.json,
      packages/compass-ui/package.json,
      packages/compass-ui/docs/DEVELOPMENT.md,
    ]
key-decisions:
  - 根 `package.json` 是 `compass-ui` 发布前校验的唯一入口
  - `Node 22.14.0` 仅作为发布 workflow runtime，不提升仓库兼容性基线
patterns-established:
  - CI 发布前始终先跑根级 release verify，再交给 Changesets 发布
requirements-completed: [PUBL-02, PUBL-05]
duration: 30min
completed: 2026-04-13
---

# Phase 1: 公开契约与发布基线 03 总结

**`compass-ui` 的 access、peer、根级发布前入口和 Trusted Publishing workflow 已收口为一套可重复执行的发布基线。**

## Performance

- **Duration:** 30 min
- **Started:** 2026-04-13T21:25:00+08:00
- **Completed:** 2026-04-13T21:55:00+08:00
- **Tasks:** 4
- **Files modified:** 4

## Accomplishments

- 根 `package.json` 新增 `release:verify:compass-ui`，统一本地与 CI 的发布前校验入口
- `.changeset/config.json` 与包级发布配置对齐到 `public` access
- 新建 `release.yml` 并补全 `DEVELOPMENT.md` 中的中文发布流程说明

## Task Commits

本计划实现已收敛到统一实现提交：

1. **Task 1: 根级发布入口、Changesets 对齐与 workflow 落地** - `ad153dd` (feat)

## Files Created/Modified

- `package.json` - 增加唯一根级发布前校验入口
- `.changeset/config.json` - 对齐 npm 公开发布 access
- `packages/compass-ui/package.json` - 收紧 peer 依赖，不再保留第二套发布基线
- `.github/workflows/release.yml` - 定义基于 Changesets 的 release workflow
- `packages/compass-ui/docs/DEVELOPMENT.md` - 记录本地预检、changeset 与 Trusted Publishing 流程

## Decisions Made

- 发布前校验统一从仓库根执行，避免包内脚本和 CI 再维护第二套入口
- Workflow 只承载发布 runtime，不把仓库整体 Node 兼容性基线抬升到 22

## Deviations from Plan

### Auto-fixed Issues

**1. 发布基线分散在多处定义**

- **Found during:** 根级发布配置收口
- **Issue:** 若包级继续持有 `release:verify` 或独立 `engines`，会与根基线形成双重真相源
- **Fix:** 仅保留根级 `release:verify:compass-ui`，包级只保留 peer 与 publish 相关最小配置
- **Files modified:** `package.json`, `packages/compass-ui/package.json`
- **Verification:** `pnpm run release:verify:compass-ui`
- **Committed in:** `ad153dd`

---

**Total deviations:** 1 auto-fixed
**Impact on plan:** 只收紧了发布权威边界，符合原始目标。

## Issues Encountered

- `publint` 仍报告非阻断 warning，但不会影响当前发布基线和 Phase 1 requirement 完成判定

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 2 可以直接围绕“单一文档入口、公开 demo 链路和 smoke 验证”继续推进，不需要再补发布底座。

---

_Phase: 01-public-api-release-baseline_
_Completed: 2026-04-13_
