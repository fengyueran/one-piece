---
title: Tooltip 文字提示
nav:
  title: 组件
  order: 2
group:
  title: 数据展示
  order: 3
---

# Tooltip 文字提示

简单的文字提示气泡框。

## 何时使用

- 需要对图标、按钮或短文本提供补充说明时
- 内容较短，不适合使用更重的弹层组件时

## 代码演示

### 基础用法

鼠标移入时显示提示内容。

```tsx
import React from 'react'
import { Tooltip, Button } from '@xinghunm/compass-ui'

export default () => (
  <Tooltip content="这是一个提示信息">
    <Button>Hover me</Button>
  </Tooltip>
)
```

### 点击触发

通过 `trigger="click"` 改为点击触发。

```tsx
import React from 'react'
import { Tooltip, Button } from '@xinghunm/compass-ui'

export default () => (
  <Tooltip content="点击后显示" trigger="click">
    <Button>Click me</Button>
  </Tooltip>
)
```

### 不同位置

通过 `placement` 控制提示框位置，支持 12 个方向。

```tsx
import React from 'react'
import { Tooltip, Button } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
    <div style={{ display: 'flex', gap: 12 }}>
      <Tooltip content="TL" placement="top-start">
        <Button>TL</Button>
      </Tooltip>
      <Tooltip content="Top" placement="top">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip content="TR" placement="top-end">
        <Button>TR</Button>
      </Tooltip>
    </div>
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <div style={{ display: 'grid', gap: 12 }}>
        <Tooltip content="LT" placement="left-start">
          <Button>LT</Button>
        </Tooltip>
        <Tooltip content="Left" placement="left">
          <Button>Left</Button>
        </Tooltip>
        <Tooltip content="LB" placement="left-end">
          <Button>LB</Button>
        </Tooltip>
      </div>
      <div style={{ width: 120, height: 80 }} />
      <div style={{ display: 'grid', gap: 12 }}>
        <Tooltip content="RT" placement="right-start">
          <Button>RT</Button>
        </Tooltip>
        <Tooltip content="Right" placement="right">
          <Button>Right</Button>
        </Tooltip>
        <Tooltip content="RB" placement="right-end">
          <Button>RB</Button>
        </Tooltip>
      </div>
    </div>
    <div style={{ display: 'flex', gap: 12 }}>
      <Tooltip content="BL" placement="bottom-start">
        <Button>BL</Button>
      </Tooltip>
      <Tooltip content="Bottom" placement="bottom">
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip content="BR" placement="bottom-end">
        <Button>BR</Button>
      </Tooltip>
    </div>
  </div>
)
```

### 受控模式

通过 `open` 和 `onOpenChange` 控制显示状态。

```tsx
import React, { useState } from 'react'
import { Tooltip, Button } from '@xinghunm/compass-ui'

export default () => {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Tooltip content="受控提示" open={open} onOpenChange={setOpen}>
        <Button>Target</Button>
      </Tooltip>
      <Button onClick={() => setOpen((prev) => !prev)}>{open ? '隐藏' : '显示'}</Button>
    </div>
  )
}
```

### 自定义样式

通过 `classNames` 和 `styles` 自定义提示框和箭头样式。

```tsx
import React from 'react'
import { Tooltip, Button } from '@xinghunm/compass-ui'

export default () => (
  <Tooltip
    content="自定义样式提示"
    classNames={{ content: 'custom-tooltip-content' }}
    styles={{
      content: { background: '#1677ff', borderRadius: 8, padding: '8px 12px' },
      arrow: { background: '#1677ff' },
    }}
  >
    <Button>Custom</Button>
  </Tooltip>
)
```

## 交互边界与可访问性

- `Tooltip` 仍然是轻量提示，不承载表单或确认操作；需要可点击内容时应使用后续的 `Popover` / `Popconfirm`。
- 触发元素在浮层打开时会通过 `aria-describedby` 指向当前提示层。
- `trigger="click"` 时，按 `Escape` 可以关闭提示层；提示层内部点击不会立即把自己关闭。
- `disabled` 或空内容时不会渲染提示层。

## API

通用属性参考：[通用属性](/guide/common-props)

| 参数            | 说明                   | 类型                                                                                                                                                                 | 默认值    |
| --------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| content         | 提示内容               | `ReactNode`                                                                                                                                                          | -         |
| children        | 触发元素               | `ReactNode`                                                                                                                                                          | -         |
| trigger         | 触发方式               | `'hover' \| 'click'`                                                                                                                                                 | `'hover'` |
| placement       | 弹层位置               | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'top'`   |
| open            | 受控显示状态           | `boolean`                                                                                                                                                            | -         |
| defaultOpen     | 默认显示状态           | `boolean`                                                                                                                                                            | `false`   |
| onOpenChange    | 显示状态变化时的回调   | `(open: boolean) => void`                                                                                                                                            | -         |
| disabled        | 是否禁用提示           | `boolean`                                                                                                                                                            | `false`   |
| mouseEnterDelay | 鼠标移入延迟，单位毫秒 | `number`                                                                                                                                                             | `0`       |
| mouseLeaveDelay | 鼠标移出延迟，单位毫秒 | `number`                                                                                                                                                             | `100`     |
| classNames      | 语义化类名             | `{ root?: string; overlay?: string; content?: string; arrow?: string }`                                                                                              | -         |
| styles          | 语义化样式             | `{ root?: CSSProperties; overlay?: CSSProperties; content?: CSSProperties; arrow?: CSSProperties }`                                                                  | -         |

## 主题变量 (Design Token)

<details>
<summary>组件 Token (components.tooltip)</summary>

| 变量名                               | 说明           |
| ------------------------------------ | -------------- |
| `components.tooltip.zIndex`          | 提示框层级     |
| `components.tooltip.backgroundColor` | 提示框背景色   |
| `components.tooltip.contentColor`    | 提示框文字色   |
| `components.tooltip.boxShadow`       | 提示框阴影     |
| `components.tooltip.borderRadius`    | 提示框圆角     |
| `components.tooltip.padding`         | 提示框内边距   |
| `components.tooltip.maxWidth`        | 提示框最大宽度 |
| `components.tooltip.fontSize`        | 提示框字体大小 |

</details>
