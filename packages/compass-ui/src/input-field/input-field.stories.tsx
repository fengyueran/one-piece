import type { Meta, StoryObj } from '@storybook/react'
import InputField from './input-field'
import { InfoIcon } from '../icons'
import ConfigProvider from '../config-provider'

const meta: Meta<typeof InputField> = {
  title: 'Components/InputField',
  component: InputField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
InputField 组件用于获取用户输入。支持标签、辅助文本、错误状态、前缀/后缀图标以及清除功能。

### 主题变量 (Design Token)

<details>
<summary>组件 Token</summary>

- \`input.padding\`: 对象，包含 \`sm\`, \`md\`, \`lg\` 尺寸的内边距
- \`input.fontSize\`: 对象，包含 \`sm\`, \`md\`, \`lg\` 尺寸的字体大小
- \`input.borderRadius\`: 边框圆角
- \`input.activeBorderColor\`: 激活/聚焦时的边框颜色
- \`input.hoverBorderColor\`: 悬停时的边框颜色

</details>

<details>
<summary>全局 Token</summary>

- \`colors.text\`: 标签和输入文本颜色
- \`colors.textSecondary\`: 辅助文本和图标颜色
- \`colors.textDisabled\`: 占位符文本颜色
- \`colors.border\`: 默认边框颜色
- \`colors.error\`: 错误状态颜色 (边框和文本)
- \`colors.background\`: 输入框背景颜色
- \`colors.backgroundSecondary\`: 禁用状态背景颜色

</details>
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      description: '输入框标签',
      control: 'text',
    },
    type: {
      description: '输入框类型',
      control: 'radio',
      options: ['text', 'password', 'search'],
      table: {
        type: { summary: "'text' | 'password' | 'search'" },
        defaultValue: { summary: 'text' },
      },
    },
    placeholder: {
      description: '占位符文本',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    helperText: {
      description: '辅助文本，显示在输入框下方',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    error: {
      description: '错误状态，可以是布尔值或错误信息字符串',
      control: 'text',
      table: {
        type: { summary: 'boolean | ReactNode' },
      },
    },
    disabled: {
      description: '是否禁用',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
      },
    },
    fullWidth: {
      description: '是否占满父容器宽度',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
      },
    },
    size: {
      description: '输入框尺寸',
      control: 'radio',
      options: ['small', 'medium', 'large'],
      table: {
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: 'medium' },
      },
    },
    allowClear: {
      description: '是否显示清除按钮',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
      },
    },
    prefix: {
      description: '前缀元素',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    suffix: {
      description: '后缀元素',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    value: {
      description: '输入框的值（受控模式）',
      control: 'text',
      table: {
        type: { summary: 'string | number' },
      },
    },
    defaultValue: {
      description: '输入框默认值（非受控模式）',
      control: 'text',
      table: {
        type: { summary: 'string | number' },
      },
    },
    onChange: {
      description: '值改变时的回调函数',
      action: 'changed',
      table: {
        type: { summary: '(event: React.ChangeEvent<HTMLInputElement>) => void' },
      },
    },
    onPressEnter: {
      description: '按下回车键时的回调函数',
      action: 'pressed enter',
      table: {
        type: { summary: '(event: React.KeyboardEvent<HTMLInputElement>) => void' },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof InputField>

export const Default: Story = {
  args: {
    placeholder: '请输入内容...',
    label: '用户名',
  },
}

export const WithHelperText: Story = {
  args: {
    placeholder: '请输入内容...',
    label: '用户名',
    helperText: '请输入您的真实姓名',
  },
}

export const Error: Story = {
  args: {
    placeholder: '请输入内容...',
    label: '邮箱',
    error: '请输入有效的邮箱地址',
    defaultValue: 'invalid-email',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: '无法输入',
    label: '禁用状态',
    disabled: true,
    defaultValue: '禁用值',
  },
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <InputField size="small" placeholder="Small Size" label="Small" />
      <InputField size="medium" placeholder="Medium Size" label="Medium" />
      <InputField size="large" placeholder="Large Size" label="Large" />
    </div>
  ),
}

export const WithAdornments: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <InputField placeholder="0.00" label="价格" prefix="$" />
      <InputField placeholder="0" label="重量" suffix="kg" />
      <InputField placeholder="搜索..." label="搜索" prefix={<InfoIcon />} allowClear />
    </div>
  ),
}

export const Clearable: Story = {
  args: {
    placeholder: '输入内容后尝试清除...',
    label: '可清除输入框',
    allowClear: true,
    defaultValue: '点击右侧图标清除',
  },
}

export const Password: Story = {
  args: {
    type: 'password',
    label: '密码',
    placeholder: '请输入密码',
    defaultValue: '123456',
  },
}

export const Search: Story = {
  args: {
    type: 'search',
    label: '搜索',
    placeholder: '搜索内容...',
    allowClear: true,
  },
}

export const WithCustomOnChange: Story = {
  render: () => (
    <InputField
      label="自定义 onChange"
      placeholder="打开控制台查看输出..."
      onChange={(e: any) => {
        console.log('用户输入:', e.target.value)
      }}
    />
  ),
}

export const WithOnPressEnter: Story = {
  render: () => (
    <InputField
      label="监听回车键"
      placeholder="输入内容后按回车..."
      onPressEnter={(e: React.KeyboardEvent<HTMLInputElement>) => {
        alert(`你输入了: ${(e.target as HTMLInputElement).value}`)
      }}
    />
  ),
}

/**
 * 通过 ConfigProvider 自定义组件样式。
 *
 * InputField 支持以下主题变量：
 * - `padding`: 控制不同尺寸的内边距
 * - `fontSize`: 控制不同尺寸的字体大小
 * - `borderRadius`: 边框圆角
 * - `activeBorderColor`: 激活/聚焦时的边框颜色
 * - `hoverBorderColor`: 悬停时的边框颜色
 */
export const CustomTheme: Story = {
  render: (args) => (
    <ConfigProvider
      theme={{
        components: {
          input: {
            borderRadius: '20px',
            activeBorderColor: '#722ed1',
            hoverBorderColor: '#b37feb',
            padding: {
              md: '10px 20px',
            },
          },
        },
      }}
    >
      <InputField {...args} />
    </ConfigProvider>
  ),
  args: {
    label: '自定义主题',
    placeholder: 'Custom Theme',
    helperText: '修改了圆角和激活颜色',
  },
}
