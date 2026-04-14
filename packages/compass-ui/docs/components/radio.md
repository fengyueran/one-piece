---
title: Radio 单选框
nav:
  title: 组件
  order: 2
group:
  title: 数据录入
  order: 2
---

# Radio 单选框

单选框用于在互斥选项中选择一个结果。

## 何时使用

- 需要在多个选项中明确选择一个值
- 选项数量较少，适合平铺展示
- 需要和表单字段直接绑定

## 代码演示

### 基础分组

```tsx
import React from 'react'
import { Radio } from '@xinghunm/compass-ui'

export default () => (
  <Radio.Group defaultValue="apple" aria-label="水果">
    <Radio value="apple">苹果</Radio>
    <Radio value="orange">橙子</Radio>
    <Radio value="pear">雪梨</Radio>
  </Radio.Group>
)
```

### 受控分组

```tsx
import React, { useState } from 'react'
import { Radio } from '@xinghunm/compass-ui'

export default () => {
  const [value, setValue] = useState('small')

  return (
    <Radio.Group value={value} onChange={(nextValue) => setValue(String(nextValue))}>
      <Radio value="small">Small</Radio>
      <Radio value="medium">Medium</Radio>
      <Radio value="large">Large</Radio>
    </Radio.Group>
  )
}
```

### options 快捷配置

```tsx
import React from 'react'
import { Radio } from '@xinghunm/compass-ui'

export default () => (
  <Radio.Group
    defaultValue="draft"
    options={[
      { label: '草稿', value: 'draft' },
      { label: '已发布', value: 'published' },
      { label: '已归档', value: 'archived', disabled: true },
    ]}
  />
)
```

### 表单集成

`Form.Item` 会把 `Radio.Group` 绑定到字段 `value`，适合直接收集枚举值。

```tsx
import React from 'react'
import { Button, Form, Radio } from '@xinghunm/compass-ui'

export default () => (
  <Form onFinish={(values) => console.log(values)}>
    <Form.Item name="plan" label="套餐" rules={[{ required: true, message: '请选择套餐' }]}>
      <Radio.Group>
        <Radio value="basic">基础版</Radio>
        <Radio value="pro">专业版</Radio>
      </Radio.Group>
    </Form.Item>
    <Button htmlType="submit" variant="primary">
      提交
    </Button>
  </Form>
)
```

### 自定义主题

```tsx
import React from 'react'
import { ConfigProvider, Radio } from '@xinghunm/compass-ui'

export default () => (
  <ConfigProvider
    theme={{
      token: {
        components: {
          radio: {
            checkedBorderColor: '#7c3aed',
            dotColor: '#7c3aed',
            focusRingColor: '#7c3aed',
          },
        },
      },
    }}
  >
    <Radio.Group defaultValue="pro">
      <Radio value="basic">基础版</Radio>
      <Radio value="pro">专业版</Radio>
    </Radio.Group>
  </ConfigProvider>
)
```

更多可配置字段见 [主题 Token](/guide/theme-tokens)。

## 键盘与可访问性

- `Radio.Group` 会输出 `radiogroup` 语义
- 每个 `Radio` 保留原生 `input[type="radio"]` 行为
- 分组内只允许一个选项处于选中状态
- 错误态会透传到子项的 `aria-invalid`

## API

通用属性参考：[通用属性](/guide/common-props)

### Radio

| 属性             | 说明               | 类型                                             | 默认值     |
| ---------------- | ------------------ | ------------------------------------------------ | ---------- |
| `checked`        | 受控选中状态       | `boolean`                                        | -          |
| `defaultChecked` | 非受控初始选中状态 | `boolean`                                        | `false`    |
| `value`          | 当前选项值         | `string \| number`                               | -          |
| `disabled`       | 是否禁用           | `boolean`                                        | `false`    |
| `size`           | 组件尺寸           | `'small' \| 'medium' \| 'large'`                 | `'medium'` |
| `status`         | 校验状态           | `'error' \| 'warning'`                           | -          |
| `onChange`       | 选中变化回调       | `(event: ChangeEvent<HTMLInputElement>) => void` | -          |

### Radio.Group

| 属性           | 说明             | 类型                             | 默认值       |
| -------------- | ---------------- | -------------------------------- | ------------ |
| `value`        | 受控选中值       | `string \| number`               | -            |
| `defaultValue` | 非受控初始选中值 | `string \| number`               | -            |
| `options`      | 快捷配置选项     | `RadioOption[]`                  | -            |
| `direction`    | 排列方向         | `'horizontal' \| 'vertical'`     | `'vertical'` |
| `disabled`     | 是否整体禁用     | `boolean`                        | `false`      |
| `size`         | 统一尺寸         | `'small' \| 'medium' \| 'large'` | `'medium'`   |
| `status`       | 统一校验状态     | `'error' \| 'warning'`           | -            |
| `onChange`     | 选中值变化回调   | `(value, event) => void`         | -            |
| `classNames`   | 语义化类名覆写   | `RadioGroupProps['classNames']`  | -            |
| `styles`       | 语义化样式覆写   | `RadioGroupProps['styles']`      | -            |

## 主题变量 (Design Token)

| Token Name                            | Description      | Default               |
| ------------------------------------- | ---------------- | --------------------- |
| `components.radio.size.sm`            | 小尺寸单选框边长 | `14px`                |
| `components.radio.size.md`            | 中尺寸单选框边长 | `16px`                |
| `components.radio.size.lg`            | 大尺寸单选框边长 | `20px`                |
| `components.radio.dotSize.sm`         | 小尺寸圆点直径   | `6px`                 |
| `components.radio.dotSize.md`         | 中尺寸圆点直径   | `8px`                 |
| `components.radio.dotSize.lg`         | 大尺寸圆点直径   | `10px`                |
| `components.radio.borderColor`        | 默认边框颜色     | `#d9d9d9`             |
| `components.radio.checkedBorderColor` | 选中边框颜色     | `#1890ff`             |
| `components.radio.dotColor`           | 选中圆点颜色     | `#1890ff`             |
| `components.radio.labelColor`         | 标签文字颜色     | `rgba(0, 0, 0, 0.88)` |
| `components.radio.focusRingColor`     | 焦点高亮颜色     | `#1890ff`             |
