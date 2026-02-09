---
title: Menu 导航菜单
nav:
  title: 组件
  order: 2
group:
  title: 导航
  order: 5
---

# Menu 导航菜单

为页面和功能提供导航的菜单列表。

## 何时使用

- 结合 Dropdown 组件使用，作为下拉菜单的内容。
- 导航菜单是一个网站的灵魂，用户依赖导航在各个页面中进行跳转。

## 代码演示

### 基础用法

最简单的菜单列表。

```tsx
import React from 'react'
import { Menu } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ width: 200, border: '1px solid #eee' }}>
    <Menu>
      <Menu.Item>Menu Item 1</Menu.Item>
      <Menu.Item>Menu Item 2</Menu.Item>
      <Menu.Item>Menu Item 3</Menu.Item>
    </Menu>
  </div>
)
```

### 数据驱动

通过 `items` 属性配置菜单项，支持 `eventKey`, `label`, `icon`, `disabled`, `danger` 等属性。

```tsx
import React from 'react'
import { Menu } from '@xinghunm/compass-ui'

export default () => {
  const items = [
    { eventKey: '1', label: 'Menu Item 1' },
    {
      eventKey: '2',
      label: 'Menu Item 2 (Disabled)',
      disabled: true,
      icon: <span style={{ marginRight: 8 }}>😊</span>,
    },
    { eventKey: '3', label: 'Menu Item 3 (Danger)', danger: true },
    {
      eventKey: '4',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          Link Item
        </a>
      ),
    },
  ]

  return (
    <div style={{ width: 200, border: '1px solid #eee' }}>
      <Menu items={items} />
    </div>
  )
}
```

### 带图标

通过 `icon` 属性添加图标。

```tsx
import React from 'react'
import { Menu, SearchIcon, CloseIcon } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ width: 200, border: '1px solid #eee' }}>
    <Menu>
      <Menu.Item icon={<SearchIcon />}>Search</Menu.Item>
      <Menu.Item icon={<CloseIcon />}>Close</Menu.Item>
    </Menu>
  </div>
)
```

### 禁用状态

设置 `disabled` 属性可禁用菜单项。

```tsx
import React from 'react'
import { Menu, SearchIcon } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ width: 200, border: '1px solid #eee' }}>
    <Menu>
      <Menu.Item>Active Item</Menu.Item>
      <Menu.Item disabled>Disabled Item</Menu.Item>
      <Menu.Item disabled icon={<SearchIcon />}>
        Disabled with Icon
      </Menu.Item>
    </Menu>
  </div>
)
```

### 危险项

设置 `danger` 属性表示危险操作。

```tsx
import React from 'react'
import { Menu, CloseIcon } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ width: 200, border: '1px solid #eee' }}>
    <Menu>
      <Menu.Item>Normal Item</Menu.Item>
      <Menu.Item danger>Delete</Menu.Item>
      <Menu.Item danger icon={<CloseIcon />}>
        Delete with Icon
      </Menu.Item>
    </Menu>
  </div>
)
```

### 默认选中

使用 `defaultSelectedKeys` 设置默认选中的菜单项。注意：结合 `children` 使用时需要为 Menu.Item 设置 `eventKey`。

```tsx
import React from 'react'
import { Menu } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ width: 200, border: '1px solid #eee' }}>
    <Menu defaultSelectedKeys={['1']}>
      <Menu.Item eventKey="1">Selected Item</Menu.Item>
      <Menu.Item eventKey="2">Normal Item</Menu.Item>
      <Menu.Item eventKey="3">Another Item</Menu.Item>
    </Menu>
  </div>
)
```

### 受控模式

通过 `selectedKeys` 配合 `onSelect` 实现受控模式。

```tsx
import React, { useState } from 'react'
import { Menu, Button } from '@xinghunm/compass-ui'

export default () => {
  const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>(['1'])

  return (
    <div style={{ width: 250, border: '1px solid #eee' }}>
      <div style={{ padding: '12px', borderBottom: '1px solid #eee', display: 'flex', gap: '8px' }}>
        <Button onClick={() => setSelectedKeys(['1'])}>Select 1</Button>
        <Button onClick={() => setSelectedKeys(['2'])}>Select 2</Button>
      </div>
      <Menu
        selectedKeys={selectedKeys}
        onSelect={(keys) => {
          console.log('select:', keys)
          setSelectedKeys(keys)
        }}
      >
        <Menu.Item eventKey="1">Item 1</Menu.Item>
        <Menu.Item eventKey="2">Item 2</Menu.Item>
        <Menu.Item eventKey="3">Item 3</Menu.Item>
      </Menu>
    </div>
  )
}
```

### 自定义内容

`children` 属性支持任意 React 节点，可用于添加分组标题或分割线。

```tsx
import React from 'react'
import { Menu } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ width: 200, border: '1px solid #eee' }}>
    <Menu>
      <div style={{ padding: '8px 12px', color: '#999', fontSize: '12px' }}>Group Title</div>
      <Menu.Item>Item 1</Menu.Item>
      <Menu.Item>Item 2</Menu.Item>
      <div style={{ borderTop: '1px solid #eee', margin: '4px 0' }} />
      <Menu.Item>Item 3</Menu.Item>
    </Menu>
  </div>
)
```

### 自定义样式

通过 `classNames` 和 `styles` 属性可以精确控制组件内部元素的样式。

```tsx
import React from 'react'
import { Menu, SearchIcon } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ width: 200, border: '1px solid #eee' }}>
    <Menu
      classNames={{
        root: 'my-custom-menu',
        item: 'my-custom-item',
        icon: 'my-custom-icon',
      }}
      styles={{
        root: { padding: '8px' },
        item: { borderRadius: '20px' },
        icon: { color: 'green' },
      }}
    >
      <Menu.Item icon={<SearchIcon />}>Custom Item 1</Menu.Item>
      <Menu.Item>Custom Item 2</Menu.Item>
    </Menu>
  </div>
)
```

### 自定义主题

通过 `ConfigProvider` 覆盖主题变量。

```tsx
import React from 'react'
import { Menu, ConfigProvider } from '@xinghunm/compass-ui'

export default () => (
  <ConfigProvider
    theme={{
      global: false,
      token: {
        components: {
          menu: {
            itemHoverBg: '#e6f7ff',
            itemColor: '#1890ff',
            borderRadius: '8px',
          },
        },
      },
    }}
  >
    <div style={{ width: 200, border: '1px solid #eee' }}>
      <Menu>
        <Menu.Item>Custom Theme Item 1</Menu.Item>
        <Menu.Item>Custom Theme Item 2</Menu.Item>
      </Menu>
    </div>
  </ConfigProvider>
)
```

## API

### Menu

| 参数                | 说明                    | 类型                                                    | 默认值 |
| ------------------- | ----------------------- | ------------------------------------------------------- | ------ |
| items               | 菜单项配置 (数据驱动)   | [ItemType[]](#menuitem-itemtype)                        | `[]`   |
| children            | 菜单内容 (JSX)          | `ReactNode`                                             | -      |
| selectedKeys        | 当前选中的 key (受控)   | `(string \| number)[]`                                  | -      |
| defaultSelectedKeys | 默认选中的 key (非受控) | `(string \| number)[]`                                  | `[]`   |
| onSelect            | 被选中时调用            | `(keys: (string \| number)[]) => void`                  | -      |
| onClick             | 点击菜单项时调用        | `(e: React.MouseEvent, key?: string \| number) => void` | -      |
| classNames          | 语义化类名              | `object`                                                | -      |
| styles              | 语义化样式              | `object`                                                | -      |

### Menu.Item (ItemType)

| 参数      | 说明                                                       | 类型                            | 默认值  |
| --------- | ---------------------------------------------------------- | ------------------------------- | ------- |
| eventKey  | 唯一标识。用于管理选中状态。如果不填，该项无法被高亮选中。 | `string \| number`              | -       |
| label     | 菜单项内容                                                 | `ReactNode`                     | -       |
| icon      | 图标元素                                                   | `ReactNode`                     | -       |
| disabled  | 是否禁用                                                   | `boolean`                       | `false` |
| danger    | 危险状态                                                   | `boolean`                       | `false` |
| onClick   | 点击事件                                                   | `(e: React.MouseEvent) => void` | -       |
| className | 自定义类名                                                 | `string`                        | -       |
| style     | 自定义样式                                                 | `React.CSSProperties`           | -       |

## 主题变量 (Design Token)

<details>
<summary>组件 Token (components.menu)</summary>

| 变量名                           | 说明               |
| -------------------------------- | ------------------ |
| `components.menu.itemHeight`     | 菜单项高度         |
| `components.menu.itemPadding`    | 菜单项内边距       |
| `components.menu.itemColor`      | 菜单项默认文字颜色 |
| `components.menu.itemHoverBg`    | 菜单项悬停背景色   |
| `components.menu.itemSelectedBg` | 菜单项选中背景色   |
| `components.menu.fontSize`       | 字体大小           |
| `components.menu.borderRadius`   | 菜单项圆角         |

</details>

<details>
<summary>全局 Token</summary>

| 变量名           | 说明     |
| ---------------- | -------- |
| `colors.primary` | 主色调   |
| `colors.error`   | 错误颜色 |

</details>
