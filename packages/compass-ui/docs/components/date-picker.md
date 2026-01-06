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
| className    | 自定义类名           | `string`                                             | -               |
| style        | 自定义样式           | `CSSProperties`                                      | -               |

### DatePicker.RangePicker

| 参数         | 说明                 | 类型                                            | 默认值                     |
| ------------ | -------------------- | ----------------------------------------------- | -------------------------- |
| value        | 当前选中的日期范围   | `[Date \| null, Date \| null]`                  | -                          |
| defaultValue | 默认选中的日期范围   | `[Date \| null, Date \| null]`                  | -                          |
| onChange     | 日期范围改变时的回调 | `(dates: [Date \| null, Date \| null]) => void` | -                          |
| placeholder  | 输入框提示文字       | `[string, string]`                              | `['开始日期', '结束日期']` |

## 主题变量 (Design Token)

| Token Name                             | Description    | Default             |
| -------------------------------------- | -------------- | ------------------- |
| `components.datePicker.cellWidth`      | 单元格宽度     | 32px                |
| `components.datePicker.cellHeight`     | 单元格高度     | 32px                |
| `components.datePicker.cellFontSize`   | 单元格字体大小 | 14px                |
| `components.datePicker.cellActiveBg`   | 选中日期背景色 | #1890ff             |
| `components.datePicker.cellHoverBg`    | 悬停日期背景色 | #40a9ff             |
| `components.datePicker.cellColor`      | 日期文字颜色   | rgba(0, 0, 0, 0.88) |
| `components.datePicker.borderColor`    | 边框颜色       | rgba(0, 0, 0, 0.06) |
| `components.datePicker.headerPadding`  | 头部内边距     | 12px 16px           |
| `components.datePicker.headerFontSize` | 头部字体大小   | 14px                |
