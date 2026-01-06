---
title: Progress 进度条
nav:
  title: 组件
  order: 2
group:
  title: 反馈
  order: 4
---

# Progress 进度条

用于显示任务完成状态的进度条组件。

## 何时使用

在操作需要较长时间才能完成时，为用户显示该操作的当前进度和状态。

## 代码演示

### 基础用法

标准的进度条。

```tsx
import React from 'react'
import { Progress } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ width: 320 }}>
    <Progress percent={30} />
    <br />
    <Progress percent={50} status="active" />
    <br />
    <Progress percent={70} status="exception" />
    <br />
    <Progress percent={100} />
    <br />
    <Progress percent={50} showInfo={false} />
  </div>
)
```

### 进度圈

圈形的进度。

```tsx
import React from 'react'
import { Progress } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ display: 'flex', gap: '20px' }}>
    <Progress type="circle" percent={75} />
    <Progress type="circle" percent={70} status="exception" />
    <Progress type="circle" percent={100} />
  </div>
)
```

### 进度条尺寸

线性进度条尺寸支持：`small`、`medium`、`large` 或自定义高度。

```tsx
import React from 'react'
import { Progress } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '300px' }}>
    <div>
      <h4>Small</h4>
      <Progress size="small" percent={30} />
    </div>
    <div>
      <h4>Medium</h4>
      <Progress size="medium" percent={50} />
    </div>
    <div>
      <h4>Large</h4>
      <Progress size="large" percent={70} />
    </div>
    <div>
      <h4>Custom Height (20px)</h4>
      <Progress size={20} percent={60} />
    </div>
  </div>
)
```

### 进度圈尺寸

圆形进度条尺寸支持：`small`、`medium`、`large` 或自定义直径。

```tsx
import React from 'react'
import { Progress } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
    <div style={{ textAlign: 'center' }}>
      <h4>Small (80px)</h4>
      <Progress type="circle" percent={30} size="small" />
    </div>
    <div style={{ textAlign: 'center' }}>
      <h4>Medium (120px)</h4>
      <Progress type="circle" percent={50} size="medium" />
    </div>
    <div style={{ textAlign: 'center' }}>
      <h4>Large (160px)</h4>
      <Progress type="circle" percent={70} size="large" />
    </div>
    <div style={{ textAlign: 'center' }}>
      <h4>Custom (200px)</h4>
      <Progress type="circle" percent={85} size={200} />
    </div>
  </div>
)
```

### 仪表盘

通过设置 `gapDegree` 和 `gapPosition` 可以实现仪表盘效果。

```tsx
import React from 'react'
import { Progress } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
    <div style={{ textAlign: 'center' }}>
      <h4>Dashboard (Bottom Gap)</h4>
      <Progress type="circle" percent={75} gapDegree={75} gapPosition="bottom" />
    </div>
    <div style={{ textAlign: 'center' }}>
      <h4>Dashboard (Top Gap)</h4>
      <Progress type="circle" percent={75} gapDegree={75} gapPosition="top" />
    </div>
  </div>
)
```

### 自定义颜色

`strokeColor` 支持自定义颜色或渐变。

```tsx
import React from 'react'
import { Progress } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '300px' }}>
    <div>
      <h4>Custom Stroke Color</h4>
      <Progress percent={60} strokeColor="#ff6b6b" />
    </div>
    <div>
      <h4>Gradient Color</h4>
      <Progress
        percent={80}
        strokeColor={{ from: '#ff6b6b', to: '#4ecdc4', direction: 'to right' }}
      />
    </div>
    <div style={{ display: 'flex', gap: 20 }}>
      <Progress type="circle" percent={60} strokeColor="#ff6b6b" />
      <Progress type="circle" percent={80} strokeColor={{ from: '#ff6b6b', to: '#4ecdc4' }} />
    </div>
  </div>
)
```

### 自定义文字格式

`format` 属性指定格式。

```tsx
import React from 'react'
import { Progress } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ display: 'flex', gap: '20px' }}>
    <Progress type="circle" percent={75} format={(percent) => `${percent} Days`} />
    <Progress type="circle" percent={100} format={() => 'Done'} />
  </div>
)
```

### 自定义主题

通过 `ConfigProvider` 覆盖主题变量。

```tsx
import React from 'react'
import { Progress, ConfigProvider } from '@xinghunm/compass-ui'

export default () => (
  <ConfigProvider
    theme={{
      token: {
        components: {
          progress: {
            trackColor: '#e6f7ff',
            infoColor: '#722ed1',
            successColor: '#52c41a',
            fontSize: '16px',
          },
        },
      },
    }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '300px' }}>
      <Progress percent={60} />
      <Progress percent={100} status="success" />
      <Progress type="circle" percent={75} />
    </div>
  </ConfigProvider>
)
```

## API

### Progress

| 参数          | 说明                               | 类型                                                        | 默认值                     |
| ------------- | ---------------------------------- | ----------------------------------------------------------- | -------------------------- |
| type          | 进度条类型                         | `'line' \| 'circle'`                                        | `'line'`                   |
| percent       | 进度百分比                         | `number`                                                    | `0`                        |
| format        | 内容的模板函数                     | `(percent: number, successPercent: number) => ReactNode`    | `percent => percent + '%'` |
| status        | 状态                               | `'success' \| 'exception' \| 'normal' \| 'active'`          | -                          |
| showInfo      | 是否显示进度数值或状态图标         | `boolean`                                                   | `true`                     |
| strokeColor   | 进度条的色彩                       | `string \| { from: string; to: string; direction: string }` | -                          |
| strokeLinecap | 进度条的样式                       | `'round' \| 'square'`                                       | `'round'`                  |
| trailColor    | 未完成分段的颜色                   | `string`                                                    | -                          |
| size          | 进度条尺寸                         | `number \| string \| { width: number, height: number }`     | `'medium'`                 |
| gapDegree     | 圆形进度条缺口角度，可取值 0 ~ 360 | `number`                                                    | `0`                        |
| gapPosition   | 圆形进度条缺口位置                 | `'top' \| 'bottom' \| 'left' \| 'right'`                    | `'top'`                    |
| strokeWidth   | 圆形进度条线的宽度                 | `number`                                                    | -                          |
| className     | 自定义类名                         | `string`                                                    | -                          |
| style         | 自定义样式                         | `CSSProperties`                                             | -                          |

## 主题变量 (Design Token)

| Token Name                         | Description       | Default   |
| ---------------------------------- | ----------------- | --------- |
| `components.progress.trackColor`   | 进度条轨道颜色    | `#f5f5f5` |
| `components.progress.successColor` | 成功状态颜色      | `#52c41a` |
| `components.progress.errorColor`   | 错误状态颜色      | `#ff4d4f` |
| `components.progress.warningColor` | 警告状态颜色      | `#faad14` |
| `components.progress.infoColor`    | 默认/信息状态颜色 | `#1890ff` |
| `components.progress.fontSize`     | 进度文本字体大小  | `14px`    |
