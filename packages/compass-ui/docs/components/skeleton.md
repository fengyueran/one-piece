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

### 自定义主题

```tsx
import React from 'react'
import { ConfigProvider, Skeleton } from '@xinghunm/compass-ui'

export default () => (
  <ConfigProvider
    theme={{
      token: {
        components: {
          skeleton: {
            borderRadius: '10px',
            shimmerBaseColor: 'rgba(15, 23, 42, 0.08)',
            shimmerHighlightColor: 'rgba(15, 118, 110, 0.18)',
          },
        },
      },
    }}
  >
    <Skeleton avatar rows={4} />
  </ConfigProvider>
)
```

更多可配置字段见 [主题 Token](/guide/theme-tokens)。

## 与 `SpinLoading` 的区别

- `Skeleton` 适合“结构已知、内容未到”的占位加载
- `SpinLoading` 更适合通用等待态、覆盖式加载或局部容器忙碌态
- 如果是彻底没有内容，而不是还在等内容，请使用 `Empty`

## 键盘与可访问性

- `Skeleton` 默认只输出装饰性占位块，不会进入 Tab 序列
- 当 `loading={false}` 时，组件会直接还原真实内容，焦点管理仍由真实内容负责
- 建议只在结构稳定的区域使用，避免与真实交互控件语义混用

## API

通用属性参考：[通用属性](/guide/common-props)

| 属性         | 说明                               | 类型                          | 默认值  |
| ------------ | ---------------------------------- | ----------------------------- | ------- |
| `loading`    | 是否显示骨架占位                   | `boolean`                     | `true`  |
| `active`     | 是否启用动画效果                   | `boolean`                     | `true`  |
| `avatar`     | 是否显示头像占位                   | `boolean`                     | `false` |
| `title`      | 是否显示标题占位                   | `boolean`                     | `true`  |
| `rows`       | 段落占位行数                       | `number`                      | `3`     |
| `round`      | 是否使用圆角块样式                 | `boolean`                     | `false` |
| `children`   | `loading={false}` 时渲染的真实内容 | `ReactNode`                   | -       |
| `classNames` | 语义化类名覆写                     | `SkeletonProps['classNames']` | -       |
| `styles`     | 语义化样式覆写                     | `SkeletonProps['styles']`     | -       |

## 主题变量 (Design Token)

| Token Name                                  | Description  | Default                     |
| ------------------------------------------- | ------------ | --------------------------- |
| `components.skeleton.gap`                   | 主体块间距   | `12px`                      |
| `components.skeleton.rowGap`                | 行间距       | `8px`                       |
| `components.skeleton.avatarSize`            | 头像占位尺寸 | `40px`                      |
| `components.skeleton.blockHeight`           | 文本块高度   | `14px`                      |
| `components.skeleton.borderRadius`          | 骨架块圆角   | `4px`                       |
| `components.skeleton.shimmerBaseColor`      | 动画基础色   | `rgba(0, 0, 0, 0.12)`       |
| `components.skeleton.shimmerHighlightColor` | 动画高亮色   | `rgba(255, 255, 255, 0.92)` |
