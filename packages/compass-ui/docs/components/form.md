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

## 代码演示

### 基础用法

基本的表单数据域控制展示,包含布局、初始化、验证、提交。

```tsx
import React from 'react'
import { Form, Input, Button } from '@xinghunm/compass-ui'

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
        <Input placeholder="请输入用户名" />
      </Form.Item>

      <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
        <Input type="password" placeholder="请输入密码" />
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
import { Form, Input, Button, Select } from '@xinghunm/compass-ui'

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
          <Input placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item label="密码" name="password">
          <Input type="password" placeholder="请输入密码" />
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
import { Form, Input, Button } from '@xinghunm/compass-ui'

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
        <Input placeholder="请输入邮箱" />
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
        <Input type="number" placeholder="请输入年龄" />
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
import { Form, Input, Button } from '@xinghunm/compass-ui'

export default () => {
  const [form] = Form.useForm()

  const handleSubmit = (values) => {
    console.log('表单值:', values)
  }

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
        <Input type="password" placeholder="请输入密码" />
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
        <Input type="password" placeholder="请再次输入密码" />
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
import { Form, Input, Button } from '@xinghunm/compass-ui'

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
        <Input />
      </Form.Item>

      <Form.Item label="邮箱" name="email">
        <Input />
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
import { Form, Input, Button } from '@xinghunm/compass-ui'

export default () => {
  const [form] = Form.useForm()

  return (
    <Form form={form}>
      <Form.Item label="字段 A" name="fieldA">
        <Input placeholder="输入内容..." />
      </Form.Item>

      <Form.Item label="字段 B" name="fieldB">
        <Input placeholder="输入内容..." />
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
import { Form, Input, Button } from '@xinghunm/compass-ui'

export default () => {
  const [form] = Form.useForm()

  return (
    <Form form={form}>
      <Form.Item label="字段 A" name="a">
        <Input />
      </Form.Item>
      <Form.Item label="字段 B" name="b">
        <Input />
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
import { Form, Input, Button } from '@xinghunm/compass-ui'

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
        <Input placeholder="输入 'loading' 查看验证状态" />
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
import { Form, Input, Button } from '@xinghunm/compass-ui'

export default () => {
  const [form] = Form.useForm()

  return (
    <Form form={form} onFinish={(values) => alert(`提交成功:\n${JSON.stringify(values, null, 2)}`)}>
      <Form.Item label="邮箱" name="email" rules={[{ required: true, type: 'email' }]}>
        <Input />
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

### 使用 validateOnly 控制提交状态（推荐）

`validateFields()` 默认会触发错误展示。  
如果你只想判断“当前是否可提交”（例如控制按钮禁用态），推荐使用
`validateFields({ validateOnly: true })`，避免提前展示未编辑字段错误。
注意：`validateOnly` 模式下不会出现红框/错误文案，这是设计行为；如需展示错误，请使用普通
`validateFields()` 或 `form.submit()`。

```tsx
import React, { useEffect, useState } from 'react'
import { Form, Input, Button } from '@xinghunm/compass-ui'

export default () => {
  const [form] = Form.useForm()
  const [isSubmittable, setIsSubmittable] = useState(false)

  const updateSubmittable = () => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setIsSubmittable(true))
      .catch(() => setIsSubmittable(false))
  }

  useEffect(() => {
    updateSubmittable()
  }, [])

  return (
    <Form form={form} onValuesChange={updateSubmittable} onFinish={(values) => console.log(values)}>
      <Form.Item
        label="项目名称"
        name="name"
        rules={[{ required: true, message: '请输入项目名称' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="邮箱"
        name="email"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '邮箱格式不正确' },
        ]}
      >
        <Input />
      </Form.Item>

      <Button variant="primary" type="submit" disabled={!isSubmittable}>
        提交
      </Button>
    </Form>
  )
}
```

### 监听字段变化

使用 `Form.useWatch` 监听特定字段的值变化，支持字符串和数组形式的 `NamePath`。

```tsx
import React from 'react'
import { Form, Input, InputNumber } from '@xinghunm/compass-ui'

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
        <Input placeholder="请输入姓名" />
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

说明：

- 用户输入、`setFieldValue`、`setFields` 更新单个嵌套字段时，`changedValues` 会使用点路径 key，例如 `{ 'user.name': 'Alice' }`
- `setFieldsValue` 批量更新时，`changedValues` 保持传入对象结构

```tsx
import React, { useState } from 'react'
import { Form, Input } from '@xinghunm/compass-ui'

export default () => {
  const [form] = Form.useForm()
  const [lastChange, setLastChange] = useState('')

  const onValuesChange = (changedValues, allValues) => {
    const msg = `changedValues: ${JSON.stringify(changedValues)}`
    setLastChange(msg)
  }

  return (
    <Form form={form} onValuesChange={onValuesChange}>
      <Form.Item label="项目名称" name="projectName">
        <Input placeholder="输入项目名称..." />
      </Form.Item>

      <Form.Item label="描述" name="description">
        <Input placeholder="输入描述..." />
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
import { Form, Input, Button } from '@xinghunm/compass-ui'

export default () => {
  const handleSubmit = (values) => {
    console.log('表单值:', values)
  }

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item label="用户名" name="username" rules={[{ required: true }]}>
        <Input />
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
import { Form, Input, Button } from '@xinghunm/compass-ui'

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
        <Input />
      </Form.Item>

      <Form.Item label="Last Name" name={['user', 'name', 'last']}>
        <Input />
      </Form.Item>

      <Form.Item label="Email" name={['user', 'email']}>
        <Input />
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
import { Form, Input, Button } from '@xinghunm/compass-ui'

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
      <Input placeholder="Check styles in devtools" />
    </Form.Item>
    <Button htmlType="submit">Submit</Button>
  </Form>
)
```

### 自定义主题

通过 `ConfigProvider` 自定义表单主题。

```tsx
import { ConfigProvider, Form, Input } from '@xinghunm/compass-ui'

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
          <Input />
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
| children       | 表单内容                         | `ReactNode`                                                                                    | -            |
| onFinish       | 提交表单且数据验证成功后回调事件 | `(values: Record<string, unknown>) => void`                                                    | -            |
| onFinishFailed | 提交表单且数据验证失败后回调事件 | (errorInfo: [ValidateErrorEntity](#validateerrorentity)) => void                               | -            |
| onValuesChange | 字段值更新时触发回调事件         | `(changedValues: Record<string, unknown>, allValues: Record<string, unknown>) => void`         | -            |
| onFieldsChange | 字段状态更新时触发回调事件       | (changedFields: [FieldData](#fielddata)[], allFields: [FieldData](#fielddata)[]) => void       | -            |
| classNames     | 语义化类名                       | `{ form?: string; item?: string; label?: string; error?: string }`                             | -            |
| styles         | 语义化样式                       | `{ form?: CSSProperties; item?: CSSProperties; label?: CSSProperties; error?: CSSProperties }` | -            |

### Form.Item

| 参数            | 说明         | 类型                                                  | 默认值       |
| --------------- | ------------ | ----------------------------------------------------- | ------------ |
| name            | 字段名       | `NamePath` (string \| number \| (string \| number)[]) | -            |
| label           | 标签文本     | `ReactNode`                                           | -            |
| rules           | 校验规则     | `RuleItem[]`                                          | -            |
| children        | 表单控件     | `ReactElement`                                        | -            |
| help            | 提示信息     | `ReactNode`                                           | -            |
| initialValue    | 字段初始值   | `unknown`                                             | -            |
| validateTrigger | 校验触发时机 | `string \| string[]`                                  | `'onChange'` |
| dependencies    | 依赖字段     | `NamePath[]`                                          | -            |

### NamePath

字段路径类型，支持扁平字段和嵌套字段。

```ts
type NamePath = string | number | (string | number)[]
```

### RuleItem

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

| 参数        | 说明               | 类型                                                 |
| ----------- | ------------------ | ---------------------------------------------------- |
| values      | 当前表单的所有值   | `object`                                             |
| errorFields | 验证失败的字段列表 | `{ name: (string \| number)[]; errors: string[] }[]` |
| outOfDate   | 错误信息是否过期   | `boolean`                                            |

### Form 静态方法

| 方法            | 说明               | 类型                                               |
| --------------- | ------------------ | -------------------------------------------------- |
| `Form.useForm`  | 创建表单实例       | `() => [FormInstance]`                             |
| `Form.useWatch` | 监听指定字段值变化 | `(name: NamePath, form?: FormInstance) => unknown` |

### FormInstance 方法

| 方法                | 说明                                                                                 | 类型                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `getFieldValue`     | 获取单个字段值                                                                       | `(name: NamePath) => unknown`                                                                                    |
| `getFieldsValue`    | 获取当前所有字段值                                                                   | `() => Values`                                                                                                   |
| `getFieldError`     | 获取单个字段的错误信息列表                                                           | `(name: NamePath) => string[]`                                                                                   |
| `isFieldsTouched`   | 判断指定字段列表或任意字段是否已被操作过                                             | `(nameList?: NamePath[]) => boolean`                                                                             |
| `isFieldTouched`    | 判断单个字段是否已被操作过                                                           | `(name: NamePath) => boolean`                                                                                    |
| `isFieldValidating` | 判断单个字段是否正在校验                                                             | `(name: NamePath) => boolean`                                                                                    |
| `resetFields`       | 重置指定字段或全部字段到初始值                                                       | `(fields?: NamePath[]) => void`                                                                                  |
| `setFields`         | 批量设置字段值和字段状态                                                             | `(fields: FieldData[]) => void`                                                                                  |
| `setFieldValue`     | 设置单个字段值                                                                       | `(name: NamePath, value: unknown) => void`                                                                       |
| `setFieldsValue`    | 批量设置字段值，支持嵌套结构                                                         | `(values: RecursivePartial<Values>) => void`                                                                     |
| `validateFields`    | 校验字段并返回表单值；传入 `validateOnly: true` 时只计算是否合法，不更新错误展示状态 | `(nameList?: NamePath[] \| { validateOnly?: boolean }, options?: { validateOnly?: boolean }) => Promise<Values>` |
| `submit`            | 触发表单提交流程                                                                     | `() => void`                                                                                                     |

### FieldData

字段的完整状态信息。

| 参数       | 说明             | 类型                   |
| ---------- | ---------------- | ---------------------- |
| name       | 字段路径         | `(string \| number)[]` |
| value      | 字段值           | `unknown`              |
| touched    | 是否被用户操作过 | `boolean`              |
| validating | 是否正在验证     | `boolean`              |
| errors     | 错误信息列表     | `string[]`             |

### classNames / styles 插槽

`classNames` 与 `styles` 使用相同的 slot key。

| 插槽名  | 说明     |
| ------- | -------- |
| `form`  | 表单容器 |
| `item`  | 表单项   |
| `label` | 标签区域 |
| `error` | 错误提示 |

## 主题变量 (Design Token)

| Token Name                          | Description      | Default               |
| ----------------------------------- | ---------------- | --------------------- |
| `components.form.itemMarginBottom`  | 表单项下间距     | `16px`                |
| `components.form.labelMarginBottom` | 标签下间距       | `8px`                 |
| `components.form.labelFontSize`     | 标签字体大小     | `14px`                |
| `components.form.labelColor`        | 标签颜色         | `rgba(0, 0, 0, 0.88)` |
| `components.form.errorColor`        | 错误信息颜色     | `#ff4d4f`             |
| `components.form.errorFontSize`     | 错误信息字体大小 | `12px`                |
| `components.form.errorMarginTop`    | 错误信息上间距   | `2px`                 |
| `components.form.errorMarginBottom` | 错误信息下间距   | `2px`                 |

Form 还会跟随全局 `spacing.md`、`colors.error` 等 token 变化，但组件级配置入口以 `components.form.*` 为主。
