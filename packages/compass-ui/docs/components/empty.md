---
title: Empty 空状态
nav:
  title: 组件
  order: 2
group:
  title: 反馈
  order: 4
---

# Empty 空状态

`Empty` 用于“当前没有内容可展示”的场景，例如搜索无结果、列表为空、初始化后还没有创建任何数据。

## 何时使用

- 数据请求成功，但结果为空时
- 列表、表格、卡片区或页面暂时没有可展示内容时
- 需要把空态说明和引导动作放在一起时

## 代码演示

### 基础用法

```tsx
import React from 'react'
import { Empty } from '@xinghunm/compass-ui'

export default () => (
  <Empty title="暂无项目" description="创建第一个项目后，这里会显示最近访问记录。" />
)
```

### 带操作区

```tsx
import React from 'react'
import { Button, Empty } from '@xinghunm/compass-ui'

export default () => (
  <Empty
    title="搜索无结果"
    description="换一个关键词试试，或者直接创建新内容。"
    action={<Button>立即创建</Button>}
  />
)
```

### 紧凑模式

```tsx
import React from 'react'
import { Empty } from '@xinghunm/compass-ui'

export default () => <Empty size="small" description="当前筛选条件下没有数据。" />
```

## 与其他反馈组件的区别

- `Empty` 表达“没有内容”，不是“请求失败”
- 如果当前区域仍在加载中，请使用 `Skeleton` 或 `SpinLoading`
- 如果需要持续解释错误、风险或成功状态，请使用 `Alert`

## 当前接入

- `Table` 已经开始复用 `Empty` 作为默认空态基建

## 键盘与可访问性

- `Empty` 本身是静态页面内反馈，不会主动接管焦点
- 如果传入 `action`，可访问性与键盘行为由传入的交互组件负责
- 适合作为列表、表格、卡片区的空内容占位，而不是错误提示或加载态

## API

通用属性参考：[通用属性](/guide/common-props)

| 属性          | 说明               | 类型                             | 默认值     |
| ------------- | ------------------ | -------------------------------- | ---------- |
| `image`       | 顶部插图或占位图形 | `ReactNode`                      | -          |
| `title`       | 主标题             | `ReactNode`                      | -          |
| `description` | 说明文案           | `ReactNode`                      | -          |
| `action`      | 操作区内容         | `ReactNode`                      | -          |
| `size`        | 空态密度           | `'small' \| 'medium' \| 'large'` | `'medium'` |
| `classNames`  | 语义化类名覆写     | `EmptyProps['classNames']`       | -          |
| `styles`      | 语义化样式覆写     | `EmptyProps['styles']`           | -          |
