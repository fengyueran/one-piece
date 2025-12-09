import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Steps } from './steps'
import { LoadingIcon, InfoIcon } from '../icons'
import { ConfigProvider } from '../config-provider'

/**
 * 步骤条组件，用于引导用户按照流程完成任务。
 *
 * ## 何时使用
 *
 * - 当任务复杂或者存在先后关系时，将其分解成一系列步骤，从而简化任务。
 *
 * ## 主题变量 (Design Token)
 *
 * <details>
 * <summary>组件 Token</summary>
 *
 * | Token Name | Description |
 * | --- | --- |
 * | `components.steps.descriptionColor` | 描述文字颜色 |
 * | `components.steps.titleColor` | 标题文字颜色 |
 * | `components.steps.subTitleColor` | 子标题文字颜色 |
 * | `components.steps.waitIconColor` | 等待状态图标颜色 |
 * | `components.steps.processIconColor` | 进行状态图标颜色 |
 * | `components.steps.finishIconColor` | 完成状态图标颜色 |
 * | `components.steps.errorIconColor` | 错误状态图标颜色 |
 * | `components.steps.waitTitleColor` | 等待状态标题颜色 |
 * | `components.steps.processTitleColor` | 进行状态标题颜色 |
 * | `components.steps.finishTitleColor` | 完成状态标题颜色 |
 * | `components.steps.errorTitleColor` | 错误状态标题颜色 |
 * | `components.steps.waitDescriptionColor` | 等待状态描述颜色 |
 * | `components.steps.processDescriptionColor` | 进行状态描述颜色 |
 * | `components.steps.finishDescriptionColor` | 完成状态描述颜色 |
 * | `components.steps.errorDescriptionColor` | 错误状态描述颜色 |
 * | `components.steps.iconSize` | 图标大小 |
 * | `components.steps.dotSize` | 点状步骤条大小 |
 * | `components.steps.titleFontSize` | 标题字体大小 |
 * | `components.steps.descriptionFontSize` | 描述字体大小 |
 *
 * </details>
 *
 * <details>
 * <summary>全局 Token</summary>
 *
 * | Token Name | Description |
 * | --- | --- |
 * | `colors.borderSecondary` | 次级边框颜色 |
 *
 * </details>
 */
const meta: Meta<typeof Steps> = {
  title: 'Components/Steps',
  component: Steps,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: '步骤条方向',
      table: {
        defaultValue: { summary: 'horizontal' },
      },
    },
    variant: {
      control: 'radio',
      options: ['default', 'dot'],
      description: '步骤条变体',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    status: {
      control: 'select',
      options: ['wait', 'process', 'finish', 'error'],
      description: '当前步骤的状态',
    },
    current: {
      control: { type: 'number', min: 0 },
      description: '当前步骤，从 0 开始',
    },
    labelPlacement: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: '标签位置',
      table: {
        defaultValue: { summary: 'horizontal' },
      },
    },
    children: {
      description: '子元素',
    },
    onChange: {
      description: '点击切换步骤的回调',
    },
    className: {
      description: '自定义类名',
    },
    style: {
      description: '自定义样式',
    },
    items: {
      control: 'object',
      description: '步骤项配置 (数据驱动)',
      table: {
        type: {
          summary: 'StepProps[]',
          detail: `interface StepProps {
  /** 步骤标题 */
  title?: ReactNode
  /** 步骤子标题 */
  subTitle?: ReactNode
  /** 步骤描述 */
  description?: ReactNode
  /** 步骤图标 */
  icon?: ReactNode
  /** 步骤状态 */
  status?: 'wait' | 'process' | 'finish' | 'error'
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: React.CSSProperties
}`,
        },
      },
    },
  },
  args: {
    direction: 'horizontal',
    labelPlacement: 'horizontal',
    status: 'process',
    variant: 'default',
  },
}

export default meta
type Story = StoryObj<typeof Steps>

const items = [
  {
    title: '已完成',
    description: '这里是描述信息',
  },
  {
    title: '进行中',
    description: '这里是描述信息',
    subTitle: '剩余 00:00:08',
  },
  {
    title: '等待中',
    description: '这里是描述信息',
  },
]

/**
 * 基础用法。
 */
export const Basic: Story = {
  args: {
    current: 1,
    items: items,
  },
}

/**
 * 垂直方向的步骤条。
 */
export const Vertical: Story = {
  render: (args) => (
    <div style={{ height: '300px' }}>
      <Steps {...args} />
    </div>
  ),
  args: {
    direction: 'vertical',
    current: 1,
    items: items,
  },
}

/**
 * 使用 error 状态。
 */
export const WithError: Story = {
  args: {
    current: 1,
    status: 'error',
    items: items,
  },
}

/**
 * 自定义图标。
 */
export const CustomIcons: Story = {
  args: {
    current: 1,
    items: [
      {
        title: '登录',
        status: 'finish',
        icon: <InfoIcon />,
      },
      {
        title: '验证',
        status: 'process',
        icon: <LoadingIcon />,
      },
      {
        title: '支付',
        status: 'wait',
      },
      {
        title: '完成',
        status: 'wait',
      },
    ],
  },
}

/**
 * 可点击的步骤条。
 */
export const Clickable: Story = {
  render: () => {
    const [current, setCurrent] = React.useState(0)
    return (
      <Steps
        current={current}
        onChange={setCurrent}
        items={[
          {
            title: '步骤 1',
            description: '可点击',
          },
          {
            title: '步骤 2',
            description: '可点击',
          },
          {
            title: '步骤 3',
            description: '可点击',
          },
        ]}
      />
    )
  },
}

/**
 * 使用 children 渲染步骤。
 */
export const WithChildren: Story = {
  render: (args) => (
    <Steps {...args}>
      <Steps.Step title="步骤 1" description="这里是描述信息。" />
      <Steps.Step title="步骤 2" description="这里是描述信息。" />
      <Steps.Step title="步骤 3" description="这里是描述信息。" />
    </Steps>
  ),
  args: {
    current: 1,
  },
}

/**
 * 标签位置。
 */
export const LabelPlacement: Story = {
  args: {
    current: 1,
    labelPlacement: 'vertical',
    items: items,
  },
}

/**
 * 自定义样式。
 */
export const CustomStyle: Story = {
  args: {
    current: 1,
    items: items,
    className: 'custom-steps-class',
    style: { padding: '24px', border: '1px dashed #ccc', borderRadius: '8px' },
  },
}

/**
 * 点状步骤条。
 */
export const DotStyle: Story = {
  args: {
    current: 1,
    variant: 'dot',
    items: items,
  },
}

/**
 * 自定义主题。
 */
export const CustomTheme: Story = {
  render: (args) => (
    <ConfigProvider
      theme={{
        components: {
          steps: {
            processIconColor: '#722ed1',
            processTitleColor: '#722ed1',
            processDescriptionColor: '#b37feb',
            waitIconColor: '#d9d9d9',
            waitTitleColor: '#d9d9d9',
            waitDescriptionColor: '#d9d9d9',
            finishIconColor: '#eb2f96',
            finishTitleColor: '#eb2f96',
            finishDescriptionColor: '#ffadd2',
            errorIconColor: '#f5222d',
            errorTitleColor: '#f5222d',
            errorDescriptionColor: '#ffccc7',
            iconSize: '26px',
            titleFontSize: '18px',
            descriptionFontSize: '14px',
            titleColor: '#333',
            subTitleColor: '#666',
            descriptionColor: '#999',
            dotSize: '3px', //vertical dot 时才生效
          },
        },
      }}
    >
      <Steps {...args} />
    </ConfigProvider>
  ),
  args: {
    current: 1,
    items: items,
  },
}
