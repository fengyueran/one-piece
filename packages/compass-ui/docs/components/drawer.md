---
title: Drawer 抽屉
nav:
  title: 组件
  order: 2
group:
  title: 反馈
  order: 4
---

# Drawer 抽屉

从页面侧边滑出的阻断式浮层，用于承载编辑、详情和补充操作流。

## 何时使用

- 需要保留当前页面上下文，同时展示更多表单或详情内容时
- 内容比 `Popover` 更重，但又不希望打断成居中的 `Modal` 时

## 代码演示

### 基础用法

```tsx
import React, { useState } from 'react'
import { Button, Drawer } from '@xinghunm/compass-ui'

export default () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer isOpen={open} title="编辑资料" onCancel={() => setOpen(false)}>
        <p>这里适合放更完整的表单或详情内容。</p>
      </Drawer>
    </>
  )
}
```

### 左侧展开

```tsx
import React, { useState } from 'react'
import { Button, Drawer } from '@xinghunm/compass-ui'

export default () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Left Drawer</Button>
      <Drawer isOpen={open} placement="left" title="筛选条件" onCancel={() => setOpen(false)}>
        <p>左侧抽屉适合导航或筛选类补充面板。</p>
      </Drawer>
    </>
  )
}
```

### 自定义页脚

```tsx
import React, { useState } from 'react'
import { Button, Drawer } from '@xinghunm/compass-ui'

export default () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Drawer with Footer</Button>
      <Drawer
        isOpen={open}
        title="编辑成员"
        onCancel={() => setOpen(false)}
        footer={
          <>
            <Button onClick={() => setOpen(false)}>取消</Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              保存
            </Button>
          </>
        }
      >
        <p>抽屉页脚由调用方完全控制，适合放保存或提交动作。</p>
      </Drawer>
    </>
  )
}
```

## 交互边界与可访问性

- `Drawer` 与 `Modal` 同属页面级 overlay，都通过 portal 渲染到 `document.body`，并使用 `mask`、关闭按钮和 `Escape` 形成统一关闭契约。
- 打开时组件会把焦点移入抽屉内容区域，关闭后再把焦点还给先前的触发元素。
- `Drawer` 不使用 `Floating UI` 做定位，因为它不是锚点型浮层；需要跟随触发器定位的交互内容请使用 `Popover` / `Popconfirm`。
- 如果只是短文案提示，优先使用 `Tooltip`；如果需要更强阻断和居中确认，优先使用 `Modal`。

## API

通用属性参考：[通用属性](/guide/common-props)

| 参数        | 说明                   | 类型                                                         | 默认值    |
| ----------- | ---------------------- | ------------------------------------------------------------ | --------- |
| isOpen      | 是否打开               | `boolean`                                                    | -         |
| title       | 抽屉标题               | `ReactNode`                                                  | -         |
| children    | 抽屉内容               | `ReactNode`                                                  | -         |
| header      | 自定义头部             | `ReactNode`                                                  | -         |
| footer      | 自定义页脚             | `ReactNode`                                                  | -         |
| maskVisible | 是否显示遮罩层         | `boolean`                                                    | `true`    |
| closable    | 是否显示右上角关闭按钮 | `boolean`                                                    | `true`    |
| placement   | 展开方向               | `'left' \| 'right'`                                          | `'right'` |
| width       | 抽屉宽度               | `string \| number`                                           | `420`     |
| onCancel    | 请求关闭时的回调       | `(event?: MouseEvent<HTMLElement>) => void \| Promise<void>` | -         |
| afterClose  | 关闭动画结束后的回调   | `() => void`                                                 | -         |
| classNames  | 语义化类名             | `{ root, mask, content, header, title, body, footer }`       | -         |
| styles      | 语义化样式             | `{ root, mask, content, header, title, body, footer }`       | -         |

## 当前约束

- 当前实现优先保证 portal / mask / Escape / focus-return 的稳定契约，不提供命令式 `useDrawer`、多层堆叠管理或 body scroll lock 策略。
- 更复杂的 overlay 基础层边界统一记录在开发指南中。
