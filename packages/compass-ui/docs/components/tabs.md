---
title: Tabs 标签页
nav:
  title: 组件
  order: 2
group:
  title: 导航
  order: 5
---

# Tabs 标签页

选项卡切换组件。

## 何时使用

提供平级的区域将大块内容进行收纳和展现，保持界面整洁。

## 代码演示

### 基础用法

默认选中第一项。

```tsx
import React from 'react'
import { Tabs } from '@xinghunm/compass-ui'

export default () => {
  const items = [
    {
      key: '1',
      label: 'Tab 1',
      children: 'Content of Tab Pane 1',
    },
    {
      key: '2',
      label: 'Tab 2',
      children: 'Content of Tab Pane 2',
    },
    {
      key: '3',
      label: 'Tab 3',
      children: 'Content of Tab Pane 3',
    },
  ]

  return <Tabs defaultActiveKey="1" items={items} />
}
```

### 禁用状态

禁用某一项。

```tsx
import React from 'react'
import { Tabs } from '@xinghunm/compass-ui'

export default () => {
  const items = [
    {
      key: '1',
      label: 'Tab 1',
      children: 'Content of Tab Pane 1',
    },
    {
      key: '2',
      label: 'Tab 2',
      disabled: true,
      children: 'Content of Tab Pane 2',
    },
    {
      key: '3',
      label: 'Tab 3',
      children: 'Content of Tab Pane 3',
    },
  ]

  return <Tabs defaultActiveKey="1" items={items} />
}
```

### 卡片样式

另一种样式的页签，不提供对应的垂直样式。

```tsx
import React from 'react'
import { Tabs } from '@xinghunm/compass-ui'

export default () => {
  const items = [
    {
      key: '1',
      label: 'Tab 1',
      children: 'Content of Tab Pane 1',
    },
    {
      key: '2',
      label: 'Tab 2',
      children: 'Content of Tab Pane 2',
    },
    {
      key: '3',
      label: 'Tab 3',
      children: 'Content of Tab Pane 3',
    },
  ]

  return <Tabs defaultActiveKey="1" type="card" items={items} />
}
```

### 位置

有四个方向：`top`, `right`, `bottom`, `left`。

```tsx
import React from 'react'
import { Tabs } from '@xinghunm/compass-ui'

export default () => {
  const items = Array.from({ length: 30 }).map((_, i) => ({
    key: `${i}`,
    label: `Tab-${i}`,
    children: `Content of Tab Pane ${i}`,
  }))

  return <Tabs defaultActiveKey="1" tabPosition="left" style={{ height: 220 }} items={items} />
}
```

### 三种大小

大、中、小三种尺寸。

```tsx
import React from 'react'
import { Tabs } from '@xinghunm/compass-ui'

export default () => {
  const items = [
    {
      key: '1',
      label: 'Tab 1',
      children: 'Content of Tab Pane 1',
    },
    {
      key: '2',
      label: 'Tab 2',
      children: 'Content of Tab Pane 2',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Tabs defaultActiveKey="1" size="small" items={items} />
      <Tabs defaultActiveKey="1" size="default" items={items} />
      <Tabs defaultActiveKey="1" size="large" items={items} />
    </div>
  )
}
```

### 附加内容

可以在页签右侧添加附加操作。

```tsx
import React from 'react'
import { Tabs } from '@xinghunm/compass-ui'

export default () => {
  const items = [
    {
      key: '1',
      label: 'Tab 1',
      children: 'Content of Tab Pane 1',
    },
    {
      key: '2',
      label: 'Tab 2',
      children: 'Content of Tab Pane 2',
    },
  ]

  return (
    <Tabs
      defaultActiveKey="1"
      items={items}
      tabBarExtraContent={
        <button style={{ cursor: 'pointer', padding: '4px 8px' }}>Extra Action</button>
      }
    />
  )
}
```

### 带图标

带图标的标签。

```tsx
import React from 'react'
import { Tabs, CalendarOutlined } from '@xinghunm/compass-ui'

export default () => {
  const items = [
    {
      key: '1',
      label: 'Tab 1',
      icon: <CalendarOutlined />,
      children: 'Content of Tab Pane 1',
    },
    {
      key: '2',
      label: 'Tab 2',
      children: 'Content of Tab Pane 2',
    },
  ]

  return <Tabs defaultActiveKey="1" items={items} />
}
```

### 动态可编辑

可以添加、删除标签。

```tsx
import React, { useState } from 'react'
import { Tabs } from '@xinghunm/compass-ui'

export default () => {
  const defaultPanes = new Array(2).fill(null).map((_, index) => {
    const id = String(index + 1)
    return { label: `Tab ${id}`, children: `Content of Tab ${id}`, key: id }
  })

  const [activeKey, setActiveKey] = useState(defaultPanes[0].key)
  const [items, setItems] = useState(defaultPanes)

  const onChange = (key) => {
    setActiveKey(key)
  }

  const remove = (targetKey) => {
    const targetIndex = items.findIndex((pane) => pane.key === targetKey)
    const newPanes = items.filter((pane) => pane.key !== targetKey)
    if (newPanes.length && targetKey === activeKey) {
      const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex]
      setActiveKey(key)
    }
    setItems(newPanes)
  }

  const onEdit = (targetKey, action) => {
    if (action === 'remove') {
      remove(targetKey)
    }
  }

  return (
    <Tabs
      type="editable-card"
      onChange={onChange}
      activeKey={activeKey}
      onEdit={onEdit}
      items={items}
    />
  )
}
```

### 自定义主题

通过 `ConfigProvider` 自定义主题。

```tsx
import React from 'react'
import { Tabs, ConfigProvider } from '@xinghunm/compass-ui'

export default () => {
  const items = [
    {
      key: '1',
      label: 'Tab 1',
      children: 'Content of Tab Pane 1',
    },
    {
      key: '2',
      label: 'Tab 2',
      children: 'Content of Tab Pane 2',
    },
  ]

  return (
    <ConfigProvider
      theme={{
        token: {
          components: {
            tabs: {
              tabItemActiveColor: '#722ed1',
              inkBarColor: '#722ed1',
              tabItemHorizontalGutter: '50px',
              tabItemPadding: '12px 30px',
              inkBarHeight: '4px',
            },
          },
        },
      }}
    >
      <Tabs defaultActiveKey="1" items={items} />
    </ConfigProvider>
  )
}
```

## API

### Tabs

| 参数               | 说明                    | 类型                                                     | 默认值      |
| ------------------ | ----------------------- | -------------------------------------------------------- | ----------- |
| activeKey          | 当前激活 tab 面板的 key | `string`                                                 | -           |
| defaultActiveKey   | 初始化选中面板的 key    | `string`                                                 | -           |
| items              | 配置选项卡内容          | `TabItem[]`                                              | `[]`        |
| type               | 页签的基本样式          | `'line' \| 'card' \| 'editable-card'`                    | `'line'`    |
| size               | 大小                    | `'small' \| 'default' \| 'large'`                        | `'default'` |
| tabPosition        | 页签位置                | `'top' \| 'right' \| 'bottom' \| 'left'`                 | `'top'`     |
| tabBarExtraContent | 标签栏附加内容          | `ReactNode`                                              | -           |
| onChange           | 切换面板的回调          | `(activeKey: string) => void`                            | -           |
| onEdit             | 编辑标签的回调          | `(targetKey: string, action: 'add' \| 'remove') => void` | -           |
| className          | 自定义类名              | `string`                                                 | -           |
| style              | 自定义样式              | `CSSProperties`                                          | -           |

### TabItem

| 参数     | 说明                                       | 类型        | 默认值  |
| -------- | ------------------------------------------ | ----------- | ------- |
| key      | 对应 activeKey                             | `string`    | -       |
| label    | 选项卡头显示文字                           | `ReactNode` | -       |
| children | 选项卡头显示内容                           | `ReactNode` | -       |
| disabled | 是否禁用                                   | `boolean`   | `false` |
| closable | 是否显示关闭按钮 (type="editable-card" 时) | `boolean`   | `true`  |
| icon     | 选项卡图标                                 | `ReactNode` | -       |

## 主题变量 (Design Token)

| Token Name                                | Description        |
| ----------------------------------------- | ------------------ |
| `components.tabs.tabBarBorderColor`       | 标签栏边框颜色     |
| `components.tabs.tabBarBorderWidth`       | 标签栏边框宽度     |
| `components.tabs.tabBarBackgroundColor`   | 标签栏背景色       |
| `components.tabs.tabItemColor`            | 标签项文字颜色     |
| `components.tabs.tabItemActiveColor`      | 激活标签项文字颜色 |
| `components.tabs.tabItemHoverColor`       | 悬停标签项文字颜色 |
| `components.tabs.tabItemDisabledColor`    | 禁用标签项文字颜色 |
| `components.tabs.tabItemFontSize`         | 标签项字体大小     |
| `components.tabs.tabItemPadding`          | 标签项内边距       |
| `components.tabs.tabItemHorizontalGutter` | 标签项水平间距     |
| `components.tabs.tabItemVerticalGutter`   | 标签项垂直间距     |
| `components.tabs.inkBarColor`             | 指示条颜色         |
| `components.tabs.inkBarHeight`            | 指示条高度         |
