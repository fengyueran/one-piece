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
import { enUS } from '@xinghunm/compass-ui/locale'

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

### 配合 styled-components 使用

利用 `styled` 可以非常方便地封装带有一致样式的组件。因为 DatePicker 的弹层是渲染在 Portal（根节点之外）中，为了让样式覆盖到弹层，可以通过高阶组件透传 `popupClassName`（或在 `classNames` 中传入）：

```tsx
/**
 * title: 配合 styled-components / emotion
 * description: 针对 Portal 渲染的组件，将 className 转发给下拉浮层即可优雅地封装样式。
 */
import React, { useState } from 'react'
import styled from '@emotion/styled'
import { DatePicker } from '@xinghunm/compass-ui'
import type { DatePickerProps } from '@xinghunm/compass-ui'

// 1. 制作一个透明转发的 Wrapper，将 className 透传给浮层
const DatePickerWrapper = ({ className, ...props }: DatePickerProps) => (
  <DatePicker
    className={className}
    classNames={{ popup: className }} // 关键点：让弹层也带上哈希类名
    {...props}
  />
)

// 2. 利用内部静态类名进行样式覆盖
const StyledDatePicker = styled(DatePickerWrapper)`
  /* 1. 针对触发器(输入框)的样式 */
  &.compass-date-picker {
    width: 240px;

    .compass-input-field-wrapper {
      border-radius: 8px;
      border-color: #eb2f96;
    }
  }

  /* 2. 针对弹出面板的样式 */
  &.compass-date-picker-popup {
    border-radius: 12px;
    padding: 8px;
    box-shadow: 0 4px 20px rgba(235, 47, 150, 0.2);

    .compass-date-picker-cell-inner {
      border-radius: 6px;
    }

    .compass-date-picker-cell-selected .compass-date-picker-cell-inner {
      background: #eb2f96;
    }
  }
`

export default () => {
  const [date, setDate] = useState<Date | null>(null)
  return <StyledDatePicker value={date} onChange={setDate} placeholder="Styled DatePicker" />
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

## 键盘与可访问性

- 输入框支持通过 `Tab` 聚焦，可直接透传 `aria-label` 给底层文本框。
- 日期输入框和范围输入框会同步暴露 `aria-expanded` 与 `aria-controls`，用于表达当前弹层状态。
- 展开后的日期面板支持通过 `Escape` 关闭；外部点击也会关闭当前面板。
- `disabled` 状态下输入框保持不可交互。
- `RangePicker` 的两个输入框共享同一个日期浮层，因此展开时两侧输入框都会反映相同的展开状态。
- `clearable` 启用且存在值时，可通过清除控件快速回到空值状态。

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

### classNames / styles 插槽

`classNames` 与 `styles` 使用相同的 slot key。

| 插槽名   | 说明       |
| -------- | ---------- |
| `root`   | 根容器     |
| `input`  | 输入区域   |
| `popup`  | 弹层容器   |
| `header` | 头部区域   |
| `body`   | 主体区域   |
| `footer` | 底部区域   |
| `day`    | 日期单元格 |

## 主题变量 (Design Token)

常用调整通常集中在输入边框、弹层阴影和日期单元格状态颜色上，下面先列出最常改的一组 token。

| Token Name                                | Description     | Default                                                                                                    |
| ----------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------- |
| `components.datePicker.borderColor`       | 边框颜色        | `rgba(0, 0, 0, 0.06)`                                                                                      |
| `components.datePicker.boxShadow`         | 阴影            | `0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)` |
| `components.datePicker.cellColor`         | 单元格文字颜色  | `rgba(0, 0, 0, 0.88)`                                                                                      |
| `components.datePicker.cellActiveColor`   | 选中/悬停文字色 | `#ffffff`                                                                                                  |
| `components.datePicker.cellActiveBg`      | 选中背景色      | `#1890ff`                                                                                                  |
| `components.datePicker.cellHoverBg`       | 悬停背景色      | `#40a9ff`                                                                                                  |
| `components.datePicker.cellDisabledColor` | 禁用文字颜色    | `rgba(0, 0, 0, 0.25)`                                                                                      |
| `components.datePicker.zIndex`            | 弹层层级        | `1000`                                                                                                     |

<details>
<summary>查看完整 token 列表</summary>

| Token Name                                | Description     | Default                                                                                                    |
| ----------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------- |
| `components.datePicker.borderColor`       | 边框颜色        | `rgba(0, 0, 0, 0.06)`                                                                                      |
| `components.datePicker.boxShadow`         | 阴影            | `0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)` |
| `components.datePicker.headerPadding`     | 头部内边距      | `12px 16px`                                                                                                |
| `components.datePicker.headerHeight`      | 头部高度        | `40px`                                                                                                     |
| `components.datePicker.headerFontSize`    | 头部字体大小    | `14px`                                                                                                     |
| `components.datePicker.weekDayFontSize`   | 星期字体大小    | `12px`                                                                                                     |
| `components.datePicker.cellWidth`         | 单元格宽度      | `32px`                                                                                                     |
| `components.datePicker.cellHeight`        | 单元格高度      | `32px`                                                                                                     |
| `components.datePicker.cellPadding`       | 单元格内边距    | `0`                                                                                                        |
| `components.datePicker.cellMargin`        | 单元格边距      | `2px`                                                                                                      |
| `components.datePicker.cellFontSize`      | 单元格字体大小  | `14px`                                                                                                     |
| `components.datePicker.cellColor`         | 单元格文字颜色  | `rgba(0, 0, 0, 0.88)`                                                                                      |
| `components.datePicker.cellActiveColor`   | 选中/悬停文字色 | `#ffffff`                                                                                                  |
| `components.datePicker.cellActiveBg`      | 选中背景色      | `#1890ff`                                                                                                  |
| `components.datePicker.cellHoverBg`       | 悬停背景色      | `#40a9ff`                                                                                                  |
| `components.datePicker.cellDisabledColor` | 禁用文字颜色    | `rgba(0, 0, 0, 0.25)`                                                                                      |
| `components.datePicker.cellBorderRadius`  | 单元格圆角      | `4px`                                                                                                      |
| `components.datePicker.zIndex`            | 弹层层级        | `1000`                                                                                                     |

</details>

DatePicker 还会跟随全局 `colors.primary`、`colors.background`、`colors.backgroundSecondary`、`colors.text`、`colors.textSecondary`、`colors.textDisabled`、`colors.border`、`colors.error`、`borderRadius.lg` 等 token 变化。
DatePicker 的阴影默认值也会继承全局 `shadows.lg` 的视觉层级习惯。
