# @xinghunm/compass-hooks

Compass UI 及其他应用通用的 React Hooks 库。

## 安装

```bash
pnpm add @xinghunm/compass-hooks
```

## 使用

```tsx
import { useMounted, useAsync } from '@xinghunm/compass-hooks'
```

## API

### 状态与生命周期 (State & Lifecycle)

#### `useMounted`

返回一个函数，如果组件已挂载则返回 `true`，否则返回 `false`。用于避免在已卸载的组件上更新状态。

```tsx
const isMounted = useMounted()

useEffect(() => {
  fetchData().then(() => {
    if (isMounted()) {
      setState(...)
    }
  })
}, [])
```

#### `useLocalStorage`

将状态值持久化到 `localStorage` 中。用法类似于 `useState`。

```tsx
const [value, setValue] = useLocalStorage('my-key', 'default-value')
```

### 异步处理 (Async)

#### `useAsync`

解析一个 `Promise` 或异步函数，并管理其状态（`loading`, `value`, `error`）。组件挂载时会立即执行一次，且当依赖项发生变化时会自动重新执行。

```tsx
const { loading, value, error } = useAsync(async () => {
  return await fetchUser(id)
}, [id])
```

#### `useAsyncFn`

管理异步函数的状态，但**不会自动执行**。返回当前状态和一个用于手动触发执行的回调函数。

```tsx
const [{ loading, value, error }, fetchUser] = useAsyncFn(
  async (id) => {
    return api.getUser(id)
  },
  [deps]
)

// 手动调用
<button onClick={() => fetchUser(1)}>获取数据</button>
```

**选项 (Options):**

- `initialState`: 初始状态对象 (默认: `{ loading: false }`)。
- `options.preventDoubleSubmit`: 如果为 `true`，则在当前请求正在加载时，阻止再次执行该函数 (默认: `false`)。

### UI 与交互 (UI & Interaction)

#### `useClickAway`

当用户点击目标元素外部时触发回调函数。

```tsx
const ref = useRef(null)
useClickAway(ref, () => {
  console.log('点击了外部区域')
})

return <div ref={ref}>点击我外部</div>
```

#### `useCountdown`

简单的倒计时器。

```tsx
const { countdown, startCountdown } = useCountdown(60)

return (
  <>
    <p>剩余时间: {countdown}秒</p>
    <button onClick={startCountdown}>重置倒计时</button>
  </>
)
```
