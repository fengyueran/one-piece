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

### 自定义下拉框样式

可以通过 `dropdownClassName` and `dropdownStyle` 自定义下拉框样式。

```tsx
import React, { useState } from 'react'
import { AutoComplete } from '@xinghunm/compass-ui'

export default () => {
  const options = [{ value: 'Option 1' }, { value: 'Option 2' }, { value: 'Option 3' }]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <style>
        {`
          .custom-dropdown-class {
            border: 1px solid #1677ff;
            background-color: #e6f7ff;
          }
        `}
      </style>
      <AutoComplete
        style={{ width: 200 }}
        options={options}
        placeholder="Custom Dropdown Style"
        dropdownStyle={{
          backgroundColor: '#f6ffed',
          border: '1px solid #b7eb8f',
        }}
        dropdownClassName="custom-dropdown-class"
      />
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

| 参数                     | 说明                                                                                                                                             | 类型                                                                       | 默认值  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ------- |
| value                    | 当前输入框的值                                                                                                                                   | `string`                                                                   | -       |
| defaultValue             | 默认选中项                                                                                                                                       | `string`                                                                   | -       |
| options                  | 数据化配置选项内容                                                                                                                               | [AutoCompleteOption[]](#autocompleteoption)                                | `[]`    |
| allowClear               | 支持清除                                                                                                                                         | `boolean`                                                                  | `false` |
| disabled                 | 是否禁用                                                                                                                                         | `boolean`                                                                  | `false` |
| placeholder              | 输入框提示                                                                                                                                       | `string`                                                                   | -       |
| filterOption             | 是否根据输入项进行筛选。当其为一个函数时，会接收 `inputValue` `option` 两个参数，当 `option` 符合筛选条件时，应返回 `true`，反之则返回 `false`。 | `boolean` \| `(inputValue: string, option: AutoCompleteOption) => boolean` | `true`  |
| dropdownMatchSelectWidth | 下拉菜单和选择器同宽。默认将设置 `min-width`，当值小于选择器宽度时会被忽略。false 时会关闭虚拟滚动                                               | `boolean` \| `number`                                                      | `true`  |
| notFoundContent          | 当下拉列表为空时显示的内容                                                                                                                       | `React.ReactNode`                                                          | -       |
| onSearch                 | 搜索补全项的时候调用。当用户输入内容变化时触发，选中选项时不会触发。                                                                             | `(value: string) => void`                                                  | -       |
| onSelect                 | 被选中时调用，参数为选中项的 value 值                                                                                                            | `(value: string, option: AutoCompleteOption) => void`                      | -       |
| onChange                 | 选中 option，或 input 的 value 变化时，调用此函数                                                                                                | `(value: string) => void`                                                  | -       |
| onFocus                  | 获得焦点时的回调                                                                                                                                 | `React.FocusEventHandler<HTMLInputElement>`                                | -       |
| onBlur                   | 失去焦点时的回调                                                                                                                                 | `React.FocusEventHandler<HTMLInputElement>`                                | -       |

## Interface

### AutoCompleteOption

| 参数  | 说明           | 类型              | 默认值 |
| ----- | -------------- | ----------------- | ------ |
| value | 选项的值       | `string`          | -      |
| label | 选项的显示内容 | `React.ReactNode` | -      |
