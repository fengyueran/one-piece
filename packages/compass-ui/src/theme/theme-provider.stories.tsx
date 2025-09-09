import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ThemeProvider, defaultTheme, type Theme } from './index'
import Button from '../button'

const meta: Meta<typeof ThemeProvider> = {
  title: 'Theme/ThemeProvider',
  component: ThemeProvider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '主题提供者组件，为子组件提供主题上下文。支持自定义主题配置，未提供的配置项会使用默认主题。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    theme: {
      description: '自定义主题配置，支持部分覆盖',
      control: { type: 'object' },
    },
    children: {
      description: '子组件',
      control: false,
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// 示例按钮组件用于展示主题效果
const ThemeDemo: React.FC = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '20px',
    }}
  >
    <h3 style={{ margin: 0, color: 'var(--theme-text, #000)' }}>主题效果演示</h3>
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary Button</Button>
      <Button variant="default">Default Button</Button>
      <Button variant="dashed">Dashed Button</Button>
      <Button variant="text">Text Button</Button>
      <Button variant="link">Link Button</Button>
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
  </div>
)

export const Default: Story = {
  args: {
    children: <ThemeDemo />,
  },
  parameters: {
    docs: {
      description: {
        story: '使用默认主题的基本示例。',
      },
    },
  },
}

export const CustomColors: Story = {
  args: {
    theme: {
      colors: {
        primary: '#ff6b35',
        primaryHover: '#ff8c69',
        primaryActive: '#e55a2b',
      },
    } as Partial<Theme>,
    children: <ThemeDemo />,
  },
  parameters: {
    docs: {
      description: {
        story: '自定义主色调的示例。只需要提供需要覆盖的颜色配置，其他配色会使用默认值。',
      },
    },
  },
}

export const DarkTheme: Story = {
  args: {
    theme: {
      colors: {
        primary: '#4096ff',
        primaryHover: '#69b1ff',
        primaryActive: '#0958d9',
        text: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.85)',
        textTertiary: 'rgba(255, 255, 255, 0.65)',
        textDisabled: 'rgba(255, 255, 255, 0.25)',
        background: '#141414',
        backgroundSecondary: '#1f1f1f',
        backgroundTertiary: '#262626',
        border: '#434343',
        borderSecondary: '#303030',
        borderHover: '#4096ff',
      },
    } as Partial<Theme>,
    children: <ThemeDemo />,
  },
  parameters: {
    docs: {
      description: {
        story: '暗色主题示例。展示了如何通过自定义颜色配置实现暗色主题。',
      },
    },
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#141414' }],
    },
  },
}

export const CustomSpacing: Story = {
  args: {
    theme: {
      spacing: {
        xs: 2,
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        xxl: 24,
      },
    } as Partial<Theme>,
    children: <ThemeDemo />,
  },
  parameters: {
    docs: {
      description: {
        story: '自定义间距配置的示例。展示了如何调整组件的内边距和外边距。',
      },
    },
  },
}

export const CustomBorderRadius: Story = {
  args: {
    theme: {
      borderRadius: {
        xs: 0,
        sm: 2,
        md: 4,
        lg: 8,
        xl: 16,
      },
    } as Partial<Theme>,
    children: <ThemeDemo />,
  },
  parameters: {
    docs: {
      description: {
        story: '自定义圆角配置的示例。可以创建更加方正或更加圆润的视觉风格。',
      },
    },
  },
}

// 展示主题配置的工具组件
const ThemeInspector: React.FC<{ theme: Partial<Theme> }> = ({ theme }) => {
  const mergedTheme = { ...defaultTheme, ...theme }

  return (
    <div
      style={{
        fontFamily: 'monospace',
        fontSize: '12px',
        background: '#f5f5f5',
        padding: '16px',
        borderRadius: '4px',
        maxHeight: '300px',
        overflow: 'auto',
      }}
    >
      <h4 style={{ margin: '0 0 12px 0' }}>当前主题配置:</h4>
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(mergedTheme, null, 2)}
      </pre>
    </div>
  )
}

export const ThemeInspection: Story = {
  args: {
    theme: {
      colors: {
        primary: '#52c41a',
      },
    } as Partial<Theme>,
    children: (
      <div>
        <ThemeDemo />
        <ThemeInspector theme={{ colors: { primary: '#52c41a' } } as Partial<Theme>} />
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '主题配置检查器。展示了当前生效的完整主题配置，有助于调试和理解主题合并机制。',
      },
    },
  },
}
