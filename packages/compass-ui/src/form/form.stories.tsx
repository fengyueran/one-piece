import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import Form, { type RuleItem } from './index'
import type { ValidateErrorEntity, FieldData } from './types'
import Button from '../button'
import InputField from '../input-field'
import InputNumber from '../input-number'
import { ThemeProvider } from '../theme'

const meta: Meta<typeof Form> = {
  title: 'Components/Form',
  component: Form,
  subcomponents: { FormItem: Form.Item },
  tags: ['autodocs'],
  argTypes: {
    // FormItem props (for documentation)
    // @ts-expect-error - Adding subcomponent props for documentation
    'FormItem.rules': {
      name: 'rules',
      control: 'object',
      description: '校验规则',
      table: {
        category: 'Form.Item',
        type: {
          summary: 'RuleItem[]',
          detail: `interface RuleItem {
  /** 验证错误信息 */
  message?: string | ReactElement
  /** 值类型 */
  type?: 'string' | 'number' | 'boolean' | 'email' | 'url' | 'date' | 'array' | 'object' | ...
  /** 是否必填 */
  required?: boolean
  /** 正则表达式 */
  pattern?: RegExp
  /** 最小长度/值 */
  min?: number
  /** 最大长度/值 */
  max?: number
  /** 确定长度 */
  len?: number
  /** 枚举值验证 */
  enum?: any[]
  /** 忽略空格 */
  whitespace?: boolean
  /** 自定义校验函数 */
  validator?: (rule: RuleItem, value: unknown, callback: (error?: string | Error) => void) => Promise<void> | void
  /** 转换值 */
  transform?: (value: unknown) => unknown
}`,
        },
      },
    },
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
            {
              type: 'email',
              message:
                'Invalid email format的说法啊啊啊啊啊啊啊啊啊啊AA啊啊啊啊啊的说法啊啊啊啊啊啊啊啊啊啊',
            },
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
            <Button type="button" onClick={() => form.resetFields()}>
              Reset
            </Button>
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

export const ErrorMessageLayout: Story = {
  render: () => {
    const [form] = Form.useForm()

    return (
      <Form
        form={form}
        onFinish={(values) => alert(JSON.stringify(values, null, 2))}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="Long Error Message"
          name="longError"
          help="This is a very long error message that should wrap to the next line instead of overflowing the container or pushing the layout incorrectly. It demonstrates the text wrapping capability of the error message component."
        >
          <InputField status="error" placeholder="Field with long error" />
        </Form.Item>

        <Form.Item
          label="Custom Help Message"
          name="customHelp"
          help={
            <span style={{ color: 'orange' }}>
              Warning: This is a custom help message with custom styling.
            </span>
          }
        >
          <InputField status="warning" placeholder="Field with custom help" />
        </Form.Item>

        <Form.Item label="No Error (Normal Layout)" name="normal">
          <InputField placeholder="Normal field" />
        </Form.Item>
      </Form>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '展示 `help` 属性的使用，以及长文本错误信息的自动换行效果。',
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

export const InitialValues: Story = {
  render: () => {
    const [form] = Form.useForm()

    return (
      <Form
        form={form}
        initialValues={{
          username: 'existing_user',
          role: 'editor',
          notifications: true,
        }}
        onFinish={(values) => alert(JSON.stringify(values, null, 2))}
        style={{ maxWidth: 600 }}
      >
        <Form.Item label="Username" name="username">
          <InputField />
        </Form.Item>
        <Form.Item label="Role" name="role">
          <InputField />
        </Form.Item>
        <Form.Item label="Notifications" name="notifications">
          {/* Mocking a switch or checkbox with InputField for simplicity, though Checkbox is preferred if available */}
          <InputField placeholder="true/false" />
        </Form.Item>
        <Form.Item>
          <div style={{ gap: 8, display: 'flex' }}>
            <Button type="submit" variant="primary">
              Submit
            </Button>
            <Button onClick={() => form.resetFields()}>Reset to Initial</Button>
          </div>
        </Form.Item>
      </Form>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          '演示 `initialValues` 属性的使用。表单初始化时会使用这些值，调用 `resetFields` 也会重置回这些值。',
      },
    },
  },
}

export const Submission: Story = {
  render: () => {
    const [form] = Form.useForm()

    const onFinish = (values: Record<string, unknown>) => {
      alert(`Submission Success:\n${JSON.stringify(values, null, 2)}`)
    }

    const onFinishFailed = (errorInfo: ValidateErrorEntity) => {
      alert(`Submission Failed:\nCheck console for details`)
      console.error('Validation Failed:', errorInfo)
    }

    return (
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="Required Field"
          name="required"
          rules={[{ required: true, message: 'This field is required!' }]}
        >
          <InputField placeholder="Try empty submission..." />
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
        story:
          '演示 `onFinish` (验证通过) 和 `onFinishFailed` (验证失败) 的处理。尝试直接提交可以看到失败回调的效果。',
      },
    },
  },
}

export const ValuesChange: Story = {
  render: () => {
    const [form] = Form.useForm()
    const [lastChange, setLastChange] = React.useState<string>('')

    const onValuesChange = (
      changedValues: Record<string, unknown>,
      allValues: Record<string, unknown>,
    ) => {
      const changedKey = Object.keys(changedValues)[0]
      const msg = `Field '${changedKey}' changed to '${changedValues[changedKey]}'. Current form state: ${JSON.stringify(allValues)}`
      setLastChange(msg)
      console.log('Values Changed:', changedValues, allValues)
    }

    return (
      <Form form={form} onValuesChange={onValuesChange} style={{ maxWidth: 600 }}>
        <Form.Item label="Project Name" name="projectName">
          <InputField placeholder="Type here..." />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <InputField placeholder="Type here..." />
        </Form.Item>
        {lastChange && (
          <div
            style={{ padding: '8px 12px', background: '#f0f5ff', borderRadius: 4, marginTop: 16 }}
          >
            {lastChange}
          </div>
        )}
      </Form>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '演示 `onValuesChange` 属性。只要表单内任意字段值发生改变，该回调就会被触发。',
      },
    },
  },
}

export const Styling: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Form style={{ border: '1px solid #d9d9d9', padding: 24, borderRadius: 8, maxWidth: 600 }}>
        <h4>Using `style`</h4>
        <Form.Item label="Input" name="input1">
          <InputField />
        </Form.Item>
      </Form>

      <style>{`
        .custom-form-class {
          background: #fafafa;
          padding: 24px;
          border-radius: 12px;
          border: 1px dashed #1890ff;
          max-width: 600px;
        }
        .custom-form-class .compass-form-item-label {
          color: #1890ff;
          font-weight: bold;
        }
      `}</style>
      <Form className="custom-form-class">
        <h4>Using `className`</h4>
        <Form.Item label="Styled Label" name="input2">
          <InputField />
        </Form.Item>
      </Form>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '演示 `className` 和 `style` 属性的使用。可以方便地进行自定义布局和样式覆盖。',
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

export const MethodsData: Story = {
  render: () => {
    const [form] = Form.useForm()

    return (
      <Form form={form} style={{ maxWidth: 600 }}>
        <Form.Item label="Field A" name="a">
          <InputField />
        </Form.Item>
        <Form.Item label="Field B" name="b">
          <InputField />
        </Form.Item>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button onClick={() => form.setFieldValue('a', 'Value A')}>Set A</Button>
            <Button
              onClick={() =>
                form.setFieldsValue({
                  a: 'Value A (Group)',
                  b: 'Value B (Group)',
                })
              }
            >
              Set All
            </Button>
            <Button onClick={() => alert(form.getFieldValue('a'))}>Get A</Button>
            <Button onClick={() => alert(JSON.stringify(form.getFieldsValue(), null, 2))}>
              Get All
            </Button>
          </div>
        </div>
      </Form>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          '**数据操作方法**：\n- `setFieldValue(name, value)`: 设置单个字段值。\n- `setFieldsValue(values)`: 设置多个字段值。\n- `getFieldValue(name)`: 获取单个字段值。\n- `getFieldsValue()`: 获取所有字段值。',
      },
    },
  },
}

export const MethodsStatus: Story = {
  render: () => {
    const [form] = Form.useForm()
    const [, forceUpdate] = React.useState({})

    // Force update to show status in real-time for demonstration
    const checkStatus = () => forceUpdate({})

    return (
      <Form
        form={form}
        onValuesChange={checkStatus}
        onFieldsChange={checkStatus}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true },
            {
              validator: async (_: unknown, value: unknown) => {
                if (value === 'loading') {
                  await new Promise((resolve) => setTimeout(resolve, 2000))
                }
                return Promise.resolve()
              },
            } as unknown as RuleItem,
          ]}
        >
          <InputField placeholder="Type 'loading' to see validating state" />
        </Form.Item>
        <div style={{ padding: 12, background: '#f5f5f5', marginTop: 16 }}>
          <p>
            <strong>{`isFieldTouched('username')`}:</strong>{' '}
            {String(form.isFieldTouched('username'))}
          </p>
          <p>
            <strong>isFieldsTouched():</strong> {String(form.isFieldsTouched())}
          </p>
          <p>
            <strong>{`getFieldError('username')`}:</strong>{' '}
            {JSON.stringify(form.getFieldError('username'))}
          </p>
          <p>
            <strong>{`isFieldValidating('username')`}:</strong>{' '}
            {String(form.isFieldValidating('username'))}
          </p>
        </div>
        <Button onClick={checkStatus} style={{ marginTop: 8 }}>
          Refresh Status
        </Button>
      </Form>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          '**状态查询方法**：\n- `isFieldTouched(name)`: 字段是否被操作过。\n- `isFieldsTouched()`: 任意字段是否被操作过。\n- `getFieldError(name)`: 获取字段错误信息。\n- `isFieldValidating(name)`: 字段是否正在验证中。',
      },
    },
  },
}

export const MethodsOperations: Story = {
  render: () => {
    const [form] = Form.useForm()

    return (
      <Form form={form} style={{ maxWidth: 600 }}>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
          <InputField />
        </Form.Item>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
          <Button
            onClick={() => {
              form
                .validateFields()
                .then((values) => alert(`Valid: ${JSON.stringify(values)}`))
                .catch((err) => console.error('Validation failed:', err))
            }}
          >
            Validate
          </Button>
          <Button onClick={() => form.submit()}>Submit (Trigger onFinish)</Button>
          <Button type="button" onClick={() => form.resetFields()}>
            Reset
          </Button>
          <Button
            onClick={() => {
              form.setFields([
                {
                  name: 'email',
                  value: 'invalid-email',
                  errors: ['Manually set error'],
                },
              ])
            }}
          >
            Set Fields (Manual Error)
          </Button>
        </div>
      </Form>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          '**操作方法**：\n- `validateFields()`: 触发验证，返回 Promise。\n- `submit()`: 提交表单（触发 onFinish/onFinishFailed）。\n- `resetFields()`: 重置表单。\n- `setFields()`: 手动设置字段状态（包括值和错误）。',
      },
    },
  },
}

export const LayoutOnly: Story = {
  render: () => {
    const [form] = Form.useForm()

    const onFinish = (values: any) => {
      console.log('Success:', values)
      alert(JSON.stringify(values, null, 2))
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {/* Scenario 1: Inside Form but without name (Pure Layout) */}
        <div>
          <h3>1. 纯布局模式（无 Name 属性）</h3>
          <p>
            当省略 <code>name</code> 属性时，<code>Form.Item</code>{' '}
            仅作为布局容器使用。它与其他表单项对齐，但不参与数据管理。
          </p>
          <Form form={form} onFinish={onFinish} style={{ maxWidth: 600 }}>
            <Form.Item label="用户名" name="username" rules={[{ required: true }]}>
              <InputField />
            </Form.Item>

            {/* Pure Layout Item */}
            <Form.Item label="提示">
              <span style={{ lineHeight: '32px', color: '#666' }}>
                这是一段与表单项对齐的静态文本，它不是表单数据的一部分。
              </span>
            </Form.Item>

            <Form.Item>
              <Button type="submit" variant="primary">
                提交
              </Button>
            </Form.Item>
          </Form>
        </div>

        {/* Scenario 2: Standalone Usage (No Context) */}
        <div>
          <h3>2. 独立使用（无 Form Context）</h3>
          <p>
            <code>Form.Item</code> 可以独立于 <code>Form</code> 组件使用，用于复用 Label 和 Input
            的布局样式。
          </p>
          <div style={{ border: '1px dashed #ccc', padding: '20px' }}>
            <Form.Item label="独立输入框">
              <InputField placeholder="我是独立的" />
            </Form.Item>
            <Form.Item label="独立选择框">
              <select style={{ width: '100%', height: '32px' }}>
                <option>选项 1</option>
                <option>选项 2</option>
              </select>
            </Form.Item>
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          '**纯布局模式 (Layout Mode)**\n\n演示 `Form.Item` 的两种特殊用法：\n1. **无 Name 属性**：在 Form 内部使用，仅作对齐布局，不参与数据收集。\n2. **无 Context (单独使用)**：完全脱离 Form 使用，仅复用 Label 和容器样式。',
      },
    },
  },
}
