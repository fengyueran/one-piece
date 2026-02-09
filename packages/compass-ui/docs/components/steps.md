---
title: Steps 步骤条
nav:
  title: 组件
  order: 2
group:
  title: 导航
  order: 2
---

# Steps 步骤条

步骤条组件,用于引导用户按照流程完成任务。

## 何时使用

- 当任务复杂或者存在先后关系时,将其分解成一系列步骤,从而简化任务。

## 代码演示

### 基础用法

最简单的用法。

```tsx
import React from 'react'
import { Steps } from '@xinghunm/compass-ui'

export default () => {
  const items = [
    {
      title: '已完成',
      description: '这里是描述信息',
    },
    {
      title: '进行中',
      description: '这里是描述信息',
      subTitle: '剩余 00:00:08',
    },
    {
      title: '等待中',
      description: '这里是描述信息',
    },
  ]

  return <Steps current={1} items={items} />
}
```

### 垂直方向

垂直方向的步骤条。

```tsx
import React from 'react'
import { Steps } from '@xinghunm/compass-ui'

export default () => {
  const items = [
    {
      title: '已完成',
      description: '这里是描述信息',
    },
    {
      title: '进行中',
      description: '这里是描述信息',
      subTitle: '剩余 00:00:08',
    },
    {
      title: '等待中',
      description: '这里是描述信息',
    },
  ]

  return (
    <div style={{ height: '300px' }}>
      <Steps direction="vertical" current={1} items={items} />
    </div>
  )
}
```

### 错误状态

使用 error 状态。

```tsx
import React from 'react'
import { Steps } from '@xinghunm/compass-ui'

export default () => {
  const items = [
    {
      title: '已完成',
      description: '这里是描述信息',
    },
    {
      title: '进行中',
      description: '这里是描述信息',
      subTitle: '剩余 00:00:08',
    },
    {
      title: '等待中',
      description: '这里是描述信息',
    },
  ]

  return <Steps current={1} status="error" items={items} />
}
```

### 自定义图标

自定义每个步骤的图标。

```tsx
import React from 'react'
import { Steps, LoadingIcon, InfoIcon } from '@xinghunm/compass-ui'

export default () => {
  const items = [
    {
      title: '登录',
      status: 'finish',
      icon: <InfoIcon />,
    },
    {
      title: '验证',
      status: 'process',
      icon: <LoadingIcon />,
    },
    {
      title: '支付',
      status: 'wait',
    },
    {
      title: '完成',
      status: 'wait',
    },
  ]

  return <Steps current={1} items={items} />
}
```

### 可点击

设置 `onChange` 后,步骤条可点击。

```tsx
import React, { useState } from 'react'
import { Steps } from '@xinghunm/compass-ui'

export default () => {
  const [current, setCurrent] = useState(0)

  const items = [
    {
      title: '步骤 1',
      description: '可点击',
    },
    {
      title: '步骤 2',
      description: '可点击',
    },
    {
      title: '步骤 3',
      description: '可点击',
    },
  ]

  return <Steps current={current} onChange={setCurrent} items={items} />
}
```

### 使用 Children

使用 `Steps.Step` 子组件渲染步骤。

```tsx
import React from 'react'
import { Steps } from '@xinghunm/compass-ui'

export default () => {
  return (
    <Steps current={1}>
      <Steps.Step title="步骤 1" description="这里是描述信息。" />
      <Steps.Step title="步骤 2" description="这里是描述信息。" />
      <Steps.Step title="步骤 3" description="这里是描述信息。" />
    </Steps>
  )
}
```

### 标签位置

可以设置标签的位置。

```tsx
import React from 'react'
import { Steps } from '@xinghunm/compass-ui'

export default () => {
  const items = [
    {
      title: '已完成',
      description: '这里是描述信息',
    },
    {
      title: '进行中',
      description: '这里是描述信息',
      subTitle: '剩余 00:00:08',
    },
    {
      title: '等待中',
      description: '这里是描述信息',
    },
  ]

  return <Steps current={1} labelPlacement="vertical" items={items} />
}
```

### 点状步骤条

点状风格的步骤条。

```tsx
import React from 'react'
import { Steps } from '@xinghunm/compass-ui'

export default () => {
  const items = [
    {
      title: '已完成',
      description: '这里是描述信息',
    },
    {
      title: '进行中',
      description: '这里是描述信息',
      subTitle: '剩余 00:00:08',
    },
    {
      title: '等待中',
      description: '这里是描述信息',
    },
  ]

  return <Steps current={1} variant="dot" items={items} />
}
```

### 自定义主题

通过 `ConfigProvider` 自定义主题。

```tsx
import React from 'react'
import { Steps, ConfigProvider } from '@xinghunm/compass-ui'

export default () => {
  const items = [
    {
      title: '已完成',
      description: '这里是描述信息',
    },
    {
      title: '进行中',
      description: '这里是描述信息',
      subTitle: '剩余 00:00:08',
    },
    {
      title: '等待中',
      description: '这里是描述信息',
    },
  ]

  return (
    <ConfigProvider
      theme={{
        token: {
          components: {
            steps: {
              processIconColor: '#722ed1',
              processTitleColor: '#722ed1',
              processDescriptionColor: '#b37feb',
              waitIconColor: '#d9d9d9',
              waitTitleColor: '#d9d9d9',
              waitDescriptionColor: '#d9d9d9',
              finishIconColor: '#eb2f96',
              finishTitleColor: '#eb2f96',
              finishDescriptionColor: '#ffadd2',
              errorIconColor: '#f5222d',
              errorTitleColor: '#f5222d',
              errorDescriptionColor: '#ffccc7',
              iconSize: '26px',
              titleFontSize: '18px',
              descriptionFontSize: '14px',
              titleColor: '#333',
              subTitleColor: '#666',
              descriptionColor: '#999',
              dotSize: '3px',
            },
          },
        },
      }}
    >
      <Steps current={1} items={items} />
    </ConfigProvider>
  )
}
```

## API

### Steps

| 参数           | 说明               | 类型                                                                | 默认值         |
| -------------- | ------------------ | ------------------------------------------------------------------- | -------------- |
| current        | 当前步骤,从 0 开始 | `number`                                                            | `0`            |
| direction      | 步骤条方向         | `'horizontal' \| 'vertical'`                                        | `'horizontal'` |
| variant        | 步骤条变体         | `'default' \| 'dot'`                                                | `'default'`    |
| status         | 当前步骤的状态     | `'wait' \| 'process' \| 'finish' \| 'error'`                        | `'process'`    |
| labelPlacement | 标签位置           | `'horizontal' \| 'vertical'`                                        | `'horizontal'` |
| items          | 步骤项配置         | `StepProps[]`                                                       | `[]`           |
| onChange       | 点击切换步骤的回调 | `(current: number) => void`                                         | -              |
| styles         | 内部组件样式       | `{ root, item, icon, content, title, subtitle, description, tail }` | -              |
| classNames     | 内部组件类名       | `{ root, item, icon, content, title, subtitle, description, tail }` | -              |

### StepProps

| 参数        | 说明       | 类型                                         | 默认值  |
| ----------- | ---------- | -------------------------------------------- | ------- |
| title       | 步骤标题   | `ReactNode`                                  | -       |
| subTitle    | 步骤子标题 | `ReactNode`                                  | -       |
| description | 步骤描述   | `ReactNode`                                  | -       |
| icon        | 步骤图标   | `ReactNode`                                  | -       |
| status      | 步骤状态   | `'wait' \| 'process' \| 'finish' \| 'error'` | -       |
| disabled    | 是否禁用   | `boolean`                                    | `false` |
| className   | 自定义类名 | `string`                                     | -       |
| style       | 自定义样式 | `React.CSSProperties`                        | -       |

## 主题变量 (Design Token)

### 组件 Token

| Token Name                                 | Description      | 默认值 |
| ------------------------------------------ | ---------------- | ------ |
| `components.steps.descriptionColor`        | 描述文字颜色     | -      |
| `components.steps.titleColor`              | 标题文字颜色     | -      |
| `components.steps.subTitleColor`           | 子标题文字颜色   | -      |
| `components.steps.waitIconColor`           | 等待状态图标颜色 | -      |
| `components.steps.processIconColor`        | 进行状态图标颜色 | -      |
| `components.steps.finishIconColor`         | 完成状态图标颜色 | -      |
| `components.steps.errorIconColor`          | 错误状态图标颜色 | -      |
| `components.steps.waitTitleColor`          | 等待状态标题颜色 | -      |
| `components.steps.processTitleColor`       | 进行状态标题颜色 | -      |
| `components.steps.finishTitleColor`        | 完成状态标题颜色 | -      |
| `components.steps.errorTitleColor`         | 错误状态标题颜色 | -      |
| `components.steps.waitDescriptionColor`    | 等待状态描述颜色 | -      |
| `components.steps.processDescriptionColor` | 进行状态描述颜色 | -      |
| `components.steps.finishDescriptionColor`  | 完成状态描述颜色 | -      |
| `components.steps.errorDescriptionColor`   | 错误状态描述颜色 | -      |
| `components.steps.iconSize`                | 图标大小         | -      |
| `components.steps.dotSize`                 | 点状步骤条大小   | -      |
| `components.steps.titleFontSize`           | 标题字体大小     | -      |
| `components.steps.descriptionFontSize`     | 描述字体大小     | -      |

### 全局 Token

| Token Name               | Description  |
| ------------------------ | ------------ |
| `colors.borderSecondary` | 次级边框颜色 |
