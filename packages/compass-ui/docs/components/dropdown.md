---
title: Dropdown 下拉菜单
nav:
  title: 组件
  order: 2
group:
  title: 导航
  order: 5
---

# Dropdown 下拉菜单

向下弹出的列表。

## 何时使用

- 当页面上的操作命令过多时，用此组件收纳操作元素。
- 点击或移入触点，会出现一个下拉菜单。可在列表中进行选择，并执行相应的命令。

## 代码演示

### 基础用法

最简单的下拉菜单。

```tsx
import React from 'react'
import { Dropdown, Button } from '@xinghunm/compass-ui'

export default () => {
  const items = [
    { key: '1', label: 'Menu Item 1' },
    { key: '2', label: 'Menu Item 2' },
    { key: '3', label: 'Menu Item 3 (Disabled)', disabled: true },
  ]

  const onMenuClick = (e, key) => {
    alert(`Menu clicked! Key: ${key}`)
  }

  return (
    <Dropdown
      menu={{
        items,
        onClick: onMenuClick,
      }}
    >
      <Button>Hover me</Button>
    </Dropdown>
  )
}
```

### 点击触发

设置 `trigger="click"` 可改为点击触发。

```tsx
import React from 'react'
import { Dropdown, Button, Menu } from '@xinghunm/compass-ui'

export default () => {
  const menu = (
    <Menu>
      <Menu.Item>Menu Item 1</Menu.Item>
      <Menu.Item>Menu Item 2</Menu.Item>
    </Menu>
  )

  return (
    <Dropdown overlay={menu} trigger="click">
      <Button>Click me</Button>
    </Dropdown>
  )
}
```

### 受控模式

通过 `visible` 和 `onVisibleChange` 属性完全控制菜单的显示状态。

```tsx
import React, { useState } from 'react'
import { Dropdown, Button, Menu } from '@xinghunm/compass-ui'

export default () => {
  const [visible, setVisible] = useState(false)

  const menu = (
    <Menu>
      <Menu.Item>Menu Item 1</Menu.Item>
      <Menu.Item>Menu Item 2</Menu.Item>
    </Menu>
  )

  return (
    <Dropdown visible={visible} onVisibleChange={setVisible} overlay={menu} trigger="click">
      <Button>Controlled ({visible ? 'Open' : 'Closed'})</Button>
    </Dropdown>
  )
}
```

### 弹出位置

支持 12 个弹出位置，通过 `placement` 属性配置。

```tsx
import React from 'react'
import { Dropdown, Button, Menu } from '@xinghunm/compass-ui'

export default () => {
  const menu = (
    <Menu>
      <Menu.Item>Menu Item 1</Menu.Item>
      <Menu.Item>Menu Item 2</Menu.Item>
    </Menu>
  )

  return (
    <div style={{ padding: '50px' }}>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', marginLeft: '70px' }}>
        <Dropdown placement="top-start" overlay={menu}>
          <Button>TL</Button>
        </Dropdown>
        <Dropdown placement="top" overlay={menu}>
          <Button>Top</Button>
        </Dropdown>
        <Dropdown placement="top-end" overlay={menu}>
          <Button>TR</Button>
        </Dropdown>
      </div>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '70px' }}>
          <Dropdown placement="left-start" overlay={menu}>
            <Button>LT</Button>
          </Dropdown>
          <Dropdown placement="left" overlay={menu}>
            <Button>Left</Button>
          </Dropdown>
          <Dropdown placement="left-end" overlay={menu}>
            <Button>LB</Button>
          </Dropdown>
        </div>
        <div style={{ width: '180px' }}></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '70px' }}>
          <Dropdown placement="right-start" overlay={menu}>
            <Button>RT</Button>
          </Dropdown>
          <Dropdown placement="right" overlay={menu}>
            <Button>Right</Button>
          </Dropdown>
          <Dropdown placement="right-end" overlay={menu}>
            <Button>RB</Button>
          </Dropdown>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '20px', marginLeft: '70px' }}>
        <Dropdown placement="bottom-start" overlay={menu}>
          <Button>BL</Button>
        </Dropdown>
        <Dropdown placement="bottom" overlay={menu}>
          <Button>Bottom</Button>
        </Dropdown>
        <Dropdown placement="bottom-end" overlay={menu}>
          <Button>BR</Button>
        </Dropdown>
      </div>
    </div>
  )
}
```

### 上层内容

`overlay`/`menu` 属性接受任意 React 节点，不局限于 Menu 组件。

```tsx
import React from 'react'
import { Dropdown, Button } from '@xinghunm/compass-ui'

export default () => (
  <Dropdown
    overlay={
      <div
        style={{
          padding: 12,
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          borderRadius: 4,
        }}
      >
        <p style={{ margin: '0 0 8px' }}>Custom Content</p>
        <Button size="small">Action</Button>
      </div>
    }
  >
    <Button>Custom Overlay</Button>
  </Dropdown>
)
```

### 禁用

禁用下拉菜单。

```tsx
import React from 'react'
import { Dropdown, Button, Menu } from '@xinghunm/compass-ui'

export default () => (
  <Dropdown
    overlay={
      <Menu>
        <Menu.Item>Item</Menu.Item>
      </Menu>
    }
    disabled
  >
    <Button>Disabled</Button>
  </Dropdown>
)
```

### 自定义主题

通过 `ConfigProvider` 覆盖主题变量。

```tsx
import React from 'react'
import { Dropdown, Button, Menu, ConfigProvider } from '@xinghunm/compass-ui'

export default () => (
  <ConfigProvider
    theme={{
      token: {
        components: {
          dropdown: {
            backgroundColor: '#f6ffed',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          },
        },
      },
    }}
  >
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item>Item</Menu.Item>
        </Menu>
      }
    >
      <Button>Custom Theme</Button>
    </Dropdown>
  </ConfigProvider>
)
```

## API

### Dropdown

| 参数            | 说明                   | 类型                                                                                                                                                                 | 默认值           |
| --------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| trigger         | 触发方式               | `'hover' \| 'click'`                                                                                                                                                 | `'hover'`        |
| overlay         | 下拉菜单内容           | `ReactNode`                                                                                                                                                          | -                |
| menu            | 菜单配置 (数据驱动)    | `MenuProps`                                                                                                                                                          | -                |
| visible         | 菜单是否显示（受控）   | `boolean`                                                                                                                                                            | -                |
| disabled        | 是否禁用               | `boolean`                                                                                                                                                            | `false`          |
| onVisibleChange | 菜单显示状态改变时调用 | `(visible: boolean) => void`                                                                                                                                         | -                |
| placement       | 菜单弹出位置           | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'bottom-start'` |
| className       | 自定义类名             | `string`                                                                                                                                                             | -                |
| style           | 自定义样式             | `CSSProperties`                                                                                                                                                      | -                |

## 主题变量 (Design Token)

| Token Name                            | Description  |
| ------------------------------------- | ------------ |
| `components.dropdown.zIndex`          | 下拉菜单层级 |
| `components.dropdown.backgroundColor` | 背景颜色     |
| `components.dropdown.boxShadow`       | 阴影         |
| `components.dropdown.borderRadius`    | 圆角         |
| `components.dropdown.padding`         | 内边距       |
