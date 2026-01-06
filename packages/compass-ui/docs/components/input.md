---
title: Input 输入框
nav:
  title: 组件
  order: 2
group:
  title: 数据录入
  order: 2
---

# Input 输入框

通过鼠标或键盘输入内容,是最基础的表单域的包装。

## 何时使用

- 需要用户输入表单域内容时
- 提供组合型输入框,带搜索的输入框,还可以进行大小选择

## 代码演示

### 基础用法

基本使用。

```tsx
import React from 'react'
import { InputField } from '@xinghunm/compass-ui'

export default () => {
  return <InputField placeholder="请输入内容" />
}
```

### 禁用状态

通过 `disabled` 属性禁用输入框。

```tsx
import React from 'react'
import { InputField } from '@xinghunm/compass-ui'

export default () => {
  return <InputField placeholder="禁用状态" disabled />
}
```

### 不同尺寸

提供三种尺寸的输入框。

```tsx
import React from 'react'
import { InputField } from '@xinghunm/compass-ui'

export default () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <InputField size="large" placeholder="Large" />
      <InputField size="medium" placeholder="Medium" />
      <InputField size="small" placeholder="Small" />
    </div>
  )
}
```

### 带清除按钮

可以点击清除图标删除内容。

```tsx
import React, { useState } from 'react'
import { InputField } from '@xinghunm/compass-ui'

export default () => {
  const [value, setValue] = useState('可清除的内容')

  return (
    <InputField
      value={value}
      onChange={(e) => setValue(e.target.value)}
      allowClear
      placeholder="可清除"
    />
  )
}
```

### 密码输入框

密码输入框。

```tsx
import React from 'react'
import { InputField } from '@xinghunm/compass-ui'

export default () => {
  return <InputField type="password" placeholder="请输入密码" />
}
```

### 带标签

可以添加前缀和后缀。

```tsx
import React from 'react'
import { InputField } from '@xinghunm/compass-ui'

export default () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <InputField prefix="¥" placeholder="请输入金额" />
      <InputField suffix=".com" placeholder="请输入域名" />
      <InputField prefix="https://" suffix=".com" placeholder="请输入网址" />
    </div>
  )
}
```

### 事件示例

演示 `onChange` 和 `onPressEnter` 事件。

```tsx
import React, { useState } from 'react'
import { InputField } from '@xinghunm/compass-ui'

export default () => {
  const [value, setValue] = useState('')

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    console.log('Change:', e.target.value)
  }

  const onPressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('PressEnter:', e.currentTarget.value)
    alert(`Pressed Enter with value: ${e.currentTarget.value}`)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <InputField
        placeholder="Try typing and pressing Enter"
        onChange={onChange}
        onPressEnter={onPressEnter}
        value={value}
      />
      <div>Current Value: {value}</div>
    </div>
  )
}
```

### 自定义主题

通过 `ConfigProvider` 自定义输入框主题。

```tsx
import React from 'react'
import { InputField, ConfigProvider } from '@xinghunm/compass-ui'

export default () => (
  <ConfigProvider
    theme={{
      token: {
        components: {
          input: {
            activeBorderColor: '#722ed1',
            hoverBorderColor: '#b37feb',
            borderRadius: '20px',
            padding: { md: '6px 20px' },
          },
        },
      },
    }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '300px' }}>
      <InputField placeholder="Custom Theme Input" />
      <InputField defaultValue="Focused Style" autoFocus />
    </div>
  </ConfigProvider>
)
```

## API

### InputField

| 参数         | 说明                     | 类型                               | 默认值     |
| ------------ | ------------------------ | ---------------------------------- | ---------- |
| value        | 输入框内容               | `string`                           | -          |
| defaultValue | 输入框默认内容           | `string`                           | -          |
| placeholder  | 占位文本                 | `string`                           | -          |
| size         | 输入框大小               | `'small' \| 'medium' \| 'large'`   | `'medium'` |
| disabled     | 是否禁用                 | `boolean`                          | `false`    |
| fullWidth    | 是否占满父容器宽度       | `boolean`                          | `false`    |
| allowClear   | 可以点击清除图标删除内容 | `boolean`                          | `false`    |
| prefix       | 带有前缀图标的 input     | `ReactNode`                        | -          |
| suffix       | 带有后缀图标的 input     | `ReactNode`                        | -          |
| type         | 声明 input 类型          | `'text' \| 'password' \| 'search'` | `'text'`   |
| onChange     | 输入框内容变化时的回调   | `(e: ChangeEvent) => void`         | -          |
| onPressEnter | 按下回车的回调           | `(e: KeyboardEvent) => void`       | -          |
| className    | 自定义类名               | `string`                           | -          |
| style        | 自定义样式               | `React.CSSProperties`              | -          |

## 主题变量 (Design Token)

<details>
<summary>组件 Token (components.input)</summary>

| 变量名              | 默认值     | 说明             |
| ------------------- | ---------- | ---------------- |
| `activeBorderColor` | `#40a9ff`  | 激活状态边框颜色 |
| `hoverBorderColor`  | `#4096ff`  | 悬停状态边框颜色 |
| `borderRadius`      | `4px`      | 边框圆角         |
| `padding.sm`        | `4px 8px`  | 小尺寸内边距     |
| `padding.md`        | `6px 12px` | 中尺寸内边距     |
| `padding.lg`        | `8px 16px` | 大尺寸内边距     |
| `fontSize.sm`       | `12px`     | 小尺寸字体大小   |
| `fontSize.md`       | `14px`     | 中尺寸字体大小   |
| `fontSize.lg`       | `16px`     | 大尺寸字体大小   |

</details>

<details>
<summary>全局 Token</summary>

| 变量名                 | 说明         |
| ---------------------- | ------------ |
| `colors.text`          | 文本颜色     |
| `colors.textSecondary` | 次级文本颜色 |
| `colors.textDisabled`  | 禁用文本颜色 |
| `colors.border`        | 边框颜色     |
| `colors.background`    | 背景颜色     |

</details>
