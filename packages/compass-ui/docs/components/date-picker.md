---
title: DatePicker 日期选择器
nav:
  title: 组件
  order: 2
group:
  title: 数据录入
  order: 2
---

# DatePicker 日期选择器

日期选择框。

## 何时使用

当用户需要输入一个日期，可以点击标准输入框，弹出日期面板进行选择。

## 代码演示

### 基础用法

最简单的用法，在浮层中选择或者输入日期。

```tsx
import React, { useState } from 'react'
import { DatePicker } from '@xinghunm/compass-ui'

export default () => {
  const [date, setDate] = useState(null)
  return <DatePicker value={date} onChange={setDate} placeholder="Select date" />
}
```

### 默认值

非受控模式下，使用 `defaultValue` 设置默认选中的日期。

```tsx
import React from 'react'
import { DatePicker } from '@xinghunm/compass-ui'

export default () => <DatePicker defaultValue={new Date('2024-01-01')} />
```

### 日期格式

使用 `format` 属性自定义日期的展示格式。

```tsx
import React, { useState } from 'react'
import { DatePicker } from '@xinghunm/compass-ui'

export default () => {
  const [date, setDate] = useState(new Date())
  return <DatePicker value={date} onChange={setDate} format="yyyy/MM/dd" />
}
```

### 增加时间选择功能

增加时间选择功能。

```tsx
import React, { useState } from 'react'
import { DatePicker } from '@xinghunm/compass-ui'

export default () => {
  const [date, setDate] = useState(null)
  return <DatePicker value={date} onChange={setDate} showTime />
}
```

### 选择器类型

支持年份、月份、季度、周选择器。

```tsx
import React, { useState } from 'react'
import { DatePicker } from '@xinghunm/compass-ui'

export default () => {
  const [date, setDate] = useState(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <DatePicker value={date} onChange={setDate} picker="year" placeholder="Select year" />
      <DatePicker value={date} onChange={setDate} picker="month" placeholder="Select month" />
      <DatePicker value={date} onChange={setDate} picker="quarter" placeholder="Select quarter" />
      <DatePicker value={date} onChange={setDate} picker="week" placeholder="Select week" />
    </div>
  )
}
```

### 带清除按钮

通过设置 `clearable` 属性显示清除按钮。

```tsx
import React, { useState } from 'react'
import { DatePicker } from '@xinghunm/compass-ui'

export default () => {
  const [date, setDate] = useState(new Date('2025-12-10'))
  return <DatePicker value={date} onChange={setDate} clearable placeholder="Hover to clear" />
}
```

### 禁用状态

禁用选择器。

```tsx
import React, { useState } from 'react'
import { DatePicker } from '@xinghunm/compass-ui'

export default () => {
  const [date, setDate] = useState(new Date())
  return <DatePicker value={date} onChange={setDate} disabled />
}
```

### 校验状态

通过 `status` 属性设置校验状态。

```tsx
import React from 'react'
import { DatePicker } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <DatePicker status="error" placeholder="Error status" />
    <DatePicker status="warning" placeholder="Warning status" />
    <DatePicker.RangePicker status="error" />
    <DatePicker.RangePicker status="warning" />
  </div>
)
```

### 范围选择器

通过 `DatePicker.RangePicker` 实现日期范围选择。

```tsx
import React, { useState } from 'react'
import { DatePicker } from '@xinghunm/compass-ui'

export default () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <DatePicker.RangePicker />
      <DatePicker.RangePicker showTime clearable />
    </div>
  )
}
```

### 全宽

设置 `fullWidth` 属性使选择器撑满父容器宽度。

```tsx
import React, { useState } from 'react'
import { DatePicker } from '@xinghunm/compass-ui'

export default () => {
  const [date, setDate] = useState(null)
  const [rangeDates, setRangeDates] = useState([null, null])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      <div style={{ width: '400px' }}>
        <h4 style={{ marginBottom: 8 }}>Full Width DatePicker</h4>
        <DatePicker value={date} onChange={setDate} fullWidth placeholder="Full Width DatePicker" />
      </div>
      <div>
        <h4 style={{ marginBottom: 8 }}>Full Width RangePicker</h4>
        <DatePicker.RangePicker
          value={rangeDates}
          onChange={setRangeDates}
          fullWidth
          placeholder={['Start Date', 'End Date']}
        />
      </div>
    </div>
  )
}
```

### 国际化

通过 `ConfigProvider` 切换语言包。

```tsx
import React, { useState } from 'react'
import { DatePicker, ConfigProvider } from '@xinghunm/compass-ui'
import enUS from '@xinghunm/compass-ui/dist/locale/en_US'

export default () => {
  const [date, setDate] = useState(null)
  const [rangeDates, setRangeDates] = useState([null, null])

  return (
    <ConfigProvider locale={enUS}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h4 style={{ marginBottom: 8 }}>Basic DatePicker</h4>
          <DatePicker value={date} onChange={setDate} />
        </div>
        <div>
          <h4 style={{ marginBottom: 8 }}>With Time</h4>
          <DatePicker value={date} onChange={setDate} showTime />
        </div>
        <div>
          <h4 style={{ marginBottom: 8 }}>Range Picker</h4>
          <DatePicker.RangePicker value={rangeDates} onChange={setRangeDates} />
        </div>
      </div>
    </ConfigProvider>
  )
}
```

### 自定义样式

可以通过 `styles` 和 `classNames` 属性对组件内部的各个部分进行精细化控制。支持的 key 包括：`root`, `input`, `popup`, `header`, `body`, `day`, `footer`。

```tsx
import React, { useState } from 'react'
import { DatePicker } from '@xinghunm/compass-ui'

export default () => {
  const [date, setDate] = useState(null)
  return (
    <DatePicker
      value={date}
      onChange={setDate}
      classNames={{
        popup: 'my-custom-popup',
        day: 'my-custom-day',
      }}
      styles={{
        header: { background: '#f6f6f6' },
        day: { fontWeight: 'bold' },
      }}
    />
  )
}
```

### 自定义主题

通过 `ConfigProvider` 覆盖主题变量。

```tsx
import React, { useState } from 'react'
import { DatePicker, ConfigProvider } from '@xinghunm/compass-ui'

export default () => {
  const [date, setDate] = useState(new Date())
  return (
    <ConfigProvider
      theme={{
        global: false,
        token: {
          components: {
            datePicker: {
              cellActiveBg: '#722ed1',
              cellHoverBg: '#b37feb',
              borderColor: '#722ed1',
              headerFontSize: '16px',
            },
            input: {
              activeBorderColor: '#722ed1',
              hoverBorderColor: '#b37feb',
            },
          },
        },
      }}
    >
      <DatePicker value={date} onChange={setDate} clearable placeholder="Purple Theme" />
    </ConfigProvider>
  )
}
```

## API

通用属性参考：[通用属性](/guide/common-props)

### DatePicker

| 参数         | 说明                 | 类型                                                 | 默认值          |
| ------------ | -------------------- | ---------------------------------------------------- | --------------- |
| picker       | 设置选择器类型       | `'date' \| 'week' \| 'month' \| 'quarter' \| 'year'` | `'date'`        |
| value        | 当前日期             | `Date`                                               | -               |
| defaultValue | 默认日期             | `Date`                                               | -               |
| onChange     | 日期改变时的回调     | `(date: Date \| null) => void`                       | -               |
| format       | 展示的日期格式       | `string`                                             | `'yyyy-MM-dd'`  |
| showTime     | 是否增加时间选择功能 | `boolean`                                            | `false`         |
| disabled     | 禁用                 | `boolean`                                            | `false`         |
| clearable    | 是否显示清除按钮     | `boolean`                                            | `false`         |
| placeholder  | 输入框提示文字       | `string`                                             | `'Select date'` |
| fullWidth    | 是否撑满父容器宽度   | `boolean`                                            | `false`         |
| styles       | 内部组件样式         | `DatePickerStyles`                                   | -               |
| classNames   | 内部组件类名         | `DatePickerClassNames`                               | -               |

### DatePicker.RangePicker

支持 `DatePicker` 的其他通用属性，如 `disabled`, `format`, `showTime`, `fullWidth` 等。

| 参数         | 说明                 | 类型                                            | 默认值                     |
| ------------ | -------------------- | ----------------------------------------------- | -------------------------- |
| value        | 当前选中的日期范围   | `[Date \| null, Date \| null]`                  | -                          |
| defaultValue | 默认选中的日期范围   | `[Date \| null, Date \| null]`                  | -                          |
| onChange     | 日期范围改变时的回调 | `(dates: [Date \| null, Date \| null]) => void` | -                          |
| placeholder  | 输入框提示文字       | `[string, string]`                              | `['开始日期', '结束日期']` |

## 主题变量 (Design Token)

<details>
<summary>组件 Token (components.datePicker)</summary>

| 变量名                                    | 说明            |
| ----------------------------------------- | --------------- |
| `components.datePicker.borderColor`       | 边框颜色        |
| `components.datePicker.boxShadow`         | 阴影            |
| `components.datePicker.headerPadding`     | 头部内边距      |
| `components.datePicker.headerFontSize`    | 头部字体大小    |
| `components.datePicker.weekDayFontSize`   | 星期字体大小    |
| `components.datePicker.cellWidth`         | 单元格宽度      |
| `components.datePicker.cellHeight`        | 单元格高度      |
| `components.datePicker.cellMargin`        | 单元格边距      |
| `components.datePicker.cellFontSize`      | 单元格字体大小  |
| `components.datePicker.cellColor`         | 单元格文字颜色  |
| `components.datePicker.cellActiveColor`   | 选中/悬停文字色 |
| `components.datePicker.cellActiveBg`      | 选中背景色      |
| `components.datePicker.cellHoverBg`       | 悬停背景色      |
| `components.datePicker.cellDisabledColor` | 禁用文字颜色    |
| `components.datePicker.cellBorderRadius`  | 单元格圆角      |

</details>

<details>
<summary>全局 Token</summary>

| 变量名                       | 说明         |
| ---------------------------- | ------------ |
| `colors.primary`             | 主色调       |
| `colors.background`          | 背景色       |
| `colors.backgroundSecondary` | 次级背景色   |
| `colors.text`                | 文本颜色     |
| `colors.textSecondary`       | 次级文本颜色 |
| `colors.textDisabled`        | 禁用文本颜色 |
| `colors.border`              | 边框颜色     |
| `colors.error`               | 错误色       |
| `borderRadius.lg`            | 大圆角       |
| `shadows.lg`                 | 大阴影       |

</details>
