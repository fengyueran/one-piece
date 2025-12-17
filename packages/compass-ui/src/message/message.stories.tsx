import type { Meta, StoryObj } from '@storybook/react'
import message, { MessageProps } from './index'
import Button from '../button'
import ConfigProvider from '../config-provider'

const meta: Meta = {
  title: 'Feedback/Message',
  component: undefined,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
全局展示操作反馈信息。

### 主题变量
<details>
<summary>组件 Token</summary>

| 变量名称 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| components.message.contentPadding | 消息内容内边距 | string | 8px 16px |
| components.message.borderRadius | 消息内容圆角 | string | 8px |
| components.message.boxShadow | 消息阴影 | string | ... |
| components.message.zIndex | 消息层级 | number | 1010 |

</details>

<details>
<summary>全局 Token</summary>

| 变量名称 | 描述 | 类型 |
| --- | --- | --- |
| spacing.md | 消息容器顶部距离 | number |
| fontSize.sm | 消息文本字体大小 | number |
| lineHeight.normal | 消息文本行高 | number |
| fontSize.md | 图标字体大小 | number |
| transitions.slow | 消息进出动画过渡 | string |
| colors.background | 消息背景色 | string |
| colors.text | 消息文本颜色 | string |
| colors.primary | 信息图标颜色 | string |
| colors.success | 成功图标颜色 | string |
| colors.error | 错误图标颜色 | string |
| colors.warning | 警告图标颜色 | string |

</details>

### 何时使用

- 可提供成功、警告和错误等反馈信息。
- 顶部居中显示并自动消失，是一种不打断用户操作的轻量级提示方式。

### API

组件提供了一些静态方法，使用方式和参数如下：

- \`message.success(content, [duration], onClose)\`
- \`message.error(content, [duration], onClose)\`
- \`message.info(content, [duration], onClose)\`
- \`message.warning(content, [duration], onClose)\`
- \`message.loading(content, [duration], onClose)\`

也可以对象的形式传递参数：

- \`message.open(config)\`
- \`message.success(config)\`
- \`message.error(config)\`
- \`message.info(config)\`
- \`message.warning(config)\`
- \`message.loading(config)\`

\`config\` 对象属性如下：
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    content: {
      description: 'Content of the message',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    duration: {
      description: "Time(seconds) before auto-dismiss, don't dismiss if set to 0",
      control: 'number',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '3' },
      },
    },
    type: {
      description: 'Type of message',
      control: 'select',
      options: ['info', 'success', 'error', 'warning', 'loading'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'info' },
      },
    },
    onClose: {
      description: 'Callback when the message is closed',
      table: {
        type: { summary: '() => void' },
      },
    },
    icon: {
      description: 'Customized icon',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    key: {
      description: 'Unique ID for the message',
      control: 'text',
      table: {
        disable: true,
      },
    },
    className: {
      description: 'Custom CSS class',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    style: {
      description: 'Custom CSS style',
      control: 'object',
      table: {
        type: { summary: 'CSSProperties' },
      },
    },
  },
}

export default meta
type Story = StoryObj

const BasicMessageWrapper = (args: MessageProps) => (
  <Button onClick={() => message.open(args)}>Display normal message</Button>
)

export const Basic: Story = {
  args: {
    content: 'This is a normal message',
    duration: 3,
    type: 'info',
  },
  render: (args: any) => <BasicMessageWrapper {...args} />,
}

export const Types: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button onClick={() => message.info('This is a normal message')}>Info</Button>
      <Button onClick={() => message.success('This is a success message')}>Success</Button>
      <Button onClick={() => message.error('This is an error message')}>Error</Button>
      <Button onClick={() => message.warning('This is a warning message')}>Warning</Button>
      <Button onClick={() => message.loading('This is a loading message')}>Loading</Button>
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <Button onClick={() => message.loading('Action in progress..', 2.5)}>
      Display loading indicator
    </Button>
  ),
}

export const CustomDuration: Story = {
  render: () => (
    <Button onClick={() => message.info('This message will stay for 10 seconds', 10)}>
      Customized display duration
    </Button>
  ),
}

export const LongText: Story = {
  render: () => (
    <Button
      onClick={() =>
        message.info(
          'This is a very long message that should demonstrate how the component handles large amounts of text. It might wrap to multiple lines or expand the container width depending on the implementation. We want to ensure it looks good and readable even with verbose content like this.',
        )
      }
    >
      Display long message
    </Button>
  ),
}

export const Hooks: Story = {
  parameters: {
    docs: {
      description: {
        story: '**Hook 用法**\n\n使用 `useMessage` Hook 可以获取上下文（Context），支持动态主题。',
      },
    },
  },
  render: () => {
    const [messageApi, contextHolder] = message.useMessage()

    return (
      <>
        {contextHolder}
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button onClick={() => messageApi.info('Info message')}>Info</Button>
          <Button onClick={() => messageApi.success('Success message')}>Success</Button>
          <Button onClick={() => messageApi.error('Error message')}>Error</Button>
          <Button onClick={() => messageApi.warning('Warning message')}>Warning</Button>
        </div>
      </>
    )
  },
}

export const FullConfig: Story = {
  render: () => (
    <Button
      onClick={() =>
        message.open({
          content: 'This is a message with full configuration',
          type: 'success',
          duration: 5,
          icon: <span style={{ fontSize: 20 }}>🎉</span>,
          className: 'custom-message-class',
          style: { marginTop: '20vh', border: '1px solid #b7eb8f' },
          onClose: () => console.log('Message closed'),
        })
      }
    >
      Display full config message
    </Button>
  ),
}

const CustomThemeWrapper = () => {
  const [messageApi, contextHolder] = message.useMessage()
  return (
    <>
      {contextHolder}
      <Button onClick={() => messageApi.success('Custom Theme Message')}>
        Display Custom Theme Message
      </Button>
    </>
  )
}

export const CustomTheme: Story = {
  render: () => (
    <ConfigProvider
      theme={{
        components: {
          message: {
            contentPadding: '12px 24px',
            borderRadius: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          },
        },
      }}
    >
      <CustomThemeWrapper />
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
