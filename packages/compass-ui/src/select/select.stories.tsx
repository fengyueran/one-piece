import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Select from './index'
import type { SelectValue } from './types'
import { ThemeProvider } from '../theme'

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
下拉选择器。

## 何时使用

- **基础选择**：当选项比较多时，使用下拉菜单节省页面空间。
- **多选 (Multiple)**：当用户需要从**固定列表**中选择多个项时（如：选择所属部门、选择星期几）。
- **标签输入 (Tags)**：当用户通过选择**或者输入**来设置标签时。常用于：
  - **文章标签**：既可选热门标签，也可输入新标签。
  - **邮件接收人**：既可选通讯录好友，也可输入陌生人邮箱。
  - **自定义分类**：允许用户创建系统不存在的新分类。
- 当选项少于 5 项时，建议直接将选项平铺，使用 Radio 是更好的选择。

## 主题变量 (Design Token)

<details>
<summary>组件 Token</summary>

| Token Name | Description |
| --- | --- |
| \`components.select.borderRadius\` | 边框圆角 |
| \`components.select.backgroundColor\` | 背景颜色 |
| \`components.select.borderColor\` | 边框颜色 |
| \`components.select.placeholderColor\` | 占位符颜色 |
| \`components.select.optionSelectedBg\` | 选项选中背景色 |
| \`components.select.optionHoverBg\` | 选项悬停背景色 |
| \`components.select.tagBg\` | 标签背景色 |
| \`components.select.tagColor\` | 标签文字颜色 |

</details>

<details>
<summary>全局 Token</summary>

| Token Name | Description |
| --- | --- |
| \`colors.primary\` | 主色调 (Selected Option) |
| \`colors.border\` | 边框颜色 |
| \`colors.background\` | 背景颜色 |
| \`colors.text\` | 文本颜色 |
| \`colors.textSecondary\` | 次级文本颜色 (Placeholder, Icon) |
| \`borderRadius.md\` | 默认圆角 |

</details>
`,
      },
    },
  },
  argTypes: {
    options: {
      control: 'object',
      description: '数据化配置选项内容',
      table: {
        type: {
          summary: 'SelectOption[]',
          detail: `interface SelectOption {
  /** 选项显示的内容 */
  label: React.ReactNode
  /** 选项的值 */
  value: string | number
  /** 是否禁用该选项 */
  disabled?: boolean
  /** 其他自定义属性 */
  [key: string]: any
}`,
        },
      },
    },
    value: {
      control: 'text',
      description: '指定当前选中的条目',
      table: {
        type: {
          summary: 'SelectValue',
          detail: 'string | number | (string | number)[]',
        },
      },
    },
    defaultValue: {
      control: 'text',
      description: '指定默认选中的条目',
      table: {
        type: {
          summary: 'SelectValue',
          detail: 'string | number | (string | number)[]',
        },
      },
    },
    onChange: {
      description: '选中 option 时调用，参数为 value',
      action: 'changed',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    loading: {
      control: 'boolean',
      description: '加载中状态',
    },
    allowClear: {
      control: 'boolean',
      description: '支持清除',
    },
    placeholder: {
      control: 'text',
      description: '选择框默认文字',
    },
    multiple: {
      control: 'boolean',
      description: '支持多选',
    },
    mode: {
      control: 'select',
      options: [undefined, 'multiple', 'tags'],
      description: '设置 Select 的模式（multiple: 多选，tags: 标签）',
      table: {
        type: { summary: "'multiple' | 'tags' | undefined" },
        defaultValue: { summary: 'undefined' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: '选择框大小',
      table: {
        defaultValue: { summary: 'medium' },
      },
    },
    status: {
      control: 'select',
      options: ['error', 'warning'],
      description: '设置校验状态',
    },
  },
}

export default meta
type Story = StoryObj<typeof Select>

const options = [
  { label: 'Jack', value: 'jack' },
  { label: 'Lucy', value: 'lucy' },
  { label: 'Yiminghe', value: 'yiminghe' },

  { label: 'Disabled', value: 'disabled', disabled: true },
]

const longOptions = [
  ...options,
  { label: 'David', value: 'david' },
  { label: 'Frank', value: 'frank' },
  { label: 'Grace', value: 'grace' },
  { label: 'Helen', value: 'helen' },
  { label: 'Ivy', value: 'ivy' },
]

export const Basic: Story = {
  args: {
    options,
    placeholder: 'Select a person',
    style: { width: 200 },
  },
}

export const Multiple: Story = {
  args: {
    options: longOptions,
    multiple: true,
    defaultValue: ['lucy', 'jack'],
    placeholder: 'Select multiple items',
    style: { width: 300 },
  },
}

export const ShowSearch: Story = {
  args: {
    showSearch: true,
    options: longOptions,
    placeholder: 'Search to Select',
    style: { width: 200 },
    onChange: (value) => console.log('Search selected:', value),
  },
  parameters: {
    docs: {
      description: {
        story: '**带搜索框** - 展开后可输入关键字进行过滤',
      },
    },
  },
}

export const Tags: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | number | (string | number)[]>([])
    return (
      <Select
        mode="tags"
        showSearch
        value={value}
        onChange={(val) => {
          console.log('Tags changed:', val)
          setValue(val)
        }}
        options={options}
        style={{ width: 300 }}
        placeholder="Select or type new tags"
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story: '**标签模式** - 可以从列表中选择，也可以直接输入内容按回车创建新标签',
      },
    },
  },
}

export const Disabled: Story = {
  args: {
    options,
    disabled: true,
    defaultValue: 'lucy',
    style: { width: 200 },
  },
}

export const WithChildren: Story = {
  render: (args) => (
    <Select {...args}>
      <Select.Option value="jack">Jack</Select.Option>
      <Select.Option value="lucy">Lucy</Select.Option>
      <Select.Option value="yiminghe">Yiminghe</Select.Option>
    </Select>
  ),
  args: {
    placeholder: 'Select with Children',
    style: { width: 200 },
  },
}

export const Loading: Story = {
  args: {
    options,
    loading: true,
    placeholder: 'Loading state',
    style: { width: 200 },
  },
}

export const AllowClear: Story = {
  args: {
    options,
    allowClear: true,
    defaultValue: 'lucy',
    placeholder: 'Hover to clear',
    style: { width: 200 },
  },
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Select options={options} size="small" placeholder="Small" style={{ width: 200 }} />
      <Select options={options} size="medium" placeholder="Medium" style={{ width: 200 }} />
      <Select options={options} size="large" placeholder="Large" style={{ width: 200 }} />
    </div>
  ),
}

export const Status: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Select options={options} status="error" placeholder="Error" style={{ width: 200 }} />
      <Select options={options} status="warning" placeholder="Warning" style={{ width: 200 }} />
    </div>
  ),
}

export const HoverTrigger: Story = {
  args: {
    options,
    trigger: 'hover',
    placeholder: 'Hover me',
    style: { width: 200 },
  },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState<SelectValue>('lucy')
    return (
      <div>
        <div style={{ marginBottom: 8 }}>Current Value: {value}</div>
        <Select value={value} onChange={setValue} options={options} style={{ width: 200 }} />
        <div style={{ marginTop: 8 }}>
          <button onClick={() => setValue('jack')} style={{ marginRight: 8 }}>
            Set Jack
          </button>
          <button onClick={() => setValue('lucy')}>Set Lucy</button>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '**受控模式** - 通过 `value` 和 `onChange` 控制组件状态。',
      },
    },
  },
}

export const CustomDropdownStyle: Story = {
  args: {
    options,
    placeholder: 'Custom Dropdown Style',
    dropdownStyle: { border: '1px solid #1890ff', padding: '4px', borderRadius: '8px' },
    dropdownClassName: 'custom-dropdown-class',
    style: { width: 200 },
  },
  parameters: {
    docs: {
      description: {
        story:
          '**自定义下拉样式** - 使用 `dropdownStyle` 和 `dropdownClassName` 自定义下拉菜单的外观。',
      },
    },
  },
}

export const CustomTheme: Story = {
  render: (args) => (
    <ThemeProvider
      theme={{
        colors: { primary: '#722ed1' },
        components: {
          select: {
            borderRadius: '20px',
            borderColor: '#722ed1',
            optionSelectedBg: '#f9f0ff',
            tagBg: '#722ed1',
            tagColor: '#fff',
          },
        },
      }}
    >
      <Select {...args} defaultValue={['jack', 'lucy']} mode="multiple" style={{ width: 300 }} />
    </ThemeProvider>
  ),
  args: {
    options,
    style: { width: 200 },
  },
  parameters: {
    docs: {
      description: {
        story: '**Custom Theme** - Customize colors and border radius.',
      },
    },
  },
}
