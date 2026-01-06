---
title: Select 选择器
nav:
  title: 组件
  order: 2
group:
  title: 数据录入
  order: 2
---

# Select 选择器

下拉选择器。

## 何时使用

- **基础选择**：当选项比较多时，使用下拉菜单节省页面空间。
- **多选 (Multiple)**：当用户需要从**固定列表**中选择多个项时（如：选择所属部门、选择星期几）。
- **标签输入 (Tags)**：当用户通过选择**或者输入**来设置标签时。常用于：
  - **文章标签**：既可选热门标签，也可输入新标签。
  - **邮件接收人**：既可选通讯录好友，也可输入陌生人邮箱。
  - **自定义分类**：允许用户创建系统不存在的新分类。
- 当选项少于 5 项时，建议直接将选项平铺，使用 Radio 是更好的选择。

## 代码演示

### 基础用法

最简单的用法。

```tsx
import React from 'react'
import { Select } from '@xinghunm/compass-ui'

export default () => {
  const options = [
    { label: 'Jack', value: 'jack' },
    { label: 'Lucy', value: 'lucy' },
    { label: 'Yiminghe', value: 'yiminghe' },
    { label: 'Disabled', value: 'disabled', disabled: true },
  ]

  return <Select options={options} placeholder="Select a person" style={{ width: 200 }} />
}
```

### 多选模式

多选模式下允许选择多个选项。

```tsx
import React from 'react'
import { Select } from '@xinghunm/compass-ui'

export default () => {
  const options = [
    { label: 'Jack', value: 'jack' },
    { label: 'Lucy', value: 'lucy' },
    { label: 'Yiminghe', value: 'yiminghe' },
    { label: 'David', value: 'david' },
    { label: 'Frank', value: 'frank' },
  ]

  return (
    <Select
      options={options}
      multiple
      defaultValue={['lucy', 'jack']}
      placeholder="Select multiple items"
      style={{ width: 300 }}
    />
  )
}
```

### 带搜索框

展开后可输入关键字进行过滤。

```tsx
import React from 'react'
import { Select } from '@xinghunm/compass-ui'

export default () => {
  const options = [
    { label: 'Jack', value: 'jack' },
    { label: 'Lucy', value: 'lucy' },
    { label: 'Yiminghe', value: 'yiminghe' },
    { label: 'David', value: 'david' },
  ]

  return (
    <Select
      showSearch
      options={options}
      placeholder="Search to Select"
      style={{ width: 200 }}
      onChange={(value) => console.log('Search selected:', value)}
    />
  )
}
```

### 标签模式

可以从列表中选择，也可以直接输入内容按回车创建新标签。

```tsx
import React, { useState } from 'react'
import { Select } from '@xinghunm/compass-ui'

export default () => {
  const [value, setValue] = useState([])

  const options = [
    { label: 'Jack', value: 'jack' },
    { label: 'Lucy', value: 'lucy' },
    { label: 'Yiminghe', value: 'yiminghe' },
  ]

  return (
    <Select
      mode="tags"
      showSearch
      value={value}
      onChange={setValue}
      options={options}
      style={{ width: 300 }}
      placeholder="Select or type new tags"
    />
  )
}
```

### 禁用状态

选择器不可用状态。

```tsx
import React from 'react'
import { Select } from '@xinghunm/compass-ui'

export default () => {
  const options = [
    { label: 'Jack', value: 'jack' },
    { label: 'Lucy', value: 'lucy' },
  ]

  return <Select options={options} disabled defaultValue="lucy" style={{ width: 200 }} />
}
```

### 加载状态

加载中状态。

```tsx
import React from 'react'
import { Select } from '@xinghunm/compass-ui'

export default () => {
  return <Select loading placeholder="Loading state" style={{ width: 200 }} />
}
```

### 支持清除

支持清除选中的内容。

```tsx
import React from 'react'
import { Select } from '@xinghunm/compass-ui'

export default () => {
  const options = [
    { label: 'Jack', value: 'jack' },
    { label: 'Lucy', value: 'lucy' },
  ]

  return (
    <Select
      options={options}
      allowClear
      defaultValue="lucy"
      placeholder="Hover to clear"
      style={{ width: 200 }}
    />
  )
}
```

###三种尺寸

三种大小的选择框。

```tsx
import React from 'react'
import { Select } from '@xinghunm/compass-ui'

export default () => {
  const options = [
    { label: 'Jack', value: 'jack' },
    { label: 'Lucy', value: 'lucy' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Select options={options} size="small" placeholder="Small" style={{ width: 200 }} />
      <Select options={options} size="medium" placeholder="Medium" style={{ width: 200 }} />
      <Select options={options} size="large" placeholder="Large" style={{ width: 200 }} />
    </div>
  )
}
```

### 校验状态

错误和警告状态。

```tsx
import React from 'react'
import { Select } from '@xinghunm/compass-ui'

export default () => {
  const options = [
    { label: 'Jack', value: 'jack' },
    { label: 'Lucy', value: 'lucy' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Select options={options} status="error" placeholder="Error" style={{ width: 200 }} />
      <Select options={options} status="warning" placeholder="Warning" style={{ width: 200 }} />
    </div>
  )
}
```

### 受控模式

通过 `value` 和 `onChange` 控制组件状态。

```tsx
import React, { useState } from 'react'
import { Select } from '@xinghunm/compass-ui'

export default () => {
  const [value, setValue] = useState('lucy')

  const options = [
    { label: 'Jack', value: 'jack' },
    { label: 'Lucy', value: 'lucy' },
    { label: 'Yiminghe', value: 'yiminghe' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 8 }}>Current Value: {value}</div>
      <Select value={value} onChange={setValue} options={options} style={{ width: 200 }} />
      <div style={{ marginTop: 8 }}>
        <button onClick={() => setValue('jack')} style={{ marginRight: 8 }}>
          Set Jack
        </button>
        <button onClick={() => setValue('lucy')}>Set Lucy</button>
      </div>
    </div>
  )
}
```

### 自定义主题

自定义颜色和圆角。

```tsx
import React from 'react'
import { Select, ConfigProvider } from '@xinghunm/compass-ui'

export default () => {
  const options = [
    { label: 'Jack', value: 'jack' },
    { label: 'Lucy', value: 'lucy' },
    { label: 'Yiminghe', value: 'yiminghe' },
  ]

  return (
    <ConfigProvider
      theme={{
        token: {
          colors: { primary: '#722ed1' },
          components: {
            select: {
              borderRadius: '20px',
              borderColor: '#722ed1',
              optionSelectedBg: '#f9f0ff',
              tagBg: '#722ed1',
              tagColor: '#fff',
            },
          },
        },
      }}
    >
      <Select
        options={options}
        defaultValue={['jack', 'lucy']}
        mode="multiple"
        style={{ width: 300 }}
      />
    </ConfigProvider>
  )
}
```

## API

### Select

| 参数         | 说明                   | 类型                                                                   | 默认值     |
| ------------ | ---------------------- | ---------------------------------------------------------------------- | ---------- |
| options      | 数据化配置选项内容     | `SelectOption[]`                                                       | `[]`       |
| value        | 指定当前选中的条目     | `SelectValue`                                                          | -          |
| defaultValue | 指定默认选中的条目     | `SelectValue`                                                          | -          |
| onChange     | 选中 option 时调用     | `(value: SelectValue, option: SelectOption \| SelectOption[]) => void` | -          |
| disabled     | 是否禁用               | `boolean`                                                              | `false`    |
| loading      | 加载中状态             | `boolean`                                                              | `false`    |
| allowClear   | 支持清除               | `boolean`                                                              | `false`    |
| placeholder  | 选择框默认文字         | `string`                                                               | -          |
| multiple     | 支持多选               | `boolean`                                                              | `false`    |
| mode         | 设置 Select 的模式     | `'multiple' \| 'tags'`                                                 | -          |
| size         | 选择框大小             | `'small' \| 'medium' \| 'large'`                                       | `'medium'` |
| status       | 设置校验状态           | `'error' \| 'warning'`                                                 | -          |
| filterOption | 是否根据输入项进行筛选 | `boolean \| ((inputValue, option) => boolean)`                         | `true`     |
| className    | 自定义类名             | `string`                                                               | -          |
| style        | 自定义样式             | `React.CSSProperties`                                                  | -          |

### SelectOption

| 参数     | 说明           | 类型               | 默认值  |
| -------- | -------------- | ------------------ | ------- |
| label    | 选项显示的内容 | `ReactNode`        | -       |
| value    | 选项的值       | `string \| number` | -       |
| disabled | 是否禁用该选项 | `boolean`          | `false` |

## 主题变量 (Design Token)

### 组件 Token

| Token Name                           | Description    |
| ------------------------------------ | -------------- |
| `components.select.borderRadius`     | 边框圆角       |
| `components.select.backgroundColor`  | 背景颜色       |
| `components.select.borderColor`      | 边框颜色       |
| `components.select.placeholderColor` | 占位符颜色     |
| `components.select.optionSelectedBg` | 选项选中背景色 |
| `components.select.optionHoverBg`    | 选项悬停背景色 |
| `components.select.tagBg`            | 标签背景色     |
| `components.select.tagColor`         | 标签文字颜色   |

### 全局 Token

| Token Name             | Description  |
| ---------------------- | ------------ |
| `colors.primary`       | 主色调       |
| `colors.border`        | 边框颜色     |
| `colors.background`    | 背景颜色     |
| `colors.text`          | 文本颜色     |
| `colors.textSecondary` | 次级文本颜色 |
| `borderRadius.md`      | 默认圆角     |
