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

### 受控下拉展开

通过 `open` 和 `onOpenChange` 控制下拉菜单的展开与收起，适合和外部筛选面板、引导流程或自定义按钮联动。

```tsx
import React, { useState } from 'react'
import { Select } from '@xinghunm/compass-ui'

export default () => {
  const [open, setOpen] = useState(false)

  const options = [
    { label: 'Jack', value: 'jack' },
    { label: 'Lucy', value: 'lucy' },
    { label: 'Yiminghe', value: 'yiminghe' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 8 }}>Dropdown Status: {open ? 'Open' : 'Closed'}</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <button onClick={() => setOpen(true)}>Open</button>
        <button onClick={() => setOpen(false)}>Close</button>
      </div>
      <Select
        open={open}
        onOpenChange={setOpen}
        options={options}
        placeholder="Controlled dropdown"
        style={{ width: 240 }}
      />
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
        global: false,
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

### 自定义类名

通过 `classNames` 属性可以精细控制组件内部各个部分的类名，配合 CSS 实现定制样式。

```tsx
import React from 'react'
import { Select } from '@xinghunm/compass-ui'

export default () => {
  const options = [
    { label: 'Jack', value: 'jack' },
    { label: 'Lucy', value: 'lucy' },
    { label: 'Yiminghe', value: 'yiminghe' },
  ]

  return (
    <>
      <style>{`
        .my-select-root {
          width: 200px
        }
        .my-select-trigger {
          border: 1px solid #1890ff !important;
          background-color: #e6f7ff !important;
        }
        .my-select-dropdown {
          background-color: #f0f5ff !important;
          border: 2px solid #1890ff !important;
        }
        .my-select-option {
          color: #1890ff !important;
          font-weight: bold;
        }
        .my-select-option:hover {
          background-color: #bae7ff !important;
        }
      `}</style>
      <Select
        options={options}
        placeholder="Custom classNames"
        classNames={{
          root: 'my-select-root',
          trigger: 'my-select-trigger',
          dropdown: 'my-select-dropdown',
          option: 'my-select-option',
        }}
      />
    </>
  )
}
```

### CSS 变量覆盖

你也可以直接通过设置 CSS 变量来定制样式，这在局部调整或非 React 环境下非常有用。

```tsx
import React from 'react'
import { Select } from '@xinghunm/compass-ui'

export default () => {
  const options = [
    { label: 'Jack', value: 'jack' },
    { label: 'Lucy', value: 'lucy' },
    { label: 'Yiminghe', value: 'yiminghe' },
  ]

  return (
    <div
      style={
        {
          //这里为了演示使用了内联样式，你也可以在 CSS 文件中定义
          '--compass-components-select-border-radius': '20px',
          '--compass-components-select-background-color': '#f6ffed',
          '--compass-components-select-border-color': '#b7eb8f',
          '--compass-components-select-option-selected-bg': '#d9f7be',
        } as React.CSSProperties
      }
    >
      <Select
        options={options}
        defaultValue="jack"
        style={{ width: 200 }}
        placeholder="CSS Variable Override"
      />
    </div>
  )
}
```

### 自定义选项与标签渲染

使用 `optionRender` 自定义下拉列表项的显示，使用 `labelRender` 自定义选中后在选择框内的显示。

```tsx
import React from 'react'
import { Select, Space } from '@xinghunm/compass-ui'

export default () => {
  const options = [
    { value: '1', label: '用户 A', desc: '管理员', icon: '👤' },
    { value: '2', label: '用户 B', desc: '编辑', icon: '✍️' },
    { value: '3', label: '用户 C', desc: '访客', icon: '👁️' },
  ]

  return (
    <Select
      options={options}
      placeholder="自定义渲染演示"
      style={{ width: 240 }}
      optionRender={(option, { index }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span role="img">{option.icon}</span>
          <div>
            <div style={{ fontWeight: 'bold' }}>{option.label}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {option.desc} (Index: {index})
            </div>
          </div>
        </div>
      )}
      labelRender={(option) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span role="img">{option.icon}</span>
          <span>
            {option.label} - {option.desc}
          </span>
        </div>
      )}
    />
  )
}
```

### 扩展菜单

使用 `popupRender` 对下拉菜单进行自由扩展。

```tsx
import React, { useState } from 'react'
import { Select, InputField, Button } from '@xinghunm/compass-ui'

export default () => {
  const [name, setName] = useState('')
  const [items, setItems] = useState(['jack', 'lucy'])

  const options = items.map((item) => ({ label: item, value: item }))

  const addItem = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    setItems((prev) => [...prev, trimmed])
    setName('')
  }

  return (
    <Select
      style={{ width: 300 }}
      placeholder="custom dropdown render"
      options={options}
      popupRender={(menu) => (
        <>
          {menu}
          <div style={{ borderTop: '1px solid #f0f0f0', margin: '8px 0' }} />
          <div style={{ display: 'flex', gap: 8, padding: '0 8px 8px' }}>
            <InputField
              placeholder="Please enter item"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
            />
            <Button variant="text" onClick={addItem}>
              Add item
            </Button>
          </div>
        </>
      )}
    />
  )
}
```

### 配合 styled-components 使用

利用 `styled` 可以非常方便地封装带有一致样式的组件。为了能让样式覆盖到在 Portal 渲染的浮层，推荐使用高阶组件转发 `className`：

```tsx
/**
 * title: 配合 styled-components / emotion
 * description: 针对 Portal 渲染的组件，将 className 同时转发给下拉浮层即可优雅地封装样式。
 */
import React from 'react'
import styled from '@emotion/styled'
import { Select, SelectProps } from '@xinghunm/compass-ui'

// 1. 制作一个透明转发的 Wrapper，让下拉框浮层也带上 styled 的哈希类名
const SelectWrapper = ({ className, ...props }: SelectProps) => (
  <Select
    className={className}
    dropdownClassName={className} // 关键点
    {...props}
  />
)

// 2. 利用内部静态类名进行样式覆盖
const StyledSelect = styled(SelectWrapper)`
  /* 1. 针对触发器本身的样式 */
  &.compass-select {
    width: 200px;

    .compass-select-selector {
      border-radius: 8px;
      border-color: #13c2c2;
      background-color: #f6ffed;
    }
  }

  /* 2. 针对下拉浮层的样式 */
  &.compass-select-dropdown {
    border-radius: 8px;
    padding: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    .compass-select-option {
      border-radius: 4px;
      color: #13c2c2;

      &:hover {
        background: #f6ffed;
      }
    }
  }
`

export default () => {
  const options = [
    { label: 'Jack', value: 'jack' },
    { label: 'Lucy', value: 'lucy' },
    { label: 'Yiminghe', value: 'yiminghe' },
  ]

  return <StyledSelect options={options} placeholder="Styled Select" />
}
```

## API

通用属性参考：[通用属性](/guide/common-props)

### Select

| 参数                 | 说明                   | 类型                                                                              | 默认值     |
| -------------------- | ---------------------- | --------------------------------------------------------------------------------- | ---------- |
| options              | 数据化配置选项内容     | `SelectOption[]`                                                                  | `[]`       |
| value                | 指定当前选中的条目     | `SelectValue`                                                                     | -          |
| defaultValue         | 指定默认选中的条目     | `SelectValue`                                                                     | -          |
| onChange             | 选中 option 时调用     | `(value: SelectValue, option?: SelectOption \| SelectOption[]) => void`           | -          |
| open                 | 受控的下拉展开状态     | `boolean`                                                                         | -          |
| onOpenChange         | 下拉展开状态变化时触发 | `(open: boolean) => void`                                                         | -          |
| children             | JSX 方式配置选项       | `ReactNode`                                                                       | -          |
| disabled             | 是否禁用               | `boolean`                                                                         | `false`    |
| loading              | 加载中状态             | `boolean`                                                                         | `false`    |
| allowClear           | 支持清除               | `boolean`                                                                         | `false`    |
| placeholder          | 选择框默认文字         | `string`                                                                          | -          |
| multiple             | 支持多选               | `boolean`                                                                         | `false`    |
| mode                 | 设置 Select 的模式     | `'multiple' \| 'tags'`                                                            | -          |
| showSearch           | 是否展示搜索框         | `boolean`                                                                         | `false`    |
| trigger              | 打开下拉菜单的触发方式 | `'click' \| 'hover'`                                                              | `'click'`  |
| size                 | 选择框大小             | `'small' \| 'medium' \| 'large'`                                                  | `'medium'` |
| status               | 设置校验状态           | `'error' \| 'warning'`                                                            | -          |
| dropdownStyle        | 下拉菜单样式           | `React.CSSProperties`                                                             | -          |
| dropdownClassName    | 下拉菜单类名           | `string`                                                                          | -          |
| menuItemSelectedIcon | 下拉选项选中图标       | `ReactNode`                                                                       | -          |
| styles               | 内部组件样式           | `{ root, trigger, dropdown, option, tag }`                                        | -          |
| classNames           | 内部组件类名           | `{ root, trigger, dropdown, option, tag }`                                        | -          |
| optionRender         | 自定义下拉选项渲染     | `(option: SelectOption, info: { index: number; selected: boolean }) => ReactNode` | -          |
| popupRender          | 自定义下拉弹层渲染     | `(menu: ReactNode) => ReactNode`                                                  | -          |
| labelRender          | 自定义选择框标签渲染   | `(props: SelectOption) => ReactNode`                                              | -          |

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
