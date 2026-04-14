---
title: InputField 兼容输入框
nav:
  title: 组件
  order: 2
group:
  title: 数据录入
  order: 2
---

# InputField 兼容输入框

`InputField` 在当前阶段仍然保留，但它已经不再是推荐的默认入口。新代码请优先使用 [`Input`](/components/input)。

## 当前定位

- `InputField` 保留给已有业务代码做平滑兼容
- 它与 `Input` 共享同一套底层实现、类型和样式契约
- 后续文档、示例与公开叙事都会优先围绕 `Input`

## 推荐迁移方式

### 新代码

```tsx
import React from 'react'
import { Input } from '@xinghunm/compass-ui'

export default () => <Input placeholder="请输入内容" />
```

### 兼容旧代码

```tsx
import React from 'react'
import { InputField } from '@xinghunm/compass-ui'

export default () => <InputField placeholder="旧代码仍可继续工作" />
```

## 迁移建议

1. 新增页面或新组件时直接使用 `Input`
2. 既有业务代码可以继续保留 `InputField`
3. 当你已经在调整相关表单或输入组件时，再顺手把 `InputField` 改为 `Input`

## 兼容范围

- `size`
- `status`
- `disabled`
- `allowClear`
- `prefix` / `suffix`
- `type="password"` 与 `type="search"`
- `onPressEnter`

## 说明

如果你只是想找标准化的单行文本输入，请直接跳到 [`Input`](/components/input)。如果你需要多行输入，请使用 [`Textarea`](/components/textarea)。
