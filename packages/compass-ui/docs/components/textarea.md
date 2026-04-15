---
title: Textarea 文本域
nav:
  title: 组件
  order: 2
group:
  title: 数据录入
  order: 2
---

# Textarea 文本域

`Textarea` 是 `compass-ui` 推荐的多行文本输入门面，用于评论、备注、描述等长文本录入场景。

## 何时使用

- 需要多行输入内容时
- 需要与 `Input` 保持一致的 `size`、`status`、`disabled` 与前后缀语义时
- 需要基础清空能力与统一视觉风格时

## 代码演示

### 基础用法

```tsx
import React from 'react'
import { Textarea } from '@xinghunm/compass-ui'

export default () => <Textarea placeholder="请输入描述" />
```

### 不同尺寸与状态

```tsx
import React from 'react'
import { Textarea } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <Textarea size="large" placeholder="Large textarea" />
    <Textarea size="medium" placeholder="Medium textarea" />
    <Textarea size="small" placeholder="Small textarea" />
    <Textarea status="error" placeholder="Error status" />
    <Textarea status="warning" placeholder="Warning status" />
  </div>
)
```

### 带清除按钮

```tsx
import React, { useState } from 'react'
import { Textarea } from '@xinghunm/compass-ui'

export default () => {
  const [value, setValue] = useState('第一行\n第二行')

  return (
    <Textarea
      value={value}
      allowClear
      rows={5}
      onChange={(event) => setValue(event.target.value)}
      placeholder="可清除的多行内容"
    />
  )
}
```

### 前缀与后缀

```tsx
import React from 'react'
import { Textarea } from '@xinghunm/compass-ui'

export default () => (
  <Textarea
    prefix="备注"
    suffix={<span style={{ fontSize: 12, color: '#999' }}>最多 200 字</span>}
    placeholder="请输入备注"
  />
)
```

## 键盘与可访问性

- 默认渲染为原生 `textarea`
- 按 `Tab` 可聚焦输入框
- 开启 `allowClear` 时，清除按钮不进入 Tab 序列，点击后会把焦点还给文本域
- `status` 仅表达视觉校验状态，不会覆盖浏览器原生文本域语义

## API

通用属性参考：[通用属性](/guide/common-props)

| 属性           | 说明                | 类型                                                  | 默认值     |
| -------------- | ------------------- | ----------------------------------------------------- | ---------- |
| `value`        | 受控输入值          | `string`                                              | -          |
| `defaultValue` | 非受控初始值        | `string`                                              | -          |
| `rows`         | 默认显示行数        | `number`                                              | `4`        |
| `placeholder`  | 占位文案            | `string`                                              | -          |
| `disabled`     | 是否禁用            | `boolean`                                             | `false`    |
| `fullWidth`    | 是否撑满父容器宽度  | `boolean`                                             | `false`    |
| `size`         | 组件尺寸            | `'small' \| 'medium' \| 'large'`                      | `'medium'` |
| `status`       | 校验状态            | `'error' \| 'warning'`                                | -          |
| `prefix`       | 前缀内容            | `ReactNode`                                           | -          |
| `suffix`       | 后缀内容            | `ReactNode`                                           | -          |
| `allowClear`   | 是否显示清除按钮    | `boolean`                                             | `false`    |
| `onChange`     | 输入值变化回调      | `(event: ChangeEvent<HTMLTextAreaElement>) => void`   | -          |
| `onPressEnter` | 按下 Enter 时的回调 | `(event: KeyboardEvent<HTMLTextAreaElement>) => void` | -          |
| `classNames`   | 语义化类名覆写      | `TextareaProps['classNames']`                         | -          |
| `styles`       | 语义化样式覆写      | `TextareaProps['styles']`                             | -          |

### classNames / styles 插槽

`classNames` 与 `styles` 使用相同的 slot key。

| 插槽名     | 说明     |
| ---------- | -------- |
| `root`     | 根容器   |
| `textarea` | 文本域   |
| `prefix`   | 前缀区域 |
| `suffix`   | 后缀区域 |
| `clear`    | 清除按钮 |
