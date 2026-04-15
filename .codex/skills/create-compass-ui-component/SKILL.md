---
name: create-compass-ui-component
description: 在当前 monorepo 根目录为 `packages/compass-ui` 创建或脚手架化新组件的路由 skill。用于用户从仓库根目录发起组件创建请求时，明确把任务收敛到 `packages/compass-ui` 的组件约定、目录结构、测试要求和文档结构，而不是误解为全仓库通用组件生成器。
---

# 创建 Compass UI 组件

## 概述

这个 skill 是仓库根目录的薄路由入口。
当用户在 monorepo 根目录要求“新增组件”“脚手架一个组件”“按 create-component 建组件”时，优先使用这个 skill，把任务明确路由到 `packages/compass-ui`，避免把需求误判为其他包的通用模块生成。

## 工作流

1. 先确认目标包是 `packages/compass-ui`。
2. 把 `packages/compass-ui` 视为组件工作区根目录。
3. 阅读并遵循包内 skill：
   - `packages/compass-ui/.codex/skills/create-component/SKILL.md`
4. 组件实现、测试、文档、导出更新都以包内 `create-component` 的要求为准，不在这里重复维护第二套规范。

## 使用边界

- 这个 skill 只服务 `compass-ui`。
- 不要把它用于 `apps/` 下的页面组件、其他 `packages/*` 的通用模块，或整个 monorepo 的脚手架生成。
- 如果用户要的是仓库级通用生成器，应单独创建新的根级 skill，而不是继续扩展这个路由 skill。

## 执行要求

- 新文件路径仍然遵守仓库 Kebab Case 规范。
- `packages/compass-ui/src/index.ts` 只允许作为导出入口，不写业务逻辑。
- 对外暴露的公共 API 需要补充 TSDoc。
- 组件文档必须使用中文，并对齐 `compass-ui` 现有组件文档结构。

## 参考

- 包内实现规范：`packages/compass-ui/.codex/skills/create-component/SKILL.md`
- 包内入口元数据：`packages/compass-ui/.codex/skills/create-component/agents/openai.yaml`
