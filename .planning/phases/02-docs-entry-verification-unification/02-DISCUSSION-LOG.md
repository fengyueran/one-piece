# Phase 2: 文档入口与验证统一 - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-14T10:20:00+08:00
**Phase:** 02-文档入口与验证统一
**Areas discussed:** 文档主入口, demo 承载方式, 验证链路, 可访问性覆盖

---

## 文档主入口

| Option                | Description                                                                   | Selected |
| --------------------- | ----------------------------------------------------------------------------- | -------- |
| 延续包内 dumi 站      | 以 `packages/compass-ui` 的 dumi 文档作为唯一公开入口，最快收口已有文档与导航 | ✓        |
| 改为 `apps/docs` 主站 | 把 `apps/docs` 做成主文档入口，再让 `compass-ui` 文档迁移过去                 |          |
| 双站并行              | 同时维护 dumi 与独立 docs 站                                                  |          |

**User's choice:** `[auto]` 选择“延续包内 dumi 站”
**Notes:** 推荐值。Phase 2 的目标是统一入口，不是新增一条平行入口。

---

## Demo 承载方式

| Option          | Description                                              | Selected |
| --------------- | -------------------------------------------------------- | -------- |
| 文档内嵌 demo   | 继续依赖 dumi 文档页中的示例与源码块，和文档内容一起维护 | ✓        |
| 独立 demo app   | 为 `compass-ui` 再建立一个独立 demo 应用                 |          |
| Storybook-first | 新建 Storybook 作为 demo 主承载                          |          |

**User's choice:** `[auto]` 选择“文档内嵌 demo”
**Notes:** 推荐值。现有 dumi 站已经可承载示例，新增站点只会扩大维护面。

---

## 验证链路

| Option               | Description                                                     | Selected |
| -------------------- | --------------------------------------------------------------- | -------- |
| `docs:build` + smoke | 基于现有 dumi 构建和公开 API 校验补齐文档 smoke，是当前最短路径 | ✓        |
| 直接引入完整 E2E     | 新增浏览器 E2E 体系覆盖文档与 demo                              |          |
| 仅人工检查           | 构建通过后依赖手工浏览与点查                                    |          |

**User's choice:** `[auto]` 选择“`docs:build` + smoke”
**Notes:** 推荐值。Phase 1 已有 `verify-public-api.mjs`，Phase 2 应复用而不是重造。

---

## 可访问性覆盖

| Option                         | Description                                                           | Selected |
| ------------------------------ | --------------------------------------------------------------------- | -------- |
| 现有 Jest 体系补键盘验证       | 在已有 Testing Library 测试中补核心组件与文档示例的键盘/a11y 最小覆盖 | ✓        |
| 只做静态示例构建               | 不新增交互验证，只保证示例能编译                                      |          |
| 直接上 Playwright + a11y audit | 新增浏览器级自动化作为 Phase 2 前置                                   |          |

**User's choice:** `[auto]` 选择“现有 Jest 体系补键盘验证”
**Notes:** 推荐值。当前仓库没有统一 E2E 基础设施，先补最小真实交互验证更稳妥。

---

## the agent's Discretion

- 文档目录重排与首页信息架构
- smoke 命令与脚本拆分方式
- 首批核心组件验证名单

## Deferred Ideas

- `apps/docs` 统一跨包文档入口
- 为 `compass-ui` 增设 Storybook
- 新增浏览器级文档站 E2E 基础设施
