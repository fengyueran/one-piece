---
title: ConfigProvider 全局配置
nav:
  title: 组件
  order: 2
group:
  title: 其他
  order: 7
---

# ConfigProvider 全局配置

为组件提供统一的全局化配置。

## 何时使用

ConfigProvider 使用 React 的 context 特性，只需在应用外层包裹一次即可全局生效。

- 当需要为整个应用配置国际化文案时。
- 当需要配置全局主题（如深色模式、品牌色）时。
- 当需要管理全局状态（如 Modal 的上下文）时。

## 代码演示

### 国际化与主题切换

切换语言和主题模式。

```tsx
import React, { useState } from 'react'
import { ConfigProvider, Button, DatePicker, Modal } from '@xinghunm/compass-ui'
import zhCN from '@xinghunm/compass-ui/dist/locale/zh_CN'
import enUS from '@xinghunm/compass-ui/dist/locale/en_US'

const ContextModalDemo = () => {
  const [modal, contextHolder] = Modal.useModal()

  return (
    <>
      {contextHolder}
      <Button
        onClick={() => {
          modal.confirm({
            title: 'Context Modal',
            content: 'This modal should inherit locale settings correctly.',
          })
        }}
      >
        Open Hook Modal
      </Button>
    </>
  )
}

export default () => {
  const [locale, setLocale] = useState(zhCN)
  const [themeMode, setThemeMode] = useState('light')

  const toggleLocale = () => {
    setLocale((prev) => (prev.locale === 'zh-CN' ? enUS : zhCN))
  }

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const showConfirm = () => {
    Modal.confirm({
      title: locale.locale === 'zh-CN' ? '确认' : 'Confirm',
      content: locale.locale === 'zh-CN' ? '这是一个确认对话框' : 'This is a confirm dialog',
      onOk: () => console.log('OK'),
    })
  }

  return (
    <ConfigProvider locale={locale} theme={{ defaultMode: themeMode }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          minWidth: 400,
          padding: 20,
          border: '1px solid #eee',
          borderRadius: 8,
          background: themeMode === 'dark' ? '#1f1f1f' : '#fff',
          color: themeMode === 'dark' ? '#fff' : '#000',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginBottom: 20,
            paddingBottom: 20,
            borderBottom: '1px solid #eee',
          }}
        >
          <Button onClick={toggleLocale}>
            Switch to {locale.locale === 'zh-CN' ? 'English' : '中文'}
          </Button>
          <Button onClick={toggleTheme}>
            Switch to {themeMode === 'light' ? 'Dark' : 'Light'}
          </Button>
        </div>

        <div>
          <h3>DatePicker</h3>
          <DatePicker />
        </div>

        <div>
          <h3>Modal</h3>
          <Button onClick={showConfirm}>Open Confirm Modal</Button>
          <div style={{ marginTop: 10 }}>
            <Button onClick={() => Modal.info({ title: 'Info', content: 'Info...' })}>
              Open Info Modal
            </Button>
          </div>
        </div>

        <div>
          <h3>Context-aware Modal (useModal)</h3>
          <ContextModalDemo />
        </div>
      </div>
    </ConfigProvider>
  )
}
```

## API

| 参数     | 说明                         | 类型          | 默认值                     |
| -------- | ---------------------------- | ------------- | -------------------------- |
| locale   | 语言包配置，用于国际化       | `Locale`      | -                          |
| theme    | 主题配置，包括 mode 和 token | `ThemeConfig` | `{ defaultMode: 'light' }` |
| children | 子节点                       | `ReactNode`   | -                          |

## Locale 接口

```typescript
interface Locale {
  locale: string;
  Modal: { ... };
  DatePicker: { ... };
  Pagination: { ... };
  // ...
}
```

## ThemeConfig 接口

```typescript
interface ThemeConfig {
  defaultMode?: 'light' | 'dark'
  token?: DeepPartial<Theme> // 全局 Token 覆盖
  light?: DeepPartial<Theme> // 浅色模式专用 Token 覆盖
  dark?: DeepPartial<Theme> // 深色模式专用 Token 覆盖
}
```
