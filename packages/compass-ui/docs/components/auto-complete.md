---
title: AutoComplete 自动完成
nav:
  title: 组件
  order: 2
group:
  title: 数据录入
  order: 2
---

# AutoComplete 自动完成

输入框自动完成功能。

## 何时使用

需要自动完成时。

## 代码演示

### 基础用法

基本使用。通过 `options` 设置自动完成的数据源。

```tsx
import React, { useState } from 'react'
import { AutoComplete } from '@xinghunm/compass-ui'

const mockVal = (str: string) => {
  return [{ value: `${str}@gmail.com` }, { value: `${str}@163.com` }, { value: `${str}@qq.com` }]
}

export default () => {
  const [value, setValue] = useState('')
  const [options, setOptions] = useState<{ value: string }[]>([])

  const onSearch = (searchText: string) => {
    setOptions(!searchText ? [] : mockVal(searchText))
  }

  const onSelect = (data: string) => {
    console.log('onSelect', data)
  }

  const onChange = (data: string) => {
    setValue(data)
  }

  return (
    <>
      <AutoComplete
        options={options}
        style={{ width: 200 }}
        onSelect={onSelect}
        onSearch={onSearch}
        placeholder="input here"
      />
      <br />
      <br />
      <AutoComplete
        value={value}
        options={options}
        style={{ width: 200 }}
        onSelect={onSelect}
        onSearch={onSearch}
        onChange={onChange}
        placeholder="controlled mode"
      />
    </>
  )
}
```

### 自定义选项

可以自定义选项的显示内容。

```tsx
import React, { useState } from 'react'
import { AutoComplete } from '@xinghunm/compass-ui'

export default () => {
  const [options, setOptions] = useState<{ value: string; label: React.ReactNode }[]>([])

  const handleSearch = (value: string) => {
    setOptions(
      !value
        ? []
        : [
            { value, label: <span>Found: {value}</span> },
            {
              value: `${value}${value}`,
              label: (
                <span>
                  Found: {value}
                  {value}
                </span>
              ),
            },
          ],
    )
  }

  return (
    <AutoComplete
      style={{ width: 200 }}
      onSearch={handleSearch}
      placeholder="input here"
      options={options}
    />
  )
}
```

### 不区分大小写

默认情况下已经是不区分大小写过滤。

```tsx
import React from 'react'
import { AutoComplete } from '@xinghunm/compass-ui'

const options = [{ value: 'Burns Bay Road' }, { value: 'Downing Street' }, { value: 'Wall Street' }]

export default () => (
  <AutoComplete
    style={{ width: 200 }}
    options={options}
    placeholder="try to type `b`"
    filterOption={(inputValue, option) =>
      option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
    }
  />
)
```

### 更多功能

展示 `notFoundContent`、`dropdownMatchSelectWidth`、`allowClear` 等属性。

```tsx
import React from 'react'
import { AutoComplete } from '@xinghunm/compass-ui'

const options = [
  { value: 'Option 1' },
  { value: 'Option 2' },
  { value: 'Very Long Option Text For Test Dropdown Match Select Width' },
]

export default () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    {/* notFoundContent */}
    <AutoComplete
      style={{ width: 200 }}
      options={[]}
      placeholder="notFoundContent"
      notFoundContent="No Data Found"
    />

    {/* dropdownMatchSelectWidth={false} */}
    <AutoComplete
      style={{ width: 150 }}
      options={options}
      placeholder="width false"
      dropdownMatchSelectWidth={false}
    />

    {/* allowClear */}
    <AutoComplete
      style={{ width: 200 }}
      options={options}
      placeholder="allowClear"
      onSelect={(val) => console.log('select', val)}
      allowClear
    />

    {/* disabled */}
    <AutoComplete style={{ width: 200 }} options={options} placeholder="disabled" disabled />
  </div>
)
```

### 事件示例

```tsx
import React from 'react'
import { AutoComplete } from '@xinghunm/compass-ui'

const options = [{ value: 'Option 1' }, { value: 'Option 2' }]

export default () => {
  const [logs, setLogs] = React.useState<string[]>([])

  const appendLog = (msg: string) => {
    setLogs((prev) => [`${new Date().toLocaleTimeString()} - ${msg}`, ...prev].slice(0, 5))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <AutoComplete
        style={{ width: 200 }}
        options={options}
        placeholder="Try events"
        onFocus={() => appendLog('focus')}
        onBlur={() => appendLog('blur')}
        onChange={(val) => appendLog(`change: ${val}`)}
        onSelect={(val) => appendLog(`select: ${val}`)}
        onSearch={(val) => appendLog(`search: ${val}`)}
      />
      <div
        style={{
          border: '1px solid #f0f0f0',
          padding: 8,
          borderRadius: 4,
          background: '#fafafa',
          minHeight: 100,
          fontFamily: 'monospace',
          fontSize: 12,
        }}
      >
        {logs.length === 0 ? (
          <span style={{ color: '#ccc' }}>Event logs will appear here...</span>
        ) : (
          logs.map((log, i) => <div key={i}>{log}</div>)
        )}
      </div>
    </div>
  )
}
```

### 自定义样式

通过 `classNames` 和 `styles` 传入对象可以自定义 AutoComplete 的语义化结构样式。

支持的语义化结构：`root`, `input`, `dropdown`, `option`。

```tsx
import React, { useState } from 'react'
import { AutoComplete } from '@xinghunm/compass-ui'

export default () => {
  const options = [{ value: 'Option 1' }, { value: 'Option 2' }, { value: 'Option 3' }]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <style>
        {`
          .my-dropdown-class {
            border: 1px solid #1677ff;
            background-color: #e6f7ff;
          }
          .my-option-class {
            font-weight: bold;
          }
        `}
      </style>
      <AutoComplete
        style={{ width: 300 }}
        options={options}
        placeholder="Custom Semantic Styles"
        styles={{
          input: { height: 40, borderRadius: 20 },
          dropdown: { backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' },
          option: { color: 'green' },
        }}
        classNames={{
          dropdown: 'my-dropdown-class',
          option: 'my-option-class',
        }}
      />
    </div>
  )
}
```

### 带有图标

通过 `prefix` 或 `suffix` 属性可以添加前缀或后缀图标，支持自定义图标组件。

```tsx
import React, { useState } from 'react'
import { AutoComplete } from '@xinghunm/compass-ui'

const SearchIcon = () => (
  <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
    <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z" />
  </svg>
)

const mockVal = (str: string) => {
  return [{ value: `${str}@gmail.com` }, { value: `${str}@163.com` }, { value: `${str}@qq.com` }]
}

export default () => {
  const [options, setOptions] = useState<{ value: string }[]>([])

  const onSearch = (searchText: string) => {
    setOptions(!searchText ? [] : mockVal(searchText))
  }

  return (
    <AutoComplete
      prefix={<SearchIcon />}
      style={{ width: 250 }}
      options={options}
      onSearch={onSearch}
      placeholder="Search..."
    />
  )
}
```

### 远程搜索

通过 `onSearch` 实现远程搜索。注意 `onSearch` 只在输入值变化时触发，而选中选项时不会触发，这可以避免选中后的重复搜索。

```tsx
import React, { useState } from 'react'
import { AutoComplete } from '@xinghunm/compass-ui'

const getRandomInt = (max: number, min = 0) => Math.floor(Math.random() * (max - min + 1)) + min

const searchResult = (query: string) =>
  new Array(getRandomInt(5))
    .join('.')
    .split('.')
    .map((_, idx) => {
      const category = `${query}${idx}`
      return {
        value: category,
        label: (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>
              Found {query} on{' '}
              <a
                href={`https://s.taobao.com/search?q=${query}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {category}
              </a>
            </span>
            <span>{getRandomInt(200, 100)} results</span>
          </div>
        ),
      }
    })

export default () => {
  const [options, setOptions] = useState<any[]>([])
  const [logs, setLogs] = useState<string[]>([])

  const appendLog = (msg: string) => {
    setLogs((prev) => [`${new Date().toLocaleTimeString()} - ${msg}`, ...prev].slice(0, 5))
  }

  const handleSearch = (value: string) => {
    appendLog(`[onSearch] Fetching data for "${value}"...`)
    setOptions(value ? searchResult(value) : [])
  }

  const handleChange = (value: string) => {
    appendLog(`[onChange] Input value changed to "${value}"`)
  }

  const handleSelect = (value: string) => {
    appendLog(`[onSelect] Selected "${value}"`)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p>Try typing "a" and then selecting an option:</p>

      <AutoComplete
        style={{ width: 300 }}
        options={options}
        onSearch={handleSearch}
        onChange={handleChange}
        onSelect={handleSelect}
        placeholder="Search remote data..."
      />

      <div
        style={{
          border: '1px solid #f0f0f0',
          padding: 8,
          borderRadius: 4,
          background: '#fafafa',
          fontFamily: 'monospace',
          fontSize: 12,
          minHeight: 120,
        }}
      >
        {logs.length === 0 ? (
          <span style={{ color: '#ccc' }}>Logs will appear here...</span>
        ) : (
          logs.map((log, i) => (
            <div key={i} style={{ color: log.includes('[onSearch]') ? '#1677ff' : '#333' }}>
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
```

### 自定义主题

通过 `ConfigProvider` 自定义 Input 样式。

```tsx
import React from 'react'
import { AutoComplete, ConfigProvider } from '@xinghunm/compass-ui'

export default () => {
  const options = [{ value: 'Option 1' }, { value: 'Option 2' }, { value: 'Option 3' }]

  return (
    <ConfigProvider
      theme={{
        global: false,
        token: {
          components: {
            input: {
              borderRadius: '20px',
              activeBorderColor: '#722ed1',
              hoverBorderColor: '#b37feb',
            },
          },
        },
      }}
    >
      <AutoComplete options={options} placeholder="Custom Theme" style={{ width: 200 }} />
    </ConfigProvider>
  )
}
```

## API

通用属性参考：[通用属性](/guide/common-props)

支持 [InputField](/components/input-field) 的所有属性，如 `prefix`, `suffix`, `allowClear`, `size`, `bordered` 等。

| 参数                     | 说明                                                                                                                                             | 类型                                                                       | 默认值  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ------- |
| value                    | 当前输入框的值                                                                                                                                   | `string`                                                                   | -       |
| defaultValue             | 默认选中项                                                                                                                                       | `string`                                                                   | -       |
| options                  | 数据化配置选项内容                                                                                                                               | [AutoCompleteOption[]](#autocompleteoption)                                | `[]`    |
| disabled                 | 是否禁用                                                                                                                                         | `boolean`                                                                  | `false` |
| filterOption             | 是否根据输入项进行筛选。当其为一个函数时，会接收 `inputValue` `option` 两个参数，当 `option` 符合筛选条件时，应返回 `true`，反之则返回 `false`。 | `boolean` \| `(inputValue: string, option: AutoCompleteOption) => boolean` | `true`  |
| dropdownMatchSelectWidth | 下拉菜单和选择器同宽。默认将设置 `min-width`，当值小于选择器宽度时会被忽略。false 时会关闭虚拟滚动                                               | `boolean` \| `number`                                                      | `true`  |
| notFoundContent          | 当下拉列表为空时显示的内容                                                                                                                       | `React.ReactNode`                                                          | -       |
| onSearch                 | 搜索补全项的时候调用。当用户输入内容变化时触发，选中选项时不会触发。                                                                             | `(value: string) => void`                                                  | -       |
| onSelect                 | 被选中时调用，参数为选中项的 value 值                                                                                                            | `(value: string, option: AutoCompleteOption) => void`                      | -       |
| onChange                 | 选中 option，或 input 的 value 变化时，调用此函数                                                                                                | `(value: string) => void`                                                  | -       |
| onFocus                  | 获得焦点时的回调                                                                                                                                 | `React.FocusEventHandler<HTMLInputElement>`                                | -       |
| onBlur                   | 失去焦点时的回调                                                                                                                                 | `React.FocusEventHandler<HTMLInputElement>`                                | -       |

## 键盘交互

| 按键             | 说明               |
| ---------------- | ------------------ |
| <kbd>Enter</kbd> | 选中当前高亮的选项 |
| <kbd>Esc</kbd>   | 关闭下拉菜单       |
| <kbd>↑</kbd>     | 上一个选项         |
| <kbd>↓</kbd>     | 下一个选项         |

## Interface

### AutoCompleteOption

| 参数          | 说明                            | 类型              | 默认值  |
| ------------- | ------------------------------- | ----------------- | ------- |
| value         | 选项的值                        | `string`          | -       |
| label         | 选项的显示内容                  | `React.ReactNode` | -       |
| disabled      | 是否禁用                        | `boolean`         | `false` |
| [key: string] | 允许包含任意其他自定义属性/字段 | `unknown`         | -       |

## 主题变量 (Design Token)

<details>
<summary>组件 Token (components.select / components.dropdown)</summary>

| 变量名                              | 说明                |
| ----------------------------------- | ------------------- |
| `components.dropdown.zIndex`        | 下拉菜单层级        |
| `components.dropdown.boxShadow`     | 下拉菜单阴影        |
| `components.select.backgroundColor` | 下拉菜单背景色      |
| `components.select.borderRadius`    | 下拉菜单圆角        |
| `components.select.optionColor`     | 选项文字颜色        |
| `components.select.optionHoverBg`   | 选项悬停/激活背景色 |

> 注：AutoComplete 的下拉菜单样式部分复用了 Select 和 Dropdown 的 Token。输入框部分的样式请参考 [Input 组件 Token](/components/input-field#主题变量-design-token)。

</details>

<details>
<summary>全局 Token</summary>

| 变量名                 | 说明                 |
| ---------------------- | -------------------- |
| `colors.primary`       | 主色调（高亮文本等） |
| `colors.text`          | 文本颜色             |
| `colors.textSecondary` | 次级文本颜色         |
| `colors.background`    | 背景色               |
| `fontSize.sm`          | 小字号               |
| `borderRadius.md`      | 中等圆角             |
| `shadows.lg`           | 大阴影               |

</details>
