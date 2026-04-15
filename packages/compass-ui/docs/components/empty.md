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

### 自定义主题

```tsx
import React from 'react'
import { ConfigProvider, Empty } from '@xinghunm/compass-ui'

export default () => (
  <ConfigProvider
    theme={{
      token: {
        components: {
          empty: {
            titleColor: '#0f172a',
            descriptionColor: '#475569',
            imageBackground:
              'linear-gradient(135deg, rgba(15, 118, 110, 0.14), rgba(14, 165, 233, 0.12)), #f8fafc',
          },
        },
      },
    }}
  >
    <Empty title="还没有内容" description="空状态插图和文案颜色都可以单独调整。" />
  </ConfigProvider>
)
```

更多可配置字段见 [主题 Token](/guide/theme-tokens)。

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

### classNames / styles 插槽

`classNames` 与 `styles` 使用相同的 slot key。

| 插槽名        | 说明     |
| ------------- | -------- |
| `root`        | 根容器   |
| `image`       | 插图区   |
| `title`       | 标题区域 |
| `description` | 描述文本 |
| `action`      | 操作区   |

## 主题变量 (Design Token)

| Token Name                               | Description      | Default                                                                               |
| ---------------------------------------- | ---------------- | ------------------------------------------------------------------------------------- |
| `components.empty.gap.sm`                | 小尺寸内容间距   | `8px`                                                                                 |
| `components.empty.gap.md`                | 中尺寸内容间距   | `12px`                                                                                |
| `components.empty.gap.lg`                | 大尺寸内容间距   | `16px`                                                                                |
| `components.empty.padding.sm`            | 小尺寸容器内边距 | `20px 16px`                                                                           |
| `components.empty.padding.md`            | 中尺寸容器内边距 | `32px 20px`                                                                           |
| `components.empty.padding.lg`            | 大尺寸容器内边距 | `40px 24px`                                                                           |
| `components.empty.imageWidth.sm`         | 小尺寸插图宽度   | `64px`                                                                                |
| `components.empty.imageWidth.md`         | 中尺寸插图宽度   | `88px`                                                                                |
| `components.empty.imageWidth.lg`         | 大尺寸插图宽度   | `112px`                                                                               |
| `components.empty.imageHeight.sm`        | 小尺寸插图高度   | `48px`                                                                                |
| `components.empty.imageHeight.md`        | 中尺寸插图高度   | `60px`                                                                                |
| `components.empty.imageHeight.lg`        | 大尺寸插图高度   | `72px`                                                                                |
| `components.empty.imageRadius`           | 插图圆角         | `16px`                                                                                |
| `components.empty.imageBackground`       | 插图背景         | `linear-gradient(135deg, rgba(22, 119, 255, 0.12), rgba(82, 196, 26, 0.08)), #fafafa` |
| `components.empty.imageBorderColor`      | 插图边框颜色     | `#d9d9d9`                                                                             |
| `components.empty.imagePlaceholderColor` | 插图占位图形颜色 | `#d9d9d9`                                                                             |
| `components.empty.titleColor`            | 标题文字颜色     | `#1f1f1f`                                                                             |
| `components.empty.descriptionColor`      | 描述文字颜色     | `#8c8c8c`                                                                             |
| `components.empty.actionGap`             | 操作区间距       | `8px`                                                                                 |

Empty 还会跟随全局 `colors.border`、`colors.text`、`colors.textSecondary`、`spacing.sm`、`borderRadius.lg`、`fontSize.md` 与 `fontSize.sm` 等 token 变化，但组件级覆盖优先使用 `components.empty.*`。
