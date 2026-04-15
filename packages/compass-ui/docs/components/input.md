---
title: Input 输入框
nav:
  title: 组件
  order: 2
group:
  title: 数据录入
  order: 2
---

# Input 输入框

`Input` 是 `compass-ui` 推荐的单行文本输入门面，用于承载常见文本、搜索和密码输入场景。

## 何时使用

- 需要单行文本输入时
- 需要统一的 `size`、`status`、`allowClear`、前后缀与密码显隐能力时
- 需要作为 `AutoComplete`、`DatePicker` 等输入型组件的基础视觉与交互语义时

## 代码演示

### 基础用法

```tsx
import React from 'react'
import { Input } from '@xinghunm/compass-ui'

export default () => <Input placeholder="请输入内容" />
```

### 不同尺寸与状态

```tsx
import React from 'react'
import { Input } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <Input size="large" placeholder="Large" />
    <Input size="medium" placeholder="Medium" />
    <Input size="small" placeholder="Small" />
    <Input status="error" placeholder="Error status" />
    <Input status="warning" placeholder="Warning status" />
  </div>
)
```

### 带清除按钮

```tsx
import React, { useState } from 'react'
import { Input } from '@xinghunm/compass-ui'

export default () => {
  const [value, setValue] = useState('可清除的内容')

  return (
    <Input
      value={value}
      onChange={(event) => setValue(event.target.value)}
      allowClear
      placeholder="可清除"
    />
  )
}
```

### 密码与搜索

```tsx
import React from 'react'
import { Input } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <Input type="password" placeholder="请输入密码" />
    <Input type="search" placeholder="搜索关键词" />
  </div>
)
```

### 前缀与后缀

```tsx
import React from 'react'
import { Input } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <Input prefix="¥" placeholder="请输入金额" />
    <Input suffix=".com" placeholder="请输入域名" />
    <Input prefix="https://" suffix=".com" placeholder="请输入网址" />
  </div>
)
```

### 自定义样式

```tsx
import React from 'react'
import { Input } from '@xinghunm/compass-ui'

export default () => (
  <Input
    placeholder="Custom Input Style"
    classNames={{
      root: 'my-input-root',
      input: 'my-input-element',
      prefix: 'my-input-prefix',
    }}
    styles={{
      root: { border: '2px dashed #1890ff', padding: '4px' },
      input: { color: '#722ed1', fontWeight: 'bold' },
      prefix: { color: '#faad14', fontWeight: 'bold' },
    }}
    prefix="Tags:"
  />
)
```

## 键盘与可访问性

- 默认渲染为原生 `input`，可直接被屏幕阅读器识别为文本输入框
- 按 `Tab` 可聚焦输入框
- 按 `Enter` 会触发 `onPressEnter`
- 开启 `allowClear` 时，清除按钮默认不进入 Tab 序列，点击后会把焦点还给输入框

## 兼容说明

- 新代码推荐使用 `Input`
- `InputField` 仍然可用，但当前阶段只作为兼容入口保留
- `Input` 与 `InputField` 共享同一套底层实现与类型契约

## API

通用属性参考：[通用属性](/guide/common-props)

| 属性           | 说明                | 类型                                               | 默认值     |
| -------------- | ------------------- | -------------------------------------------------- | ---------- |
| `type`         | 输入框类型          | `'text' \| 'password' \| 'search'`                 | `'text'`   |
| `value`        | 受控输入值          | `string \| number`                                 | -          |
| `defaultValue` | 非受控初始值        | `string \| number`                                 | -          |
| `placeholder`  | 占位文案            | `string`                                           | -          |
| `disabled`     | 是否禁用            | `boolean`                                          | `false`    |
| `fullWidth`    | 是否撑满父容器宽度  | `boolean`                                          | `false`    |
| `size`         | 组件尺寸            | `'small' \| 'medium' \| 'large'`                   | `'medium'` |
| `status`       | 校验状态            | `'error' \| 'warning'`                             | -          |
| `prefix`       | 前缀内容            | `ReactNode`                                        | -          |
| `suffix`       | 后缀内容            | `ReactNode`                                        | -          |
| `allowClear`   | 是否显示清除按钮    | `boolean`                                          | `false`    |
| `onChange`     | 输入值变化回调      | `(event: ChangeEvent<HTMLInputElement>) => void`   | -          |
| `onPressEnter` | 按下 Enter 时的回调 | `(event: KeyboardEvent<HTMLInputElement>) => void` | -          |
| `classNames`   | 语义化类名覆写      | `InputProps['classNames']`                         | -          |
| `styles`       | 语义化样式覆写      | `InputProps['styles']`                             | -          |

### classNames / styles 插槽

`classNames` 与 `styles` 使用相同的 slot key。

| 插槽名   | 说明     |
| -------- | -------- |
| `root`   | 根容器   |
| `input`  | 输入区域 |
| `prefix` | 前缀区域 |
| `suffix` | 后缀区域 |
| `clear`  | 清除按钮 |
