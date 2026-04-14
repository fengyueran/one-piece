---
title: SpinLoading 加载中
nav:
  title: 组件
  order: 2
group:
  title: 反馈
  order: 4
---

# SpinLoading 加载中

`SpinLoading` 是通用加载态组件。它既可以独立作为一个内联 loading 指示器，也可以包裹已有内容，形成容器级覆盖式加载态。

## 何时使用

- 需要用简单加载指示器表示“正在处理中”时
- 需要在不卸载当前内容的情况下，为某个局部容器加一层 loading 遮罩时
- 你不确定是否应该用骨架屏，而当前场景更像“已有内容正在刷新”时

## 代码演示

### 独立加载态

```tsx
import React from 'react'
import { SpinLoading } from '@xinghunm/compass-ui'

export default () => <SpinLoading tip="正在加载数据" />
```

### 覆盖现有内容

```tsx
import React from 'react'
import { SpinLoading } from '@xinghunm/compass-ui'

export default () => (
  <SpinLoading tip="正在刷新">
    <div style={{ minHeight: 160, padding: 16, border: '1px solid #f0f0f0' }}>容器内容</div>
  </SpinLoading>
)
```

### 自定义大小

```tsx
import React from 'react'
import { SpinLoading } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ display: 'flex', gap: 16 }}>
    <SpinLoading size="small" />
    <SpinLoading size="medium" />
    <SpinLoading size="large" />
  </div>
)
```

## 与 `Message.loading` 的区别

- `SpinLoading` 是页面内或容器内构件
- `Message.loading` 是全局临时提示
- 如果你需要某个表格、卡片或区域显示刷新中，请优先考虑 `SpinLoading`

## 当前接入

- `Table` 已经开始复用 `SpinLoading` 处理空数据加载态和已有数据的覆盖式加载态

## 键盘与可访问性

- `SpinLoading` 会通过 `role="status"` 和 `aria-live="polite"` 暴露加载状态
- 当作为覆盖层使用时，原有内容不会被卸载，但会标记 `aria-busy="true"`
- 如果只是装饰性等待，不需要焦点管理；具体交互节奏仍由容器内业务组件负责

## API

通用属性参考：[通用属性](/guide/common-props)

| 属性         | 说明                             | 类型                                       | 默认值     |
| ------------ | -------------------------------- | ------------------------------------------ | ---------- |
| `spinning`   | 是否处于加载中                   | `boolean`                                  | `true`     |
| `indicator`  | 自定义加载指示器                 | `ReactNode`                                | -          |
| `tip`        | 辅助说明文案                     | `ReactNode`                                | -          |
| `size`       | 指示器尺寸                       | `'small' \| 'medium' \| 'large' \| number` | `'medium'` |
| `children`   | 被包裹的内容；传入后会渲染覆盖层 | `ReactNode`                                | -          |
| `classNames` | 语义化类名覆写                   | `SpinLoadingProps['classNames']`           | -          |
| `styles`     | 语义化样式覆写                   | `SpinLoadingProps['styles']`               | -          |
