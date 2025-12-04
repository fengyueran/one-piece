# Theme API

主题系统为组件库提供统一的设计规范和样式定制能力。

## 导入

```tsx
import { ThemeProvider, defaultTheme } from '@xinghunm/compass-ui'
```

## ThemeProvider

主题提供者组件，为整个应用或部分组件提供主题上下文。

### 基本用法

```tsx
import { ThemeProvider } from '@xinghunm/compass-ui'

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  )
}
```

### Props

| 属性     | 类型             | 默认值         | 描述           |
| -------- | ---------------- | -------------- | -------------- |
| theme    | `Partial<Theme>` | `defaultTheme` | 自定义主题配置 |
| children | `ReactNode`      | **必需**       | 子组件         |

### 使用默认主题

```tsx
import { ThemeProvider } from '@xinghunm/compass-ui'
;<ThemeProvider>
  <Button>Button with default theme</Button>
</ThemeProvider>
```

### 自定义主题

```tsx
import { ThemeProvider } from '@xinghunm/compass-ui'

const customTheme = {
  colors: {
    primary: '#1890ff',
    success: '#52c41a',
    error: '#ff4d4f',
  },
  spacing: {
    sm: 8,
    md: 16,
    lg: 24,
  },
}

<ThemeProvider theme={customTheme}>
  <Button variant="primary">Custom Themed Button</Button>
</ThemeProvider>
```

### 嵌套主题

```tsx
<ThemeProvider theme={outerTheme}>
  <div>
    <Button>Outer Theme</Button>

    <ThemeProvider theme={innerTheme}>
      <Button>Inner Theme</Button>
    </ThemeProvider>
  </div>
</ThemeProvider>
```

## Theme 接口

完整的主题类型定义。

```typescript
interface Theme {
  colors: {
    // 主色
    primary: string
    primaryHover: string
    primaryActive: string

    // 功能色
    success: string
    warning: string
    error: string
    info: string

    // 文本色
    text: string
    textSecondary: string
    textTertiary: string
    textDisabled: string

    // 背景色
    background: string
    backgroundSecondary: string
    backgroundTertiary: string

    // 边框色
    border: string
    borderSecondary: string
    borderHover: string
  }

  spacing: {
    xs: number // 4
    sm: number // 8
    md: number // 16
    lg: number // 24
    xl: number // 32
    xxl: number // 48
  }

  borderRadius: {
    xs: number // 2
    sm: number // 4
    md: number // 6
    lg: number // 8
    xl: number // 12
  }

  fontSize: {
    xs: number // 12
    sm: number // 14
    md: number // 16
    lg: number // 18
    xl: number // 20
    xxl: number // 24
  }

  fontWeight: {
    light: number // 300
    normal: number // 400
    medium: number // 500
    semibold: number // 600
    bold: number // 700
  }

  lineHeight: {
    tight: number // 1.25
    normal: number // 1.5
    relaxed: number // 1.75
  }

  shadows: {
    sm: string
    md: string
    lg: string
    xl: string
  }

  transitions: {
    fast: string // all 0.1s ease-in-out
    normal: string // all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)
    slow: string // all 0.3s ease-in-out
  }

  breakpoints: {
    xs: string // 480px
    sm: string // 576px
    md: string // 768px
    lg: string // 992px
    xl: string // 1200px
  }
}
```

## 默认主题

```typescript
import { defaultTheme } from '@xinghunm/compass-ui'

// 查看默认主题
console.log(defaultTheme)
```

## 在样式中使用主题

### 使用 styled-components

```tsx
import styled from '@emotion/styled'

const StyledComponent = styled.div`
  /* 使用主题颜色 */
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.background};

  /* 使用主题间距 */
  padding: ${({ theme }) => theme.spacing.md}px;
  margin: ${({ theme }) => theme.spacing.sm}px;

  /* 使用主题字体 */
  font-size: ${({ theme }) => theme.fontSize.md}px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};

  /* 使用主题圆角 */
  border-radius: ${({ theme }) => theme.borderRadius.md}px;

  /* 使用主题过渡 */
  transition: ${({ theme }) => theme.transitions.normal};

  /* 使用主题阴影 */
  box-shadow: ${({ theme }) => theme.shadows.sm};

  /* 响应式断点 */
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSize.lg}px;
  }
`
```

### 使用 useTheme Hook

```tsx
import { useTheme } from '@emotion/react'
import { Theme } from '@xinghunm/compass-ui'

function MyComponent() {
  const theme = useTheme() as Theme

  return <div style={{ color: theme.colors.primary }}>Themed Component</div>
}
```

## 主题定制示例

### 深色主题

```tsx
const darkTheme = {
  colors: {
    primary: '#1890ff',
    background: '#141414',
    backgroundSecondary: '#1f1f1f',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.65)',
    border: '#434343',
  },
}

<ThemeProvider theme={darkTheme}>
  <App />
</ThemeProvider>
```

### 品牌主题

```tsx
const brandTheme = {
  colors: {
    primary: '#6366f1', // Indigo
    success: '#10b981', // Emerald
    warning: '#f59e0b', // Amber
    error: '#ef4444', // Red
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
}

<ThemeProvider theme={brandTheme}>
  <App />
</ThemeProvider>
```

### 紧凑主题

```tsx
const compactTheme = {
  spacing: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
  },
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
  },
}

<ThemeProvider theme={compactTheme}>
  <App />
</ThemeProvider>
```

## TypeScript 支持

```typescript
import type { Theme, ThemeProviderProps } from '@xinghunm/compass-ui'

// 扩展主题类型
interface CustomTheme extends Theme {
  customProperty: string
}

// 自定义主题提供者
interface CustomThemeProviderProps extends Omit<ThemeProviderProps, 'theme'> {
  theme?: Partial<CustomTheme>
}
```

## 最佳实践

### 1. 渐进式定制

```tsx
// 只定制需要的部分
const partialTheme = {
  colors: {
    primary: '#your-brand-color',
  },
}
```

### 2. 主题变量（Design Token）复用

```tsx
const colors = {
  brand: '#6366f1',
  brandLight: '#a5b4fc',
  brandDark: '#4338ca',
}

const theme = {
  colors: {
    primary: colors.brand,
    primaryHover: colors.brandLight,
    primaryActive: colors.brandDark,
  },
}
```

### 3. 响应式主题

```tsx
const responsiveTheme = {
  spacing: {
    sm: 8,
    md: 16,
    lg: 24,
  },
  // 在组件中根据断点调整
}
```

### 4. 主题切换

```tsx
function App() {
  const [isDark, setIsDark] = useState(false)
  const theme = isDark ? darkTheme : lightTheme

  return (
    <ThemeProvider theme={theme}>
      <button onClick={() => setIsDark(!isDark)}>
        Switch to {isDark ? 'Light' : 'Dark'} Theme
      </button>
      <YourApp />
    </ThemeProvider>
  )
}
```
