---
phase: 02-docs-entry-verification-unification
plan: 02
subsystem: docs-verification
tags: [docs, smoke-test, exports, validation]
requires: [phase-1-public-api]
provides:
  - docs-public-import-smoke
  - root-docs-verify-command
  - docs-maintainer-guidance
affects: [docs-build, release-boundary, markdown-imports]
key-files:
  created: [packages/compass-ui/scripts/verify-docs-public-imports.mjs]
  modified: [package.json, packages/compass-ui/docs/DEVELOPMENT.md]
requirements-completed: [DOCS-03, DOCS-04]
completed: 2026-04-14
implementation_commit: e51cbd2
---

# Phase 2: 文档入口与验证统一 02 总结

**文档与 demo 现在有了固定的公开导入 smoke 校验入口，维护者可以用一条命令同时验证 dumi build 和公开路径约束。**

## Accomplishments

- 新增 `packages/compass-ui/scripts/verify-docs-public-imports.mjs`
- 脚本直接从 `packages/compass-ui/package.json` 的 `exports` 派生允许导入清单
- 会拦截三类问题：
  - `src/`、`dist/` 等内部路径
  - 未声明的 `@xinghunm/compass-ui/*` 子路径
  - 依赖仓库内部 alias 的导入写法
- 根 `package.json` 新增唯一维护入口 `pnpm run docs:verify:compass-ui`
- `docs/DEVELOPMENT.md` 补充了文档验证章节，并明确了与 `release:verify:compass-ui` 的边界

## Verification

- `node packages/compass-ui/scripts/verify-docs-public-imports.mjs`
- `pnpm run docs:verify:compass-ui`

## Notes

- 文档验证和发布验证现在是两条并行但职责清晰的链路：前者验证文档入口与导入边界，后者验证打包产物与真实消费者接入。
