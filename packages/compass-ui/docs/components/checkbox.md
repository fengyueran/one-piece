---
title: Checkbox 多选框
nav:
  title: 组件
  order: 2
group:
  title: 数据录入
  order: 2
---

# Checkbox 多选框

多选框用于表达一个独立布尔值，或者一组选项里的多选状态。

## 何时使用

- 需要用户对单个开关项做是/否确认
- 需要在表单里收集布尔值
- 需要展示禁用、错误或半选状态

## 代码演示

### 基础用法

```tsx
import React from 'react'
import { Checkbox } from '@xinghunm/compass-ui'

export default () => <Checkbox defaultChecked>接收产品更新</Checkbox>
```

### 受控用法

```tsx
import React, { useState } from 'react'
import { Checkbox } from '@xinghunm/compass-ui'

export default () => {
  const [checked, setChecked] = useState(false)

  return (
    <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)}>
      我已阅读并同意协议
    </Checkbox>
  )
}
```

### 禁用与错误状态

```tsx
import React from 'react'
import { Checkbox } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <Checkbox disabled defaultChecked>
      禁用且选中
    </Checkbox>
    <Checkbox status="error">校验失败</Checkbox>
    <Checkbox indeterminate>半选状态</Checkbox>
  </div>
)
```

### 表单集成

`Form.Item` 会自动把 `Checkbox` 绑定到 `checked`，不需要手动桥接事件。

```tsx
import React from 'react'
import { Button, Checkbox, Form } from '@xinghunm/compass-ui'

export default () => (
  <Form onFinish={(values) => console.log(values)}>
    <Form.Item
      name="agree"
      label="协议确认"
      rules={[{ required: true, type: 'boolean', message: '请先勾选协议' }]}
    >
      <Checkbox>我已阅读并同意协议</Checkbox>
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
import { Checkbox, ConfigProvider } from '@xinghunm/compass-ui'

export default () => (
  <ConfigProvider
    theme={{
      token: {
        components: {
          checkbox: {
            checkedBg: '#0f766e',
            checkedBorderColor: '#0f766e',
            focusRingColor: '#0f766e',
          },
        },
      },
    }}
  >
    <Checkbox defaultChecked>品牌绿色主题</Checkbox>
  </ConfigProvider>
)
```

更多可配置字段见 [主题 Token](/guide/theme-tokens)。

## 键盘与可访问性

- 原生 `input[type="checkbox"]` 语义保留，可直接被屏幕阅读器识别
- 聚焦后按 `Space` 可切换选中状态
- 错误态会同步输出 `aria-invalid="true"`

## API

通用属性参考：[通用属性](/guide/common-props)

| 属性             | 说明               | 类型                                             | 默认值     |
| ---------------- | ------------------ | ------------------------------------------------ | ---------- |
| `checked`        | 受控选中状态       | `boolean`                                        | -          |
| `defaultChecked` | 非受控初始选中状态 | `boolean`                                        | `false`    |
| `disabled`       | 是否禁用           | `boolean`                                        | `false`    |
| `indeterminate`  | 是否半选           | `boolean`                                        | `false`    |
| `size`           | 组件尺寸           | `'small' \| 'medium' \| 'large'`                 | `'medium'` |
| `status`         | 校验状态           | `'error' \| 'warning'`                           | -          |
| `onChange`       | 选中状态变化回调   | `(event: ChangeEvent<HTMLInputElement>) => void` | -          |
| `classNames`     | 语义化类名覆写     | `CheckboxProps['classNames']`                    | -          |
| `styles`         | 语义化样式覆写     | `CheckboxProps['styles']`                        | -          |

### classNames / styles 插槽

`classNames` 与 `styles` 使用相同的 slot key。

| 插槽名      | 说明       |
| ----------- | ---------- |
| `root`      | 根容器     |
| `input`     | 原生输入框 |
| `control`   | 控件区域   |
| `label`     | 标签区域   |
| `indicator` | 勾选标记   |

## 主题变量 (Design Token)

| Token Name                               | Description      | Default               |
| ---------------------------------------- | ---------------- | --------------------- |
| `components.checkbox.size.sm`            | 小尺寸勾选框边长 | `14px`                |
| `components.checkbox.size.md`            | 中尺寸勾选框边长 | `16px`                |
| `components.checkbox.size.lg`            | 大尺寸勾选框边长 | `20px`                |
| `components.checkbox.borderRadius`       | 勾选框圆角       | `4px`                 |
| `components.checkbox.borderColor`        | 默认边框颜色     | `#d9d9d9`             |
| `components.checkbox.checkedBorderColor` | 选中边框颜色     | `#1890ff`             |
| `components.checkbox.checkedBg`          | 选中背景色       | `#1890ff`             |
| `components.checkbox.disabledBg`         | 禁用背景色       | `#fafafa`             |
| `components.checkbox.labelColor`         | 标签文字颜色     | `rgba(0, 0, 0, 0.88)` |
| `components.checkbox.iconColor`          | 勾选图标颜色     | `#ffffff`             |
| `components.checkbox.focusRingColor`     | 焦点高亮颜色     | `#1890ff`             |

Checkbox 还会跟随全局 `colors.primary`、`colors.border`、`colors.background`、`colors.text`、`colors.textDisabled`、`spacing.sm`、`fontSize.*` 与 `borderRadius.sm` 等 token 变化，但组件级覆盖优先使用 `components.checkbox.*`。
