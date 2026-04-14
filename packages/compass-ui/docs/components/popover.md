---
title: Popover 浮层卡片
nav:
  title: 组件
  order: 2
group:
  title: 导航
  order: 5
---

# Popover 浮层卡片

承载轻量交互内容的锚点浮层。

## 何时使用

- 需要在触发元素附近展示一段说明、配置项或轻量表单时
- 内容比 `Tooltip` 更复杂，但又不需要 `Modal` 这类阻断式对话框时

## 代码演示

### 基础用法

```tsx
import React from 'react'
import { Button, Popover } from '@xinghunm/compass-ui'

export default () => (
  <Popover title="筛选提示" content="这里可以放更完整的说明或轻量配置。">
    <Button>Open Popover</Button>
  </Popover>
)
```

### 受控模式

```tsx
import React, { useState } from 'react'
import { Button, Popover } from '@xinghunm/compass-ui'

export default () => {
  const [open, setOpen] = useState(false)

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      title="受控 Popover"
      content="点击外部区域或按 Escape 也会关闭。"
    >
      <Button>{open ? 'Close' : 'Open'}</Button>
    </Popover>
  )
}
```

### Hover 触发

```tsx
import React from 'react'
import { Button, Popover } from '@xinghunm/compass-ui'

export default () => (
  <Popover trigger="hover" title="Hover card" content="适合承载较短的补充说明。">
    <Button>Hover me</Button>
  </Popover>
)
```

## 交互边界与可访问性

- `Popover` 默认使用 `click` 触发，并通过 `aria-expanded`、`aria-controls` 把触发器和浮层关联起来。
- 外部点击和 `Escape` 都会关闭当前浮层；浮层内部点击不会被当成外部关闭处理。
- `Popover` 适合承载轻量交互内容，但仍不建议把长表单或复杂流程塞进去；更重的编辑流程应使用 `Drawer` 或 `Modal`。
- 如果只是纯提示文案，优先使用 `Tooltip`，不要把 `Popover` 当成更重的 Tooltip 来滥用。

## API

通用属性参考：[通用属性](/guide/common-props)

| 参数         | 说明                 | 类型                                     | 默认值    |
| ------------ | -------------------- | ---------------------------------------- | --------- |
| title        | 浮层标题             | `ReactNode`                              | -         |
| content      | 浮层内容             | `ReactNode`                              | -         |
| children     | 触发元素             | `ReactElement`                           | -         |
| trigger      | 触发方式             | `'click' \| 'hover'`                     | `'click'` |
| placement    | 弹层位置             | `PopoverPlacement`                       | `'top'`   |
| open         | 受控展开状态         | `boolean`                                | -         |
| defaultOpen  | 默认展开状态         | `boolean`                                | `false`   |
| onOpenChange | 展开状态变化时的回调 | `(open: boolean) => void`                | -         |
| disabled     | 是否禁用             | `boolean`                                | `false`   |
| classNames   | 语义化类名           | `{ root, overlay, header, title, body }` | -         |
| styles       | 语义化样式           | `{ root, overlay, header, title, body }` | -         |

## 当前约束

- 当前实现优先保证触发、关闭和基础语义稳定，不提供箭头、嵌套层级管理或复杂焦点陷阱。
- 更细的 overlay 策略与边界说明，会在项目的复杂交互基础层文档中统一维护。
