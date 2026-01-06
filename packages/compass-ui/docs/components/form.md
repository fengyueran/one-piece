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

### 动态增减表单项

动态添加和删除表单项。

```tsx
import React from 'react'
import { Form, InputField, Button } from '@xinghunm/compass-ui'

export default () => {
  return (
    <Form>
      <Form.List name="users">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <div key={field.key} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <Form.Item
                  {...field}
                  name={[field.name, 'name']}
                  rules={[{ required: true, message: '请输入姓名' }]}
                  style={{ flex: 1, marginBottom: 0 }}
                >
                  <InputField placeholder="姓名" />
                </Form.Item>
                <Form.Item
                  {...field}
                  name={[field.name, 'age']}
                  rules={[{ required: true, message: '请输入年龄' }]}
                  style={{ flex: 1, marginBottom: 0 }}
                >
                  <InputField placeholder="年龄" type="number" />
                </Form.Item>
                <Button onClick={() => remove(field.name)}>删除</Button>
              </div>
            ))}
            <Form.Item>
              <Button onClick={() => add()}>添加用户</Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item>
        <Button variant="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  )
}
```

## API

### Form

| 参数           | 说明                             | 类型                                     | 默认值         |
| -------------- | -------------------------------- | ---------------------------------------- | -------------- |
| layout         | 表单布局                         | `'horizontal' \| 'vertical' \| 'inline'` | `'horizontal'` |
| initialValues  | 表单默认值                       | `object`                                 | -              |
| onFinish       | 提交表单且数据验证成功后回调事件 | `(values) => void`                       | -              |
| onFinishFailed | 提交表单且数据验证失败后回调事件 | `(errorInfo) => void`                    | -              |
| onValuesChange | 字段值更新时触发回调事件         | `(changedValues, allValues) => void`     | -              |
| className      | 自定义类名                       | `string`                                 | -              |
| style          | 自定义样式                       | `React.CSSProperties`                    | -              |

### Form.Item

| 参数           | 说明       | 类型                                                | 默认值  |
| -------------- | ---------- | --------------------------------------------------- | ------- |
| name           | 字段名     | `string \| string[]`                                | -       |
| label          | 标签文本   | `ReactNode`                                         | -       |
| rules          | 校验规则   | `Rule[]`                                            | -       |
| required       | 是否必填   | `boolean`                                           | `false` |
| help           | 提示信息   | `ReactNode`                                         | -       |
| validateStatus | 校验状态   | `'success' \| 'warning' \| 'error' \| 'validating'` | -       |
| className      | 自定义类名 | `string`                                            | -       |
| style          | 自定义样式 | `React.CSSProperties`                               | -       |

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
