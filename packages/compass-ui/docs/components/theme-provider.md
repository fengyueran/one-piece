---
title: ThemeProvider 主题配置
nav:
  title: 组件
  order: 2
group:
  title: 其他
  order: 7
---

# ThemeProvider 主题配置

主题提供者组件，为子组件提供主题上下文。通常你通过 `ConfigProvider` 间接使用它，但也可以直接使用。

## 何时使用

- 需要高度自定义 Design Token 时。
- 需要实现动态主题切换（Light/Dark）时。

## 内置主题

Compass UI 内置了两套主题配置：

- **Light Theme (默认)**: 适用于亮色背景的标准主题。
- **Dark Theme**: 适用于暗色背景的主题，优化了对比度和阅读体验。

## 代码演示

### 基础用法

使用默认主题。

```tsx
import React from 'react'
import { ThemeProvider, Button } from '@xinghunm/compass-ui'

export default () => (
  <ThemeProvider>
    <div style={{ display: 'flex', gap: '12px' }}>
      <Button variant="primary">Primary Button</Button>
      <Button variant="default">Default Button</Button>
    </div>
  </ThemeProvider>
)
```

### 动态切换

使用 `useTheme` hook 获取当前模式并切换。

```tsx
import React from 'react'
import { ThemeProvider, useTheme, Button } from '@xinghunm/compass-ui'

const ThemeSwitcher = () => {
  const { mode, toggleTheme } = useTheme()
  return (
    <div
      style={{
        padding: 20,
        background: mode === 'dark' ? '#141414' : '#fff',
        color: mode === 'dark' ? '#fff' : '#000',
        transition: 'all 0.3s',
        borderRadius: 8,
        border: '1px solid #eee',
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <span style={{ marginRight: 16 }}>Current Mode: {mode}</span>
        <Button onClick={toggleTheme}>Toggle Theme</Button>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <Button variant="primary">Primary</Button>
        <Button variant="default">Default</Button>
      </div>
    </div>
  )
}

export default () => (
  <ThemeProvider>
    <ThemeSwitcher />
  </ThemeProvider>
)
```

### 自定义颜色

使用 `lightTheme` 和 `darkTheme` 分别配置亮色和暗色模式下的主题。

```tsx
import React from 'react'
import { ThemeProvider, Button, useTheme } from '@xinghunm/compass-ui'

const DemoContent = () => {
  const { toggleTheme } = useTheme()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Button onClick={toggleTheme}>Toggle Light/Dark</Button>
      <div style={{ display: 'flex', gap: '12px' }}>
        <Button variant="primary">Primary (Custom Color)</Button>
        <Button variant="primary" size="large">
          Large Primary
        </Button>
      </div>
    </div>
  )
}

export default () => (
  <ThemeProvider
    lightTheme={{
      colors: {
        primary: '#ff6b35',
        primaryHover: '#ff8c69',
        primaryActive: '#e55a2b',
      },
    }}
    darkTheme={{
      colors: {
        primary: '#d4380d',
        primaryHover: '#ff6b35',
        primaryActive: '#ad2102',
      },
    }}
  >
    <DemoContent />
  </ThemeProvider>
)
```

### 暗色主题

通过设置 `defaultMode="dark"` 开启暗色主题。

```tsx
import React from 'react'
import { ThemeProvider, Button } from '@xinghunm/compass-ui'

export default () => (
  <ThemeProvider defaultMode="dark">
    <div style={{ padding: 20, background: '#141414', color: '#fff' }}>
      <Button variant="primary">Dark Mode Button</Button>
    </div>
  </ThemeProvider>
)
```

### 自定义圆角

自定义 `borderRadius` Token。

```tsx
import React from 'react'
import { ThemeProvider, Button } from '@xinghunm/compass-ui'

export default () => (
  <ThemeProvider
    theme={{
      borderRadius: {
        xs: 0,
        sm: 2,
        md: 4,
        lg: 8,
        xl: 16,
      },
    }}
  >
    <div style={{ display: 'flex', gap: '12px' }}>
      <Button variant="primary" size="small">
        Small (Radius 4)
      </Button>
      <Button variant="primary">Medium (Radius 4)</Button>
      <Button variant="primary" size="large">
        Large (Radius 8)
      </Button>
    </div>
  </ThemeProvider>
)
```

## API

| 参数        | 说明                       | 类型                 | 默认值    |
| ----------- | -------------------------- | -------------------- | --------- |
| theme       | 通用主题配置，覆盖所有模式 | `DeepPartial<Theme>` | -         |
| lightTheme  | 仅 Light 模式配置          | `DeepPartial<Theme>` | -         |
| darkTheme   | 仅 Dark 模式配置           | `DeepPartial<Theme>` | -         |
| defaultMode | 默认主题模式               | `'light' \| 'dark'`  | `'light'` |
| children    | 子组件                     | `ReactNode`          | -         |

## Hooks

### useTheme

获取当前主题上下文。

```tsx
const {
  theme, //当前激活的完整 Theme 对象
  mode, // 当前模式 'light' | 'dark'
  toggleTheme, // 切换模式函数
  setMode, // 设置模式函数
} = useTheme()
```
