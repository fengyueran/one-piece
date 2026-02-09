---
title: Form 表单
nav:
  title: 组件
  order: 2
group:
  title: 数据录入
  order: 2
---

# Form 表单

具有数据收集、校验和提交功能的表单,包含复选框、单选框、输入框、下拉选择框等元素。

## 何时使用

- 用于创建一个实体或收集信息
- 需要对输入的数据类型进行校验时

通用属性参考：[通用属性](/guide/common-props)

## 代码演示

### 基础用法

基本的表单数据域控制展示,包含布局、初始化、验证、提交。

```tsx
import React from 'react'
import { Form, InputField, Button } from '@xinghunm/compass-ui'

export default () => {
  const handleSubmit = (values) => {
    console.log('表单值:', values)
    alert(JSON.stringify(values, null, 2))
  }

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item
        label="用户名"
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <InputField placeholder="请输入用户名" />
      </Form.Item>

      <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
        <InputField type="password" placeholder="请输入密码" />
      </Form.Item>

      <Form.Item>
        <Button variant="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  )
}
```

### 表单布局

表单有三种布局方式。

```tsx
import React, { useState } from 'react'
import { Form, InputField, Button, Select } from '@xinghunm/compass-ui'

export default () => {
  const [layout, setLayout] = useState('horizontal')

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <span>表单布局: </span>
        <Select
          value={layout}
          onChange={setLayout}
          style={{ width: 120 }}
          options={[
            { label: '水平', value: 'horizontal' },
            { label: '垂直', value: 'vertical' },
            { label: '内联', value: 'inline' },
          ]}
        />
      </div>

      <Form layout={layout}>
        <Form.Item label="用户名" name="username">
          <InputField placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item label="密码" name="password">
          <InputField type="password" placeholder="请输入密码" />
        </Form.Item>

        <Form.Item>
          <Button variant="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
```

### 表单验证

Form 组件提供了表单验证的功能,只需要通过 `rules` 属性传入约定的验证规则。

```tsx
import React from 'react'
import { Form, InputField, Button } from '@xinghunm/compass-ui'

export default () => {
  const handleSubmit = (values) => {
    console.log('Success:', values)
  }

  const handleFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Form onFinish={handleSubmit} onFinishFailed={handleFailed}>
      <Form.Item
        label="邮箱"
        name="email"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入有效的邮箱地址' },
        ]}
      >
        <InputField placeholder="请输入邮箱" />
      </Form.Item>

      <Form.Item
        label="年龄"
        name="age"
        rules={[
          { required: true, message: '请输入年龄' },
          {
            validator: (rule, value) => {
              if (value && (value < 1 || value > 120)) {
                return Promise.reject('年龄必须在 1-120 之间')
              }
              return Promise.resolve()
            },
          },
        ]}
      >
        <InputField type="number" placeholder="请输入年龄" />
      </Form.Item>

      <Form.Item>
        <Button variant="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  )
}
```

### 字段依赖

当一个字段需要根据其他字段的值进行校验时，可以使用 `dependencies`。

```tsx
import React from 'react'
import { Form, InputField, Button } from '@xinghunm/compass-ui'

export default () => {
  const [form] = Form.useForm()

  const handleSubmit = (values) => {
    console.log('表单值:', values)
  }

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
        <InputField type="password" placeholder="请输入密码" />
      </Form.Item>

      <Form.Item
        label="确认密码"
        name="confirm"
        dependencies={['password']}
        rules={[
          { required: true, message: '请再次输入密码' },
          {
            validator: (rule, value) => {
              if (!value || form.getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject('两次输入的密码不一致!')
            },
          },
        ]}
      >
        <InputField type="password" placeholder="请再次输入密码" />
      </Form.Item>

      <Form.Item>
        <Button variant="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  )
}
```

### 初始值

通过 `initialValues` 设置表单的初始值。

```tsx
import React from 'react'
import { Form, InputField, Button } from '@xinghunm/compass-ui'

export default () => {
  const [form] = Form.useForm()

  const handleSubmit = (values) => {
    console.log('表单值:', values)
  }

  return (
    <Form
      form={form}
      initialValues={{
        username: 'admin',
        email: 'admin@example.com',
      }}
      onFinish={handleSubmit}
    >
      <Form.Item label="用户名" name="username">
        <InputField />
      </Form.Item>

      <Form.Item label="邮箱" name="email">
        <InputField />
      </Form.Item>

      <Form.Item>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="primary" htmlType="submit">
            提交
          </Button>
          <Button onClick={() => form.resetFields()}>重置</Button>
        </div>
      </Form.Item>
    </Form>
  )
}
```

### 表单方法

使用 `Form.useForm()` 创建表单实例，通过实例方法操作表单数据。

```tsx
import React from 'react'
import { Form, InputField, Button } from '@xinghunm/compass-ui'

export default () => {
  const [form] = Form.useForm()

  return (
    <Form form={form}>
      <Form.Item label="字段 A" name="fieldA">
        <InputField placeholder="输入内容..." />
      </Form.Item>

      <Form.Item label="字段 B" name="fieldB">
        <InputField placeholder="输入内容..." />
      </Form.Item>

      <Form.Item>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button
            onClick={() => {
              form.setFieldsValue({
                fieldA: 'Hello',
                fieldB: 'World',
              })
            }}
          >
            设置值
          </Button>
          <Button
            onClick={() => {
              const values = form.getFieldsValue()
              alert(JSON.stringify(values, null, 2))
            }}
          >
            获取所有值
          </Button>
          <Button onClick={() => form.resetFields()}>重置</Button>
        </div>
      </Form.Item>
    </Form>
  )
}
```

### 数据操作方法

演示表单实例的数据操作方法。

```tsx
import React from 'react'
import { Form, InputField, Button } from '@xinghunm/compass-ui'

export default () => {
  const [form] = Form.useForm()

  return (
    <Form form={form}>
      <Form.Item label="字段 A" name="a">
        <InputField />
      </Form.Item>
      <Form.Item label="字段 B" name="b">
        <InputField />
      </Form.Item>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button onClick={() => form.setFieldValue('a', '值 A')}>设置 A</Button>
        <Button onClick={() => form.setFieldValue(['b', 'c'], '值 C (嵌套)')}>设置 B.C</Button>
        <Button
          onClick={() =>
            form.setFieldsValue({
              a: '值 A (批量)',
              b: { c: '值 C (批量嵌套)' },
            })
          }
        >
          批量设置
        </Button>
        <Button onClick={() => alert(form.getFieldValue('a'))}>获取 A</Button>
        <Button onClick={() => alert(form.getFieldValue(['b', 'c']))}>获取 B.C</Button>
        <Button onClick={() => alert(JSON.stringify(form.getFieldsValue(), null, 2))}>
          获取全部
        </Button>
      </div>
    </Form>
  )
}
```

### 状态查询方法

演示如何查询字段的状态信息。

```tsx
import React, { useState } from 'react'
import { Form, InputField, Button } from '@xinghunm/compass-ui'

export default () => {
  const [form] = Form.useForm()
  const [, forceUpdate] = useState({})

  const checkStatus = () => forceUpdate({})

  return (
    <Form form={form} onValuesChange={checkStatus} onFieldsChange={checkStatus}>
      <Form.Item
        label="用户名"
        name="username"
        rules={[
          { required: true, message: '请输入用户名' },
          {
            validator: async (_, value) => {
              if (value === 'loading') {
                await new Promise((resolve) => setTimeout(resolve, 2000))
              }
              return Promise.resolve()
            },
          },
        ]}
      >
        <InputField placeholder="输入 'loading' 查看验证状态" />
      </Form.Item>

      <div style={{ padding: 12, background: '#f5f5f5', marginTop: 16 }}>
        <p>
          <strong>isFieldTouched('username'):</strong> {String(form.isFieldTouched('username'))}
        </p>
        <p>
          <strong>isFieldsTouched():</strong> {String(form.isFieldsTouched())}
        </p>
        <p>
          <strong>getFieldError('username'):</strong>{' '}
          {JSON.stringify(form.getFieldError('username'))}
        </p>
        <p>
          <strong>isFieldValidating('username'):</strong>{' '}
          {String(form.isFieldValidating('username'))}
        </p>
      </div>
      <Button onClick={checkStatus} style={{ marginTop: 8 }}>
        刷新状态
      </Button>
    </Form>
  )
}
```

### 表单操作方法

演示表单的验证、提交和重置等操作方法。

```tsx
import React from 'react'
import { Form, InputField, Button } from '@xinghunm/compass-ui'

export default () => {
  const [form] = Form.useForm()

  return (
    <Form form={form} onFinish={(values) => alert(`提交成功:\n${JSON.stringify(values, null, 2)}`)}>
      <Form.Item label="邮箱" name="email" rules={[{ required: true, type: 'email' }]}>
        <InputField />
      </Form.Item>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button
          onClick={() => {
            form
              .validateFields()
              .then((values) => alert(`验证通过: ${JSON.stringify(values)}`))
              .catch((err) => console.error('验证失败:', err))
          }}
        >
          验证
        </Button>
        <Button onClick={() => form.submit()}>提交</Button>
        <Button onClick={() => form.resetFields()}>重置</Button>
        <Button
          onClick={() => {
            form.setFields([
              {
                name: 'email',
                value: 'invalid-email',
                errors: ['手动设置的错误'],
              },
            ])
          }}
        >
          设置错误
        </Button>
      </div>
    </Form>
  )
}
```

### 监听字段变化

使用 `Form.useWatch` 监听特定字段的值变化。

```tsx
import React from 'react'
import { Form, InputField, InputNumber } from '@xinghunm/compass-ui'

export default () => {
  const [form] = Form.useForm()

  const WatchComponent = () => {
    const nameValue = Form.useWatch('name', form)
    const ageValue = Form.useWatch('age', form)

    return (
      <div style={{ padding: 12, background: '#f5f5f5', marginTop: 16 }}>
        <p>
          姓名: <strong>{String(nameValue || '')}</strong>
        </p>
        <p>
          年龄: <strong>{String(ageValue || '')}</strong>
        </p>
      </div>
    )
  }

  return (
    <Form form={form}>
      <Form.Item label="姓名" name="name">
        <InputField placeholder="请输入姓名" />
      </Form.Item>
      <Form.Item label="年龄" name="age">
        <InputNumber placeholder="请输入年龄" />
      </Form.Item>
      <WatchComponent />
    </Form>
  )
}
```

### 值变化回调

使用 `onValuesChange` 监听表单值的变化。

```tsx
import React, { useState } from 'react'
import { Form, InputField } from '@xinghunm/compass-ui'

export default () => {
  const [form] = Form.useForm()
  const [lastChange, setLastChange] = useState('')

  const onValuesChange = (changedValues, allValues) => {
    const changedKey = Object.keys(changedValues)[0]
    const msg = `字段 '${changedKey}' 变更为 '${changedValues[changedKey]}'`
    setLastChange(msg)
  }

  return (
    <Form form={form} onValuesChange={onValuesChange}>
      <Form.Item label="项目名称" name="projectName">
        <InputField placeholder="输入项目名称..." />
      </Form.Item>

      <Form.Item label="描述" name="description">
        <InputField placeholder="输入描述..." />
      </Form.Item>

      {lastChange && (
        <div style={{ padding: '8px 12px', background: '#f0f5ff', borderRadius: 4 }}>
          {lastChange}
        </div>
      )}
    </Form>
  )
}
```

### 纯布局模式

`Form.Item` 可以不设置 `name` 属性，仅用于布局对齐。

```tsx
import React from 'react'
import { Form, InputField, Button } from '@xinghunm/compass-ui'

export default () => {
  const handleSubmit = (values) => {
    console.log('表单值:', values)
  }

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item label="用户名" name="username" rules={[{ required: true }]}>
        <InputField />
      </Form.Item>

      <Form.Item label="提示">
        <span style={{ lineHeight: '32px', color: '#666' }}>
          这是一段与表单项对齐的静态文本,不参与数据收集
        </span>
      </Form.Item>

      <Form.Item>
        <Button variant="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  )
}
```

### 嵌套结构

支持使用数组格式的 `name` 来处理嵌套数据结构。

```tsx
import React from 'react'
import { Form, InputField, Button } from '@xinghunm/compass-ui'

export default () => {
  const handleSubmit = (values) => {
    console.log('表单值:', values)
    alert(JSON.stringify(values, null, 2))
  }

  const initialValues = {
    user: {
      name: {
        first: 'John',
        last: 'Doe',
      },
      email: 'john@example.com',
    },
  }

  return (
    <Form onFinish={handleSubmit} initialValues={initialValues}>
      <Form.Item label="First Name" name={['user', 'name', 'first']}>
        <InputField />
      </Form.Item>

      <Form.Item label="Last Name" name={['user', 'name', 'last']}>
        <InputField />
      </Form.Item>

      <Form.Item label="Email" name={['user', 'email']}>
        <InputField />
      </Form.Item>

      <Form.Item>
        <Button variant="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  )
}
```

### 自定义样式

通过 `classNames` 和 `styles` 属性可以精确控制组件内部元素的样式。对于 Form 组件，你可以直接在根组件上配置所有 Item 的全局样式。

```tsx
import React from 'react'
import { Form, InputField, Button } from '@xinghunm/compass-ui'

export default () => (
  <Form
    classNames={{
      form: 'custom-form',
      item: 'custom-item-root',
      label: 'custom-item-label',
      error: 'custom-item-error',
    }}
    styles={{
      form: { border: '1px solid #eee', padding: 16 },
      label: { color: 'blue', fontWeight: 'bold' },
    }}
  >
    <Form.Item label="Custom Item" name="custom">
      <InputField placeholder="Check styles in devtools" />
    </Form.Item>
    <Button htmlType="submit">Submit</Button>
  </Form>
)
```

### 自定义主题

通过 `ConfigProvider` 自定义表单主题。

```tsx
import { ConfigProvider, Form, InputField } from '@xinghunm/compass-ui'

export default () => {
  return (
    <ConfigProvider
      theme={{
        global: false,
        token: {
          components: {
            form: {
              labelColor: '#1890ff',
              labelFontSize: '16px',
              itemMarginBottom: '32px',
            },
          },
        },
      }}
    >
      <Form>
        <Form.Item label="用户名" name="username">
          <InputField />
        </Form.Item>
      </Form>
    </ConfigProvider>
  )
}
```

## API

通用属性参考：[通用属性](/guide/common-props)

### Form

| 参数           | 说明                             | 类型                                                                                           | 默认值       |
| -------------- | -------------------------------- | ---------------------------------------------------------------------------------------------- | ------------ |
| form           | 表单控制实例                     | `FormInstance`                                                                                 | -            |
| layout         | 表单布局                         | `'horizontal' \| 'vertical' \| 'inline'`                                                       | `'vertical'` |
| initialValues  | 表单默认值                       | `Record<string, unknown>`                                                                      | -            |
| onFinish       | 提交表单且数据验证成功后回调事件 | `(values: Record<string, unknown>) => void`                                                    | -            |
| onFinishFailed | 提交表单且数据验证失败后回调事件 | (errorInfo: [ValidateErrorEntity](#validateerrorentity)) => void                               | -            |
| onValuesChange | 字段值更新时触发回调事件         | `(changedValues: Record<string, unknown>, allValues: Record<string, unknown>) => void`         | -            |
| onFieldsChange | 字段状态更新时触发回调事件       | (changedFields: [FieldData](#fielddata)[], allFields: [FieldData](#fielddata)[]) => void       | -            |
| classNames     | 语义化类名                       | `{ form?: string; item?: string; label?: string; error?: string }`                             | -            |
| styles         | 语义化样式                       | `{ form?: CSSProperties; item?: CSSProperties; label?: CSSProperties; error?: CSSProperties }` | -            |

### Form.Item

| 参数           | 说明       | 类型                                                  | 默认值  |
| -------------- | ---------- | ----------------------------------------------------- | ------- |
| name           | 字段名     | `NamePath` (string \| number \| (string \| number)[]) | -       |
| label          | 标签文本   | `ReactNode`                                           | -       |
| rules          | 校验规则   | `Rule[]`                                              | -       |
| required       | 是否必填   | `boolean`                                             | `false` |
| help           | 提示信息   | `ReactNode`                                           | -       |
| validateStatus | 校验状态   | `'success' \| 'warning' \| 'error' \| 'validating'`   | -       |
| dependencies   | 依赖字段   | `NamePath[]`                                          | -       |
| className      | 自定义类名 | `string`                                              | -       |
| style          | 自定义样式 | `React.CSSProperties`                                 | -       |

### Rule

| 参数      | 说明       | 类型                       | 默认值  |
| --------- | ---------- | -------------------------- | ------- |
| required  | 是否必填   | `boolean`                  | `false` |
| message   | 错误信息   | `string \| ReactNode`      | -       |
| type      | 类型       | `string`                   | -       |
| pattern   | 正则表达式 | `RegExp`                   | -       |
| validator | 自定义校验 | `(rule, value) => Promise` | -       |
| min       | 最小长度   | `number`                   | -       |
| max       | 最大长度   | `number`                   | -       |

### ValidateErrorEntity

表单验证失败时的错误信息对象。

| 参数        | 说明               | 类型                                     |
| ----------- | ------------------ | ---------------------------------------- |
| values      | 当前表单的所有值   | `object`                                 |
| errorFields | 验证失败的字段列表 | `{ name: NamePath; errors: string[] }[]` |
| outOfDate   | 错误信息是否过期   | `boolean`                                |

### FieldData

字段的完整状态信息。

| 参数       | 说明             | 类型       |
| ---------- | ---------------- | ---------- |
| name       | 字段名           | `string`   |
| value      | 字段值           | `unknown`  |
| touched    | 是否被用户操作过 | `boolean`  |
| validating | 是否正在验证     | `boolean`  |
| errors     | 错误信息列表     | `string[]` |

## 主题变量 (Design Token)

<details>
<summary>组件 Token (components.form)</summary>

| 变量名                              | 说明             |
| ----------------------------------- | ---------------- |
| `components.form.itemMarginBottom`  | 表单项下间距     |
| `components.form.labelMarginBottom` | 标签下间距       |
| `components.form.labelFontSize`     | 标签字体大小     |
| `components.form.labelColor`        | 标签颜色         |
| `components.form.errorColor`        | 错误信息颜色     |
| `components.form.errorFontSize`     | 错误信息字体大小 |
| `components.form.errorMarginTop`    | 错误信息上间距   |
| `components.form.errorMarginBottom` | 错误信息下间距   |

</details>

<details>
<summary>全局 Token</summary>

| 变量名         | 说明     |
| -------------- | -------- |
| `spacing.md`   | 默认间距 |
| `colors.error` | 错误主色 |

</details>
