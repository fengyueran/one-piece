# Button API

按钮组件，用于触发操作和事件。

## 导入

```tsx
import { Button } from '@xinghunm/compass-ui'
```

## 基本用法

```tsx
<Button>Default Button</Button>
<Button variant="primary">Primary Button</Button>
<Button variant="primary" size="large">Large Button</Button>
```

## Props

| 属性          | 类型                                                     | 默认值      | 描述                        |
| ------------- | -------------------------------------------------------- | ----------- | --------------------------- |
| variant       | `'primary' \| 'default' \| 'dashed' \| 'text' \| 'link'` | `'default'` | 按钮变体样式                |
| size          | `'small' \| 'default' \| 'large'`                        | `'default'` | 按钮尺寸                    |
| disabled      | `boolean`                                                | `false`     | 是否禁用                    |
| loading       | `boolean`                                                | `false`     | 是否加载中                  |
| danger        | `boolean`                                                | `false`     | 是否为危险按钮              |
| block         | `boolean`                                                | `false`     | 是否为块级按钮（宽度 100%） |
| icon          | `ReactNode`                                              | -           | 图标元素                    |
| hasRipple     | `boolean`                                                | `true`      | 是否显示波纹效果            |
| rippleBgColor | `string`                                                 | -           | 波纹背景颜色                |
| rippleOpacity | `number`                                                 | -           | 波纹透明度                  |
| onClick       | `(event: React.MouseEvent<HTMLButtonElement>) => void`   | -           | 点击事件处理函数            |
| className     | `string`                                                 | -           | 自定义类名                  |
| style         | `React.CSSProperties`                                    | -           | 自定义样式                  |
| children      | `ReactNode`                                              | -           | 按钮内容                    |

## 变体 (Variants)

### Primary

主要按钮，用于主要操作。

```tsx
<Button variant="primary">Primary Button</Button>
```

**样式特征：**

- 背景色：主题色 (`theme.colors.primary`)
- 文本色：白色
- 具有 hover 和 active 状态

### Default

默认按钮，用于次要操作。

```tsx
<Button variant="default">Default Button</Button>
```

**样式特征：**

- 背景色：白色
- 边框：灰色
- 文本色：深色

### Dashed

虚线按钮，用于辅助操作。

```tsx
<Button variant="dashed">Dashed Button</Button>
```

**样式特征：**

- 虚线边框
- 透明背景

### Text

文本按钮，用于弱化操作。

```tsx
<Button variant="text">Text Button</Button>
```

**样式特征：**

- 无边框
- 透明背景
- hover 时显示背景

### Link

链接按钮，样式类似超链接。

```tsx
<Button variant="link">Link Button</Button>
```

**样式特征：**

- 无边框和背景
- 主题色文本
- hover 时颜色加深

## 尺寸 (Sizes)

### Small

小尺寸按钮。

```tsx
<Button size="small">Small</Button>
```

**尺寸：**

- 高度：24px
- 字体：12px
- 内边距：0 8px

### Default

默认尺寸按钮。

```tsx
<Button size="default">Default</Button>
```

**尺寸：**

- 高度：32px
- 字体：14px
- 内边距：0 16px

### Large

大尺寸按钮。

```tsx
<Button size="large">Large</Button>
```

**尺寸：**

- 高度：40px
- 字体：16px
- 内边距：0 16px

## 状态 (States)

### Disabled

禁用状态。

```tsx
<Button disabled>Disabled Button</Button>
```

**特征：**

- 不可点击
- 透明度降低
- cursor: not-allowed

### Loading

加载状态。

```tsx
<Button loading>Loading Button</Button>
```

**特征：**

- 显示旋转图标
- 自动禁用点击
- 保留文本内容

### Danger

危险状态，用于危险操作。

```tsx
<Button danger>Delete</Button>
<Button variant="primary" danger>Confirm Delete</Button>
```

**样式：**

- 使用错误色 (`theme.colors.error`)
- primary variant：错误色背景
- 其他 variant：错误色边框和文本

### Block

块级按钮，宽度 100%。

```tsx
<Button block>Block Button</Button>
```

**特征：**

- width: 100%
- 适合移动端或表单场景

## 图标 (Icon)

### 带图标的按钮

```tsx
import { IconSearch } from 'your-icon-library'
;<Button icon={<IconSearch />}>Search</Button>
```

### 仅图标按钮

```tsx
<Button icon={<IconSearch />} />
```

## 波纹效果 (Ripple Effect)

### 默认波纹效果

```tsx
<Button>Click Me</Button>
```

### 禁用波纹效果

```tsx
<Button hasRipple={false}>No Ripple</Button>
```

### 自定义波纹颜色

```tsx
<Button rippleBgColor="#ff0000">Red Ripple</Button>
<Button variant="primary" rippleBgColor="#ffffff">White Ripple</Button>
```

### 自定义波纹透明度

```tsx
<Button rippleOpacity={0.1}>Light Ripple</Button>
<Button rippleOpacity={0.5}>Strong Ripple</Button>
```

### 组合使用

```tsx
<Button variant="primary" rippleBgColor="#ffffff" rippleOpacity={0.3}>
  Custom Ripple Button
</Button>
```

## 示例

### 基本使用

```tsx
import { Button, ThemeProvider } from '@xinghunm/compass-ui'

function App() {
  const handleClick = () => {
    console.log('Button clicked!')
  }

  return (
    <ThemeProvider>
      <Button onClick={handleClick}>Click Me</Button>
    </ThemeProvider>
  )
}
```

### 不同变体

```tsx
<Button variant="primary">Primary</Button>
<Button variant="default">Default</Button>
<Button variant="dashed">Dashed</Button>
<Button variant="text">Text</Button>
<Button variant="link">Link</Button>
```

### 不同尺寸

```tsx
<Button size="small">Small</Button>
<Button size="default">Default</Button>
<Button size="large">Large</Button>
```

### 状态组合

```tsx
<Button variant="primary" size="large" loading>
  Submitting...
</Button>

<Button variant="primary" danger>
  Delete
</Button>

<Button block>
  Full Width Button
</Button>
```

### 波纹效果示例

```tsx
{
  /* 默认波纹 */
}
;<Button variant="primary">Default Ripple</Button>

{
  /* 禁用波纹 */
}
;<Button variant="primary" hasRipple={false}>
  No Ripple
</Button>

{
  /* 自定义波纹 */
}
;<Button variant="primary" rippleBgColor="#ffffff" rippleOpacity={0.2}>
  Custom Ripple
</Button>

{
  /* 深色主题下的波纹 */
}
;<Button variant="default" rippleBgColor="#000000" rippleOpacity={0.1}>
  Dark Ripple
</Button>
```

## 可访问性

Button 组件完全支持键盘导航和屏幕阅读器：

- `Tab`: 聚焦到按钮
- `Enter` / `Space`: 激活按钮
- 支持 ARIA 属性

```tsx
<Button aria-label="Delete item" aria-describedby="delete-description">
  Delete
</Button>
```

## TypeScript

```typescript
import type { ButtonProps } from '@xinghunm/compass-ui'

interface MyButtonProps extends ButtonProps {
  customProp?: string
}
```
