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

### 配合 styled-components 使用

利用 `styled` 可以非常方便地封装带有一致样式的组件。因为 TreeSelect 的下拉弹层渲染在 Portal 中，为了让样式覆盖到弹层，我们同样需要把 className 透传给 `dropdownClassName`：

```tsx
/**
 * title: 配合 styled-components / emotion
 * description: 针对 Portal 渲染的组件，将 className 转发给下拉浮层即可优雅地封装样式。
 */
import React, { useState } from 'react'
import styled from '@emotion/styled'
import { TreeSelect } from '@xinghunm/compass-ui'
import type { TreeSelectProps } from '@xinghunm/compass-ui'

// 1. 制作一个透明转发的 Wrapper，将 className 透传给浮层
const TreeSelectWrapper = ({ className, ...props }: TreeSelectProps) => (
  <TreeSelect
    className={className}
    dropdownClassName={className} // 关键点
    {...props}
  />
)

// 2. 利用内部静态类名进行样式覆盖
const StyledTreeSelect = styled(TreeSelectWrapper)`
  /* 1. 针对触发器的样式 */
  &.compass-tree-select {
    width: 250px;

    .compass-select-selector {
      border-radius: 8px;
      background-color: #f0f5ff;
    }
  }

  /* 2. 针对下拉浮层和里面树的样式 */
  &.compass-tree-select-dropdown {
    border-radius: 12px;
    padding: 8px;

    .compass-tree-node-content-wrapper {
      border-radius: 4px;
      &:hover {
        background-color: #e6f4ff;
      }
    }

    .compass-tree-node-selected {
      background-color: #bae0ff;
    }
  }
`

export default () => {
  const [value, setValue] = useState<string>()

  const treeData = [
    {
      key: '1',
      title: 'Node 1',
      children: [{ key: '1-1', title: 'Child Node 1' }],
    },
    { key: '2', title: 'Node 2' },
  ]

  return (
    <StyledTreeSelect
      value={value}
      onChange={setValue}
      treeData={treeData}
      placeholder="Styled TreeSelect"
      treeDefaultExpandAll
    />
  )
}
```

## 键盘与可访问性

- 非搜索模式下，触发器以 `combobox` 语义暴露当前展开状态，并通过 `aria-expanded`、`aria-controls` 关联树形浮层。
- 搜索模式下，输入框承担同样的 `combobox` 语义，输入过滤条件后仍然由同一个浮层承载树节点结果。
- 展开后的树形浮层支持通过 `Escape` 关闭；外部点击会关闭浮层，浮层内部点击不会被当成外部关闭处理。
- `disabled` 状态下不会打开浮层，也不会响应搜索或选择动作。

## API

通用属性参考：[通用属性](/guide/common-props)

### TreeSelect

| 参数                    | 说明               | 类型                                                                             | 默认值     |
| ----------------------- | ------------------ | -------------------------------------------------------------------------------- | ---------- |
| value                   | 指定当前选中的条目 | `SelectValue`                                                                    | -          |
| defaultValue            | 指定默认选中的条目 | `SelectValue`                                                                    | -          |
| treeData                | treeNodes 数据     | `DataNode[]`                                                                     | `[]`       |
| onChange                | 选中 option 时调用 | `(value: SelectValue, label: ReactNode \| ReactNode[], extra?: unknown) => void` | -          |
| disabled                | 是否禁用           | `boolean`                                                                        | `false`    |
| allowClear              | 支持清除           | `boolean`                                                                        | `false`    |
| multiple                | 是否支持多选       | `boolean`                                                                        | `false`    |
| showSearch              | 是否支持搜索       | `boolean`                                                                        | `false`    |
| size                    | 选择框大小         | `'small' \| 'medium' \| 'large'`                                                 | `'medium'` |
| status                  | 校验状态           | `'error' \| 'warning'`                                                           | -          |
| treeCheckable           | 是否显示 Checkbox  | `boolean`                                                                        | `false`    |
| treeSelectable          | 是否可选中         | `boolean`                                                                        | `true`     |
| onlyLeafSelect          | 只允许选择叶子节点 | `boolean`                                                                        | `false`    |
| treeDefaultExpandAll    | 默认展开所有树节点 | `boolean`                                                                        | `false`    |
| treeDefaultExpandedKeys | 默认展开的树节点   | `(string \| number)[]`                                                           | -          |
| placeholder             | 选择框默认文字     | `string`                                                                         | -          |
| dropdownStyle           | 下拉菜单的样式     | `React.CSSProperties`                                                            | -          |
| dropdownClassName       | 下拉菜单的类名     | `string`                                                                         | -          |
| treeSelectedIcon        | 选中树节点的图标   | `ReactNode`                                                                      | -          |
| titleRender             | 自定义节点标题渲染 | `(node: DataNode, searchValue: string) => ReactNode`                             | -          |
| switcherIcon            | 自定义展开图标     | `ReactNode \| ((props: { expanded: boolean }) => ReactNode)`                     | -          |
