---
title: Skeleton 骨架屏
nav:
  title: 组件
  order: 2
group:
  title: 反馈
  order: 4
---

# Skeleton 骨架屏

`Skeleton` 用于内容结构已经确定、但真实数据还没返回时的占位展示。它的作用是降低加载等待时的布局跳动感。

## 何时使用

- 你知道内容大致长什么样，但数据还在请求中
- 需要避免真实内容到来前的布局闪烁
- 卡片、详情区、侧栏摘要等区域需要局部占位时

## 代码演示

### 基础用法

```tsx
import React from 'react'
import { Skeleton } from '@xinghunm/compass-ui'

export default () => <Skeleton rows={3} />
```

### 带头像和标题

```tsx
import React from 'react'
import { Skeleton } from '@xinghunm/compass-ui'

export default () => <Skeleton avatar rows={4} />
```

### 加载完成后切换真实内容

```tsx
import React from 'react'
import { Skeleton } from '@xinghunm/compass-ui'

export default () => (
  <Skeleton loading={false}>
    <div>真实内容已经返回</div>
  </Skeleton>
)
```

## 与 `SpinLoading` 的区别

- `Skeleton` 适合“结构已知、内容未到”的占位加载
- `SpinLoading` 更适合通用等待态、覆盖式加载或局部容器忙碌态
- 如果是彻底没有内容，而不是还在等内容，请使用 `Empty`
