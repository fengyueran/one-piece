---
hero:
  title: Compass UI
  description: 面向真实项目复用的 React 组件库，先提供稳定公开 API，再补齐常用组件能力。
  actions:
    - text: 安装指南
      link: /guide/getting-started
    - text: 组件目录
      link: /components
    - text: API 参考
      link: /api

features:
  - title: 单一公开入口
    description: 当前阶段以 dumi 文档站作为唯一对外入口，安装、组件总览与 API 说明都在同一站点内完成。
  - title: 真实公开导入
    description: 所有示例都只使用 `@xinghunm/compass-ui` 与已声明的公开子路径，避免文档和 npm 消费行为脱节。
  - title: 渐进式组件建设
    description: 先沉淀高频基础组件与主题能力，再逐步补齐复杂交互与更高阶的场景支持。
---

# Compass UI

Compass UI 是一个持续沉淀中的 React 组件库仓库，目标是把真实项目里反复复用的 UI 能力收敛成可发布、可验证、可维护的公共资产。

## 你可以从这里开始

- [安装指南](/guide/getting-started)：了解安装方式、根入口导入和公开子路径用法。
- [组件目录](/components)：浏览当前已公开组件、组件分组和后续补齐方向。
- [API 参考](/api)：查看根入口、`/theme`、`/locale`、`/icons` 四类公开导出边界。

## 安装

```bash
pnpm add @xinghunm/compass-ui
```

## 最小示例

```tsx
import React from 'react'
import { Button, ConfigProvider, defaultTheme } from '@xinghunm/compass-ui'

export default () => (
  <ConfigProvider theme={{ token: defaultTheme }}>
    <Button variant="primary">Hello Compass UI</Button>
  </ConfigProvider>
)
```

## 当前公开能力

- 根入口：高频组件、`ConfigProvider`、`ThemeProvider`、`defaultTheme` 与主要类型。
- `@xinghunm/compass-ui/theme`：主题上下文与主题扩展能力。
- `@xinghunm/compass-ui/locale`：语言包资源。
- `@xinghunm/compass-ui/icons`：图标资源。

## 文档约定

- 文档站就是当前唯一公开入口，不额外引入 `apps/docs` 或 Storybook 作为第二站点。
- 示例代码必须与 npm 消费路径一致，只能使用根入口或已声明的公开子路径。
- 组件文档优先记录已经实现并可验证的行为，不提前承诺尚未稳定的交互细节。
