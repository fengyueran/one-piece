---
phase: 01-public-api-release-baseline
plan: 01
subsystem: public-api-docs
tags: [exports, dumi, tsup, docs]
requires: []
provides:
  - compass-ui-public-subpaths
  - dumi-public-aliases
  - docs-public-imports
affects: [phase-2-docs-entry, docs-build, public-consumption]
tech-stack:
  added: [tsup-multi-entry-build]
  patterns: [exports-to-build-artifact-parity, exact-dumi-alias-mapping]
key-files:
  created:
    [
      packages/compass-ui/tsup.config.ts,
      packages/compass-ui/src/icons/icons.tsx,
      packages/compass-ui/src/icons/index.ts,
    ]
  modified:
    [
      packages/compass-ui/package.json,
      packages/compass-ui/.dumirc.ts,
      packages/compass-ui/src/locale/index.ts,
      packages/compass-ui/README.md,
      packages/compass-ui/docs/guide/getting-started.md,
      packages/compass-ui/docs/components/config-provider.md,
      packages/compass-ui/docs/components/date-picker.md,
      packages/compass-ui/docs/components/auto-complete.md,
      packages/compass-ui/docs/components/tree-select.md,
      packages/compass-ui/docs/components/menu.md,
      packages/compass-ui/docs/components/steps.md,
    ]
key-decisions:
  - 只公开 `./theme`、`./locale` 和 `./icons` 子路径，避免继续暴露组件级私有入口
  - dumi 根别名必须使用精确匹配 `$`，避免根路径吞掉子路径
patterns-established:
  - 文档示例只通过公开包名与公开子路径消费
  - 构建入口与 exports 一一对应
requirements-completed: [PUBL-01]
duration: 35min
completed: 2026-04-13
---

# Phase 1: 公开契约与发布基线 01 总结

**`compass-ui` 的首批公开子路径、dumi alias 和文档示例已全部收口到真实公开消费路径。**

## Performance

- **Duration:** 35 min
- **Started:** 2026-04-13T20:10:00+08:00
- **Completed:** 2026-04-13T20:45:00+08:00
- **Tasks:** 3
- **Files modified:** 12

## Accomplishments

- 新增 `./theme`、`./locale`、`./icons` 三条公开子路径，并补齐对应多入口构建产物
- 把 `icons` 拆成 `icons.tsx + index.ts`，恢复 `index` 仅做 barrel export 的约束
- README、组件文档和 dumi alias 全部移除 `src/*`、`dist/*` 与组件级私有导入

## Task Commits

本计划实现已收敛到统一实现提交：

1. **Task 1: 公开子路径、构建入口与文档消费路径收口** - `ad153dd` (feat)

## Files Created/Modified

- `packages/compass-ui/tsup.config.ts` - 定义与 `exports` 对齐的多入口构建配置
- `packages/compass-ui/package.json` - 暴露首批公开子路径并切换到 `tsup.config.ts`
- `packages/compass-ui/.dumirc.ts` - 以精确 alias 映射公开入口与子路径
- `packages/compass-ui/src/icons/icons.tsx` - 承载 icon 具体实现
- `packages/compass-ui/src/icons/index.ts` - 仅做 icon barrel export
- `packages/compass-ui/src/locale/index.ts` - 收口 locale 的公开导出
- `packages/compass-ui/README.md` - 示例改为公开导入路径
- `packages/compass-ui/docs/guide/getting-started.md` - 安装与入门示例切换到公开 API
- `packages/compass-ui/docs/components/config-provider.md` - locale 示例改为公开子路径
- `packages/compass-ui/docs/components/date-picker.md` - locale 与类型导入改为公开路径
- `packages/compass-ui/docs/components/auto-complete.md` - props 类型改为根入口导入
- `packages/compass-ui/docs/components/tree-select.md` - props 类型改为根入口导入
- `packages/compass-ui/docs/components/menu.md` - icon 示例改为公开 icon 子路径
- `packages/compass-ui/docs/components/steps.md` - icon 示例改为公开 icon 子路径

## Decisions Made

- 只对外暴露 theme、locale、icons 三个稳定子路径，避免继续扩散私有组件入口
- 文档与 README 全部以“真实安装后的消费者视角”组织导入方式，不再依赖仓库内部路径

## Deviations from Plan

### Auto-fixed Issues

**1. dumi 根 alias 吞掉子路径导入**

- **Found during:** 文档构建验证
- **Issue:** `@xinghunm/compass-ui` 的根 alias 未精确匹配时，会覆盖 `theme`、`locale`、`icons` 子路径
- **Fix:** 将根 alias 调整为 `@xinghunm/compass-ui$`
- **Files modified:** `packages/compass-ui/.dumirc.ts`
- **Verification:** `pnpm --filter @xinghunm/compass-ui docs:build`
- **Committed in:** `ad153dd`

---

**Total deviations:** 1 auto-fixed
**Impact on plan:** 仅修正公开子路径解析规则，没有引入额外范围。

## Issues Encountered

- `docs:build` 初次失败，原因是 dumi 别名把公开子路径误解析到根入口；修正后构建恢复通过

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 2 已可直接基于公开导出统一文档入口、demo 链路与 smoke 验证，不需要再回头清理私有导入。

---

_Phase: 01-public-api-release-baseline_
_Completed: 2026-04-13_
