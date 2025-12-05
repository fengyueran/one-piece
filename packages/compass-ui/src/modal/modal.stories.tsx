import type { Meta, StoryObj } from '@storybook/react'
import Modal, { ModalProps } from '.'
import Button from '../button'
import { useState, useEffect } from 'react'
import { ThemeProvider, defaultTheme } from '../theme'

const meta: Meta<typeof Modal> = {
  title: 'Feedback/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A modal dialog component for displaying content that requires user interaction.

### 主题变量
<details>
<summary>组件 Token</summary>

| 变量名称 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| components.modal.maskColor | 遮罩层背景色 | string | rgba(0, 0, 0, 0.45) |
| components.modal.contentBg | 模态框背景色 | string | #ffffff |
| components.modal.borderRadius | 模态框圆角 | string | 8px |
| components.modal.boxShadow | 模态框阴影 | string | ... |
| components.modal.headerPadding | 头部内边距 | string | 16px 24px |
| components.modal.bodyPadding | 内容内边距 | string | 24px |
| components.modal.footerPadding | 底部内边距 | string | 10px 16px |
| components.modal.zIndex | 模态框层级 | number | 1000 |

</details>

<details>
<summary>全局 Token</summary>

| 变量名称 | 描述 | 类型 |
| --- | --- | --- |
| colors.text | 模态框文本颜色 | string |
| colors.textSecondary | 模态框关闭按钮颜色 | string |
| colors.textTertiary | 模态框关闭按钮悬停颜色 | string |
| colors.border | 模态框边框颜色 | string |
| transitions.normal | 模态框过渡效果 | string |

</details>
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      description: 'Whether the modal is open',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    maskVisible: {
      description: 'Whether to show the mask',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    footer: {
      description: 'Custom footer content',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    children: {
      description: 'Modal content',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    className: {
      description: 'Custom class name',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    style: {
      description: 'Custom style',
      control: 'object',
      table: {
        type: { summary: 'CSSProperties' },
      },
    },
    onCancel: {
      description: 'Callback when the modal is closed or cancelled',
      action: 'cancelled',
      table: {
        type: { summary: '() => void' },
      },
    },
    title: {
      description: 'Modal title',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    closable: {
      description: 'Whether to show the close button',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    width: {
      description: 'Width of the modal',
      control: 'text',
      table: {
        type: { summary: 'string | number' },
        defaultValue: { summary: '500px' },
      },
    },
    onOk: {
      description: 'Callback when the OK button is clicked',
      action: 'ok',
      table: {
        type: { summary: '(e: React.MouseEvent<HTMLElement>) => void | Promise<void>' },
      },
    },

    okText: {
      description: 'Text of the OK button',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: '确定' },
      },
    },
    cancelText: {
      description: 'Text of the Cancel button',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: '取消' },
      },
    },
    confirmLoading: {
      description: 'Whether the OK button is loading',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    afterClose: {
      description: 'Callback when the modal is completely closed (after animation)',
      action: 'afterClose',
      table: {
        type: { summary: '() => void' },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Modal>

export const Default: Story = {
  parameters: {
    docs: {
      description: { story: '**基础用法**' },
    },
  },
  render: (args: ModalProps) => {
    const [isOpen, setIsOpen] = useState(args.isOpen || false)

    // Sync isOpen with args when args.isOpen changes (e.g. via Controls)
    useEffect(() => {
      setIsOpen(args.isOpen || false)
    }, [args.isOpen])

    const handleCancel = (e?: React.MouseEvent<HTMLElement>) => {
      setIsOpen(false)
      args.onCancel?.(e)
    }

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal
          {...args}
          isOpen={isOpen}
          onCancel={handleCancel}
          title={args.title || 'Basic Modal'}
        >
          {args.children || (
            <>
              <p>Some contents...</p>
              <p>Some contents...</p>
              <p>Some contents...</p>
            </>
          )}
        </Modal>
      </>
    )
  },
}

export const WithoutMask: Story = {
  parameters: {
    docs: {
      description: { story: '**隐藏遮罩层**' },
    },
  },
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal without Mask</Button>
        <Modal isOpen={isOpen} onCancel={() => setIsOpen(false)} maskVisible={false}>
          <p>This modal has no mask.</p>
        </Modal>
      </>
    )
  },
}

export const WithTitleAndClose: Story = {
  parameters: {
    docs: {
      description: { story: '**带标题和关闭按钮**' },
    },
  },
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    const handleCancel = (e?: React.MouseEvent<HTMLElement>) => {
      setIsOpen(false)
      console.log('Cancel clicked')
    }

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal with Title</Button>
        <Modal isOpen={isOpen} onCancel={handleCancel} title="Basic Modal" closable={true}>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </>
    )
  },
}

export const CustomFooter: Story = {
  parameters: {
    docs: {
      description: { story: '**自定义页脚**' },
    },
  },
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal with Custom Footer</Button>
        <Modal
          isOpen={isOpen}
          onCancel={() => setIsOpen(false)}
          footer={
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px',
                padding: '16px 24px',
              }}
            >
              <Button onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setIsOpen(false)}>
                Submit
              </Button>
            </div>
          }
        >
          <p>This modal has a custom footer.</p>
        </Modal>
      </>
    )
  },
}

export const CustomStyle: Story = {
  parameters: {
    docs: {
      description: { story: '**自定义样式**' },
    },
  },
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    const handleCancel = (e?: React.MouseEvent<HTMLElement>) => {
      setIsOpen(false)
      console.log('Cancel clicked')
    }

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Custom Styled Modal</Button>
        <Modal
          isOpen={isOpen}
          onCancel={handleCancel}
          style={{ top: '20px' }}
          className="custom-modal-class"
        >
          <p>This modal has custom styles (top: 20px) and class name.</p>
        </Modal>
      </>
    )
  },
}

export const StaticMethods: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**静态方法**

\`Modal.info\`, \`Modal.success\`, \`Modal.error\`, \`Modal.warning\`, \`Modal.confirm\`
        `,
      },
    },
  },
  render: () => {
    const showInfo = () => {
      Modal.info({
        title: 'This is a notification message',
        content: (
          <div>
            <p>some messages...some messages...</p>
            <p>some messages...some messages...</p>
          </div>
        ),
        onOk() {},
      })
    }

    const showSuccess = () => {
      Modal.success({
        title: 'This is a success message',
        content: 'some messages...some messages...',
      })
    }

    const showError = () => {
      Modal.error({
        title: 'This is an error message',
        content: 'some messages...some messages...',
      })
    }

    const showWarning = () => {
      Modal.warning({
        title: 'This is a warning message',
        content: 'some messages...some messages...',
      })
    }

    const showConfirm = () => {
      Modal.confirm({
        title: 'Do you want to delete these items?',
        content: 'When clicked the OK button, this dialog will be closed after 1 second',
        onOk() {
          return new Promise<void>((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
          }).catch(() => console.log('Oops errors!'))
        },
        onCancel() {},
      })
    }

    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button onClick={showInfo}>Info</Button>
        <Button onClick={showSuccess}>Success</Button>
        <Button onClick={showError}>Error</Button>
        <Button onClick={showWarning}>Warning</Button>
        <Button onClick={showConfirm}>Confirm</Button>
      </div>
    )
  },
}

export const UseModal: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Hook 用法 (推荐)**

使用 \`useModal\` Hook 可以获取上下文（Context），支持动态主题和国际化。
        `,
      },
    },
  },
  render: () => {
    const [modal, contextHolder] = Modal.useModal()

    const showConfirm = () => {
      modal.confirm({
        title: 'Do you want to delete these items?',
        content: 'When clicked the OK button, this dialog will be closed after 1 second',
        onOk() {
          return new Promise<void>((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
          }).catch(() => console.log('Oops errors!'))
        },
      })
    }

    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {contextHolder}
        <Button onClick={() => modal.info({ title: 'Info', content: 'Info content' })}>Info</Button>
        <Button onClick={() => modal.success({ title: 'Success', content: 'Success content' })}>
          Success
        </Button>
        <Button onClick={() => modal.error({ title: 'Error', content: 'Error content' })}>
          Error
        </Button>
        <Button onClick={() => modal.warning({ title: 'Warning', content: 'Warning content' })}>
          Warning
        </Button>
        <Button onClick={showConfirm}>Confirm</Button>
      </div>
    )
  },
}

export const DynamicTheme: Story = {
  parameters: {
    docs: {
      description: { story: '**动态主题**' },
    },
  },
  render: () => {
    const [theme, setTheme] = useState({
      ...defaultTheme,
      colors: {
        ...defaultTheme.colors,
        primary: '#1677ff',
      },
    })

    const toggleTheme = () => {
      setTheme((prev) => ({
        ...prev,
        colors: {
          ...prev.colors,
          primary: prev.colors.primary === '#1677ff' ? '#722ed1' : '#1677ff',
        },
      }))
    }

    const [modal, contextHolder] = Modal.useModal()

    const showInfo = () => {
      modal.info({
        title: 'Theme Check',
        content: (
          <div>
            <p>The OK button color should match the current theme primary color.</p>
            <p>Current Primary Color: {theme.colors.primary}</p>
          </div>
        ),
        onOk() {},
      })
    }

    return (
      <ThemeProvider theme={theme}>
        <div style={{ padding: 20, border: '1px solid #eee' }}>
          <h3>Dynamic Theme Context Test</h3>
          <div style={{ marginBottom: 16 }}>
            <Button onClick={toggleTheme}>
              Toggle Theme (Current: {theme.colors.primary === '#1677ff' ? 'Blue' : 'Purple'})
            </Button>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {contextHolder}
            <Button onClick={showInfo}>Open Modal</Button>
          </div>
        </div>
      </ThemeProvider>
    )
  },
}

export const AsyncConfirm: Story = {
  parameters: {
    docs: {
      description: { story: '**异步确认 (Modal.confirm)**' },
    },
  },
  render: () => {
    const showConfirm = () => {
      Modal.confirm({
        title: 'Do you want to delete these items?',
        content: 'When clicked the OK button, this dialog will be closed after 2 seconds',
        onOk() {
          return new Promise<void>((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 2000)
          }).catch(() => console.log('Oops errors!'))
        },
        onCancel() {},
      })
    }

    return <Button onClick={showConfirm}>Async Confirm</Button>
  },
}

export const ModalAsync: Story = {
  parameters: {
    docs: {
      description: { story: '**异步确认 (Modal 组件)**' },
    },
  },
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)

    const handleOk = () => {
      setConfirmLoading(true)
      setTimeout(() => {
        setIsOpen(false)
        setConfirmLoading(false)
      }, 2000)
    }

    const handleCancel = () => {
      console.log('Clicked cancel button')
      setIsOpen(false)
    }

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal with Async Logic</Button>
        <Modal
          title="Title"
          isOpen={isOpen}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
        >
          <p>The OK button will show loading state for 2 seconds.</p>
        </Modal>
      </>
    )
  },
}

export const ModalAsyncAuto: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '**自动异步确认 (Modal 组件)**\n\n如果 onOk 返回 Promise，组件会自动处理 loading 状态。',
      },
    },
  },
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    const handleOk = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsOpen(false)
    }

    const handleCancel = () => {
      setIsOpen(false)
    }

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal with Auto Async</Button>
        <Modal title="Title" isOpen={isOpen} onOk={handleOk} onCancel={handleCancel}>
          <p>The OK button will automatically show loading state because onOk returns a Promise.</p>
        </Modal>
      </>
    )
  },
}

export const CustomTheme: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <ThemeProvider
        theme={{
          components: {
            modal: {
              borderRadius: '20px',
              headerPadding: '20px 30px',
              bodyPadding: '30px',
              footerPadding: '15px 30px',
              maskColor: 'rgba(100, 0, 100, 0.5)',
            },
          },
        }}
      >
        <Button onClick={() => setIsOpen(true)}>Open Custom Theme Modal</Button>
        <Modal isOpen={isOpen} onCancel={() => setIsOpen(false)} title="Custom Theme Modal">
          <p>This modal uses custom theme tokens.</p>
        </Modal>
      </ThemeProvider>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '**自定义主题**',
      },
    },
  },
}
