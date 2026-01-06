---
title: Table 表格
nav:
  title: 组件
  order: 2
group:
  title: 数据展示
  order: 3
---

# Table 表格

展示行列数据的表格组件。

## 何时使用

- 当有大量结构化的数据需要展现时
- 当需要对数据进行排序、搜索、分页、自定义操作等复杂行为时

## 代码演示

### 基础用法

最简单的表格用法。

```tsx
import React from 'react'
import { Table } from '@xinghunm/compass-ui'

export default () => {
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
  ]

  const dataSource = [
    {
      key: '1',
      name: '张三',
      age: 32,
      address: '北京市朝阳区',
    },
    {
      key: '2',
      name: '李四',
      age: 42,
      address: '上海市浦东新区',
    },
  ]

  return <Table columns={columns} dataSource={dataSource} />
}
```

### 带边框

添加表格边框。

```tsx
import React from 'react'
import { Table } from '@xinghunm/compass-ui'

export default () => {
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
  ]

  const dataSource = [
    {
      key: '1',
      name: '张三',
      age: 32,
      address: '北京市朝阳区',
    },
    {
      key: '2',
      name: '李四',
      age: 42,
      address: '上海市浦东新区',
    },
  ]

  return <Table columns={columns} dataSource={dataSource} bordered />
}
```

### 可选择

通过 `rowSelection` 配置项启用行选择功能。

```tsx
import React, { useState } from 'react'
import { Table } from '@xinghunm/compass-ui'

export default () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
  ]

  const dataSource = [
    {
      key: '1',
      name: '张三',
      age: 32,
      address: '北京市朝阳区',
    },
    {
      key: '2',
      name: '李四',
      age: 42,
      address: '上海市浦东新区',
    },
    {
      key: '3',
      name: '王五',
      age: 28,
      address: '深圳市南山区',
    },
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys)
    },
  }

  return (
    <div>
      <p>已选择: {selectedRowKeys.join(', ')}</p>
      <Table columns={columns} dataSource={dataSource} rowSelection={rowSelection} />
    </div>
  )
}
```

### 加载状态

表格加载中状态。

```tsx
import React from 'react'
import { Table } from '@xinghunm/compass-ui'

export default () => {
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
  ]

  const dataSource = [
    {
      key: '1',
      name: '张三',
      age: 32,
      address: '北京市朝阳区',
    },
  ]

  return <Table columns={columns} dataSource={dataSource} loading />
}
```

### 空数据

无数据时的展示。

```tsx
import React from 'react'
import { Table } from '@xinghunm/compass-ui'

export default () => {
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
  ]

  return <Table columns={columns} dataSource={[]} />
}
```

### 分页用法

通过 `pagination` 属性配置分页。注意：Table 组件只通过 `pagination` 属性透传配置，分页逻辑（如数据切片）需由用户处理。

```tsx
import React, { useState } from 'react'
import { Table } from '@xinghunm/compass-ui'

export default () => {
  const [current, setCurrent] = useState(1)
  const pageSize = 3

  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '年龄', dataIndex: 'age', key: 'age' },
  ]

  // 模拟数据 10 条
  const dataSource = Array.from({ length: 10 }).map((_, i) => ({
    key: i,
    name: `User ${i + 1}`,
    age: 20 + i,
  }))

  const currentData = dataSource.slice((current - 1) * pageSize, current * pageSize)

  return (
    <Table
      columns={columns}
      dataSource={currentData}
      pagination={{
        current,
        total: dataSource.length,
        pageSize,
        onChange: (page) => setCurrent(page),
      }}
    />
  )
}
```

### 自定义 RowKey

默认情况下，表格使用 `key` 属性作为行标识。如果数据中没有 `key`，可以使用 `rowKey` 指定其他字段。

```tsx
import React from 'react'
import { Table } from '@xinghunm/compass-ui'

export default () => {
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
  ]

  const data = [
    { id: '1001', name: 'Alice' },
    { id: '1002', name: 'Bob' },
  ]

  return <Table columns={columns} dataSource={data} rowKey="id" />
}
```

### 自定义样式

通过 `className` 和 `style` 自定义表格样式。

```tsx
import React from 'react'
import { Table } from '@xinghunm/compass-ui'

export default () => (
  <>
    <style>{`
    .custom-table .compass-table {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .custom-table .compass-table-thead th {
      background: #e6f7ff !important;
      color: #1890ff;
      font-weight: bold;
    }
  `}</style>
    <Table
      columns={[
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Role', dataIndex: 'role', key: 'role' },
      ]}
      dataSource={[
        { key: 1, name: 'Styled User', role: 'Admin' },
        { key: 2, name: 'Another User', role: 'Guest' },
      ]}
      className="custom-table"
      style={{ marginTop: 20 }}
      bordered
    />
  </>
)
```

### 排序用法

通过 `sorter` 属性配置列排序。

```tsx
import React from 'react'
import { Table } from '@xinghunm/compass-ui'

export default () => {
  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
  ]

  const data = [
    { key: 1, name: 'John', age: 32, address: 'New York' },
    { key: 2, name: 'Jim', age: 42, address: 'London' },
    { key: 3, name: 'Joe', age: 20, address: 'Tokyo' },
    { key: 4, name: 'Jim', age: 25, address: 'Paris' },
  ]

  return <Table columns={columns} dataSource={data} />
}
```

### 固定列

当表格内容宽度超出容器时，可以使用 `fixed` 属性固定首尾列。建议配合 `scroll.x` 设置表格内容的**总宽度**（例如 `1300`）。当容器宽度小于此值时，会出现横向滚动条。

```tsx
import React from 'react'
import { Table } from '@xinghunm/compass-ui'

export default () => {
  const columns = [
    { title: 'Full Name', dataIndex: 'name', key: 'name', width: 100, fixed: 'left' },
    { title: 'Age', dataIndex: 'age', key: 'age', width: 100 },
    { title: 'Column 1', dataIndex: 'address', key: '1', width: 150 },
    { title: 'Column 2', dataIndex: 'address', key: '2', width: 150 },
    { title: 'Column 3', dataIndex: 'address', key: '3', width: 150 },
    { title: 'Column 4', dataIndex: 'address', key: '4', width: 150 },
    { title: 'Action', key: 'operation', fixed: 'right', width: 100, render: () => <a>Action</a> },
  ]

  const data = []
  for (let i = 0; i < 20; i++) {
    data.push({
      key: i,
      name: `Edrward ${i}`,
      age: 32,
      address: `London Park no. ${i}`,
    })
  }

  return <Table columns={columns} dataSource={data} scroll={{ x: 1300 }} />
}
```

### 紧凑型表格

通过 `size` 属性设置表格大小，支持 `small`、`medium`、`large`。

```tsx
import React from 'react'
import { Table } from '@xinghunm/compass-ui'

export default () => {
  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '年龄', dataIndex: 'age', key: 'age' },
    { title: '地址', dataIndex: 'address', key: 'address' },
  ]
  const data = [
    { key: '1', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
    { key: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
    { key: '3', name: 'Joe Black', age: 32, address: 'Sidney No. 1 Lake Park' },
  ]
  return (
    <div>
      <h4>Small Size</h4>
      <Table columns={columns} dataSource={data} size="small" />
      <h4 style={{ marginTop: 16 }}>Medium Size (Default)</h4>
      <Table columns={columns} dataSource={data} size="medium" />
    </div>
  )
}
```

### 自定义空状态

通过 `emptyText` 属性自定义数据为空时的展示内容，支持字符串或 ReactNode。

```tsx
import React from 'react'
import { Table } from '@xinghunm/compass-ui'

export default () => {
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
  ]

  return (
    <Table
      columns={columns}
      dataSource={[]}
      emptyText={
        <div style={{ textAlign: 'center', padding: '30px 0' }}>
          <span style={{ fontSize: 24, display: 'block', marginBottom: 8 }}>🕵️‍♂️</span>
          <span style={{ color: '#999' }}>这里什么都没有...</span>
        </div>
      }
    />
  )
}
```

## API

### Table

| 参数         | 说明                   | 类型                                             | 默认值      |
| ------------ | ---------------------- | ------------------------------------------------ | ----------- |
| columns      | 表格列的配置           | [ColumnType[]](#columntype)                      | `[]`        |
| dataSource   | 数据数组               | `object[]`                                       | `[]`        |
| bordered     | 是否展示外边框和列边框 | `boolean`                                        | `false`     |
| loading      | 页面是否加载中         | `boolean`                                        | `false`     |
| rowSelection | 行选择配置             | [RowSelection](#rowselection)                    | -           |
| rowKey       | 表格行 key 的取值      | `string \| (record) => string`                   | `'key'`     |
| pagination   | 分页配置               | `PaginationConfig \| false`                      | -           |
| size         | 表格大小               | `'small' \| 'medium' \| 'large'`                 | `'medium'`  |
| emptyText    | 空数据文案             | `ReactNode`                                      | `'No Data'` |
| scroll       | 滚动设置               | `{ x?: string \| number, y?: string \| number }` | -           |
| className    | 自定义类名             | `string`                                         | -           |
| style        | 自定义样式             | `React.CSSProperties`                            | -           |

### ColumnType

| 参数      | 说明                       | 类型                                 | 默认值   |
| --------- | -------------------------- | ------------------------------------ | -------- |
| title     | 列头显示文字               | `ReactNode`                          | -        |
| dataIndex | 列数据在数据项中对应的路径 | `string`                             | -        |
| key       | React 需要的 key           | `string`                             | -        |
| width     | 列宽度                     | `string \| number`                   | -        |
| align     | 设置列的对齐方式           | `'left' \| 'center' \| 'right'`      | `'left'` |
| render    | 生成复杂数据的渲染函数     | `(text, record, index) => ReactNode` | -        |
| sorter    | 排序函数                   | `(a, b) => number`                   | -        |
| fixed     | 列是否固定                 | `'left' \| 'right' \| boolean`       | -        |

### RowSelection

| 参数            | 说明                   | 类型                                      | 默认值       |
| --------------- | ---------------------- | ----------------------------------------- | ------------ |
| selectedRowKeys | 指定选中项的 key 数组  | `string[]`                                | `[]`         |
| onChange        | 选中项发生变化时的回调 | `(selectedRowKeys, selectedRows) => void` | -            |
| type            | 多选/单选              | `'checkbox' \| 'radio'`                   | `'checkbox'` |
