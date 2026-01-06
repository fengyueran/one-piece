---
title: TreeSelect 树选择
nav:
  title: 组件
  order: 2
group:
  title: 数据展示
  order: 3
---

# TreeSelect 树选择

树型选择控件。

## 何时使用

类似 Select 的选择控件，可选择的数据结构是一个树形结构时，可以使用 TreeSelect，例如公司层级、学科系统、分类目录等等。

## 代码演示

### 基础用法

最简单的用法。

```tsx
import React, { useState } from 'react'
import { TreeSelect } from '@xinghunm/compass-ui'

export default () => {
  const [value, setValue] = useState()

  const treeData = [
    {
      key: 'parent 1',
      title: 'parent 1',
      children: [
        {
          key: 'parent 1-0',
          title: 'parent 1-0',
          children: [
            { key: 'leaf1', title: 'leaf1' },
            { key: 'leaf2', title: 'leaf2' },
          ],
        },
        {
          key: 'parent 1-1',
          title: 'parent 1-1',
          children: [{ key: 'leaf3', title: 'leaf3' }],
        },
      ],
    },
  ]

  return (
    <TreeSelect
      style={{ width: 300 }}
      value={value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      treeData={treeData}
      placeholder="Please select"
      treeDefaultExpandAll
      onChange={setValue}
    />
  )
}
```

### 多选

多选的树选择。

```tsx
import React, { useState } from 'react'
import { TreeSelect } from '@xinghunm/compass-ui'

export default () => {
  const [value, setValue] = useState(undefined)

  const treeData = [
    {
      key: 'parent 1',
      title: 'parent 1',
      children: [
        {
          key: 'parent 1-0',
          title: 'parent 1-0',
          children: [
            { key: 'leaf1', title: 'leaf1' },
            { key: 'leaf2', title: 'leaf2' },
          ],
        },
      ],
    },
  ]

  return (
    <TreeSelect
      showSearch
      style={{ width: 300 }}
      value={value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="Please select multiple"
      allowClear
      multiple
      treeDefaultExpandAll
      onChange={setValue}
      treeData={treeData}
    />
  )
}
```

### 勾选

带复选框的树选择。

```tsx
import React, { useState } from 'react'
import { TreeSelect } from '@xinghunm/compass-ui'

export default () => {
  const [value, setValue] = useState(['leaf1'])

  const treeData = [
    {
      key: 'parent 1',
      title: 'parent 1',
      children: [
        {
          key: 'parent 1-0',
          title: 'parent 1-0',
          children: [
            { key: 'leaf1', title: 'leaf1' },
            { key: 'leaf2', title: 'leaf2' },
          ],
        },
      ],
    },
  ]

  return (
    <TreeSelect
      treeCheckable
      showSearch
      style={{ width: 300 }}
      value={value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="Please select"
      allowClear
      treeDefaultExpandAll
      onChange={setValue}
      treeData={treeData}
    />
  )
}
```

### 可搜索

支持搜索树节点。

```tsx
import React, { useState } from 'react'
import { TreeSelect } from '@xinghunm/compass-ui'

export default () => {
  const [value, setValue] = useState(undefined)

  const treeData = [
    {
      key: 'parent 1',
      title: 'parent 1',
      children: [
        {
          key: 'parent 1-0',
          title: 'parent 1-0',
          children: [
            { key: 'leaf1', title: 'leaf1' },
            { key: 'leaf2', title: 'leaf2' },
          ],
        },
      ],
    },
  ]

  return (
    <TreeSelect
      showSearch
      style={{ width: 300 }}
      value={value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="Search..."
      allowClear
      treeDefaultExpandAll
      onChange={setValue}
      treeData={treeData}
    />
  )
}
```

### 只允许选择叶子节点

设置 `onlyLeafSelect` 为 `true`，父节点不可选，但点击可以展开/收起节点。

```tsx
import React, { useState } from 'react'
import { TreeSelect } from '@xinghunm/compass-ui'

export default () => {
  const [value, setValue] = useState()

  const treeData = [
    {
      key: 'parent 1',
      title: 'parent 1',
      children: [
        {
          key: 'parent 1-0',
          title: 'parent 1-0',
          children: [
            { key: 'leaf1', title: 'leaf1' },
            { key: 'leaf2', title: 'leaf2' },
          ],
        },
      ],
    },
  ]

  return (
    <TreeSelect
      style={{ width: 300 }}
      value={value}
      onChange={setValue}
      treeData={treeData}
      onlyLeafSelect
      placeholder="Please select leaf node"
      treeDefaultExpandedKeys={['parent 1', 'parent 1-0']}
    />
  )
}
```

### 部分节点可选

通过在 `treeData` 中设置节点的 `selectable: false`，可以禁用特定节点的选择功能。

```tsx
import React, { useState } from 'react'
import { TreeSelect } from '@xinghunm/compass-ui'

export default () => {
  const [value, setValue] = useState(undefined)

  const treeData = [
    {
      key: 'parent 1',
      title: 'parent 1 (Not Selectable)',
      selectable: false,
      children: [
        {
          key: 'parent 1-0',
          title: 'parent 1-0',
          children: [
            { key: 'leaf1', title: 'leaf1 (Not Selectable)', selectable: false },
            { key: 'leaf2', title: 'leaf2' },
          ],
        },
        {
          key: 'parent 1-1',
          title: 'parent 1-1',
          children: [{ key: 'leaf3', title: 'leaf3' }],
        },
      ],
    },
  ]

  return (
    <TreeSelect
      style={{ width: 300 }}
      value={value}
      onChange={setValue}
      treeData={treeData}
      placeholder="Please select"
      treeDefaultExpandedKeys={['parent 1', 'parent 1-0']}
    />
  )
}
```

## API

### TreeSelect

| 参数                    | 说明               | 类型                                                       | 默认值  |
| ----------------------- | ------------------ | ---------------------------------------------------------- | ------- |
| value                   | 指定当前选中的条目 | `SelectValue`                                              | -       |
| defaultValue            | 指定默认选中的条目 | `SelectValue`                                              | -       |
| treeData                | treeNodes 数据     | `DataNode[]`                                               | `[]`    |
| onChange                | 选中 option 时调用 | `(value: SelectValue, node: DataNode, extra: any) => void` | -       |
| disabled                | 是否禁用           | `boolean`                                                  | `false` |
| multiple                | 是否支持多选       | `boolean`                                                  | `false` |
| showSearch              | 是否支持搜索       | `boolean`                                                  | `false` |
| treeCheckable           | 是否显示 Checkbox  | `boolean`                                                  | `false` |
| treeSelectable          | 是否可选中         | `boolean`                                                  | `true`  |
| onlyLeafSelect          | 只允许选择叶子节点 | `boolean`                                                  | `false` |
| treeDefaultExpandAll    | 默认展开所有树节点 | `boolean`                                                  | `false` |
| treeDefaultExpandedKeys | 默认展开的树节点   | `string[]`                                                 | -       |
| placeholder             | 选择框默认文字     | `string`                                                   | -       |
| className               | 自定义类名         | `string`                                                   | -       |
| style                   | 自定义样式         | `CSSProperties`                                            | -       |
| dropdownStyle           | 下拉菜单的样式     | `CSSProperties`                                            | -       |
| dropdownClassName       | 下拉菜单的类名     | `string`                                                   | -       |
