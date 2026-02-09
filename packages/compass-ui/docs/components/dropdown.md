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

### 触发方式

通过 `trigger` 属性配置触发方式，支持 `hover` (默认) 和 `click`。

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
    <div style={{ display: 'flex', gap: '8px' }}>
      <Dropdown overlay={menu} trigger="hover">
        <Button>Hover me</Button>
      </Dropdown>
      <Dropdown overlay={menu} trigger="click">
        <Button>Click me</Button>
      </Dropdown>
    </div>
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

### 选择后不关闭

通过 `closeOnSelect={false}` 设置选中菜单项后不关闭下拉框。

```tsx
import React from 'react'
import { Dropdown, Button, Menu } from '@xinghunm/compass-ui'

export default () => {
  const menu = (
    <Menu>
      <Menu.Item>Item 1</Menu.Item>
      <Menu.Item>Item 2</Menu.Item>
    </Menu>
  )

  return (
    <Dropdown overlay={menu} closeOnSelect={false} trigger="click">
      <Button>Click me (Stay Open)</Button>
    </Dropdown>
  )
}
```

### 禁用

通过 `disabled` 属性禁用下拉菜单。

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
    <Button>Disabled Dropdown</Button>
  </Dropdown>
)
```

### 自定义样式

通过 `classNames` 和 `styles` 属性可以精确控制组件内部元素的样式。

```tsx
import React from 'react'
import { Dropdown, Button, Menu } from '@xinghunm/compass-ui'

export default () => (
  <Dropdown
    menu={{
      items: [
        { key: '1', label: 'Item 1' },
        { key: '2', label: 'Item 2' },
      ],
    }}
    classNames={{
      overlay: 'custom-overlay-class',
      content: 'custom-content-class',
    }}
    styles={{
      trigger: { fontWeight: 'bold' },
      overlay: { border: '1px solid #1677ff' },
    }}
  >
    <Button>Semantic Customization</Button>
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
      global: false,
      token: {
        components: {
          dropdown: {
            backgroundColor: '#f6ffed',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            padding: '8px',
          },
        },
      },
    }}
  >
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item>Item 1</Menu.Item>
          <Menu.Item>Item 2</Menu.Item>
        </Menu>
      }
    >
      <Button>Custom Theme</Button>
    </Dropdown>
  </ConfigProvider>
)
```

### 自定义弹出层类名

通过 `overlayClassName` 设置弹出层的类名，从而自定义样式。

```tsx
/**
 * title: 自定义弹出层样式
 * description: 使用 overlayClassName 和 overlayStyle 自定义弹出层外观。
 */
import React from 'react'
import styled from '@emotion/styled'
import { Dropdown, Button, Menu } from '@xinghunm/compass-ui'

// 这里使用 styled.div 作为演示容器来定义样式
// 实际项目中可以在全局 CSS 或 CSS Module 中定义类名
const Wrapper = styled.div`
  .custom-overlay-red {
    background-color: #fff1f0;
    border: 1px solid #ffa39e;

    .compass-menu-item:hover {
      background-color: #ffccc7;
    }
  }
`

export default () => (
  <Wrapper>
    <Dropdown
      overlayClassName="custom-overlay-red"
      overlay={
        <Menu>
          <Menu.Item>Danger Item 1</Menu.Item>
          <Menu.Item>Danger Item 2</Menu.Item>
        </Menu>
      }
    >
      <Button danger>Red Overlay</Button>
    </Dropdown>
  </Wrapper>
)
```

### 配合 styled-components 使用

利用 `overlayClassName` 可以非常方便地适配 `styled-components`，实现样式的完美封装。

```tsx
/**
 * title: 配合 styled-components (通用方案)
 * description: 通过内联组件转发 className，既优雅又兼容所有 CSS-in-JS 库。
 */
import React from 'react'
import styled from '@emotion/styled'
import { Dropdown, Button, Menu } from '@xinghunm/compass-ui'

const StyledDropdown = styled(({ className, ...props }) => (
  <Dropdown {...props} overlayClassName={className} />
))`
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  // 自定义内部菜单项样式
  .compass-menu-item {
    color: #389e0d;
    &:hover {
      background-color: #d9f7be;
    }
  }
`

export default () => (
  <StyledDropdown
    overlay={
      <Menu>
        <Menu.Item>Green Item 1</Menu.Item>
        <Menu.Item>Green Item 2</Menu.Item>
      </Menu>
    }
  >
    <Button type="primary" style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
      Styled Dropdown (Green)
    </Button>
  </StyledDropdown>
)
```

## API

通用属性参考：[通用属性](/guide/common-props)

### Dropdown

| 参数             | 说明                   | 类型                                                                                                                                                                 | 默认值           |
| ---------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| trigger          | 触发方式               | `'hover' \| 'click'`                                                                                                                                                 | `'hover'`        |
| overlay          | 下拉菜单内容           | `ReactNode`                                                                                                                                                          | -                |
| menu             | 菜单配置 (数据驱动)    | `MenuProps`                                                                                                                                                          | -                |
| visible          | 菜单是否显示（受控）   | `boolean`                                                                                                                                                            | -                |
| disabled         | 是否禁用               | `boolean`                                                                                                                                                            | `false`          |
| onVisibleChange  | 菜单显示状态改变时调用 | `(visible: boolean) => void`                                                                                                                                         | -                |
| placement        | 菜单弹出位置           | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'bottom-start'` |
| closeOnSelect    | 是否在选中项后关闭菜单 | `boolean`                                                                                                                                                            | `true`           |
| overlayClassName | 弹出层类名             | `string`                                                                                                                                                             | -                |
| overlayStyle     | 弹出层样式             | `CSSProperties`                                                                                                                                                      | -                |
| classNames       | 语义化类名             | `{ trigger?: string; overlay?: string; content?: string }`                                                                                                           | -                |
| styles           | 语义化样式             | `{ trigger?: CSSProperties; overlay?: CSSProperties; content?: CSSProperties }`                                                                                      | -                |

## 主题变量 (Design Token)

<details>
<summary>组件 Token (components.dropdown)</summary>

| 变量名                                | 说明         |
| ------------------------------------- | ------------ |
| `components.dropdown.zIndex`          | 下拉菜单层级 |
| `components.dropdown.backgroundColor` | 背景颜色     |
| `components.dropdown.boxShadow`       | 阴影         |
| `components.dropdown.borderRadius`    | 圆角         |
| `components.dropdown.padding`         | 内边距       |

</details>

<details>
<summary>全局 Token</summary>

| 变量名              | 说明         |
| ------------------- | ------------ |
| `colors.background` | 背景基础颜色 |
| `shadows.lg`        | 默认大阴影   |
| `borderRadius.md`   | 默认中圆角   |

</details>
