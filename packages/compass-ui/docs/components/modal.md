---
title: Modal 对话框
nav:
  title: 组件
  order: 2
group:
  title: 反馈
  order: 4
---

# Modal 对话框

模态对话框，用于显示需要用户交互的内容。

## 何时使用

- 需要用户处理事务，又不希望跳转页面以致打断工作流程时。
- 需要一个补充的层作为独立的交互区域时。
- 需要进行即时性反馈时。

## 代码演示

### 基础用法

最简单的对话框。

```tsx
import React, { useState } from 'react'
import { Modal, Button } from '@xinghunm/compass-ui'

export default () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onCancel={() => setIsOpen(false)}
        afterClose={() => console.log('afterClose')}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  )
}
```

### 带标题和关闭按钮

包含标题和关闭按钮的对话框。

```tsx
import React, { useState } from 'react'
import { Modal, Button } from '@xinghunm/compass-ui'

export default () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal with Title</Button>
      <Modal isOpen={isOpen} onCancel={() => setIsOpen(false)} title="Basic Modal" closable>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  )
}
```

### 异步关闭

点击确定后异步关闭对话框，例如提交表单。如果 `onOk` 返回 Promise，组件会自动处理 loading 状态。

```tsx
import React, { useState } from 'react'
import { Modal, Button } from '@xinghunm/compass-ui'

export default () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOk = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsOpen(false)
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal with Auto Async</Button>
      <Modal title="Title" isOpen={isOpen} onOk={handleOk} onCancel={() => setIsOpen(false)}>
        <p>The OK button will automatically show loading state because onOk returns a Promise.</p>
      </Modal>
    </>
  )
}
```

### 隐藏遮罩层

创建一个没有遮罩层的模态框。

```tsx
import React, { useState } from 'react'
import { Modal, Button } from '@xinghunm/compass-ui'

export default () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal without Mask</Button>
      <Modal isOpen={isOpen} onCancel={() => setIsOpen(false)} maskVisible={false}>
        <p>This modal has no mask.</p>
      </Modal>
    </>
  )
}
```

### 自定义页脚

更灵活的页脚布局。

```tsx
import React, { useState } from 'react'
import { Modal, Button } from '@xinghunm/compass-ui'

export default () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal with Custom Footer</Button>
      <Modal
        isOpen={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
              padding: '16px 24px',
            }}
          >
            <Button onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Submit
            </Button>
          </div>
        }
      >
        <p>This modal has a custom footer.</p>
      </Modal>
    </>
  )
}
```

### 自定义头部

自定义头部内容。

```tsx
import React, { useState } from 'react'
import { Modal, Button } from '@xinghunm/compass-ui'

export default () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal with Custom Header</Button>
      <Modal
        isOpen={isOpen}
        onCancel={() => setIsOpen(false)}
        header={
          <div
            style={{
              padding: '16px 24px',
              borderBottom: '1px solid #f0f0f0',
              fontWeight: 'bold',
              fontSize: '18px',
              color: '#1890ff',
            }}
          >
            Custom Header
          </div>
        }
      >
        <p>This modal has a custom header.</p>
      </Modal>
    </>
  )
}
```

### 静态方法

使用 `Modal.info`, `Modal.success` 等静态方法创建对话框。

```tsx
import React from 'react'
import { Modal, Button } from '@xinghunm/compass-ui'

export default () => {
  const showInfo = () => {
    Modal.info({
      title: 'This is a notification message',
      content: (
        <div>
          <p>some messages...some messages...</p>
          <p>some messages...some messages...</p>
        </div>
      ),
      onOk() {},
    })
  }

  const showConfirm = () => {
    Modal.confirm({
      title: 'Do you want to delete these items?',
      content: 'When clicked the OK button, this dialog will be closed after 1 second',
      onOk() {
        return new Promise((resolve) => {
          setTimeout(resolve, 1000)
        }).catch(() => console.log('Oops errors!'))
      },
      onCancel() {},
    })
  }

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Button onClick={showInfo}>Info</Button>
      <Button onClick={() => Modal.success({ title: 'Success', content: 'Success content' })}>
        Success
      </Button>
      <Button onClick={() => Modal.error({ title: 'Error', content: 'Error content' })}>
        Error
      </Button>
      <Button onClick={() => Modal.warning({ title: 'Warning', content: 'Warning content' })}>
        Warning
      </Button>
      <Button onClick={showConfirm}>Confirm</Button>
    </div>
  )
}
```

### Hook 用法 (推荐)

使用 `useModal` Hook 可以获取上下文（Context），支持动态主题和国际化。

```tsx
import React from 'react'
import { Modal, Button } from '@xinghunm/compass-ui'

export default () => {
  const [modal, contextHolder] = Modal.useModal()

  const showConfirm = () => {
    modal.confirm({
      title: 'Do you want to delete these items?',
      content: 'When clicked the OK button, this dialog will be closed after 1 second',
      onOk() {
        return new Promise((resolve) => {
          setTimeout(resolve, 1000)
        }).catch(() => console.log('Oops errors!'))
      },
    })
  }

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {contextHolder}
      <Button onClick={() => modal.info({ title: 'Info', content: 'Info content' })}>Info</Button>
      <Button onClick={showConfirm}>Confirm</Button>
    </div>
  )
}
```

### 自定义样式

自定义位置和样式。

```tsx
import React, { useState } from 'react'
import { Modal, Button } from '@xinghunm/compass-ui'

export default () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Custom Styled Modal</Button>
      <Modal
        isOpen={isOpen}
        onCancel={() => setIsOpen(false)}
        style={{ top: '20px' }}
        className="custom-modal-class"
      >
        <p>This modal has custom styles (top: 20px) and class name.</p>
      </Modal>
    </>
  )
}
```

### 配合 styled-components 使用

利用 `styled` 可以非常方便地封装带有一致样式的组件。因为 Modal 的内容渲染在 Portal（根节点之外）中，我们可以直接利用组件内部的静态类名（如 `.compass-modal-content`）进行样式覆盖：

```tsx
/**
 * title: 配合 styled-components / emotion
 * description: 针对 Portal 渲染的组件，利用全局静态 className 进行样式覆盖。
 */
import React, { useState } from 'react'
import styled from '@emotion/styled'
import { Modal, Button } from '@xinghunm/compass-ui'

const StyledModal = styled(Modal)`
  /* 覆盖内容区 */
  .compass-modal-content {
    border-radius: 16px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
    border: 2px solid #1890ff;
  }

  /* 覆盖头部 */
  .compass-modal-header {
    border-bottom: none;
    padding: 24px 24px 12px;
  }

  /* 覆盖底部按钮区 */
  .compass-modal-footer {
    border-top: none;
    padding: 12px 24px 24px;
  }
`

export default () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        打开 Styled Modal
      </Button>
      <StyledModal title="Styled Modal" isOpen={isOpen} onCancel={() => setIsOpen(false)}>
        <p>这个 Modal 的样式完全由 styled 封装。</p>
        <p>这种写法在使用 CSS-in-JS 时最符合直觉。</p>
      </StyledModal>
    </>
  )
}
```

### 自定义主题

通过 `ConfigProvider` 定制模态框主题。

```tsx
import React, { useState } from 'react'
import { Modal, Button, ConfigProvider } from '@xinghunm/compass-ui'

export default () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ConfigProvider
      theme={{
        token: {
          components: {
            modal: {
              borderRadius: '20px',
              headerPadding: '20px 30px',
              bodyPadding: '30px',
              footerPadding: '15px 30px',
              maskColor: 'rgba(100, 0, 100, 0.5)',
            },
          },
        },
      }}
    >
      <Button onClick={() => setIsOpen(true)}>Open Custom Theme Modal</Button>
      <Modal isOpen={isOpen} onCancel={() => setIsOpen(false)} title="Custom Theme Modal">
        <p>This modal uses custom theme tokens.</p>
      </Modal>
    </ConfigProvider>
  )
}
```

## API

通用属性参考：[通用属性](/guide/common-props)

### Modal

| 参数           | 说明                                              | 类型                                                           | 默认值   |
| -------------- | ------------------------------------------------- | -------------------------------------------------------------- | -------- |
| isOpen         | 对话框是否可见                                    | `boolean`                                                      | `false`  |
| title          | 标题                                              | `ReactNode`                                                    | -        |
| children       | 内容                                              | `ReactNode`                                                    | -        |
| onOk           | 点击确定回调                                      | `(e?: React.MouseEvent<HTMLElement>) => void \| Promise<void>` | -        |
| onCancel       | 点击遮罩层或右上角叉或取消按钮的回调              | `(e?: React.MouseEvent<HTMLElement>) => void`                  | -        |
| footer         | 底部内容，当不需要默认底部按钮时，可以设为 `null` | `ReactNode`                                                    | -        |
| header         | 头部内容，当不需要默认头部时，可以设为 `null`     | `ReactNode`                                                    | -        |
| okText         | 确认按钮文字                                      | `ReactNode`                                                    | `'确定'` |
| cancelText     | 取消按钮文字                                      | `ReactNode`                                                    | `'取消'` |
| confirmLoading | 确定按钮 loading                                  | `boolean`                                                      | `false`  |
| closable       | 是否显示右上角的关闭按钮                          | `boolean`                                                      | `true`   |
| maskVisible    | 是否显示遮罩层                                    | `boolean`                                                      | `true`   |
| width          | 宽度                                              | `string \| number`                                             | `500px`  |
| afterClose     | Modal 完全关闭后的回调                            | `() => void`                                                   | -        |
| styles         | 内部组件样式                                      | `{ root, mask, content, header, body, footer }`                | -        |
| classNames     | 内部组件类名                                      | `{ root, mask, content, header, body, footer }`                | -        |

## 主题变量 (Design Token)

| Token Name                       | Description  | Default                                                                                                    |
| -------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------- |
| `components.modal.maskColor`     | 遮罩层背景色 | `rgba(0, 0, 0, 0.45)`                                                                                      |
| `components.modal.contentBg`     | 模态框背景色 | `#ffffff`                                                                                                  |
| `components.modal.borderRadius`  | 模态框圆角   | `8px`                                                                                                      |
| `components.modal.boxShadow`     | 模态框阴影   | `0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)` |
| `components.modal.headerPadding` | 头部内边距   | `16px 24px`                                                                                                |
| `components.modal.bodyPadding`   | 内容内边距   | `24px`                                                                                                     |
| `components.modal.footerPadding` | 底部内边距   | `10px 16px`                                                                                                |
| `components.modal.padding`       | 内部通用间距 | `24px`                                                                                                     |
| `components.modal.zIndex`        | 模态框层级   | `1000`                                                                                                     |
