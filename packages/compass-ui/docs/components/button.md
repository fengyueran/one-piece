---
title: Button 按钮
nav:
  title: 组件
  order: 2
group:
  title: 通用
  order: 1
---

# Button 按钮

按钮用于开始一个即时操作。

## 何时使用

标记了一个(或封装一组)操作命令,响应用户点击行为,触发相应的业务逻辑。

## 代码演示

### 基础用法

按钮有五种类型:`primary`、`default`、`dashed`、`text` 和 `link`。

```tsx
import React from 'react'
import { Button } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    <Button variant="primary">Primary</Button>
    <Button variant="default">Default</Button>
    <Button variant="dashed">Dashed</Button>
    <Button variant="text">Text</Button>
    <Button variant="link">Link</Button>
  </div>
)
```

### 图标按钮

当需要在 `Button` 内嵌入 Icon 时，可以设置 `icon` 属性，或者直接在 `Button` 内使用 Icon 组件。

```tsx
import React from 'react'
import { Button } from '@xinghunm/compass-ui'

const SearchIcon = () => (
  <span role="img" aria-label="search" className="compass-icon">
    <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
      <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path>
    </svg>
  </span>
)

export default () => (
  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
    <Button icon={<SearchIcon />} variant="primary">
      Search
    </Button>
    <Button icon={<SearchIcon />}>Search</Button>
    <Button shape="circle" variant="primary" icon={<SearchIcon />} />
    <Button shape="circle" icon={<SearchIcon />} />
    <Button variant="dashed" icon={<SearchIcon />}>
      Search
    </Button>
  </div>
)
```

### 按钮尺寸

按钮有大、中、小三种尺寸。

```tsx
import React from 'react'
import { Button } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
    <Button size="large">Large</Button>
    <Button size="medium">Medium</Button>
    <Button size="small">Small</Button>
  </div>
)
```

### 禁用状态

添加 `disabled` 属性即可让按钮处于不可用状态。

```tsx
import React from 'react'
import { Button } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    <Button variant="primary" disabled>
      Primary
    </Button>
    <Button variant="default" disabled>
      Default
    </Button>
    <Button variant="dashed" disabled>
      Dashed
    </Button>
    <Button variant="text" disabled>
      Text
    </Button>
    <Button variant="link" disabled>
      Link
    </Button>
  </div>
)
```

### 加载状态

添加 `loading` 属性即可让按钮处于加载状态。

```tsx
import React from 'react'
import { Button } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    <Button variant="primary" loading>
      Loading
    </Button>
    <Button variant="default" loading>
      Loading
    </Button>
  </div>
)
```

### 块级按钮

`block` 属性将使按钮适合其父宽度。

```tsx
import React from 'react'
import { Button } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <Button variant="primary" block>
      Primary Block Button
    </Button>
    <Button variant="default" block>
      Default Block Button
    </Button>
  </div>
)
```

### 危险按钮

危险按钮用于警告用户此操作具有风险。

```tsx
import React from 'react'
import { Button } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    <Button variant="primary" danger>
      Primary Danger
    </Button>
    <Button variant="default" danger>
      Default Danger
    </Button>
    <Button variant="dashed" danger>
      Dashed Danger
    </Button>
    <Button variant="text" danger>
      Text Danger
    </Button>
    <Button variant="link" danger>
      Link Danger
    </Button>
  </div>
)
```

### 自定义样式

通过 `style` 和 `className` 属性自定义按钮样式。

```tsx
import React from 'react'
import { Button } from '@xinghunm/compass-ui'

export default () => (
  <>
    <style>{`
      .custom-button {
        font-weight: bold !important;
        letter-spacing: 2px;
        transition: transform 0.2s;
      }
      .custom-button:hover {
        transform: scale(1.05);
      }
    `}</style>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Button
        variant="primary"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
        }}
      >
        Gradient Button
      </Button>
      <Button
        variant="default"
        className="custom-button"
        style={{
          borderRadius: '20px',
          padding: '0 24px',
        }}
      >
        Custom Class
      </Button>
    </div>
  </>
)
```

### Ripple 效果

默认开启点击波纹效果，可以通过 `hasRipple` 属性关闭。

```tsx
import React from 'react'
import { Button } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    <Button variant="primary">With Ripple</Button>
    <Button variant="primary" hasRipple={false}>
      Without Ripple
    </Button>
  </div>
)
```

### 自定义主题

通过 `ConfigProvider` 自定义按钮主题。

```tsx
import React from 'react'
import { Button, ConfigProvider } from '@xinghunm/compass-ui'

export default () => (
  <ConfigProvider
    theme={{
      token: {
        colors: {
          primary: '#722ed1',
        },
        components: {
          button: {
            borderRadius: { md: '20px' },
            padding: { md: '0 30px' },
          },
        },
      },
    }}
  >
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Button variant="primary">Custom Theme</Button>
      <Button variant="default">Custom Theme</Button>
    </div>
  </ConfigProvider>
)
```

## API

### Button

| 参数      | 说明                     | 类型                                                     | 默认值      |
| --------- | ------------------------ | -------------------------------------------------------- | ----------- |
| variant   | 按钮类型                 | `'primary' \| 'default' \| 'dashed' \| 'text' \| 'link'` | `'default'` |
| size      | 按钮尺寸                 | `'small' \| 'medium' \| 'large'`                         | `'medium'`  |
| disabled  | 按钮失效状态             | `boolean`                                                | `false`     |
| loading   | 设置按钮载入状态         | `boolean`                                                | `false`     |
| block     | 将按钮宽度调整为其父宽度 | `boolean`                                                | `false`     |
| danger    | 设置危险按钮             | `boolean`                                                | `false`     |
| hasRipple | 是否启用水波纹效果       | `boolean`                                                | `true`      |
| onClick   | 点击按钮时的回调         | `(event: React.MouseEvent) => void`                      | -           |
| className | 自定义类名               | `string`                                                 | -           |
| style     | 自定义样式               | `React.CSSProperties`                                    | -           |
| children  | 按钮内容                 | `ReactNode`                                              | -           |

## 主题变量 (Design Token)

<details>
<summary>组件 Token (components.button)</summary>

| 变量名                           | 说明         |
| -------------------------------- | ------------ |
| `components.button.borderRadius` | 按钮圆角     |
| `components.button.padding`      | 按钮内边距   |
| `components.button.fontSize`     | 按钮字体大小 |
| `components.button.height`       | 按钮高度     |

</details>

<details>
<summary>全局 Token</summary>

| 变量名           | 说明     |
| ---------------- | -------- |
| `colors.primary` | 主色调   |
| `colors.danger`  | 危险色   |
| `colors.text`    | 文本颜色 |

</details>
