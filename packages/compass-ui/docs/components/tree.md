---
title: Tree 树形控件
nav:
  title: 组件
  order: 2
group:
  title: 数据展示
  order: 3
---

# Tree 树形控件

树形控件，用于层级数据的展示、展开、选择。

## 何时使用

- 文件夹、组织架构、生物分类、国家地区等等，世间万物的大多数结构都是树形结构。
- 当需要展示层级数据时。

## 代码演示

### 基础用法

最简单的用法。

```tsx
import React from 'react'
import { Tree } from '@xinghunm/compass-ui'

export default () => {
  const treeData = [
    {
      key: '0-0',
      title: 'parent 1',
      children: [
        {
          key: '0-0-0',
          title: 'parent 1-0',
          children: [
            { key: '0-0-0-0', title: 'leaf', isLeaf: true },
            { key: '0-0-0-1', title: 'leaf', isLeaf: true },
          ],
        },
        {
          key: '0-0-1',
          title: 'parent 1-1',
          children: [{ key: '0-0-1-0', title: 'leaf', isLeaf: true }],
        },
      ],
    },
  ]

  return <Tree treeData={treeData} defaultExpandedKeys={['0-0', '0-0-0', '0-0-1']} />
}
```

### 可勾选

可通过 `checkable` 属性开启复选功能。

```tsx
import React from 'react'
import { Tree } from '@xinghunm/compass-ui'

export default () => {
  const treeData = [
    {
      key: '0-0',
      title: 'parent 1',
      children: [
        {
          key: '0-0-0',
          title: 'parent 1-0',
          children: [
            { key: '0-0-0-0', title: 'leaf', isLeaf: true },
            { key: '0-0-0-1', title: 'leaf', isLeaf: true },
          ],
        },
        {
          key: '0-0-1',
          title: 'parent 1-1',
          children: [{ key: '0-0-1-0', title: 'leaf', isLeaf: true }],
        },
      ],
    },
  ]

  return <Tree checkable treeData={treeData} defaultExpandedKeys={['0-0', '0-0-0', '0-0-1']} />
}
```

### 展现连接线

节点之间带连接线的树，常用于文件目录结构。

```tsx
import React from 'react'
import { Tree } from '@xinghunm/compass-ui'

export default () => {
  const treeData = [
    {
      key: '0-0',
      title: 'parent 1',
      children: [
        {
          key: '0-0-0',
          title: 'parent 1-0',
          children: [
            { key: '0-0-0-0', title: 'leaf', isLeaf: true },
            { key: '0-0-0-1', title: 'leaf', isLeaf: true },
          ],
        },
      ],
    },
  ]

  return <Tree showLine treeData={treeData} defaultExpandedKeys={['0-0', '0-0-0']} />
}
```

### 带图标

展示带图标的树节点，需要设置 `showIcon` 为 true，并在数据源中提供 `icon`。

```tsx
import React from 'react'
import { Tree } from '@xinghunm/compass-ui'

export default () => {
  const treeDataWithIcon = [
    {
      key: '0-0',
      title: 'Folder 1',
      icon: <span>📂</span>,
      children: [
        {
          key: '0-0-0',
          title: 'File 1',
          icon: <span>📄</span>,
          isLeaf: true,
        },
        {
          key: '0-0-1',
          title: 'File 2',
          icon: <span>📄</span>,
          isLeaf: true,
        },
      ],
    },
  ]

  return <Tree treeData={treeDataWithIcon} showIcon defaultExpandedKeys={['0-0']} />
}
```

### 受控操作

`expandedKeys`、`checkedKeys`、`selectedKeys` 由父组件 state 控制。

```tsx
import React, { useState } from 'react'
import { Tree } from '@xinghunm/compass-ui'

export default () => {
  const [expandedKeys, setExpandedKeys] = useState(['0-0'])
  const [checkedKeys, setCheckedKeys] = useState(['0-0-0'])
  const [selectedKeys, setSelectedKeys] = useState([])

  const treeData = [
    {
      key: '0-0',
      title: 'parent 1',
      children: [
        { key: '0-0-0', title: 'leaf', isLeaf: true },
        { key: '0-0-1', title: 'leaf', isLeaf: true },
      ],
    },
  ]

  const onExpand = (expandedKeysValue) => {
    console.log('onExpand', expandedKeysValue)
    setExpandedKeys(expandedKeysValue)
  }

  const onCheck = (checkedKeysValue) => {
    console.log('onCheck', checkedKeysValue)
    setCheckedKeys(checkedKeysValue)
  }

  const onSelect = (selectedKeysValue, info) => {
    console.log('onSelect', info)
    setSelectedKeys(selectedKeysValue)
  }

  return (
    <Tree
      checkable
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      onCheck={onCheck}
      checkedKeys={checkedKeys}
      onSelect={onSelect}
      selectedKeys={selectedKeys}
      treeData={treeData}
    />
  )
}
```

### 虚拟滚动

使用 `virtual` 属性开启虚拟滚动，适用于大量数据展示。需要设置 `height` 和 `itemHeight`。

```tsx
import React from 'react'
import { Tree } from '@xinghunm/compass-ui'

export default () => {
  const dig = (path = '0', level = 3) => {
    const list = []
    for (let i = 0; i < 10; i += 1) {
      const key = `${path}-${i}`
      const treeNode = {
        title: key,
        key,
      }

      if (level > 0) {
        treeNode.children = dig(key, level - 1)
      } else {
        treeNode.isLeaf = true
      }

      list.push(treeNode)
    }
    return list
  }

  return (
    <Tree height={300} itemHeight={28} virtual defaultExpandedKeys={['0-0']} treeData={dig()} />
  )
}
```

### 自定义主题

通过 ThemeProvider 覆盖主题组件 Token。

```tsx
import React from 'react'
import { Tree, ConfigProvider } from '@xinghunm/compass-ui'

export default () => {
  const treeData = [
    {
      key: '0-0',
      title: 'parent 1',
      children: [{ key: '0-0-0', title: 'leaf', isLeaf: true }],
    },
  ]

  return (
    <ConfigProvider
      theme={{
        token: {
          components: {
            tree: {
              nodeSelectedBg: '#f6ffed',
              nodeHoverBg: '#d9f7be',
              nodeColor: '#389e0d',
              nodeSelectedColor: '#135200',
              switcherColor: '#389e0d',
              switcherHoverColor: '#135200',
              fontSize: '16px',
              borderRadius: '12px',
              indentSize: '32px',
            },
          },
        },
      }}
    >
      <Tree treeData={treeData} defaultExpandedKeys={['0-0']} defaultSelectedKeys={['0-0-0']} />
    </ConfigProvider>
  )
}
```

## API

### Tree

| 参数                | 说明                             | 类型                           | 默认值  |
| ------------------- | -------------------------------- | ------------------------------ | ------- |
| treeData            | 树形数据                         | `DataNode[]`                   | `[]`    |
| checkable           | 节点前添加 Checkbox 复选框       | `boolean`                      | `false` |
| selectable          | 是否可选中                       | `boolean`                      | `true`  |
| showLine            | 是否展示连接线                   | `boolean`                      | `false` |
| showIcon            | 是否展示 TreeNode title 前的图标 | `boolean`                      | `false` |
| virtual             | 设置 false 时关闭虚拟滚动        | `boolean`                      | `true`  |
| height              | 虚拟滚动容器高度                 | `number`                       | -       |
| itemHeight          | 虚拟滚动每一行的高度             | `number`                       | -       |
| defaultExpandedKeys | 默认展开的节点 key 数组          | `(string \| number)[]`         | -       |
| expandedKeys        | （受控）展开的节点 key 数组      | `(string \| number)[]`         | -       |
| defaultSelectedKeys | 默认选中的节点 key 数组          | `(string \| number)[]`         | -       |
| selectedKeys        | （受控）选中的节点 key 数组      | `(string \| number)[]`         | -       |
| defaultCheckedKeys  | 默认勾选的节点 key 数组          | `(string \| number)[]`         | -       |
| checkedKeys         | （受控）勾选的节点 key 数组      | `(string \| number)[]`         | -       |
| onExpand            | 展开/收起节点时触发              | `(expandedKeys, info) => void` | -       |
| onSelect            | 点击树节点时触发                 | `(selectedKeys, info) => void` | -       |
| onCheck             | 点击复选框时触发                 | `(checkedKeys, info) => void`  | -       |

## 主题变量 (Design Token)

| Token Name                | Description      | Default               |
| ------------------------- | ---------------- | --------------------- |
| `tree.nodeSelectedBg`     | 节点选中背景色   | `#e6f7ff`             |
| `tree.nodeHoverBg`        | 节点悬浮背景色   | `#f5f5f5`             |
| `tree.nodeColor`          | 节点文本颜色     | `rgba(0, 0, 0, 0.88)` |
| `tree.nodeSelectedColor`  | 节点选中文本颜色 | `rgba(0, 0, 0, 0.88)` |
| `tree.switcherColor`      | 展开图标颜色     | `rgba(0, 0, 0, 0.45)` |
| `tree.switcherHoverColor` | 展开图标悬浮颜色 | `#1890ff`             |
| `tree.fontSize`           | 字体大小         | `14px`                |
| `tree.borderRadius`       | 圆角             | `4px`                 |
| `tree.indentSize`         | 缩进大小         | `24px`                |
