---
title: Pagination 分页
nav:
  title: 组件
  order: 2
group:
  title: 导航
  order: 5
---

# Pagination 分页

分页组件。

## 何时使用

当数据量过多时，使用分页分解数据。

## 代码演示

### 基础用法

基本分页。

```tsx
import React from 'react'
import { Pagination } from '@xinghunm/compass-ui'

export default () => <Pagination total={50} />
```

### 更多分页

更多分页。

```tsx
import React from 'react'
import { Pagination } from '@xinghunm/compass-ui'

export default () => <Pagination defaultCurrent={6} total={500} />
```

### 改变每页显示条目数

展示 pageSize 切换器。

```tsx
import React from 'react'
import { Pagination } from '@xinghunm/compass-ui'

export default () => <Pagination total={500} showSizeChanger />
```

### 迷你尺寸

迷你版本的分页。

```tsx
import React from 'react'
import { Pagination } from '@xinghunm/compass-ui'

export default () => <Pagination size="small" total={50} showSizeChanger />
```

### 受控模式

通过 `current` 和 `onChange` 控制当前页码。

```tsx
import React, { useState } from 'react'
import { Pagination } from '@xinghunm/compass-ui'

export default () => {
  const [current, setCurrent] = useState(3)

  const onChange = (page) => {
    console.log('Page:', page)
    setCurrent(page)
  }

  return <Pagination current={current} onChange={onChange} total={50} />
}
```

### 显示总数

通过 `showTotal` 属性显示总数和当前数据范围。

```tsx
import React from 'react'
import { Pagination } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <Pagination
      total={85}
      pageSize={20}
      defaultCurrent={1}
      showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
    />

    <Pagination
      total={85}
      pageSize={20}
      defaultCurrent={1}
      totalAlign="right"
      showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
    />
  </div>
)
```

### 快速跳转

是否可以快速跳转至某页。

```tsx
import React from 'react'
import { Pagination } from '@xinghunm/compass-ui'

export default () => <Pagination total={500} showQuickJumper />
```

### 简单模式

设置 `simple` 属性启用简单模式，适用于空间有限的场景。

```tsx
import React from 'react'
import { Pagination } from '@xinghunm/compass-ui'

export default () => <Pagination simple total={50} />
```

### 自定义页大小选项

通过 `pageSizeOptions` 自定义每页显示条数的选项列表。

```tsx
import React from 'react'
import { Pagination } from '@xinghunm/compass-ui'

export default () => (
  <Pagination total={500} showSizeChanger pageSizeOptions={[20, 40, 60, 80]} defaultPageSize={40} />
)
```

### 禁用状态

设置 `disabled` 属性来禁用分页导航。

```tsx
import React from 'react'
import { Pagination } from '@xinghunm/compass-ui'

export default () => <Pagination total={50} disabled showSizeChanger showQuickJumper />
```

### 自定义主题

通过 ConfigProvider 覆盖主题变量。

```tsx
import React from 'react'
import { Pagination, ConfigProvider } from '@xinghunm/compass-ui'

export default () => (
  <ConfigProvider
    theme={{
      token: {
        components: {
          pagination: {
            itemSize: '40px',
            itemActiveBg: '#e6f7ff',
            itemActiveColor: '#1890ff',
            itemBorderRadius: '50%',
            fontSize: '16px',
            itemHoverColor: '#40a9ff',
          },
        },
      },
    }}
  >
    <Pagination total={50} />
  </ConfigProvider>
)
```

## API

### Pagination

| 参数            | 说明                           | 类型                                                    | 默认值              |
| --------------- | ------------------------------ | ------------------------------------------------------- | ------------------- |
| current         | 当前页数                       | `number`                                                | -                   |
| defaultCurrent  | 默认的当前页数                 | `number`                                                | `1`                 |
| total           | 数据总数                       | `number`                                                | `0`                 |
| pageSize        | 每页条数                       | `number`                                                | -                   |
| defaultPageSize | 默认的每页条数                 | `number`                                                | `10`                |
| onChange        | 页码或 pageSize 改变的回调     | `(page: number, pageSize: number) => void`              | -                   |
| disabled        | 禁用分页                       | `boolean`                                               | `false`             |
| showSizeChanger | 是否展示 pageSize 切换器       | `boolean`                                               | `false`             |
| pageSizeOptions | 指定每页可以显示多少条         | `number[]`                                              | `[10, 20, 50, 100]` |
| showQuickJumper | 是否可以快速跳转至某页         | `boolean`                                               | `false`             |
| showTotal       | 用于显示数据总量和当前数据范围 | `(total: number, range: [number, number]) => ReactNode` | -                   |
| simple          | 是否使用简单模式               | `boolean`                                               | `false`             |
| size            | 当为 small 时，是小尺寸分页    | `'default' \| 'small'`                                  | `'default'`         |
| totalAlign      | 指定总数文字的对齐方式         | `'left' \| 'right'`                                     | `'left'`            |

## 主题变量 (Design Token)

| Token Name                               | Description    | Default             |
| ---------------------------------------- | -------------- | ------------------- |
| `components.pagination.itemSize`         | 页码按钮大小   | 32px                |
| `components.pagination.fontSize`         | 字体大小       | 14px                |
| `components.pagination.itemBg`           | 按钮背景色     | #ffffff             |
| `components.pagination.itemActiveBg`     | 选中项背景色   | #ffffff             |
| `components.pagination.itemBorderRadius` | 按钮圆角       | 4px                 |
| `components.pagination.itemColor`        | 按钮文字颜色   | rgba(0, 0, 0, 0.88) |
| `components.pagination.itemActiveColor`  | 选中项文字颜色 | #1890ff             |
| `components.pagination.itemHoverColor`   | 悬停文字颜色   | #1890ff             |
| `components.pagination.itemHoverBg`      | 悬停背景色     | -                   |
