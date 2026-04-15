# 测试模式

**分析日期：** 2026-04-13

## 测试框架

**Runner：**

- 工作区入口命令是根目录 `package.json` 的 `pnpm test`，实际执行 `turbo run test`。
- 包级测试主力是 Jest，配置文件位于：
  - `packages/ai-chat/jest.config.js`
  - `packages/compass-ui/jest.config.js`
  - `packages/compass-hooks/jest.config.js`
  - `packages/eslint-plugin-fsd-lint/jest.config.js`
- `packages/ai-chat`、`packages/compass-ui`、`packages/compass-hooks` 运行在 `jsdom`，`packages/eslint-plugin-fsd-lint` 运行在 `node`。
- `apps/ai-chat-demo/src/lib/*.test.ts` 使用了 Vitest 风格 API（`import { describe, it, expect, vi } from 'vitest'`），但 `apps/ai-chat-demo/package.json` 当前没有 `test` 脚本、Vitest 依赖或独立配置文件；这些测试属于未接入工作区标准命令的样例测试。

**断言库：**

- Jest 包统一使用 `expect`。
- React/UI 测试引入 `@testing-library/jest-dom` 扩展断言，见 `packages/ai-chat/jest.setup.js`、`packages/compass-ui/jest.setup.js`。
- React 组件和 Hook 测试主用 `@testing-library/react`。

**运行命令：**

```bash
pnpm test
pnpm --filter @xinghunm/compass-ui test
pnpm --filter @xinghunm/compass-ui test:coverage
pnpm --filter @xinghunm/ai-chat test:coverage
pnpm --filter @xinghunm/eslint-plugin-fsd-lint test:integration
```

## 测试文件组织

**位置：**

- `packages/ai-chat` 使用集中式 `src/__tests__`，再按领域分目录，见 `packages/ai-chat/src/__tests__/components`、`packages/ai-chat/src/__tests__/hooks`、`packages/ai-chat/src/__tests__/transport`。
- `packages/compass-ui` 与 `packages/compass-hooks` 以源码旁 colocated 测试为主，典型路径见 `packages/compass-ui/src/button/button.test.tsx`、`packages/compass-hooks/src/use-local-storage/use-local-storage.test.ts`。
- `packages/eslint-plugin-fsd-lint` 规则测试集中在 `packages/eslint-plugin-fsd-lint/src/rules/__tests__`。
- `apps/ai-chat-demo` 把测试放在实现文件旁边，见 `apps/ai-chat-demo/src/lib/pde-plan-options-api.test.ts`。

**命名：**

- 主流命名为 `*.test.ts` / `*.test.tsx`。
- Jest 配置同时兼容 `*.spec.ts(x)`，见 `packages/compass-ui/jest.config.js`、`packages/compass-hooks/jest.config.js`。

**结构：**

```text
packages/ai-chat/src/__tests__/{components,context,hooks,store,transport}
packages/compass-ui/src/<component>/<component>.test.tsx
packages/compass-hooks/src/<hook>/<hook>.test.ts
packages/eslint-plugin-fsd-lint/src/rules/__tests__/*.test.ts
apps/ai-chat-demo/src/lib/*.test.ts
```

**当前数量：**

- `packages/compass-ui`：32 个测试文件
- `packages/ai-chat`：16 个测试文件
- `packages/compass-hooks`：6 个测试文件
- `packages/eslint-plugin-fsd-lint`：5 个测试文件
- `apps/ai-chat-demo`：2 个测试文件

## 测试结构

**套件组织：**

```ts
describe('Button', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(
        <ThemeProvider>
          <Button>Click me</Button>
        </ThemeProvider>,
      )
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })
})
```

- 上述模式来自 `packages/compass-ui/src/button/button.test.tsx`。

**常见模式：**

- React 组件测试通过 `render(...)` 渲染，再结合 `screen.getBy*` 或 DOM `querySelector` 断言，见 `packages/compass-ui/src/button/button.test.tsx`、`packages/ai-chat/src/__tests__/components/ai-chat-provider.test.tsx`。
- Hook 测试用 `renderHook` + `act`，见 `packages/compass-hooks/src/use-local-storage/use-local-storage.test.ts`、`packages/compass-hooks/src/use-async-fn/use-async-fn.test.ts`。
- 规则/纯函数测试不引入 DOM，直接比较输入输出或错误报告，见 `packages/eslint-plugin-fsd-lint/src/rules/__tests__/naming-convention.test.ts`。

## Mock 方式

**框架：**

- Jest 包统一使用 `jest.mock`、`jest.fn`、`jest.spyOn`、`mockResolvedValue`、`mockImplementation`。
- Vitest 样例使用 `vi.fn`、`vi.stubGlobal`、`vi.restoreAllMocks`，见 `apps/ai-chat-demo/src/lib/pde-plan-options-api.test.ts`。

**典型模式：**

```ts
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <>{children}</>,
}))

const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
```

- 以上模式来自 `packages/ai-chat/src/__tests__/components/ai-chat-provider.test.tsx`。

```ts
const fetchMock = vi.fn().mockResolvedValueOnce({ ok: true, json: async () => ({}) })
vi.stubGlobal('fetch', fetchMock)
```

- 以上模式来自 `apps/ai-chat-demo/src/lib/pde-plan-options-api.test.ts`。

**Mock 什么：**

- 第三方渲染器或难以在测试环境稳定运行的依赖，例如 `react-markdown`、`remark-gfm`、`remark-math`、`rehype-katex`，见 `packages/ai-chat/src/__tests__/components/ai-chat-provider.test.tsx`。
- 网络边界与浏览器全局对象，例如 `global.fetch`、`Storage.prototype.setItem`、`console.error`，见 `packages/ai-chat/src/__tests__/transport/default-chat-transport.test.ts`、`packages/compass-hooks/src/use-local-storage/use-local-storage.test.ts`。
- CSS 模块/样式文件通过 `identity-obj-proxy` 映射，见 `packages/ai-chat/jest.config.js`、`packages/compass-ui/jest.config.js`。

**不要 Mock 什么：**

- 组件本身的 DOM 输出、主题上下文、样式行为通常直接渲染验证，不额外 mock，见 `packages/compass-ui/src/theme/theme-provider.test.tsx`、`packages/compass-ui/src/button/button.test.tsx`。
- Hook 的状态迁移一般真实驱动，不把内部 state mock 掉，见 `packages/compass-hooks/src/use-async-fn/use-async-fn.test.ts`。

## Fixtures 与 Factories

**测试数据：**

```ts
const columns: ColumnType<DataType>[] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
]

const data: DataType[] = [
  { key: '1', name: 'John Brown', age: 32 },
  { key: '2', name: 'Jim Green', age: 42 },
]
```

- 以上模式来自 `packages/compass-ui/src/table/table.test.tsx`，倾向在测试文件内就地声明 fixture。

```ts
const makeTransport = (): ChatTransport => ({
  getModels: async () => ({ data: [{ id: 'gpt-4.1', object: 'model' }] }),
  startStream: async ({ onDone }) => {
    onDone?.()
  },
  terminateStream: async () => ({ terminated: true }),
})
```

- 以上模式来自 `packages/ai-chat/src/__tests__/components/ai-chat-provider.test.tsx`，倾向用本地工厂函数生成 mock adapter。

**位置：**

- 当前未检测到统一的 `fixtures/` 或 `factories/` 目录。
- fixture 与 helper 主要内联在各自测试文件内。

## 覆盖率

**要求：**

- `packages/compass-ui/jest.config.js` 全局阈值：`statements: 90`、`branches: 80`、`functions: 90`、`lines: 90`。
- `packages/compass-hooks/jest.config.js` 全局阈值：四项均为 `90`。
- `packages/eslint-plugin-fsd-lint/jest.config.js` 采集覆盖率，但未设置阈值。
- `packages/ai-chat/package.json` 提供 `test:coverage`，但当前 `jest.config.js` 未设置覆盖率阈值。
- 根工作区 `pnpm test` 不会默认产出覆盖率；覆盖率按包执行。

**查看覆盖率：**

```bash
pnpm --filter @xinghunm/compass-ui test:coverage
pnpm --filter @xinghunm/ai-chat test:coverage
pnpm --filter @xinghunm/eslint-plugin-fsd-lint test:coverage
```

## 测试类型

**单元测试：**

- Hook、组件、工具函数、lint rule 全部以单元测试为主。
- 代表文件：`packages/compass-hooks/src/use-local-storage/use-local-storage.test.ts`、`packages/compass-ui/src/button/button.test.tsx`、`packages/eslint-plugin-fsd-lint/src/rules/__tests__/naming-convention.test.ts`。

**集成测试：**

- `packages/eslint-plugin-fsd-lint` 定义了显式集成命令 `test:integration`，流程为先 `build`，再进入 `test-project` 执行 `eslint src/`，见 `packages/eslint-plugin-fsd-lint/package.json`。
- `packages/ai-chat` 的 transport/provider 测试也带有轻量集成属性，会串联 fetch/axios mock、Provider、store 和组件，见 `packages/ai-chat/src/__tests__/transport/default-chat-transport.test.ts`、`packages/ai-chat/src/__tests__/components/ai-chat-provider.test.tsx`。

**E2E 测试：**

- 未检测到 Playwright、Cypress 等端到端测试配置文件。

## 常见模式

**异步测试：**

```ts
await act(async () => {
  await fetch()
})

expect(result.current[0]).toEqual({ loading: false, value: 'success', error: undefined })
```

- 来自 `packages/compass-hooks/src/use-async-fn/use-async-fn.test.ts`。

**错误测试：**

```ts
const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
expect(() => render(<TestConsumer />)).toThrow(
  'useChatContext must be used inside AiChatProvider',
)
spy.mockRestore()
```

- 来自 `packages/ai-chat/src/__tests__/components/ai-chat-provider.test.tsx`。

**环境准备：**

- `packages/ai-chat/jest.setup.js` 会补齐 `TextEncoder`、`TextDecoder`、`ReadableStream`、`URL.createObjectURL`、`scrollIntoView`。
- `packages/compass-ui/jest.setup.js` 只引入 `@testing-library/jest-dom`，环境更轻。

## 验证命令

```bash
pnpm lint
pnpm test
pnpm build
pnpm --filter @xinghunm/compass-ui test:coverage
pnpm --filter @xinghunm/eslint-plugin-fsd-lint test:integration
```

- 如果只验证某个包，优先用 `pnpm --filter <package-name> <script>`。
- 如果补的是 UI/Hook/规则类改动，至少补跑对应包的 `test` 或 `test:coverage`；如果改动了 workspace 级联关系，再补跑根命令 `pnpm test`。

---

_测试分析：2026-04-13_
