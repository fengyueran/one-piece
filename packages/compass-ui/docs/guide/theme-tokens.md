---
title: 主题 Token
nav:
  title: 指南
  order: 1
group:
  title: 基础
  order: 3
---

# 主题 Token

`Compass UI` 的主题定制统一通过 `ConfigProvider` 的 `theme.token` 完成。你可以覆盖全局 token，也可以针对单个组件覆盖 `components.*` 级别的 token。

## 覆盖入口

```tsx
import React from 'react'
import { Checkbox, ConfigProvider, Drawer, Switch } from '@xinghunm/compass-ui'

export default () => (
  <ConfigProvider
    theme={{
      token: {
        colors: {
          primary: '#0f766e',
        },
        components: {
          checkbox: {
            checkedBg: '#0f766e',
            checkedBorderColor: '#0f766e',
          },
          switch: {
            checkedBg: '#0f766e',
            thumbBg: '#f8fafc',
          },
          drawer: {
            titleColor: '#0f172a',
            maskColor: 'rgba(15, 23, 42, 0.42)',
          },
        },
      },
    }}
  >
    <Checkbox defaultChecked>可配置主题</Checkbox>
    <Switch defaultChecked />
    <Drawer open title="自定义抽屉" onClose={() => undefined}>
      Drawer Content
    </Drawer>
  </ConfigProvider>
)
```

## 回退规则

组件样式读取 token 时遵循统一优先级：

1. `components.xxx.*`
2. 全局 token，如 `colors.*`、`spacing.*`、`borderRadius.*`
3. 组件内部默认值

这意味着：

- 你想统一品牌色，优先改全局 `colors.primary`
- 你想只调整某个组件，再覆盖对应的 `components.xxx.*`
- 没覆盖的字段会继续使用默认主题，不需要一次性写完整对象

## 新增组件支持的组件级 Token

下面这批新增组件现在都支持 `components.*` 级别的精细配置。

### Checkbox

- `components.checkbox.size.sm`
- `components.checkbox.size.md`
- `components.checkbox.size.lg`
- `components.checkbox.borderRadius`
- `components.checkbox.borderColor`
- `components.checkbox.checkedBorderColor`
- `components.checkbox.checkedBg`
- `components.checkbox.disabledBg`
- `components.checkbox.labelColor`
- `components.checkbox.iconColor`
- `components.checkbox.focusRingColor`

### Radio

- `components.radio.size.sm`
- `components.radio.size.md`
- `components.radio.size.lg`
- `components.radio.dotSize.sm`
- `components.radio.dotSize.md`
- `components.radio.dotSize.lg`
- `components.radio.borderColor`
- `components.radio.checkedBorderColor`
- `components.radio.dotColor`
- `components.radio.labelColor`
- `components.radio.focusRingColor`

### Switch

- `components.switch.trackWidth.sm`
- `components.switch.trackWidth.md`
- `components.switch.trackWidth.lg`
- `components.switch.trackHeight.sm`
- `components.switch.trackHeight.md`
- `components.switch.trackHeight.lg`
- `components.switch.thumbSize.sm`
- `components.switch.thumbSize.md`
- `components.switch.thumbSize.lg`
- `components.switch.thumbOffset.sm`
- `components.switch.thumbOffset.md`
- `components.switch.thumbOffset.lg`
- `components.switch.checkedBg`
- `components.switch.uncheckedBg`
- `components.switch.disabledBg`
- `components.switch.thumbBg`
- `components.switch.labelColor`
- `components.switch.focusRingColor`

### Alert

- `components.alert.padding`
- `components.alert.borderRadius`
- `components.alert.titleColor`
- `components.alert.descriptionColor`
- `components.alert.iconSize`
- `components.alert.closeColor`
- `components.alert.closeHoverColor`
- `components.alert.focusRingColor`
- `components.alert.info.backgroundColor`
- `components.alert.info.borderColor`
- `components.alert.info.accentColor`
- `components.alert.success.backgroundColor`
- `components.alert.success.borderColor`
- `components.alert.success.accentColor`
- `components.alert.warning.backgroundColor`
- `components.alert.warning.borderColor`
- `components.alert.warning.accentColor`
- `components.alert.error.backgroundColor`
- `components.alert.error.borderColor`
- `components.alert.error.accentColor`

### Empty

- `components.empty.gap.sm`
- `components.empty.gap.md`
- `components.empty.gap.lg`
- `components.empty.padding.sm`
- `components.empty.padding.md`
- `components.empty.padding.lg`
- `components.empty.imageWidth.sm`
- `components.empty.imageWidth.md`
- `components.empty.imageWidth.lg`
- `components.empty.imageHeight.sm`
- `components.empty.imageHeight.md`
- `components.empty.imageHeight.lg`
- `components.empty.imageRadius`
- `components.empty.imageBackground`
- `components.empty.imageBorderColor`
- `components.empty.imagePlaceholderColor`
- `components.empty.titleColor`
- `components.empty.descriptionColor`
- `components.empty.actionGap`

### Skeleton

- `components.skeleton.gap`
- `components.skeleton.rowGap`
- `components.skeleton.avatarSize`
- `components.skeleton.blockHeight`
- `components.skeleton.borderRadius`
- `components.skeleton.shimmerBaseColor`
- `components.skeleton.shimmerHighlightColor`

### SpinLoading

- `components.spinLoading.indicatorColor`
- `components.spinLoading.tipColor`
- `components.spinLoading.overlayBackground`
- `components.spinLoading.overlayBackdropBlur`
- `components.spinLoading.size.sm`
- `components.spinLoading.size.md`
- `components.spinLoading.size.lg`

### Popover

- `components.popover.zIndex`
- `components.popover.minWidth`
- `components.popover.maxWidth`
- `components.popover.borderRadius`
- `components.popover.backgroundColor`
- `components.popover.boxShadow`
- `components.popover.borderColor`
- `components.popover.headerPadding`
- `components.popover.bodyPadding`
- `components.popover.titleColor`
- `components.popover.titleFontSize`
- `components.popover.bodyColor`
- `components.popover.bodyFontSize`

### Popconfirm

- `components.popconfirm.minWidth`
- `components.popconfirm.titleColor`
- `components.popconfirm.titleFontSize`
- `components.popconfirm.descriptionColor`
- `components.popconfirm.descriptionFontSize`
- `components.popconfirm.descriptionMarginTop`
- `components.popconfirm.actionsGap`
- `components.popconfirm.actionsMarginTop`

### Drawer

- `components.drawer.zIndex`
- `components.drawer.maskColor`
- `components.drawer.backdropBlur`
- `components.drawer.contentBg`
- `components.drawer.boxShadow`
- `components.drawer.headerPadding`
- `components.drawer.bodyPadding`
- `components.drawer.footerPadding`
- `components.drawer.borderColor`
- `components.drawer.titleColor`
- `components.drawer.titleFontSize`

## 推荐做法

### 先改全局，再改组件

如果你的目标是“整站风格统一”，先改全局 token：

```tsx
<ConfigProvider
  theme={{
    token: {
      colors: {
        primary: '#0f766e',
        border: '#cbd5e1',
      },
      borderRadius: {
        md: 10,
      },
    },
  }}
/>
```

如果你的目标是“只改某个组件的观感”，再改对应组件 token：

```tsx
<ConfigProvider
  theme={{
    token: {
      components: {
        alert: {
          borderRadius: '12px',
          warning: {
            accentColor: '#d97706',
          },
        },
      },
    },
  }}
/>
```

### 尺寸类 token 尽量按级别覆盖

像 `checkbox.size.*`、`switch.trackWidth.*`、`empty.padding.*` 这类 token，建议一次覆盖完整的 `sm / md / lg`，避免不同尺寸之间比例失衡。

## 相关页面

- 想先跑通项目接入：看 [快速开始](/guide/getting-started)
- 想查看具体组件 API：看 [组件总览](/components)
- 想确认正式公开导入路径：看 [API 参考](/api)
