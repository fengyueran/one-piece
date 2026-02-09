---
title: InputNumber 数字输入框
nav:
  title: 组件
  order: 2
group:
  title: 数据录入
  order: 2
---

# InputNumber 数字输入框

通过鼠标或键盘，输入范围内的数值。

## 何时使用

- 当需要获取标准数值时。

## 代码演示

### 基础用法

数字输入框。

```tsx
import React, { useState } from 'react'
import { InputNumber } from '@xinghunm/compass-ui'

export default () => <InputNumber placeholder="Basic usage" />
```

### 控制按钮

通过 `controls` 属性显示或隐藏数字控制按钮。

```tsx
import React from 'react'
import { InputNumber } from '@xinghunm/compass-ui'

export default () => (
  <InputNumber controls={false} defaultValue={100} helperText="No increment/decrement buttons" />
)
```

### 两种状态

设置 `disabled` 和 `error` 状态。

```tsx
import React from 'react'
import { InputNumber } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 300 }}>
    <InputNumber disabled defaultValue={10} />
    <InputNumber error label="Error State" defaultValue={100} />
    <InputNumber error="Invalid value!" label="With Error Message" defaultValue={100} />
  </div>
)
```

### 自定义样式

三种大小的数字输入框。

```tsx
import React from 'react'
import { InputNumber } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 300 }}>
    <InputNumber size="small" placeholder="Small" />
    <InputNumber size="medium" placeholder="Medium" />
    <InputNumber size="large" placeholder="Large" />
  </div>
)
```

### 小数

和 `step` 属性配合使用。

```tsx
import React from 'react'
import { InputNumber } from '@xinghunm/compass-ui'

export default () => (
  <InputNumber
    step={0.5}
    defaultValue={1}
    helperText="Step: 0.5 - Click buttons or use arrow keys"
  />
)
```

### 精度

使用 `precision` 属性控制数值精度。

```tsx
import React, { useState } from 'react'
import { InputNumber } from '@xinghunm/compass-ui'

export default () => {
  const [value, setValue] = useState(5.5)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <InputNumber
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        step={0.1}
        precision={2}
        helperText="Precision: 2"
      />
      <div style={{ fontSize: '14px', color: '#666' }}>Current value: {value}</div>
    </div>
  )
}
```

### 带前缀和标签

带标签、辅助说明和前缀的输入框。

```tsx
import React from 'react'
import { InputNumber } from '@xinghunm/compass-ui'

export default () => (
  <InputNumber label="Price" helperText="Enter the price in USD" prefix="$" min={0} />
)
```

### 自定义主题

通过 `ConfigProvider` 覆盖主题变量。

```tsx
import React from 'react'
import { InputNumber, ConfigProvider } from '@xinghunm/compass-ui'

export default () => (
  <ConfigProvider
    theme={{
      global: false,
      token: {
        colors: { primary: '#e91e63' },
        components: {
          input: {
            borderRadius: '10px',
            activeBorderColor: '#e91e63',
            padding: {
              md: '12px',
            },
          },
        },
      },
    }}
  >
    <InputNumber defaultValue={123} label="Custom Theme" />
  </ConfigProvider>
)
```

### 自定义样式

通过 `classNames` 和 `styles` 属性可以精确控制组件内部元素的样式。

```tsx
import React from 'react'
import { InputNumber } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '300px' }}>
    <InputNumber
      defaultValue={100}
      prefix="$"
      classNames={{
        root: 'my-input-root',
        input: 'my-input-element',
        upHandler: 'my-up-btn',
        downHandler: 'my-down-btn',
      }}
      styles={{
        root: { border: '2px solid #1890ff', borderRadius: '4px' },
        input: { color: '#1890ff', fontWeight: 'bold' },
        upHandler: { backgroundColor: '#e6f7ff' },
        downHandler: { backgroundColor: '#fffbe6' },
      }}
    />
  </div>
)
```

## API

### InputNumber

| 参数         | 说明               | 类型                                                                    | 默认值     |
| ------------ | ------------------ | ----------------------------------------------------------------------- | ---------- |
| value        | 当前值（受控）     | `number \| null`                                                        | -          |
| defaultValue | 默认值             | `number \| null`                                                        | -          |
| min          | 最小值             | `number`                                                                | -          |
| max          | 最大值             | `number`                                                                | -          |
| step         | 步长               | `number`                                                                | `1`        |
| precision    | 数值精度           | `number`                                                                | -          |
| size         | 输入框大小         | `'small' \| 'medium' \| 'large'`                                        | `'medium'` |
| disabled     | 是否禁用           | `boolean`                                                               | `false`    |
| status       | 校验状态           | `'error' \| 'warning'`                                                  | -          |
| fullWidth    | 是否占满父容器宽度 | `boolean`                                                               | `false`    |
| controls     | 是否显示增减按钮   | `boolean`                                                               | `true`     |
| keyboard     | 是否支持键盘上下键 | `boolean`                                                               | `true`     |
| prefix       | 前缀               | `ReactNode`                                                             | -          |
| suffix       | 后缀               | `ReactNode`                                                             | -          |
| placeholder  | 输入框占位文本     | `string`                                                                | -          |
| onChange     | 值变化时的回调     | `(value: number \| null) => void`                                       | -          |
| onPressEnter | 按下回车键时的回调 | `(e: KeyboardEvent) => void`                                            | -          |
| classNames   | 语义化类名         | `{ root, input, inputWrapper, prefix, suffix, upHandler, downHandler }` | -          |
| styles       | 语义化样式         | `{ root, input, inputWrapper, prefix, suffix, upHandler, downHandler }` | -          |

<details>
<summary>组件 Token (components.input)</summary>

| 变量名                               | 说明             |
| ------------------------------------ | ---------------- |
| `components.input.activeBorderColor` | 激活状态边框颜色 |
| `components.input.hoverBorderColor`  | 悬停状态边框颜色 |
| `components.input.borderRadius`      | 边框圆角         |
| `components.input.padding.sm`        | 小尺寸内边距     |
| `components.input.padding.md`        | 中尺寸内边距     |
| `components.input.padding.lg`        | 大尺寸内边距     |
| `components.input.fontSize.sm`       | 小尺寸字体大小   |
| `components.input.fontSize.md`       | 中尺寸字体大小   |
| `components.input.fontSize.lg`       | 大尺寸字体大小   |

</details>

<details>
<summary>全局 Token</summary>

| 变量名                       | 说明         |
| ---------------------------- | ------------ |
| `colors.primary`             | 主色调       |
| `colors.text`                | 文本颜色     |
| `colors.textSecondary`       | 次级文本颜色 |
| `colors.textTertiary`        | 三级文本颜色 |
| `colors.textDisabled`        | 禁用文本颜色 |
| `colors.border`              | 边框颜色     |
| `colors.background`          | 背景颜色     |
| `colors.backgroundSecondary` | 次级背景颜色 |
| `colors.backgroundTertiary`  | 三级背景颜色 |
| `colors.error`               | 错误状态颜色 |
| `colors.warning`             | 警告状态颜色 |

</details>
