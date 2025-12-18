import type { Meta, StoryObj } from '@storybook/react'
import { useState, useEffect } from 'react'
import DatePicker from './index'
import ConfigProvider from '../config-provider'

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
日期选择框。

## 何时使用

当用户需要输入一个日期，可以点击标准输入框，弹出日期面板进行选择。

## 主题变量 (Design Token)

<details>
<summary>组件 Token</summary>

| Token Name | Description | Default |
| --- | --- | --- |
| \`components.datePicker.cellWidth\` | 单元格宽度 | 32px |
| \`components.datePicker.cellHeight\` | 单元格高度 | 32px |
| \`components.datePicker.cellFontSize\` | 单元格字体大小 | 14px |
| \`components.datePicker.cellActiveBg\` | 选中日期背景色 | #1890ff |
| \`components.datePicker.cellHoverBg\` | 悬停日期背景色 | #40a9ff |
| \`components.datePicker.cellColor\` | 日期文字颜色 | rgba(0, 0, 0, 0.88) |
| \`components.datePicker.cellActiveColor\` | 选中日期文字颜色 | #ffffff |
| \`components.datePicker.borderColor\` | 边框颜色 | rgba(0, 0, 0, 0.06) |
| \`components.datePicker.boxShadow\` | 阴影 | ... |
| \`components.datePicker.headerPadding\` | 头部内边距 | 12px 16px |
| \`components.datePicker.headerFontSize\` | 头部字体大小 | 14px |

</details>

<details>
<summary>全局 Token</summary>

| Token Name | Description |
| --- | --- |
| \`colors.primary\` | 主色调 |
| \`colors.background\` | 背景色 |
| \`colors.text\` | 文本颜色 |
| \`colors.textSecondary\` | 次级文本颜色 |

</details>
        `,
      },
    },
  },
  argTypes: {
    picker: {
      control: 'select',
      options: ['date', 'week', 'month', 'quarter', 'year'],
      description: '设置选择器类型',
      table: {
        type: { summary: "'date' | 'week' | 'month' | 'quarter' | 'year'" },
        defaultValue: { summary: "'date'" },
      },
    },
    showTime: {
      control: 'boolean',
      description: '是否增加时间选择功能',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: '禁用',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    clearable: {
      control: 'boolean',
      description: '是否显示清除按钮',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    placeholder: {
      control: 'text',
      description: '输入框提示文字',
      table: {
        defaultValue: { summary: "'Select date'" },
      },
    },
    format: {
      control: 'text',
      description:
        '展示的日期格式，配置参考 <a href="https://date-fns.org/v2.30.0/docs/format" target="_blank" rel="noopener noreferrer">date-fns</a>',
      table: {
        defaultValue: { summary: "'yyyy-MM-dd'" },
      },
    },
    defaultValue: {
      control: 'date',
      description: '默认日期 (JS Date) (仅在组件挂载时生效)',
    },
    value: {
      control: 'date',
      description: '当前日期 (JS Date)',
    },
    onChange: {
      description: '日期改变时的回调',
    },
    className: {
      control: 'text',
      description: '自定义类名',
    },
    style: {
      control: 'object',
      description: '自定义样式',
    },
    fullWidth: {
      control: 'boolean',
      description: '是否撑满父容器宽度',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof DatePicker>

export const Basic: Story = {
  render: (args) => {
    // Storybook controls return timestamps (number) for date inputs
    // We need to convert them to Date objects for the component
    const toDate = (val: any) => {
      if (typeof val === 'number') return new Date(val)
      return val
    }

    const [date, setDate] = useState<Date | null>(
      toDate(args.value) || toDate(args.defaultValue) || null,
    )

    useEffect(() => {
      if (args.value !== undefined) {
        setDate(toDate(args.value))
      }
    }, [args.value])

    return (
      <DatePicker
        {...args}
        value={date || undefined}
        onChange={(newDate) => {
          setDate(newDate)
          args.onChange?.(newDate)
        }}
      />
    )
  },
  args: {
    placeholder: 'Select date',
  },
}

export const UncontrolledDefaultValue: Story = {
  render: (args) => {
    return <DatePicker {...args} />
  },
  args: {
    defaultValue: new Date('2024-01-01'),
  },
  parameters: {
    docs: {
      description: {
        story: '**DefaultValue** - 非受控模式下，使用 `defaultValue` 设置默认选中的日期。',
      },
    },
  },
}

export const Format: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | null>(new Date())
    return <DatePicker {...args} value={date || undefined} onChange={setDate} format="yyyy/MM/dd" />
  },
  parameters: {
    docs: {
      description: {
        story: '**Format** - 使用 `format` 属性自定义日期的展示格式。',
      },
    },
  },
}

export const CustomPlaceholder: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | null>(null)
    return (
      <DatePicker
        {...args}
        value={date || undefined}
        onChange={setDate}
        placeholder="请选择您的生日"
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story: '**Placeholder** - 自定义输入框的提示文字。',
      },
    },
  },
}

export const WithClearable: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | null>(new Date('2025-12-10'))
    return <DatePicker {...args} value={date || undefined} onChange={setDate} />
  },
  args: {
    clearable: true,
    placeholder: 'Hover to clear',
  },
  parameters: {
    docs: {
      description: {
        story: '**Clearable** - 通过设置 `clearable` 属性显示清除按钮。',
      },
    },
  },
}

export const WithTime: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | null>(null)
    return <DatePicker {...args} value={date || undefined} onChange={setDate} showTime />
  },
  parameters: {
    docs: {
      description: {
        story: '**ShowTime** - 增加时间选择功能。',
      },
    },
  },
}

export const YearPicker: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | null>(null)
    return (
      <DatePicker
        {...args}
        value={date || undefined}
        onChange={setDate}
        picker="year"
        placeholder="Select year"
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story: '**Picker** - 年份选择器。',
      },
    },
  },
}

export const MonthPicker: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | null>(null)
    return (
      <DatePicker
        {...args}
        value={date || undefined}
        onChange={setDate}
        picker="month"
        placeholder="Select month"
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story: '**Picker** - 月份选择器。',
      },
    },
  },
}

export const QuarterPicker: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | null>(null)
    return (
      <DatePicker
        {...args}
        value={date || undefined}
        onChange={setDate}
        picker="quarter"
        placeholder="Select quarter"
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story: '**Picker** - 季度选择器。',
      },
    },
  },
}

export const WeekPicker: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | null>(null)
    return (
      <DatePicker
        {...args}
        value={date || undefined}
        onChange={setDate}
        picker="week"
        placeholder="Select week"
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story: '**Picker** - 周选择器。',
      },
    },
  },
}

export const Disabled: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | null>(new Date())
    return <DatePicker {...args} value={date || undefined} onChange={setDate} disabled />
  },
  parameters: {
    docs: {
      description: {
        story: '**Disabled** - 禁用状态。',
      },
    },
  },
}

export const CustomStyle: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | null>(null)
    return (
      <DatePicker
        {...args}
        value={date || undefined}
        onChange={setDate}
        style={{ border: '1px dashed red', borderRadius: '4px' }}
        className="my-custom-class"
        placeholder="Custom Style"
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story: '**Style & ClassName** - 支持自定义内联样式和 CSS 类名。',
      },
    },
  },
}

export const RangePicker: Story = {
  render: () => <DatePicker.RangePicker />,
  parameters: {
    docs: {
      description: {
        story: `
**RangePicker 属性差异**

RangePicker 支持 DatePicker 的大多数属性，以下是主要差异：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前选中的日期范围 (JS Date) | \`[Date | null, Date | null]\` | - |
| defaultValue | 默认选中的日期范围 (JS Date) (仅在组件挂载时生效) | \`[Date | null, Date | null]\` | - |
| onChange | 日期范围改变时的回调 | \`(dates: [Date | null, Date | null]) => void\` | - |
| placeholder | 输入框提示文字 | \`[string, string]\` | \`['开始日期', '结束日期']\` |
        `,
      },
    },
  },
}

export const RangePickerWithTime: Story = {
  render: () => <DatePicker.RangePicker showTime clearable />,
}

export const FullWidth: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null)
    const [rangeDates, setRangeDates] = useState<[Date | null, Date | null]>([null, null])

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
        <div style={{ width: '400px' }}>
          <h4 style={{ marginBottom: 8 }}>Full Width DatePicker</h4>
          <DatePicker
            value={date || undefined}
            onChange={setDate}
            fullWidth
            placeholder="Full Width DatePicker"
          />
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
  },
  parameters: {
    docs: {
      description: {
        story: '**Full Width** - 设置 `fullWidth` 属性使选择器撑满父容器宽度。',
      },
    },
  },
}

import enUS from '../locale/en_US'

// ... existing imports ...

export const CustomTheme: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | null>(new Date())
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
        <DatePicker {...args} value={date || undefined} onChange={setDate} clearable />
      </ConfigProvider>
    )
  },
  args: {
    placeholder: 'Purple Theme',
  },
  parameters: {
    docs: {
      description: {
        story: '**自定义主题** - 通过 ConfigProvider 覆盖主题变量。',
      },
    },
  },
}

export const EnglishLocale: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null)
    const [rangeDates, setRangeDates] = useState<[Date | null, Date | null]>([null, null])

    return (
      <ConfigProvider locale={enUS}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h4 style={{ marginBottom: 8 }}>Basic DatePicker</h4>
            <DatePicker value={date || undefined} onChange={setDate} />
          </div>
          <div>
            <h4 style={{ marginBottom: 8 }}>With Time</h4>
            <DatePicker value={date || undefined} onChange={setDate} showTime />
          </div>
          <div>
            <h4 style={{ marginBottom: 8 }}>Month Picker</h4>
            <DatePicker
              value={date || undefined}
              onChange={setDate}
              picker="month"
              placeholder="Select month"
            />
          </div>
          <div>
            <h4 style={{ marginBottom: 8 }}>Range Picker</h4>
            <DatePicker.RangePicker value={rangeDates} onChange={setRangeDates} />
          </div>
        </div>
      </ConfigProvider>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '**English Locale** - 通过 ConfigProvider 切换为英文语言包，支持多种选择器形态。',
      },
    },
  },
}
