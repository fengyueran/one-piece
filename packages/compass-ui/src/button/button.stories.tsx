import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import Button from './button'
import { ThemeProvider } from '../theme'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '基于 Emotion 的按钮组件，支持多种样式变体、尺寸和状态。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'default', 'dashed', 'text', 'link'],
      description: '按钮样式变体',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'default', 'large'],
      description: '按钮尺寸',
    },
    disabled: {
      control: { type: 'boolean' },
      description: '是否禁用',
    },
    loading: {
      control: { type: 'boolean' },
      description: '是否显示加载状态',
    },
    danger: {
      control: { type: 'boolean' },
      description: '是否为危险操作样式',
    },
    block: {
      control: { type: 'boolean' },
      description: '是否为块级按钮（占满父容器宽度）',
    },
    hasRipple: {
      control: { type: 'boolean' },
      description: '是否启用水波纹效果（来自 ButtonBase）',
    },
    rippleBgColor: {
      control: { type: 'color' },
      description: '水波纹背景色（来自 ButtonBase）',
    },
    rippleOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: '水波纹不透明度（来自 ButtonBase）',
    },
    onClick: {
      action: 'clicked',
      description: '点击事件（展示于 Actions 面板）',
    },
    children: {
      description: '按钮内容',
    },
    icon: {
      description: '按钮图标，显示在文本前面（React.ReactNode 类型）',
      control: { type: 'object' },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
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
}

export const Default: Story = {
  args: {
    variant: 'default',
    children: 'Default Button',
  },
}

export const Dashed: Story = {
  args: {
    variant: 'dashed',
    children: 'Dashed Button',
  },
}

export const Text: Story = {
  args: {
    variant: 'text',
    children: 'Text Button',
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
}

export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    children: 'Small Button',
  },
}

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    children: 'Large Button',
  },
}

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled Button',
  },
}

export const Loading: Story = {
  args: {
    variant: 'primary',
    loading: true,
    children: 'Loading Button',
  },
}

export const Danger: Story = {
  args: {
    variant: 'primary',
    danger: true,
    children: 'Danger Button',
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
  },
}

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    icon: <span>🚀</span>,
    children: 'Button with Icon',
  },
  parameters: {
    docs: {
      description: {
        story: '按钮可以包含图标，图标会显示在文本前面。',
      },
    },
  },
}

export const IconOnly: Story = {
  args: {
    variant: 'primary',
    icon: <span>➕</span>,
    children: '',
  },
  parameters: {
    docs: {
      description: {
        story: '只显示图标的按钮。',
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
        story: '禁用水波纹效果。',
      },
    },
  },
}

export const RippleCustomColor: Story = {
  args: {
    variant: 'primary',
    rippleBgColor: '#1677ff',
    children: 'Ripple Color (#1677ff)',
  },
}

export const RippleCustomOpacity: Story = {
  args: {
    variant: 'primary',
    rippleOpacity: 0.6,
    children: 'Ripple Opacity 0.6',
  },
}

export const ClickAction: Story = {
  args: {
    variant: 'primary',
    children: 'Click Me',
  },
}

// 展示所有变体的组合示例
const AllVariants: React.FC = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '20px',
    }}
  >
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="default">Default</Button>
      <Button variant="dashed">Dashed</Button>
      <Button variant="text">Text</Button>
      <Button variant="link">Link</Button>
    </div>

    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button variant="primary" size="small">
        Small
      </Button>
      <Button variant="primary" size="default">
        Default
      </Button>
      <Button variant="primary" size="large">
        Large
      </Button>
    </div>

    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button variant="primary" disabled>
        Disabled
      </Button>
      <Button variant="primary" loading>
        Loading
      </Button>
      <Button variant="primary" danger>
        Danger
      </Button>
    </div>

    <div style={{ width: '200px' }}>
      <Button variant="primary" block>
        Block Button
      </Button>
    </div>

    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button variant="primary" icon={<span>🚀</span>}>
        With Icon
      </Button>
      <Button variant="primary" icon={<span>➕</span>}>
        Icon Only
      </Button>
    </div>
  </div>
)

export const AllCombinations: Story = {
  render: () => <AllVariants />,
  parameters: {
    docs: {
      description: {
        story: '展示按钮组件的所有变体和状态组合。',
      },
    },
  },
}
