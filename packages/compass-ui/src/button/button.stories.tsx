import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import Button from './index'
import ConfigProvider from '../config-provider'

// Common icon component for examples
const PlusIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
基于 Emotion 的按钮组件，支持多种样式变体、尺寸和状态。

### 主题变量（Design Token）
<details>
<summary>组件 Token</summary>

| 变量名称 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| components.button.fontSize.sm | 小号按钮字体大小 | string | 12px |
| components.button.fontSize.md | 默认按钮字体大小 | string | 14px |
| components.button.fontSize.lg | 大号按钮字体大小 | string | 16px |
| components.button.padding.sm | 小号按钮内边距 | string | 0 8px |
| components.button.padding.md | 默认/大号按钮内边距 | string | 0 16px |
| components.button.borderRadius.sm | 小号按钮圆角 | string | 4px |
| components.button.borderRadius.md | 默认按钮圆角 | string | 6px |
| components.button.borderRadius.lg | 大号按钮圆角 | string | 8px |

</details>

<details>
<summary>全局 Token</summary>

| 变量名称 | 描述 | 类型 |
| --- | --- | --- |
| fontWeight.normal | 按钮字体粗细 | number |
| transitions.normal | 按钮过渡效果 | string |
| colors.primary | 主按钮背景色/边框色/文本色 | string |
| colors.primaryHover | 主按钮悬停背景色/边框色 | string |
| colors.primaryActive | 主按钮激活背景色/边框色 | string |
| colors.background | 默认/虚线按钮背景色 | string |
| colors.border | 默认/虚线按钮边框色 | string |
| colors.text | 默认/虚线/文本按钮文本色 | string |
| colors.borderHover | 默认/虚线按钮悬停边框色/文本色 | string |
| colors.backgroundTertiary | 文本按钮悬停背景色 | string |
| colors.error | 危险按钮颜色 | string |

</details>
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'default', 'dashed', 'text', 'link'],
      description: '按钮样式变体',
      table: {
        type: { summary: "'primary' | 'default' | 'dashed' | 'text' | 'link'" },
      },
    },
    shape: {
      control: { type: 'select' },
      options: ['default', 'circle', 'round'],
      description: '按钮形状',
      table: {
        type: { summary: "'default' | 'circle' | 'round'" },
        defaultValue: { summary: "'default'" },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'default', 'large'],
      description: '按钮尺寸',
      table: {
        type: { summary: "'small' | 'default' | 'large'" },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: '是否禁用',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    loading: {
      control: { type: 'boolean' },
      description: '是否显示加载状态',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    danger: {
      control: { type: 'boolean' },
      description: '是否为危险操作样式',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    block: {
      control: { type: 'boolean' },
      description: '是否为块级按钮（占满父容器宽度）',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    hasRipple: {
      control: { type: 'boolean' },
      description: '是否启用水波纹效果',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    rippleBgColor: {
      control: { type: 'color' },
      description: '水波纹背景色',
      type: 'string',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    rippleOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: '水波纹不透明度',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onClick: {
      action: 'clicked',
      description: '点击事件（展示于 Actions 面板）',
      table: {
        type: { summary: '(event: React.MouseEvent<HTMLButtonElement>) => void' },
      },
    },
    children: {
      description: '按钮内容',
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
    icon: {
      description: '按钮图标，显示在文本前面（React.ReactNode 类型）',
      control: { type: 'object' },
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
  },
  decorators: [
    (Story) => (
      <ConfigProvider>
        <Story />
      </ConfigProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
  parameters: {
    docs: {
      description: { story: '**主要按钮**' },
    },
  },
}

export const Default: Story = {
  args: {
    children: 'Default Button',
  },
  parameters: {
    docs: {
      description: { story: '**默认按钮**' },
    },
  },
}

export const Dashed: Story = {
  args: {
    variant: 'dashed',
    children: 'Dashed Button',
  },
  parameters: {
    docs: {
      description: { story: '**虚线按钮**' },
    },
  },
}

export const Text: Story = {
  args: {
    variant: 'text',
    children: 'Text Button',
  },
  parameters: {
    docs: {
      description: { story: '**文本按钮**' },
    },
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
  parameters: {
    docs: {
      description: { story: '**链接按钮**' },
    },
  },
}

export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    children: 'Small Button',
  },
  parameters: {
    docs: {
      description: { story: '**小尺寸按钮**' },
    },
  },
}

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    children: 'Large Button',
  },
  parameters: {
    docs: {
      description: { story: '**大尺寸按钮**' },
    },
  },
}

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled Button',
  },
  parameters: {
    docs: {
      description: { story: '**禁用状态**' },
    },
  },
}

export const Loading: Story = {
  args: {
    variant: 'primary',
    loading: true,
    children: 'Loading Button',
  },
  parameters: {
    docs: {
      description: { story: '**加载状态**' },
    },
  },
}

export const Danger: Story = {
  args: {
    variant: 'primary',
    danger: true,
    children: 'Danger Button',
  },
  parameters: {
    docs: {
      description: { story: '**危险操作**' },
    },
  },
}

export const Block: Story = {
  args: {
    variant: 'primary',
    block: true,
    children: 'Block Button',
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: { story: '**块级按钮**' },
    },
  },
}

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    icon: PlusIcon,
    children: 'Button with Icon',
  },
  parameters: {
    docs: {
      description: {
        story: '**带图标的按钮**',
      },
    },
  },
}

export const IconOnly: Story = {
  args: {
    variant: 'text',
    shape: 'circle',
    icon: PlusIcon,
  },
  parameters: {
    docs: {
      description: {
        story: '**仅图标按钮** (使用 `variant="text"` 和 `shape="circle"`)',
      },
    },
  },
}

export const Round: Story = {
  args: {
    variant: 'primary',
    shape: 'round',
    children: 'Round Button',
  },
  parameters: {
    docs: {
      description: {
        story: '**圆角按钮** (使用 `shape="round"`)',
      },
    },
  },
}

export const NoRipple: Story = {
  args: {
    variant: 'primary',
    hasRipple: false,
    children: 'No Ripple',
  },
  parameters: {
    docs: {
      description: {
        story: '**禁用水波纹效果**',
      },
    },
  },
}

export const RippleCustomColor: Story = {
  args: {
    variant: 'primary',
    rippleBgColor: 'red',
    children: 'Ripple Color (red)',
  },
  parameters: {
    docs: {
      description: { story: '**自定义水波纹颜色**' },
    },
  },
}

export const RippleCustomOpacity: Story = {
  args: {
    variant: 'primary',
    rippleOpacity: 0.6,
    children: 'Ripple Opacity 0.6',
  },
  parameters: {
    docs: {
      description: { story: '**自定义水波纹透明度**' },
    },
  },
}

export const ClickAction: Story = {
  args: {
    variant: 'primary',
    children: 'Click Me',
  },
  parameters: {
    docs: {
      description: { story: '**点击事件**' },
    },
  },
  render: () => (
    <Button
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        console.log('用户点击')
      }}
    >
      Click Me
    </Button>
  ),
}

export const CustomTheme: Story = {
  render: (args) => (
    <ConfigProvider
      theme={{
        token: {
          colors: {
            primary: '#722ed1',
            primaryHover: '#9254de',
            primaryActive: '#531dab',
          },
          components: {
            button: {
              borderRadius: {
                md: '20px',
              },
              padding: {
                md: '0 30px',
              },
              fontSize: {
                md: '16px',
              },
            },
          },
        },
      }}
    >
      <Button {...args} />
    </ConfigProvider>
  ),
  args: {
    children: 'Custom Theme Button',
    variant: 'primary',
  },
  parameters: {
    docs: {
      description: {
        story: '**自定义主题**',
      },
    },
  },
}
