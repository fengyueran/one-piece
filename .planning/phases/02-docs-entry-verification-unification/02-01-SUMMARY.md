---
phase: 02-docs-entry-verification-unification
plan: 01
subsystem: docs-entry
tags: [dumi, docs, navigation, public-api]
requires: [phase-1-public-api]
provides:
  - single-docs-entry
  - docs-information-architecture
  - public-api-wayfinding
affects: [docs-homepage, components-index, api-navigation]
key-files:
  modified:
    [
      packages/compass-ui/.dumirc.ts,
      packages/compass-ui/docs/index.md,
      packages/compass-ui/docs/README.md,
      packages/compass-ui/docs/API.md,
      packages/compass-ui/docs/components/index.md,
      packages/compass-ui/docs/guide/getting-started.md,
    ]
requirements-completed: [DOCS-01, DOCS-02]
completed: 2026-04-14
implementation_commit: e51cbd2
---

# Phase 2: 文档入口与验证统一 01 总结

**`compass-ui` 的 dumi 站点已收口为单一公开入口，首页、组件目录、安装指南与 API 页面形成统一导航。**

## Accomplishments

- 首页新增安装、组件目录、API 参考三条明确入口，不再让用户猜下一步去哪里
- `docs/README.md` 改成文档入口说明，明确 dumi 是当前唯一对外文档站
- 组件总览页改为按组件分组浏览，不再保留大段 showcase 型内容
- API 页面改为只解释正式公开导入边界：根入口、`/theme`、`/locale`、`/icons`
- 顶部导航加入 `API` 链接，但没有引入第二站点入口

## Verification

- `pnpm --filter @xinghunm/compass-ui docs:build`
- `rg -n '安装|组件|API' packages/compass-ui/docs/index.md packages/compass-ui/docs/README.md packages/compass-ui/docs/components/index.md`
- `rg -n '@xinghunm/compass-ui(/theme|/locale|/icons)?' packages/compass-ui/docs/API.md packages/compass-ui/docs/guide/getting-started.md`

## Notes

- `API.md` 中仅用于展示导入方式的代码块已改为非 demo 代码块，避免 dumi 把它们当可运行示例编译。
