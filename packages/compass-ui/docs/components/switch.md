---
title: Switch 开关
nav:
  title: 组件
  order: 2
group:
  title: 数据录入
  order: 2
---

# Switch 开关

开关用于即时切换某个功能或状态，强调“立即生效”的语义。

## 何时使用

- 需要让用户即时开启或关闭某项能力
- 不适合使用“提交后统一生效”的传统复选框语义
- 需要在设置页、偏好页里快速切换状态

## 代码演示

### 基础用法

```tsx
import React from 'react'
import { Switch } from '@xinghunm/compass-ui'

export default () => <Switch defaultChecked aria-label="消息通知" />
```

### 带文案的受控开关

```tsx
import React, { useState } from 'react'
import { Switch } from '@xinghunm/compass-ui'

export default () => {
  const [checked, setChecked] = useState(true)

  return (
    <Switch
      checked={checked}
      checkedChildren="开"
      uncheckedChildren="关"
      onCheckedChange={setChecked}
      aria-label="自动保存"
    >
      自动保存
    </Switch>
  )
}
```

### 禁用与错误状态

```tsx
import React from 'react'
import { Switch } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <Switch defaultChecked disabled aria-label="禁用开关">
      禁用状态
    </Switch>
    <Switch status="error" aria-label="错误开关">
      校验失败
    </Switch>
  </div>
)
```

### 自定义主题

```tsx
import React from 'react'
import { ConfigProvider, Switch } from '@xinghunm/compass-ui'

export default () => (
  <ConfigProvider
    theme={{
      token: {
        components: {
          switch: {
            checkedBg: '#0f766e',
            thumbBg: '#f8fafc',
            focusRingColor: '#0f766e',
          },
        },
      },
    }}
  >
    <Switch defaultChecked aria-label="自动发布">
      自动发布
    </Switch>
  </ConfigProvider>
)
```

更多可配置字段见 [主题 Token](/guide/theme-tokens)。

## 键盘与可访问性

- 根交互元素使用 `role="switch"`，读屏器会按开关语义朗读
- `aria-checked` 会随着当前状态同步更新
- 错误态会输出 `aria-invalid="true"`

## API

通用属性参考：[通用属性](/guide/common-props)

| 属性                | 说明                 | 类型                                             | 默认值     |
| ------------------- | -------------------- | ------------------------------------------------ | ---------- |
| `checked`           | 受控开关状态         | `boolean`                                        | -          |
| `defaultChecked`    | 非受控初始开关状态   | `boolean`                                        | `false`    |
| `disabled`          | 是否禁用             | `boolean`                                        | `false`    |
| `checkedChildren`   | 选中时轨道内部内容   | `ReactNode`                                      | -          |
| `uncheckedChildren` | 未选中时轨道内部内容 | `ReactNode`                                      | -          |
| `size`              | 组件尺寸             | `'small' \| 'medium' \| 'large'`                 | `'medium'` |
| `status`            | 校验状态             | `'error' \| 'warning'`                           | -          |
| `onCheckedChange`   | 开关状态变化回调     | `(checked, event) => void`                       | -          |
| `onChange`          | 原生变化回调         | `(event: ChangeEvent<HTMLInputElement>) => void` | -          |
| `classNames`        | 语义化类名覆写       | `SwitchProps['classNames']`                      | -          |
| `styles`            | 语义化样式覆写       | `SwitchProps['styles']`                          | -          |

## 主题变量 (Design Token)

| Token Name                         | Description      | Default               |
| ---------------------------------- | ---------------- | --------------------- |
| `components.switch.trackWidth.sm`  | 小尺寸轨道宽度   | `28px`                |
| `components.switch.trackWidth.md`  | 中尺寸轨道宽度   | `36px`                |
| `components.switch.trackWidth.lg`  | 大尺寸轨道宽度   | `44px`                |
| `components.switch.trackHeight.sm` | 小尺寸轨道高度   | `16px`                |
| `components.switch.trackHeight.md` | 中尺寸轨道高度   | `20px`                |
| `components.switch.trackHeight.lg` | 大尺寸轨道高度   | `24px`                |
| `components.switch.thumbSize.sm`   | 小尺寸滑块直径   | `12px`                |
| `components.switch.thumbSize.md`   | 中尺寸滑块直径   | `16px`                |
| `components.switch.thumbSize.lg`   | 大尺寸滑块直径   | `20px`                |
| `components.switch.thumbOffset.sm` | 小尺寸滑块位移   | `12px`                |
| `components.switch.thumbOffset.md` | 中尺寸滑块位移   | `16px`                |
| `components.switch.thumbOffset.lg` | 大尺寸滑块位移   | `20px`                |
| `components.switch.checkedBg`      | 选中轨道背景色   | `#1890ff`             |
| `components.switch.uncheckedBg`    | 未选中轨道背景色 | `rgba(0, 0, 0, 0.25)` |
| `components.switch.disabledBg`     | 禁用轨道背景色   | `rgba(0, 0, 0, 0.25)` |
| `components.switch.thumbBg`        | 滑块背景色       | `#ffffff`             |
| `components.switch.labelColor`     | 标签文字颜色     | `rgba(0, 0, 0, 0.88)` |
| `components.switch.focusRingColor` | 焦点高亮颜色     | `#1890ff`             |

Switch 还会跟随全局 `colors.primary`、`colors.warning`、`colors.error`、`colors.text`、`colors.textDisabled`、`colors.white`、`spacing.sm`、`fontSize.*`、`lineHeight.normal` 与 `shadows.sm` 等 token 变化，但组件级覆盖优先使用 `components.switch.*`。
