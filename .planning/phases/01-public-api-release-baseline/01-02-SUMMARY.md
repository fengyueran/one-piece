---
phase: 01-public-api-release-baseline
plan: 02
subsystem: release-verification
tags: [publint, npm-pack, smoke-test, types]
requires:
  - phase: 01-public-api-release-baseline
    provides: compass-ui-public-subpaths
provides:
  - verify-public-api-script
  - standalone-test-consumer
  - tarball-typecheck
affects: [phase-2-docs-entry, release-governance, public-consumption]
tech-stack:
  added: []
  patterns: [import-meta-root-resolution, temporary-consumer-installation]
key-files:
  created:
    [
      packages/compass-ui/scripts/verify-public-api.mjs,
      packages/compass-ui/test-consumer/package.json,
      packages/compass-ui/test-consumer/tsconfig.json,
      packages/compass-ui/test-consumer/src/index.tsx,
    ]
  modified: [packages/compass-ui/src/tree/tree.tsx]
key-decisions:
  - `verify-public-api.mjs` 必须以 `import.meta.url` 反推路径，不能依赖调用时 cwd
  - `test-consumer` 只做版本控制内夹具，真实安装必须发生在临时目录
patterns-established:
  - 发布验证必须经过 `build + publint + pnpm pack + consumer typecheck`
requirements-completed: [PUBL-03, PUBL-04]
duration: 40min
completed: 2026-04-13
---

# Phase 1: 公开契约与发布基线 02 总结

**`compass-ui` 已具备真实 tarball 级别的公开 API 验证脚本和只走公开导入路径的最小消费者夹具。**

## Performance

- **Duration:** 40 min
- **Started:** 2026-04-13T20:45:00+08:00
- **Completed:** 2026-04-13T21:25:00+08:00
- **Tasks:** 4
- **Files modified:** 5

## Accomplishments

- 新建 `verify-public-api.mjs`，把 `build`、`publint`、`pnpm pack` 和消费者类型校验串成一次真实发布前检查
- 新建 `test-consumer` 夹具，只使用 `@xinghunm/compass-ui` 及其公开子路径进行消费验证
- 在 `tree.tsx` 增加最小 `react-window` 类型桥接，解除 `tsup dts` 的阻塞

## Task Commits

本计划实现已收敛到统一实现提交：

1. **Task 1: 公开 API 验证脚本与消费者夹具** - `ad153dd` (feat)

## Files Created/Modified

- `packages/compass-ui/scripts/verify-public-api.mjs` - 以真实 tarball 为目标做构建、发布前静态检查和消费者类型验证
- `packages/compass-ui/test-consumer/package.json` - 最小消费者依赖定义
- `packages/compass-ui/test-consumer/tsconfig.json` - 消费者类型检查配置
- `packages/compass-ui/test-consumer/src/index.tsx` - 只经公开导入路径消费组件、类型、theme、locale 与 icons
- `packages/compass-ui/src/tree/tree.tsx` - 为 `react-window` 增加最小类型桥接，保证声明文件构建通过

## Decisions Made

- 发布验证脚本统一基于 `import.meta.url` 推导仓库与包路径，避免 cwd 差异导致的假通过
- 消费者安装必须隔离到临时目录执行，不能在 workspace 夹具目录直接运行 `pnpm install/add`

## Deviations from Plan

### Auto-fixed Issues

**1. workspace 锁文件被消费者安装污染**

- **Found during:** 发布验证脚本联调
- **Issue:** 直接在 `packages/compass-ui/test-consumer` 内执行安装会把依赖变更提升到 workspace 级别
- **Fix:** 改为把夹具复制到临时目录，再安装 `pnpm pack` 生成的 tarball
- **Files modified:** `packages/compass-ui/scripts/verify-public-api.mjs`
- **Verification:** `node packages/compass-ui/scripts/verify-public-api.mjs`
- **Committed in:** `ad153dd`

**2. `react-window` 类型导致 `tsup dts` 失败**

- **Found during:** 构建验证
- **Issue:** `List` 在当前 JSX 类型上下文下无法直接作为组件使用
- **Fix:** 在 `tree.tsx` 中增加最小 `VirtualList` 类型桥接
- **Files modified:** `packages/compass-ui/src/tree/tree.tsx`
- **Verification:** `pnpm run release:verify:compass-ui`
- **Committed in:** `ad153dd`

---

**Total deviations:** 2 auto-fixed
**Impact on plan:** 都是发布前验证链路的必要修正，没有扩大功能范围。

## Issues Encountered

- `pnpm pack` 之外的本地 alias/源码直连都不足以证明公开 API 可用，所以验证链路最终收敛到真实 tarball 消费

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 2 可以直接复用这条真实消费者链路作为 demo smoke 和文档示例校验基线。

---

_Phase: 01-public-api-release-baseline_
_Completed: 2026-04-13_
