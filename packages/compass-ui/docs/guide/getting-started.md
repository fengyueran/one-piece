---
title: 快速开始
order: 1
nav:
  title: 指南
  order: 1
---

# 快速开始

## 安装

使用 npm、yarn 或 pnpm 安装:

```bash
# npm
npm install @xinghunm/compass-ui

# yarn
yarn add @xinghunm/compass-ui

# pnpm
pnpm add @xinghunm/compass-ui
```

## 使用

### 完整引入

```tsx
import React from 'react'
import { Button, ConfigProvider } from '@xinghunm/compass-ui'

export default () => (
  <ConfigProvider>
    <Button variant="primary">Hello Compass UI</Button>
  </ConfigProvider>
)
```

### 按需引入

Compass UI 支持 tree-shaking,你可以直接引入需要的组件:

```tsx
import React from 'react'
import Button from '@xinghunm/compass-ui/button'
import ConfigProvider from '@xinghunm/compass-ui/config-provider'

export default () => (
  <ConfigProvider>
    <Button variant="primary">Hello Compass UI</Button>
  </ConfigProvider>
)
```

## 主题定制

Compass UI 提供了强大的主题定制能力,你可以通过 `ConfigProvider` 来定制主题:

```tsx
import React from 'react'
import { Button, ConfigProvider } from '@xinghunm/compass-ui'

export default () => (
  <ConfigProvider
    theme={{
      token: {
        colors: {
          primary: '#722ed1',
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

Compass UI 使用 TypeScript 开发,提供完整的类型定义:

```tsx
import React from 'react'
import type { ButtonProps } from '@xinghunm/compass-ui'
import { Button } from '@xinghunm/compass-ui'

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />
}

export default MyButton
```
