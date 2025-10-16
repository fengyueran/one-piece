// NOTE: Avoid importing Storybook type declarations to prevent TS resolution errors.
// We keep typings minimal in this stories file.
import { Progress } from './progress'

const meta = {
  title: 'Components/Progress',
  component: Progress,
  parameters: {
    // Use padded layout to allow horizontal space for linear bars
    layout: 'padded',
    docs: {
      description: {
        component:
          '用于显示任务完成状态的进度条组件。支持线性和圆形进度指示器。可以与 ThemeProvider 一起使用或单独使用 - 当不使用主题时，会回退到默认样式值。',
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
    },
    trailColor: {
      control: 'color',
      description: '轨道颜色（背景颜色）',
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

// Interactive Examples
export const InteractiveLinear: Story = {
  args: {
    type: 'line',
    percent: 50,
    size: 'medium',
    status: 'normal',
    showInfo: true,
  },
}

export const InteractiveCircle: Story = {
  args: {
    type: 'circle',
    percent: 50,
    size: 'medium',
    status: 'normal',
    showInfo: true,
    strokeWidth: 6,
  },
}
