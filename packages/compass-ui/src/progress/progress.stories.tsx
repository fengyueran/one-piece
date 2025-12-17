// NOTE: Avoid importing Storybook type declarations to prevent TS resolution errors.
// We keep typings minimal in this stories file.
import { Progress } from './progress'
import ConfigProvider from '../config-provider'

const meta = {
  title: 'Components/Progress',
  component: Progress,
  parameters: {
    // Use padded layout to allow horizontal space for linear bars
    layout: 'padded',
    docs: {
      description: {
        component: `
用于显示任务完成状态的进度条组件。支持线性和圆形进度指示器。可以与 ConfigProvider 一起使用或单独使用 - 当不使用主题时，会回退到默认样式值。

### 主题变量
<details>
<summary>组件 Token</summary>

| 变量名称 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| components.progress.trackColor | 进度条轨道颜色 | string | #f5f5f5 |
| components.progress.successColor | 成功状态颜色 | string | #52c41a |
| components.progress.errorColor | 错误状态颜色 | string | #ff4d4f |
| components.progress.warningColor | 警告状态颜色 | string | #faad14 |
| components.progress.infoColor | 默认/信息状态颜色 | string | #1890ff |
| components.progress.fontSize | 进度文本字体大小 | string | 14px |

</details>

<details>
<summary>全局 Token</summary>

| 变量名称 | 描述 | 类型 |
| --- | --- | --- |
| borderRadius.xl | 进度条圆角 | number |
| transitions.normal | 进度条动画过渡 | string |
| colors.text | 进度文本颜色 | string |
| fontSize.xs | 小号进度文本字体大小 | number |
| fontSize.md | 大号进度文本字体大小 | number |

</details>
`,
      },
    },
  },
  // Ensure linear progress has a reasonable width in canvas/docs
  decorators: [(Story: any) => <div style={{ width: 320 }}>{Story()}</div>],
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['line', 'circle'],
      description: '进度条类型',
    },
    percent: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: '进度百分比 (0-100)',
    },
    size: {
      control: {
        type: 'select',
        labels: {
          custom: 'Object: { width: 250, height: 12 }',
        },
      },
      options: ['small', 'medium', 'large', 30, 'custom'],
      mapping: {
        custom: { width: 250, height: 12 },
      },
      description: `
**ProgressSize**:
- **预设尺寸**: 'small' | 'medium' | 'large'
- **数字**: 自定义高度(线性)或直径(圆形), 如 30
- **对象**: 仅线性进度条支持 { width: number, height: number }

**示例**:
- \`size="small"\`
- \`size={30}\`
- \`size={{ width: 300, height: 16 }}\``,
    },
    status: {
      control: 'select',
      options: ['normal', 'success', 'error', 'warning'],
      description: '进度条状态',
    },
    showInfo: {
      control: 'boolean',
      description: '显示百分比文本',
    },
    strokeWidth: {
      control: { type: 'range', min: 1, max: 20, step: 1 },
      description: '圆形进度条线的宽度',
    },
    strokeColor: {
      control: 'color',
      description: '描边颜色',
      type: 'string',
    },
    trailColor: {
      control: 'color',
      description: '轨道颜色（背景颜色）',
      type: 'string',
    },
    gapDegree: {
      control: { type: 'range', min: 0, max: 295, step: 1 },
      description: '圆形进度条缺口角度',
      table: {
        type: { summary: 'number' },
      },
    },
    gapPosition: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: '圆形进度条缺口位置',
      table: {
        type: { summary: "'top' | 'bottom' | 'left' | 'right'" },
        defaultValue: { summary: "'top'" },
      },
    },
  },
}

export default meta
type Story = any

// Default story
export const Default: Story = {
  args: {
    type: 'line',
    percent: 50,
  },
}

export const LinearProgress: Story = {
  args: {
    type: 'line',
    percent: 75,
  },
}

export const CircleProgress: Story = {
  args: {
    type: 'circle',
    percent: 60,
  },
}

// Size Variations
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '300px' }}>
      <div>
        <h4>Small</h4>
        <Progress size="small" percent={30} />
      </div>
      <div>
        <h4>Medium</h4>
        <Progress size="medium" percent={50} />
      </div>
      <div>
        <h4>Large</h4>
        <Progress size="large" percent={70} />
      </div>
      <div>
        <h4>Custom Height (20px)</h4>
        <Progress size={20} percent={60} />
      </div>
      <div>
        <h4>Custom Width & Height (250px × 12px)</h4>
        <Progress size={{ width: 250, height: 12 }} percent={80} />
      </div>
    </div>
  ),
}

export const CircleSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h4>Small (80px)</h4>
        <Progress type="circle" percent={30} size="small" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4>Medium (120px)</h4>
        <Progress type="circle" percent={50} size="medium" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4>Large (160px)</h4>
        <Progress type="circle" percent={70} size="large" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4>Custom (200px)</h4>
        <Progress type="circle" percent={85} size={200} />
      </div>
    </div>
  ),
}

// Status Variations
export const StatusVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '300px' }}>
      <div>
        <h4>Normal</h4>
        <Progress percent={30} status="normal" />
      </div>
      <div>
        <h4>Success</h4>
        <Progress percent={100} status="success" />
      </div>
      <div>
        <h4>Warning</h4>
        <Progress percent={60} status="warning" />
      </div>
      <div>
        <h4>Error</h4>
        <Progress percent={40} status="error" />
      </div>
    </div>
  ),
}

export const CircleStatusVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h4>Normal</h4>
        <Progress type="circle" percent={30} status="normal" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4>Success</h4>
        <Progress type="circle" percent={100} status="success" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4>Warning</h4>
        <Progress type="circle" percent={60} status="warning" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4>Error</h4>
        <Progress type="circle" percent={40} status="error" />
      </div>
    </div>
  ),
}

// Custom Styling
export const CustomColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '300px' }}>
      <div>
        <h4>Custom Stroke Color</h4>
        <Progress percent={60} strokeColor="#ff6b6b" />
      </div>
      <div>
        <h4>Custom Trail Color</h4>
        <Progress percent={40} trailColor="#f0f0f0" />
      </div>
      <div>
        <h4>Gradient Color</h4>
        <Progress
          percent={80}
          strokeColor={{ from: '#ff6b6b', to: '#4ecdc4', direction: 'to right' }}
        />
      </div>
    </div>
  ),
}

export const CustomCircleColors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h4>Custom Color</h4>
        <Progress type="circle" percent={60} strokeColor="#ff6b6b" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4>Custom Trail</h4>
        <Progress type="circle" percent={40} trailColor="#f0f0f0" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4>Gradient</h4>
        <Progress type="circle" percent={80} strokeColor={{ from: '#ff6b6b', to: '#4ecdc4' }} />
      </div>
    </div>
  ),
}

// Custom Formatting
export const CustomFormat: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '300px' }}>
      <div>
        <h4>Custom Format Function</h4>
        <Progress percent={75} format={(percent) => `${percent} of 100`} />
      </div>
      <div>
        <h4>Success Icon</h4>
        <Progress percent={100} success={<span style={{ color: '#52c41a' }}>✓</span>} />
      </div>
      <div>
        <h4>No Info Text</h4>
        <Progress percent={45} showInfo={false} />
      </div>
    </div>
  ),
}

export const CustomCircleFormat: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h4>Custom Format</h4>
        <Progress type="circle" percent={75} format={(percent) => `${percent}/100`} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4>Success Icon</h4>
        <Progress
          type="circle"
          percent={100}
          success={<span style={{ color: '#52c41a', fontSize: '24px' }}>✓</span>}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4>No Info</h4>
        <Progress type="circle" percent={45} showInfo={false} />
      </div>
    </div>
  ),
}

// Stroke Width Variations (Linear Progress no longer supports strokeWidth)
export const LinearHeightVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '300px' }}>
      <div>
        <h4>Thin (2px)</h4>
        <Progress percent={50} size={2} />
      </div>
      <div>
        <h4>Default (8px)</h4>
        <Progress percent={50} />
      </div>
      <div>
        <h4>Thick (16px)</h4>
        <Progress percent={50} size={16} />
      </div>
    </div>
  ),
}

export const CircleStrokeWidthVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h4>Thin (2px)</h4>
        <Progress type="circle" percent={50} strokeWidth={2} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4>Default (6px)</h4>
        <Progress type="circle" percent={50} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4>Thick (12px)</h4>
        <Progress type="circle" percent={50} strokeWidth={12} />
      </div>
    </div>
  ),
}

export const CustomTheme: Story = {
  render: () => (
    <ConfigProvider
      theme={{
        components: {
          progress: {
            trackColor: '#e6f7ff',
            infoColor: '#722ed1',
            successColor: '#52c41a',
            fontSize: '16px',
          },
        },
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '300px' }}>
        <Progress percent={60} />
        <Progress percent={100} status="success" />
        <Progress type="circle" percent={75} />
      </div>
    </ConfigProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: '**自定义主题**',
      },
    },
  },
}

export const CircleDashboard: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h4>Dashboard (Bottom Gap)</h4>
        <Progress type="circle" percent={75} gapDegree={75} gapPosition="bottom" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4>Dashboard (Top Gap)</h4>
        <Progress type="circle" percent={75} gapDegree={75} gapPosition="top" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4>Dashboard (Left Gap)</h4>
        <Progress type="circle" percent={75} gapDegree={75} gapPosition="left" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4>Dashboard (Right Gap)</h4>
        <Progress type="circle" percent={75} gapDegree={75} gapPosition="right" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '**仪表盘** \n\n通过设置 `gapDegree` 和 `gapPosition` 可以实现仪表盘效果。',
      },
    },
  },
}
