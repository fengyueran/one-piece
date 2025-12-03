import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ThemeProvider, defaultTheme, darkTheme, useTheme, type Theme } from './index'
import Button from '../button'

const meta: Meta<typeof ThemeProvider> = {
  title: 'Theme/ThemeProvider',
  component: ThemeProvider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
主题提供者组件，为子组件提供主题上下文。

### 内置主题
Compass UI 内置了两套主题配置：
- **Light Theme (默认)**: 适用于亮色背景的标准主题。
- **Dark Theme**: 适用于暗色背景的主题，优化了对比度和阅读体验。

### 主题配置
你可以通过以下属性自定义主题：
- \`theme\`: 通用主题配置，会覆盖 Light 和 Dark 模式下的共有配置（如圆角、间距）。
- \`lightTheme\`: 仅在 Light 模式下生效的覆盖配置。
- \`darkTheme\`: 仅在 Dark 模式下生效的覆盖配置。

ThemeProvider 会自动根据当前的 \`mode\` (light/dark) 选择对应的内置主题作为基础，然后依次合并 \`theme\` 和对应模式的专属配置 (\`lightTheme\`/\`darkTheme\`)。
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    theme: {
      description: '通用主题配置，会覆盖 Light 和 Dark 模式下的共有配置',
      control: { type: 'object' },
    },
    lightTheme: {
      description: '仅在 Light 模式下生效的覆盖配置',
      control: { type: 'object' },
    },
    darkTheme: {
      description: '仅在 Dark 模式下生效的覆盖配置',
      control: { type: 'object' },
    },
    defaultMode: {
      description: '默认主题模式',
      control: { type: 'radio' },
      options: ['light', 'dark'],
      defaultValue: 'light',
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
    lightTheme: {
      colors: {
        primary: '#ff6b35',
        primaryHover: '#ff8c69',
        primaryActive: '#e55a2b',
      },
    },
    darkTheme: {
      colors: {
        primary: '#d4380d',
        primaryHover: '#ff6b35',
        primaryActive: '#ad2102',
      },
    },
    children: <ThemeDemo />,
  },
  parameters: {
    docs: {
      description: {
        story:
          '自定义主色调的示例。使用 `lightTheme` 和 `darkTheme` 分别配置亮色和暗色模式下的主题。',
      },
    },
  },
}

export const DarkTheme: Story = {
  args: {
    defaultMode: 'dark',
    children: <ThemeDemo />,
  },
  parameters: {
    docs: {
      description: {
        story: '内置暗色主题示例。通过设置 `defaultMode="dark"` 即可开启。',
      },
    },
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#141414' }],
    },
  },
}

export const BuiltInThemes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 20, flexDirection: 'column' }}>
      <div>
        <h4 style={{ margin: '0 0 10px' }}>Light Theme (Default)</h4>
        <pre
          style={{
            background: '#f5f5f5',
            padding: 10,
            borderRadius: 4,
            fontSize: 12,
            overflow: 'auto',
            maxHeight: 300,
            border: '1px solid #eee',
          }}
        >
          {JSON.stringify(defaultTheme, null, 2)}
        </pre>
      </div>
      <div>
        <h4 style={{ margin: '0 0 10px' }}>Dark Theme</h4>
        <pre
          style={{
            background: '#141414',
            color: '#e6e6e6',
            padding: 10,
            borderRadius: 4,
            fontSize: 12,
            overflow: 'auto',
            maxHeight: 300,
            border: '1px solid #333',
          }}
        >
          {JSON.stringify(darkTheme, null, 2)}
        </pre>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '查看内置的 Light 和 Dark 主题的具体配置值。',
      },
      source: {
        code: '/* Built-in themes configuration display */',
      },
    },
  },
}

const ThemeSwitcher = () => {
  const { mode, toggleTheme } = useTheme()
  return (
    <div
      style={{
        padding: 20,
        background: mode === 'dark' ? '#141414' : '#fff',
        color: mode === 'dark' ? '#fff' : '#000',
        transition: 'all 0.3s',
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <span style={{ marginRight: 16 }}>Current Mode: {mode}</span>
        <Button onClick={toggleTheme}>Toggle Theme</Button>
      </div>
      <ThemeDemo />
    </div>
  )
}

export const Switching: Story = {
  render: () => (
    <ThemeProvider>
      <ThemeSwitcher />
    </ThemeProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: '动态切换主题示例。使用 `useTheme` hook 获取当前模式并切换。',
      },
      source: {
        code: `import React from 'react'
import { ThemeProvider, useTheme, Button } from '@xinghunm/compass-ui'

const ThemeSwitcher = () => {
  const { mode, toggleTheme } = useTheme()
  return (
    <div
      style={{
        padding: 20,
        background: mode === 'dark' ? '#141414' : '#fff',
        color: mode === 'dark' ? '#fff' : '#000',
        transition: 'all 0.3s',
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <span style={{ marginRight: 16 }}>Current Mode: {mode}</span>
        <Button onClick={toggleTheme}>Toggle Theme</Button>
      </div>
      {/* Your App Content */}
    </div>
  )
}

const App = () => (
  <ThemeProvider>
    <ThemeSwitcher />
  </ThemeProvider>
)
`,
      },
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
