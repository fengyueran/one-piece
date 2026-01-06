---
title: Message 消息提示
nav:
  title: 组件
  order: 2
group:
  title: 反馈
  order: 4
---

# Message 消息提示

全局展示操作反馈信息。

## 何时使用

- 可提供成功、警告和错误等反馈信息。
- 顶部居中显示并自动消失，是一种不打断用户操作的轻量级提示方式。

## 代码演示

### 基础用法

最简单的用法，全局显示一条信息。

```tsx
import React from 'react'
import { message, Button } from '@xinghunm/compass-ui'

export default () => (
  <Button onClick={() => message.info('This is a normal message')}>Display normal message</Button>
)
```

### 不同类型

包括成功、失败、警告、加载等。

```tsx
import React from 'react'
import { message, Button } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ display: 'flex', gap: '8px' }}>
    <Button onClick={() => message.info('This is a normal message')}>Info</Button>
    <Button onClick={() => message.success('This is a success message')}>Success</Button>
    <Button onClick={() => message.error('This is an error message')}>Error</Button>
    <Button onClick={() => message.warning('This is a warning message')}>Warning</Button>
    <Button onClick={() => message.loading('This is a loading message')}>Loading</Button>
  </div>
)
```

### 加载中

进行全局 loading 显示。

```tsx
import React from 'react'
import { message, Button } from '@xinghunm/compass-ui'

export default () => (
  <Button onClick={() => message.loading('Action in progress..', 2.5)}>
    Display loading indicator
  </Button>
)
```

### 自定义时长

自定义显示持续时间，设为 0 时不自动关闭。

```tsx
import React from 'react'
import { message, Button } from '@xinghunm/compass-ui'

export default () => (
  <Button onClick={() => message.info('This message will stay for 10 seconds', 10)}>
    Customized display duration
  </Button>
)
```

### Hook 用法

使用 `useMessage` Hook 可以获取上下文（Context），支持动态主题。

```tsx
import React from 'react'
import { message, Button } from '@xinghunm/compass-ui'

export default () => {
  const [messageApi, contextHolder] = message.useMessage()

  return (
    <>
      {contextHolder}
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button onClick={() => messageApi.info('Info message')}>Info</Button>
        <Button onClick={() => messageApi.success('Success message')}>Success</Button>
        <Button onClick={() => messageApi.error('Error message')}>Error</Button>
        <Button onClick={() => messageApi.warning('Warning message')}>Warning</Button>
      </div>
    </>
  )
}
```

### 完整配置

接受配置对象参数。

```tsx
import React from 'react'
import { message, Button } from '@xinghunm/compass-ui'

export default () => (
  <Button
    onClick={() =>
      message.open({
        content: 'This is a message with full configuration',
        type: 'success',
        duration: 5,
        icon: <span style={{ fontSize: 20 }}>🎉</span>,
        className: 'custom-message-class',
        style: { marginTop: '20vh', border: '1px solid #b7eb8f' },
        onClose: () => console.log('Message closed'),
      })
    }
  >
    Display full config message
  </Button>
)
```

### 自定义主题

通过 `ConfigProvider` 自定义消息样式。

```tsx
import React from 'react'
import { message, Button, ConfigProvider } from '@xinghunm/compass-ui'

const CustomThemeWrapper = () => {
  const [messageApi, contextHolder] = message.useMessage()
  return (
    <>
      {contextHolder}
      <Button onClick={() => messageApi.success('Custom Theme Message')}>
        Display Custom Theme Message
      </Button>
    </>
  )
}

export default () => (
  <ConfigProvider
    theme={{
      token: {
        components: {
          message: {
            contentPadding: '12px 24px',
            borderRadius: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          },
        },
      },
    }}
  >
    <CustomThemeWrapper />
  </ConfigProvider>
)
```

## API

组件提供了一些静态方法，使用方式和参数如下：

- `message.success(content, [duration], onClose)`
- `message.error(content, [duration], onClose)`
- `message.info(content, [duration], onClose)`
- `message.warning(content, [duration], onClose)`
- `message.loading(content, [duration], onClose)`

也可以对象的形式传递参数：

- `message.open(config)`
- `message.success(config)`
- `message.error(config)`
- `message.info(config)`
- `message.warning(config)`
- `message.loading(config)`

| 参数      | 说明                                          | 类型                                                       | 默认值   |
| --------- | --------------------------------------------- | ---------------------------------------------------------- | -------- |
| content   | 消息内容                                      | `ReactNode`                                                | -        |
| duration  | 自动关闭的延时，单位秒。设为 0 时不自动关闭。 | `number`                                                   | `3`      |
| type      | 消息类型                                      | `'info' \| 'success' \| 'error' \| 'warning' \| 'loading'` | `'info'` |
| onClose   | 关闭时触发的回调函数                          | `() => void`                                               | -        |
| icon      | 自定义图标                                    | `ReactNode`                                                | -        |
| className | 自定义 CSS 类名                               | `string`                                                   | -        |
| style     | 自定义 CSS 样式                               | `CSSProperties`                                            | -        |

## 主题变量 (Design Token)

| 变量名称                            | 描述           | 默认值     |
| ----------------------------------- | -------------- | ---------- |
| `components.message.contentPadding` | 消息内容内边距 | `8px 16px` |
| `components.message.borderRadius`   | 消息内容圆角   | `8px`      |
| `components.message.boxShadow`      | 消息阴影       | ...        |
| `components.message.zIndex`         | 消息层级       | `1010`     |
