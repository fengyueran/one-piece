---
title: Popconfirm 气泡确认框
nav:
  title: 组件
  order: 2
group:
  title: 导航
  order: 5
---

# Popconfirm 气泡确认框

用于承载轻量确认动作的锚点浮层。

## 何时使用

- 删除、关闭、移出等操作需要一次就地确认时
- 你希望保留用户当前上下文，而不是弹出完整 `Modal` 时

## 代码演示

### 基础用法

```tsx
import React from 'react'
import { Button, Popconfirm } from '@xinghunm/compass-ui'

export default () => (
  <Popconfirm title="确认删除这条记录？" onConfirm={() => console.log('confirmed')}>
    <Button danger>Delete</Button>
  </Popconfirm>
)
```

### 带补充说明

```tsx
import React from 'react'
import { Button, Popconfirm } from '@xinghunm/compass-ui'

export default () => (
  <Popconfirm
    title="确认停用当前项目？"
    description="停用后不会删除数据，但会阻止新的访问请求。"
    onConfirm={() => console.log('confirmed')}
  >
    <Button>Disable</Button>
  </Popconfirm>
)
```

### 异步确认

```tsx
import React from 'react'
import { Button, Popconfirm } from '@xinghunm/compass-ui'

export default () => (
  <Popconfirm
    title="确认提交？"
    onConfirm={() => new Promise((resolve) => setTimeout(resolve, 1000))}
  >
    <Button type="primary">Submit</Button>
  </Popconfirm>
)
```

### 自定义主题

```tsx
import React from 'react'
import { Button, ConfigProvider, Popconfirm } from '@xinghunm/compass-ui'

export default () => (
  <ConfigProvider
    theme={{
      token: {
        components: {
          popconfirm: {
            minWidth: '280px',
            titleColor: '#0f172a',
            descriptionColor: '#475569',
            actionsGap: '12px',
          },
        },
      },
    }}
  >
    <Popconfirm
      title="确认发布当前版本？"
      description="确认区的最小宽度、文案颜色和操作间距都可以单独调整。"
      onConfirm={() => Promise.resolve()}
    >
      <Button variant="primary">Publish</Button>
    </Popconfirm>
  </ConfigProvider>
)
```

更多可配置字段见 [主题 Token](/guide/theme-tokens)。

## 主题变量 (Design Token)

| Token Name                                   | Description  | Default               |
| -------------------------------------------- | ------------ | --------------------- |
| `components.popconfirm.minWidth`             | 最小宽度     | `240px`               |
| `components.popconfirm.titleColor`           | 标题颜色     | `rgba(0, 0, 0, 0.88)` |
| `components.popconfirm.titleFontSize`        | 标题字体大小 | `14px`                |
| `components.popconfirm.descriptionColor`     | 描述文字颜色 | `rgba(0, 0, 0, 0.65)` |
| `components.popconfirm.descriptionFontSize`  | 描述字体大小 | `13px`                |
| `components.popconfirm.descriptionMarginTop` | 描述上间距   | `8px`                 |
| `components.popconfirm.actionsGap`           | 操作按钮间距 | `8px`                 |
| `components.popconfirm.actionsMarginTop`     | 操作区上间距 | `14px`                |

## 交互边界与可访问性

- `Popconfirm` 建立在 `Popover` 的打开/关闭契约之上，触发器同样通过 `aria-expanded`、`aria-controls` 关联浮层。
- 点击外部区域或按 `Escape` 会关闭浮层；点击“取消”也会立即关闭。
- 点击“确定”会先执行 `onConfirm`。如果回调返回 Promise，确认按钮会进入 loading 状态，待 Promise 完成后再关闭浮层。
- `Popconfirm` 只适合轻量确认，不适合承载长文案、多步操作或复杂表单；这类场景应使用 `Modal`。

## API

通用属性参考：[通用属性](/guide/common-props)

| 参数         | 说明                 | 类型                                                         | 默认值    |
| ------------ | -------------------- | ------------------------------------------------------------ | --------- |
| title        | 确认标题             | `ReactNode`                                                  | -         |
| description  | 补充描述             | `ReactNode`                                                  | -         |
| children     | 触发元素             | `ReactElement`                                               | -         |
| trigger      | 触发方式             | `'click' \| 'hover'`                                         | `'click'` |
| placement    | 弹层位置             | `PopoverPlacement`                                           | `'top'`   |
| open         | 受控展开状态         | `boolean`                                                    | -         |
| defaultOpen  | 默认展开状态         | `boolean`                                                    | `false`   |
| onOpenChange | 展开状态变化时的回调 | `(open: boolean) => void`                                    | -         |
| onConfirm    | 点击确认后的回调     | `(event?: MouseEvent<HTMLElement>) => void \| Promise<void>` | -         |
| onCancel     | 点击取消后的回调     | `(event?: MouseEvent<HTMLElement>) => void`                  | -         |
| okText       | 确认按钮文案         | `ReactNode`                                                  | `'确定'`  |
| cancelText   | 取消按钮文案         | `ReactNode`                                                  | `'取消'`  |
| disabled     | 是否禁用             | `boolean`                                                    | `false`   |
| classNames   | 语义化类名           | `{ root, overlay, title, description, actions }`             | -         |
| styles       | 语义化样式           | `{ root, overlay, title, description, actions }`             | -         |
