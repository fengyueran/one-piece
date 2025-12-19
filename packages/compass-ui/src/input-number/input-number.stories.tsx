import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ThemeProvider } from '../theme'
import InputNumber from './input-number'

const meta: Meta<typeof InputNumber> = {
  title: 'Components/InputNumber',
  component: InputNumber,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
数字输入框组件，用于输入数字值。

## 何时使用
- 需要获取用户输入的数值时。
- 需要限制输入范围（最大值、最小值）时。
- 需要提供格式化显示（如精度控制）时。

## 主题变量 (Design Token)

<details>
<summary>组件 Token (继承自 Input)</summary>

| Token Name | Description | Default Value |
| --- | --- | --- |
| \`components.input.borderRadius\` | 边框圆角 | 4px |
| \`components.input.activeBorderColor\` | 激活状态边框颜色 | #40a9ff |
| \`components.input.hoverBorderColor\` | 悬停状态边框颜色 | #4096ff |
| \`components.input.padding\` | 内边距 (sm/md/lg) | different per size |
| \`components.input.fontSize\` | 字体大小 (sm/md/lg) | different per size |

</details>

<details>
<summary>全局 Token</summary>

| Token Name | Description | Default Value |
| --- | --- | --- |
| \`colors.border\` | 默认边框颜色 | #d9d9d9 |
| \`colors.borderSecondary\` | 次级边框颜色 | #f0f0f0 |
| \`colors.background\` | 输入框背景色 | #ffffff |
| \`colors.backgroundSecondary\` | 禁用背景色 / 按钮悬停背景 | #fafafa |
| \`colors.text\` | 主要文本颜色 | rgba(0, 0, 0, 0.88) |
| \`colors.textSecondary\` | 次要文本颜色 | rgba(0, 0, 0, 0.65) |
| \`colors.textDisabled\` | 占位符和禁用文本颜色 | rgba(0, 0, 0, 0.25) |
| \`colors.error\` | 错误状态颜色 | #ff4d4f |

</details>
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: '输入框大小',
      table: {
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'medium'" },
      },
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
      table: { type: { summary: 'boolean' } },
    },
    fullWidth: {
      control: 'boolean',
      description: '是否占满父容器宽度',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    min: {
      control: 'number',
      description: '最小值',
      table: { type: { summary: 'number' } },
    },
    max: {
      control: 'number',
      description: '最大值',
      table: { type: { summary: 'number' } },
    },
    precision: {
      control: 'number',
      description: '数值精度',
      table: { type: { summary: 'number' } },
    },
    value: {
      control: 'number',
      description: '当前值（受控）',
      table: { type: { summary: 'number | null' } },
    },
    defaultValue: {
      control: 'number',
      description: '默认值',
      table: { type: { summary: 'number | null' } },
    },
    placeholder: {
      control: 'text',
      description: '输入框占位文本',
      table: { type: { summary: 'string' } },
    },
    label: {
      control: 'text',
      description: '标签文本',
      table: { type: { summary: 'string' } },
    },
    helperText: {
      control: 'text',
      description: '辅助文本',
      table: { type: { summary: 'ReactNode' } },
    },
    error: {
      control: 'text',
      description: '错误状态或错误文本',
      table: { type: { summary: 'boolean | string' } },
    },
    prefix: {
      control: 'text',
      description: '前缀',
      table: { type: { summary: 'ReactNode' } },
    },
    suffix: {
      control: 'text',
      description: '后缀',
      table: { type: { summary: 'ReactNode' } },
    },
    step: {
      control: 'number',
      description: '步长',
      table: { type: { summary: 'number' }, defaultValue: { summary: '1' } },
    },
    controls: {
      control: 'boolean',
      description: '是否显示增减按钮',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    keyboard: {
      control: 'boolean',
      description: '是否支持键盘上下键',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    onChange: {
      action: 'changed',
      description: '值变化时的回调',
      table: { type: { summary: '(value: number | null) => void' } },
    },
    onPressEnter: {
      action: 'entered',
      description: '按下回车键时的回调',
      table: { type: { summary: '(e: KeyboardEvent) => void' } },
    },
    onBlur: {
      action: 'blurred',
      description: '失焦时的回调',
      table: { type: { summary: '(e: FocusEvent) => void' } },
    },
    onFocus: {
      action: 'focused',
      description: '聚焦时的回调',
      table: { type: { summary: '(e: FocusEvent) => void' } },
    },
  },
}

export default meta
type Story = StoryObj<typeof InputNumber>

export const Basic: Story = {
  args: {
    placeholder: 'Basic usage',
  },
}

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = React.useState<number | null>(null)
    return (
      <InputNumber
        {...args}
        value={value}
        onChange={(val) => {
          setValue(val)
          console.log('Changed:', val)
        }}
        placeholder="Controlled mode"
      />
    )
  },
  args: {},
  parameters: {
    docs: {
      description: {
        story: '受控模式示例。',
      },
    },
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 10,
  },
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 300 }}>
      <InputNumber size="small" placeholder="Small" />
      <InputNumber size="medium" placeholder="Medium" />
      <InputNumber size="large" placeholder="Large" />
    </div>
  ),
}

export const WithLabelAndHelpers: Story = {
  args: {
    label: 'Price',
    helperText: 'Enter the price in USD',
    prefix: '$',
    min: 0,
  },
}

export const Validation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 300 }}>
      <InputNumber error label="Error State" defaultValue={100} />
      <InputNumber error="Invalid value!" label="With Error Message" defaultValue={100} />
    </div>
  ),
}

export const MinMax: Story = {
  args: {
    min: 0,
    max: 10,
    defaultValue: 5,
    helperText: 'Min: 0, Max: 10',
  },
}

export const Step: Story = {
  args: {
    step: 0.5,
    defaultValue: 1,
    helperText: 'Step: 0.5 - Click buttons or use arrow keys',
  },
  parameters: {
    docs: {
      description: {
        story: '**步长** - 设置 step 控制每次增减的步长',
      },
    },
  },
}

export const WithoutControls: Story = {
  args: {
    controls: false,
    defaultValue: 100,
    helperText: 'No increment/decrement buttons',
  },
  parameters: {
    docs: {
      description: {
        story: '**无按钮** - 设置 controls={false} 隐藏增减按钮',
      },
    },
  },
}

export const Precision: Story = {
  render: (args) => {
    const [value, setValue] = React.useState<number | null>(5.5)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <InputNumber
          {...args}
          value={value}
          onChange={setValue}
          helperText={`Precision: ${args.precision ?? 'undefined'} - Try changing precision in Controls`}
        />
        <div style={{ fontSize: '14px', color: '#666' }}>Current value: {value}</div>
      </div>
    )
  },
  args: {
    min: 0,
    max: 100,
    step: 0.1,
    precision: 2,
  },
  parameters: {
    docs: {
      description: {
        story: '**精度控制** - 可以在 Controls 面板动态修改 precision 查看效果',
      },
    },
  },
}

export const CustomTheme: Story = {
  render: (args) => (
    <ThemeProvider
      theme={{
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
      }}
    >
      <InputNumber {...args} />
    </ThemeProvider>
  ),
  args: {
    defaultValue: 123,
    label: 'Custom Theme',
  },
  parameters: {
    docs: {
      description: {
        story: '**自定义主题** - 通过 ThemeProvider 覆盖主题变量',
      },
    },
  },
}
