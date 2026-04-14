---
title: 快速开始
order: 1
nav:
  title: 指南
  order: 1
---

# 快速开始

本页负责回答 3 个问题：怎么安装、怎么开始用、公开导入应该怎么写。组件列表看 [组件总览](/components)，导入边界看 [API 参考](/api)。

## 安装

```bash
# npm
npm install @xinghunm/compass-ui

# yarn
yarn add @xinghunm/compass-ui

# pnpm
pnpm add @xinghunm/compass-ui
```

## 从根入口开始

大多数业务代码应优先从根入口导入高频组件和主题门面能力：

```tsx
import React from 'react'
import { Button, ConfigProvider, Input, Textarea, defaultTheme } from '@xinghunm/compass-ui'

export default () => (
  <ConfigProvider theme={{ token: defaultTheme }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
      <Input placeholder="项目名称" />
      <Textarea placeholder="项目描述" rows={4} />
      <Button variant="primary">Hello Compass UI</Button>
    </div>
  </ConfigProvider>
)
```

如果你刚接入文本输入能力，默认推荐：

- 单行输入使用 `Input`
- 多行输入使用 `Textarea`
- `InputField` 仍然可用，但主要用于兼容既有代码

## 使用公开子路径

当前公开子路径主要用于资源型和领域型能力：

```tsx
import React from 'react'
import { Button, ConfigProvider, defaultTheme } from '@xinghunm/compass-ui'
import { zhCN } from '@xinghunm/compass-ui/locale'

export default () => (
  <ConfigProvider locale={zhCN} theme={{ token: defaultTheme }}>
    <Button variant="primary">你好，Compass UI</Button>
  </ConfigProvider>
)
```

可用的公开路径只有：

- `@xinghunm/compass-ui`
- `@xinghunm/compass-ui/theme`
- `@xinghunm/compass-ui/locale`
- `@xinghunm/compass-ui/icons`

不要从 `src/`、`dist/` 或未声明的 `@xinghunm/compass-ui/*` 子路径导入。

## 主题定制

你可以通过 `ConfigProvider` 传入主题 token 覆盖默认值：

```tsx
import React from 'react'
import { Button, ConfigProvider } from '@xinghunm/compass-ui'

export default () => (
  <ConfigProvider
    theme={{
      token: {
        colors: {
          primary: '#1677ff',
        },
        components: {
          button: {
            borderRadius: { md: '20px' },
            padding: { md: '0 30px' },
          },
        },
      },
    }}
  >
    <Button variant="primary">自定义主题按钮</Button>
  </ConfigProvider>
)
```

## TypeScript

`compass-ui` 提供根入口的类型导出：

```tsx
import React from 'react'
import type { ButtonProps } from '@xinghunm/compass-ui'
import { Button } from '@xinghunm/compass-ui'

const MyButton: React.FC<ButtonProps> = (props) => <Button {...props} />

export default MyButton
```

## 下一步

- 想看当前有哪些组件：前往 [组件总览](/components)
- 想确认每个公开路径的职责：前往 [API 参考](/api)
