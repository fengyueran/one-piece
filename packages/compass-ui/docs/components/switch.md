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

## 键盘与可访问性

- 根交互元素使用 `role="switch"`，读屏器会按开关语义朗读
- `aria-checked` 会随着当前状态同步更新
- 错误态会输出 `aria-invalid="true"`

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `checked` | 受控开关状态 | `boolean` | - |
| `defaultChecked` | 非受控初始开关状态 | `boolean` | `false` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `checkedChildren` | 选中时轨道内部内容 | `ReactNode` | - |
| `uncheckedChildren` | 未选中时轨道内部内容 | `ReactNode` | - |
| `size` | 组件尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| `status` | 校验状态 | `'error' \| 'warning'` | - |
| `onCheckedChange` | 开关状态变化回调 | `(checked, event) => void` | - |
| `onChange` | 原生变化回调 | `(event: ChangeEvent<HTMLInputElement>) => void` | - |
| `classNames` | 语义化类名覆写 | `SwitchProps['classNames']` | - |
| `styles` | 语义化样式覆写 | `SwitchProps['styles']` | - |
