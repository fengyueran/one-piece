# Progress API

进度条组件，用于显示任务完成状态。支持线性和圆形两种进度指示器。

## 导入

```tsx
import { Progress } from '@xinghunm/compass-ui'
```

## 基本用法

```tsx
{/* 线性进度条 */}
<Progress percent={50} />
<Progress type="line" percent={75} status="success" />

{/* 圆形进度条 */}
<Progress type="circle" percent={60} />
<Progress type="circle" percent={100} width={120} />
```

## Props

| 属性        | 类型                                                         | 默认值      | 描述                         |
| ----------- | ------------------------------------------------------------ | ----------- | ---------------------------- |
| type        | `'line' \| 'circle'`                                         | `'line'`    | 进度条类型                   |
| percent     | `number`                                                     | `0`         | 进度百分比 (0-100)           |
| size        | `'small' \| 'default' \| 'large'`                            | `'default'` | 进度条尺寸                   |
| status      | `'normal' \| 'success' \| 'error' \| 'warning'`              | `'normal'`  | 进度条状态                   |
| showInfo    | `boolean`                                                    | `true`      | 是否显示百分比文本           |
| format      | `(percent?: number) => ReactNode`                            | -           | 自定义百分比文本格式化函数   |
| strokeWidth | `number`                                                     | -           | 线条宽度                     |
| strokeColor | `string \| { from: string; to: string; direction?: string }` | -           | 线条颜色（支持渐变）         |
| trailColor  | `string`                                                     | -           | 轨道颜色（背景色）           |
| width       | `number`                                                     | `120`       | 圆形进度条宽度（仅圆形类型） |
| success     | `ReactNode`                                                  | -           | 完成时显示的成功图标         |
| className   | `string`                                                     | -           | 自定义类名                   |
| style       | `React.CSSProperties`                                        | -           | 自定义样式                   |

## 类型 (Types)

### 线性进度条

默认的进度条类型，水平显示进度。

```tsx
<Progress type="line" percent={50} />
```

**特征：**

- 水平条形显示
- 支持不同尺寸
- 可自定义颜色和宽度

### 圆形进度条

圆形的进度指示器。

```tsx
<Progress type="circle" percent={75} />
```

**特征：**

- 圆形环状显示
- 可自定义直径
- 中心显示百分比文本

## 尺寸 (Sizes)

### Small

小尺寸进度条。

```tsx
<Progress size="small" percent={30} />
<Progress type="circle" size="small" percent={30} width={80} />
```

**线性进度条：**

- 高度：4px
- 文本：12px

**圆形进度条：**

- 推荐宽度：80px
- 线条宽度：4px

### Default

默认尺寸进度条。

```tsx
<Progress size="default" percent={50} />
<Progress type="circle" size="default" percent={50} width={120} />
```

**线性进度条：**

- 高度：8px
- 文本：14px

**圆形进度条：**

- 推荐宽度：120px
- 线条宽度：6px

### Large

大尺寸进度条。

```tsx
<Progress size="large" percent={70} />
<Progress type="circle" size="large" percent={70} width={160} />
```

**线性进度条：**

- 高度：12px
- 文本：16px

**圆形进度条：**

- 推荐宽度：160px
- 线条宽度：8px

## 状态 (Status)

### Normal

正常状态，使用主题色。

```tsx
<Progress percent={50} status="normal" />
<Progress type="circle" percent={50} status="normal" />
```

### Success

成功状态，使用绿色。

```tsx
<Progress percent={100} status="success" />
<Progress type="circle" percent={100} status="success" />
```

**特征：**

- 自动在 100% 时切换为成功状态
- 使用成功色 (`theme.colors.success`)

### Warning

警告状态，使用黄色。

```tsx
<Progress percent={60} status="warning" />
<Progress type="circle" percent={60} status="warning" />
```

### Error

错误状态，使用红色。

```tsx
<Progress percent={40} status="error" />
<Progress type="circle" percent={40} status="error" />
```

## 自定义样式

### 自定义颜色

```tsx
{
  /* 单色 */
}
;<Progress percent={60} strokeColor="#ff6b6b" />

{
  /* 渐变色 */
}
;<Progress
  percent={80}
  strokeColor={{
    from: '#ff6b6b',
    to: '#4ecdc4',
    direction: 'to right',
  }}
/>

{
  /* 自定义轨道颜色 */
}
;<Progress percent={40} trailColor="#f0f0f0" />
```

### 自定义线条宽度

```tsx
{/* 线性进度条 */}
<Progress percent={50} strokeWidth={2} />  {/* 细线 */}
<Progress percent={50} strokeWidth={16} /> {/* 粗线 */}

{/* 圆形进度条 */}
<Progress type="circle" percent={50} strokeWidth={2} />  {/* 细环 */}
<Progress type="circle" percent={50} strokeWidth={12} /> {/* 粗环 */}
```

### 圆形进度条尺寸

```tsx
<Progress type="circle" percent={50} width={80} />   {/* 小圆 */}
<Progress type="circle" percent={50} width={200} />  {/* 大圆 */}
```

## 自定义文本

### 格式化函数

```tsx
<Progress
  percent={75}
  format={(percent) => `${percent} of 100`}
/>

<Progress
  type="circle"
  percent={60}
  format={(percent) => `${percent}/100`}
/>
```

### 成功图标

```tsx
<Progress
  percent={100}
  success={<span style={{ color: '#52c41a' }}>✓</span>}
/>

<Progress
  type="circle"
  percent={100}
  success={<span style={{ color: '#52c41a', fontSize: '24px' }}>✓</span>}
/>
```

### 隐藏文本

```tsx
<Progress percent={45} showInfo={false} />
<Progress type="circle" percent={45} showInfo={false} />
```

## 示例

### 基本使用

```tsx
import { Progress, ThemeProvider } from '@xinghunm/compass-ui'

function App() {
  const [percent, setPercent] = useState(0)

  const increase = () => {
    setPercent((prev) => Math.min(prev + 10, 100))
  }

  return (
    <ThemeProvider>
      <Progress percent={percent} />
      <button onClick={increase}>Increase</button>
    </ThemeProvider>
  )
}
```

### 不同类型

```tsx
{/* 线性进度条 */}
<Progress type="line" percent={30} />
<Progress type="line" percent={50} />
<Progress type="line" percent={70} />

{/* 圆形进度条 */}
<Progress type="circle" percent={30} />
<Progress type="circle" percent={50} />
<Progress type="circle" percent={70} />
```

### 不同尺寸

```tsx
{/* 线性进度条尺寸 */}
<Progress size="small" percent={30} />
<Progress size="default" percent={50} />
<Progress size="large" percent={70} />

{/* 圆形进度条尺寸 */}
<Progress type="circle" size="small" percent={30} width={80} />
<Progress type="circle" size="default" percent={50} width={120} />
<Progress type="circle" size="large" percent={70} width={160} />
```

### 状态示例

```tsx
<Progress percent={30} status="normal" />
<Progress percent={100} status="success" />
<Progress percent={60} status="warning" />
<Progress percent={40} status="error" />
```

### 自定义样式示例

```tsx
{
  /* 渐变色进度条 */
}
;<Progress
  percent={80}
  strokeColor={{
    from: '#108ee9',
    to: '#87d068',
  }}
/>

{
  /* 自定义圆形进度条 */
}
;<Progress
  type="circle"
  percent={75}
  strokeColor="#ff6b6b"
  strokeWidth={8}
  width={150}
  format={(percent) => `${percent}%`}
/>

{
  /* 成功状态带图标 */
}
;<Progress percent={100} success={<span>✓ Complete</span>} />
```

### 动态进度

```tsx
function DynamicProgress() {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 1
      })
    }, 100)

    return () => clearInterval(timer)
  }, [])

  return (
    <div>
      <Progress percent={percent} />
      <Progress type="circle" percent={percent} />
    </div>
  )
}
```

## 可访问性

Progress 组件支持基本的可访问性特性：

- 语义化的进度显示
- 清晰的视觉反馈
- 适当的颜色对比度

```tsx
{
  /* 建议为进度条添加描述 */
}
;<div>
  <label>Upload Progress</label>
  <Progress percent={60} />
</div>
```

## 最佳实践

### 1. 选择合适的类型

```tsx
{
  /* 文件上传 - 使用线性 */
}
;<Progress type="line" percent={uploadPercent} />

{
  /* 任务完成度 - 使用圆形 */
}
;<Progress type="circle" percent={taskPercent} />
```

### 2. 状态反馈

```tsx
{
  /* 根据进度自动设置状态 */
}
;<Progress
  percent={percent}
  status={percent === 100 ? 'success' : percent > 80 ? 'warning' : 'normal'}
/>
```

### 3. 自定义格式

```tsx
{
  /* 文件大小进度 */
}
;<Progress
  percent={percent}
  format={(percent) => `${((percent * fileSize) / 100).toFixed(1)}MB / ${fileSize}MB`}
/>
```

### 4. 响应式设计

```tsx
{
  /* 移动端使用较小尺寸 */
}
;<Progress size={isMobile ? 'small' : 'default'} percent={percent} />
```

## TypeScript

```typescript
import type { ProgressProps, LinearProgressProps, CircleProgressProps } from '@xinghunm/compass-ui'

// 扩展 Progress 属性
interface CustomProgressProps extends ProgressProps {
  onComplete?: () => void
}

// 线性进度条特定属性
interface MyLinearProgressProps extends LinearProgressProps {
  showSpeed?: boolean
}

// 圆形进度条特定属性
interface MyCircleProgressProps extends CircleProgressProps {
  showCenter?: boolean
}
```
