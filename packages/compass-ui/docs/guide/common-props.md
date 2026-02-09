---
title: 通用属性
nav:
  title: 指南
  order: 1
group:
  title: 基础
  order: 2
---

# 通用属性

Compass UI 的组件大多数都支持以下通用属性，以便于开发者进行样式定制和功能扩展。

## 基础样式属性

| 属性名      | 说明       | 类型                  | 备注                       |
| ----------- | ---------- | --------------------- | -------------------------- |
| `className` | 自定义类名 | `string`              | 会追加到组件的最外层元素上 |
| `style`     | 自定义样式 | `React.CSSProperties` | 会应用到组件的最外层元素上 |

## 细粒度样式定制 (Granular Styling)

为了提供更灵活的样式定制能力，Compass UI 的复杂组件支持 `classNames` 和 `styles` 属性，允许精确控制组件内部的各个部分。

### classNames

**类型**：`Record<string, string>`
**说明**：用于自定义组件内部各个语义化元素的 CSS 类名。

每个组件的 `classNames` 对象包含的键值取决于组件的内部结构。常见的键包括：

- `root` - 组件的根元素
- `trigger` / `input` / `header` - 组件的主要交互元素
- `dropdown` / `popup` / `content` - 浮层或内容区域
- `option` / `item` / `node` - 列表项或子元素

**示例**：

```tsx | pure
<Tree
  classNames={{
    root: 'my-tree',
    node: 'my-node',
    content: 'my-content',
  }}
/>
```

### styles

**类型**：`Record<string, React.CSSProperties>`
**说明**：用于自定义组件内部各个语义化元素的内联样式。

`styles` 对象的键与 `classNames` 对象一致，值为标准的 React `CSSProperties` 对象。

**示例**：

```tsx | pure
<Select
  styles={{
    root: { width: '100%' },
    dropdown: { backgroundColor: '#f9f9f9' },
    option: { padding: '8px 12px' },
  }}
/>
```

### 使用场景

1. **全局样式覆盖**：通过 `classNames` 添加自定义类名，在全局 CSS 中定义样式
2. **局部样式调整**：通过 `styles` 快速调整特定组件实例的样式
3. **主题定制**：结合 CSS Modules 或 CSS-in-JS 方案实现主题化

### 注意事项

- `classNames` 和 `styles` 是**细粒度控制属性**，适用于需要精确控制组件内部元素样式的场景
- 不同组件支持的 `classNames` / `styles` 键不同，请参考各组件 API 文档中的说明
- 推荐优先使用 Design Token 方式进行主题定制，仅在 Token 无法满足需求时使用这些属性
