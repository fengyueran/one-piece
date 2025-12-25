import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import type { RuleItem } from 'async-validator'
import Form from './index'
import type { ValidateErrorEntity, FieldData } from './types'
import Button from '../button'
import InputField from '../input-field'
import InputNumber from '../input-number'
import { ThemeProvider } from '../theme'

const meta: Meta<typeof Form> = {
  title: 'Components/Form',
  component: Form,
  subcomponents: { FormItem: Form.Item as React.ComponentType<any> },
  tags: ['autodocs'],
  argTypes: {
    form: {
      description: `表单控制实例，通过 \`Form.useForm()\` 创建。

<details>
<summary><strong>FormInstance 方法列表</strong></summary>

| 方法 | 说明 | 类型 |
|------|------|------|
| \`getFieldValue\` | 获取单个字段值 | \`(name: string) => unknown\` |
| \`getFieldsValue\` | 获取所有字段值 | \`() => Values\` |
| \`setFieldValue\` | 设置单个字段值 | \`(name: string, value: unknown) => void\` |
| \`setFieldsValue\` | 设置多个字段值 | \`(values: Partial<Values>) => void\` |
| \`setFields\` | 设置字段状态（值+错误） | \`(fields: FieldData[]) => void\` |
| \`getFieldError\` | 获取单个字段的错误 | \`(name: string) => string[]\` |
| \`resetFields\` | 重置字段到初始值 | \`(fields?: string[]) => void\` |
| \`validateFields\` | 触发表单验证 | \`(nameList?: string[]) => Promise<Values>\` |
| \`submit\` | 提交表单 | \`() => void\` |
| \`isFieldTouched\` | 检查字段是否被修改过 | \`(name: string) => boolean\` |
| \`isFieldsTouched\` | 检查多个字段是否被修改过 | \`(nameList?: string[]) => boolean\` |
| \`isFieldValidating\` | 检查字段是否正在验证 | \`(name: string) => boolean\` |

</details>`,
      table: {
        type: { summary: 'FormInstance' },
        defaultValue: { summary: 'undefined（内部自动创建）' },
      },
      control: false,
    },
    initialValues: {
      description: '表单初始值',
      table: {
        type: { summary: 'Record<string, unknown>' },
        defaultValue: { summary: 'undefined' },
      },
      control: { type: 'object' },
    },
    onFinish: {
      description: '提交表单且数据验证通过后的回调函数',
      table: {
        type: { summary: '(values: Record<string, unknown>) => void' },
      },
      control: false,
    },
    onFinishFailed: {
      description: '提交表单且数据验证失败后的回调函数，接收错误信息对象',
      table: {
        type: {
          summary:
            '(errorInfo: { values: Record<string, unknown>, errorFields: Array<{ name: string, errors: string[] }> }) => void',
        },
      },
      control: false,
    },
    onValuesChange: {
      description: '字段值更新时触发的回调，参数为变更的字段和所有字段值',
      table: {
        type: { summary: '(changedValues: Record<string, unknown>, values: Values) => void' },
      },
      control: false,
    },
    className: {
      description: '自定义类名',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
      control: { type: 'text' },
    },
    style: {
      description: '自定义样式',
      table: {
        type: { summary: 'React.CSSProperties' },
        defaultValue: { summary: 'undefined' },
      },
      control: { type: 'object' },
    },
    children: {
      description: '表单内容',
      table: {
        type: { summary: 'ReactNode' },
      },
      control: false,
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
高性能表单组件，用于数据收集、验证和提交。

## 特性

- **高性能**：采用 Field 级别的状态管理，输入时仅触发当前 Field 更新，不会导致整个 Form 重渲染。
- **数据管理**：通过 \`Form.useForm\` 钩子轻松获取、设置和验证表单数据。
- **验证**：内置 async-validator，支持声明式验证规则。
- **布局**：提供灵活的布局能力。

## 何时使用

- 需要收集用户数据时。
- 需要对用户输入进行验证时。

## 主题变量 (Design Token)

<details>
<summary>组件 Token</summary>

| Token Name | Description | Default Value |
| --- | --- | --- |
| \`components.form.itemMarginBottom\` | 表单项下间距 | 0px |
| \`components.form.labelMarginBottom\` | 标签下间距 | 8px |
| \`components.form.labelFontSize\` | 标签字体大小 | 14px |
| \`components.form.labelColor\` | 标签颜色 | rgba(0, 0, 0, 0.88) |
| \`components.form.errorColor\` | 错误信息颜色 | #ff4d4f |
| \`components.form.errorFontSize\` | 错误信息字体大小 | 12px |
| \`components.form.errorMarginTop\` | 错误信息上间距 | 4px |
| \`components.form.errorMarginBottom\` | 错误信息下间距 | 8px |

</details>

<details>
<summary>全局 Token</summary>

暂无直接引用的全局 Token。

</details>
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Form>

export const Basic: Story = {
  render: () => {
    const [form] = Form.useForm()

    const onFinish = (values: Record<string, unknown>) => {
      console.log('Success:', values)
      alert(JSON.stringify(values, null, 2))
    }

    const onFinishFailed = (errorInfo: ValidateErrorEntity) => {
      console.log('Failed:', errorInfo)
    }

    return (
      <Form
        form={form}
        initialValues={{ username: 'admin' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <InputField placeholder="Username" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <InputField type="password" placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </Form.Item>
      </Form>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '最基础的表单用法，包含数据收集、验证和提交。',
      },
    },
  },
}

export const Validation: Story = {
  render: () => {
    const [form] = Form.useForm()

    return (
      <Form
        form={form}
        onFinish={(values) => alert(JSON.stringify(values, null, 2))}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Invalid email format' },
          ]}
        >
          <InputField placeholder="example@email.com" />
        </Form.Item>

        <Form.Item
          label="Age"
          name="age"
          rules={[
            { required: true, message: 'Age is required' },
            {
              validator: (_rule: unknown, value: unknown) => {
                if (value && Number(value) < 18) {
                  return Promise.reject(new Error('You must be at least 18 years old'))
                }
                return Promise.resolve()
              },
            } as unknown as RuleItem,
          ]}
        >
          <InputNumber placeholder="Age" />
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button type="submit" variant="primary">
              Submit
            </Button>
            <Button onClick={() => form.resetFields()}>Reset</Button>
          </div>
        </Form.Item>
      </Form>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '支持多种验证规则，包括必填、类型检查（如 email）、自定义 validator 函数等。',
      },
    },
  },
}

export const DynamicMethods: Story = {
  render: () => {
    const [form] = Form.useForm()

    return (
      <Form
        form={form}
        style={{ maxWidth: 600 }}
        onValuesChange={(changed, all) => console.log('Changed:', changed, 'All:', all)}
      >
        <Form.Item label="Field A" name="fieldA">
          <InputField placeholder="Type something..." />
        </Form.Item>
        <Form.Item label="Field B" name="fieldB">
          <InputField placeholder="Type something..." />
        </Form.Item>
        <div style={{ marginBottom: 16 }}>
          <Button
            onClick={() => {
              form.setFieldsValue({
                fieldA: 'Hello',
                fieldB: 'World',
              })
            }}
          >
            Set Values (Hello World)
          </Button>
          <Button onClick={() => console.log(form.getFieldsValue())} style={{ marginLeft: 8 }}>
            Log Values
          </Button>
        </div>
      </Form>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          '演示如何使用 `form` 实例方法动态设置值 (`setFieldsValue`) 和获取值 (`getFieldsValue`)。',
      },
    },
  },
}

export const CustomTheme: Story = {
  render: () => {
    const BasicForm = () => {
      const [form] = Form.useForm()

      return (
        <Form form={form} initialValues={{ username: 'admin' }} style={{ maxWidth: 600 }}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <InputField placeholder="Username" />
          </Form.Item>
        </Form>
      )
    }
    return (
      <ThemeProvider
        theme={{
          components: {
            form: {
              labelColor: '#1890ff',
              labelFontSize: '16px',
              itemMarginBottom: '32px',
            },
          },
        }}
      >
        <BasicForm />
      </ThemeProvider>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '**自定义主题** - 通过 ThemeProvider 覆盖主题变量。例如修改标签颜色和字体大小。',
      },
    },
  },
}

export const FieldSubscription: Story = {
  render: () => {
    const [form] = Form.useForm()
    const [canSend, setCanSend] = React.useState(false)

    // Update button state when fields change
    const onFieldsChange = (_: FieldData[], allFields: FieldData[]) => {
      const emailField = allFields.find((f) => f.name === 'email')
      const emailValue = emailField?.value
      const emailErrors = emailField?.errors || []

      // Enable if value exists and no errors
      const isValid = !!emailValue && emailErrors.length === 0
      setCanSend(isValid)
    }

    return (
      <Form form={form} onFieldsChange={onFieldsChange} style={{ maxWidth: 600 }}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Invalid email format' },
          ]}
        >
          <InputField placeholder="example@email.com" />
        </Form.Item>

        <Form.Item>
          <Button variant="primary" disabled={!canSend} onClick={() => alert('Sent!')}>
            Send Email
          </Button>
        </Form.Item>
        <div>Current Status: {canSend ? 'Ready to send' : 'Invalid or empty email'}</div>
      </Form>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          '演示如何通过 `onFieldsChange` 监听字段变化（包括值和错误状态），实现"验证通过后启用按钮"的需求。',
      },
    },
  },
}

export const OnFieldsChange: Story = {
  render: () => {
    const [form] = Form.useForm()
    const [logs, setLogs] = React.useState<string[]>([])

    const onFieldsChange = (changedFields: FieldData[], allFields: FieldData[]) => {
      const changed = changedFields.map(
        (f) =>
          `${f.name}: value=${f.value}, errors=${JSON.stringify(f.errors)}, touched=${f.touched}, validating=${f.validating}`,
      )
      setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${changed.join(', ')}`, ...prev])
      console.log('Changed:', changedFields, 'All:', allFields)
    }

    return (
      <Form form={form} onFieldsChange={onFieldsChange} style={{ maxWidth: 600 }}>
        <Form.Item label="Username" name="username" rules={[{ required: true }]}>
          <InputField placeholder="Username" />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, min: 6 }]}>
          <InputField type="password" placeholder="Password (min 6 chars)" />
        </Form.Item>
        <div
          style={{
            marginTop: 20,
            padding: 10,
            background: '#f5f5f5',
            maxHeight: 200,
            overflowY: 'auto',
          }}
        >
          <h4>Change Log:</h4>
          {logs.map((log, index) => (
            // eslint-disable-next-line
            <div key={index} style={{ fontSize: 12, marginBottom: 4 }}>
              {log}
            </div>
          ))}
        </div>
      </Form>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          '演示 `onFieldsChange` 回调的详细信息。每次字段变化（值改变、验证开始、验证结束）都会触发该回调。',
      },
    },
  },
}

export const UseWatch: Story = {
  render: () => {
    const [form] = Form.useForm()

    const WatchComponent = () => {
      const nameValue = Form.useWatch('name', form)
      const ageValue = Form.useWatch('age', form)

      return (
        <div style={{ padding: 12, background: '#f5f5f5', marginTop: 16 }}>
          <p>
            Name: <strong>{String(nameValue)}</strong>
          </p>
          <p>
            Age: <strong>{String(ageValue)}</strong>
          </p>
        </div>
      )
    }

    return (
      <Form form={form} style={{ maxWidth: 600 }}>
        <Form.Item label="Name" name="name">
          <InputField placeholder="Enter name" />
        </Form.Item>
        <Form.Item label="Age" name="age">
          <InputNumber placeholder="Enter age" />
        </Form.Item>
        <WatchComponent />
      </Form>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          '演示使用 `Form.useWatch` 钩子监听字段值的变化。这种方式可以仅重新渲染依赖该值的组件，而不是整个 Form。',
      },
    },
  },
}
