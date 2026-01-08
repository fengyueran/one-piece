---
trigger: always_on
description: Compass UI Development Rules
---

---

## alwaysApply: true

# Compass UI - 开发规则

## 0. 包管理器规范

### 0.1 使用 pnpm

- **必须使用 pnpm 作为包管理器**
- 安装依赖：`pnpm install`
- 添加依赖：`pnpm add <package>`
- 添加开发依赖：`pnpm add -D <package>`
- 运行脚本：`pnpm run <script>` 或 `pnpm <script>`

## 1. 组件开发规范

### 1.1 组件结构

- 每个组件必须在 `src/` 目录下的独立目录中
- 文件夹名和文件名使用 kebab-case（例如：`button-base`, `input-field`）
- 目录结构：

  ```text
  component-name/
  ├── index.ts                  # 导出文件
  ├── component-name.tsx        # 主组件
  ├── component-name.test.tsx   # 单元测试
  ├── component-name.stories.tsx # Storybook 文档
  ├── types.ts                  # 类型定义
  └── component-name.styles.ts                 # 样式（使用 @emotion/styled）
  ```

### 1.2 组件命名

- 组件名（类名）使用 PascalCase（例如：`ButtonBase`, `InputField`）
- 文件夹名和文件名使用 kebab-case（例如：`button-base`, `input-field`）
- Props 接口命名为 `ComponentNameProps`

### 1.3 组件 Props 设计

- 必须定义 TypeScript 接口
- 所有 Props 必须有 JSDoc 注释说明用途
- 支持 `className` 和 `style` 属性以便自定义
- 使用 `React.forwardRef` 转发 ref
- 示例：

  ```typescript
  export interface ButtonProps {
    /** Button type */
    type?: 'primary' | 'secondary' | 'danger'
    /** Button size */
    size?: 'small' | 'medium' | 'large'
    /** Disabled state */
    disabled?: boolean
    /** Click handler */
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
    /** Custom className */
    className?: string
    /** Custom style */
    style?: React.CSSProperties
    /** Button content */
    children?: React.ReactNode
  }
  ```

### 1.4 className 命名规范

- **组件根元素必须添加标准化的 className**
- className 格式：`compass-{component-name} compass-{component-name}--{variant} {customClassName}`
- 组件名使用 kebab-case
- variant 使用 kebab-case
- 示例：

  ```typescript
  // Button 组件
  className={`compass-button compass-button--${variant} ${className || ''}`}

  // Progress 组件
  className={`compass-progress compass-progress--${type} ${className || ''}`}

  // InputField 组件
  className={`compass-input-field compass-input-field--${size} ${className || ''}`}
  ```

- **规则说明：**
  - 基础类名：`compass-{component-name}` - 用于基础样式和组件识别
  - 变体类名：`compass-{component-name}--{variant}` - 用于不同变体的样式
  - 自定义类名：`${className || ''}` - 支持用户传入的自定义类名
  - 类名之间用空格分隔
  - 如果没有 variant，可以省略变体类名
- **内部结构 ClassName：**
  - 组件的关键内部结构必须添加语义化的静态 ClassName
  - 遵循 BEM 命名风格 `compass-[component]-[part]`
  - 示例：`compass-message-content`, `compass-button-icon`

### 1.5 导出规范

- 每个组件目录的 `index.ts` 导出组件和类型
- `src/index.ts` 统一导出所有公共 API

- 导出示例：

  ```typescript
  // button-base/index.ts
  export { Button } from './button'
  export type { ButtonProps } from './button'

  // src/index.ts
  export { Button } from './button-base'
  export type { ButtonProps } from './button-base'
  ```

### 1.6 内部组件复用

- **优先使用 Compass UI 内部组件**：在开发新组件或页面时，优先复用已有的 Compass UI 组件，而不是使用原生 HTML 标签或重复造轮子。
- **保持一致性**：复用组件可以确保整个应用的设计风格和交互行为保持一致。
- 示例：
  - 需要按钮时，使用 `<Button />` 而不是 `<button>`。

## 2. TypeScript 规范

### 2.1 类型使用

- **严禁使用 `any`**：在任何情况下都不要使用 `any` 类型。
  - 如果类型不确定，请使用 `unknown` 并配合类型守卫。
  - 对于复杂的对象结构，定义具体的 Interface 或 Type。
  - 如果是临时代码，请添加 `// TODO: fix any` 注释，但提交代码时必须修复。

## 3. 测试规范 ⚠️

### 3.1 测试覆盖率要求

- **所有组件必须有单元测试**
- 测试覆盖率目标：
  - 语句覆盖率 ≥ 90%
  - 分支覆盖率 ≥ 90%
  - 函数覆盖率 ≥90%
  - 行覆盖率 ≥ 90%

### 3.2 测试文件命名

- 测试文件命名：`component-name.test.tsx`（kebab-case）
- 与被测试文件放在同一目录

### 3.3 测试内容（必须包含）

- ✅ **渲染测试**：验证组件能正常渲染
- ✅ **Props 测试**：测试所有 props 的效果
- ✅ **交互测试**：测试用户交互（点击、输入等）
- ✅ **状态测试**：测试不同状态下的表现
- ✅ **可访问性测试**：验证 ARIA 属性和键盘导航
- ✅ **边界测试**：测试边界情况和错误处理

### 3.4 测试示例结构

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('should apply disabled state', () => {
      render(<Button disabled>Click me</Button>)
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })

  describe('Interactions', () => {
    it('should call onClick handler', () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Click me</Button>)
      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('should have correct ARIA attributes', () => {
      render(<Button aria-label="Submit form">Submit</Button>)
      expect(screen.getByLabelText('Submit form')).toBeInTheDocument()
    })
  })
})
```

### 3.5 测试工具

- 使用 Jest 作为测试框架
- 使用 @testing-library/react 进行组件测试
- 使用 @testing-library/user-event 模拟用户交互
- 避免使用快照测试（snapshot），优先使用行为测试

### 3.6 测试最佳实践

- 测试行为而非实现细节
- 使用语义化查询（role, label, text）而非 className 或 data-testid
- 每个测试应该独立且可重复
- 测试描述清晰明确，说明测试目的
- Mock 外部依赖和副作用

## 4. 样式规范

### 4.1 样式系统

- 使用 `@emotion/styled` 编写样式
- 使用 `@emotion/react` 的 css prop（必要时）
- 支持主题定制
- **必须使用主题变量（Design Token）**：所有组件样式必须基于 Theme System 开发，禁止硬编码颜色、间距、字体大小等值。
- **暗色模式**：确保组件通过主题变量（Design Token）自动适配 Light/Dark 模式。
- **组件必须提供默认样式**：确保在没有 `ThemeProvider` 的情况下，组件也能正常显示，所有依赖主题的样式都必须有备用值。

### 4.2 样式文件

- 样式定义在单独的 `styles.ts` 文件中
- 使用 styled components 创建样式组件
- 示例：

  ```typescript
  import styled from '@emotion/styled'

  export const StyledButton = styled.button<{ size?: 'small' | 'medium' | 'large' }>`
    padding: ${(props) => (props.size === 'small' ? '4px 8px' : '8px 16px')};
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      opacity: 0.8;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  `
  ```

### 4.3 响应式设计

- 使用媒体查询实现响应式
- 考虑移动端和桌面端体验

## 5. 文档规范

### 5.1 dumi 文档

- **文档位置**：组件文档应位于 `docs/components/` 目录下，命名为 `component-name.md`。
- **Frontmatter**：必须包含 `title`、`nav` 和 `group` 配置。
  - `nav`: 通常配置为 `{ title: '组件', order: 2 }`
  - `group`: 配置组件所属分组及排序
- **代码演示**：
  - 使用 `tsx` 代码块展示用法。
  - 必须 `export default` 一个无状态组件来渲染示例。
  - 示例代码需展示完整的 `import` 路径（使用包名）。
- **API 表格**：
  - 必须包含 Props 说明表格。
  - 表格列包含：参数、说明、类型、默认值。
- **主题变量**：
  - 必须列出组件使用的 Design Token。
  - 使用 `<details>` 折叠展示组件 Token 和全局 Token。
- **示例结构**：

  ````markdown
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

  组件描述...

  ## 代码演示

  ### 基础用法

  ```tsx
  import React from 'react'
  import { Button } from '@xinghunm/compass-ui'

  export default () => <Button>Default</Button>
  ```

  ## API

  | 参数 | 说明     | 类型     | 默认值 |
  | ---- | -------- | -------- | ------ |
  | type | 按钮类型 | `string` | `-`    |

  ## 主题变量 (Design Token)

  <details>
  <summary>组件 Token (components.button)</summary>

  | 变量名                           | 说明     |
  | -------------------------------- | -------- |
  | `components.button.borderRadius` | 按钮圆角 |

  </details>

  <details>
  <summary>全局 Token</summary>

  | 变量名           | 说明   |
  | ---------------- | ------ |
  | `colors.primary` | 主色调 |

  </details>
  ````

### 5.2 代码注释

- 所有公共 API 使用 JSDoc/TSDoc
- 复杂逻辑添加行内注释说明
- 注释使用英文（除非特殊要求）

### 5.3 JSDoc 示例

````typescript
/**
 * A flexible button component with various styles and sizes.
 *
 * @example
 * ```tsx
 * <Button type="primary" size="large" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  // implementation
})
````

## 6. 可访问性规范（A11y）

### 6.1 语义化 HTML

- 使用语义化 HTML 标签
- 正确使用 ARIA 属性
- 支持键盘导航

### 6.2 必须支持

- ✅ 键盘导航（Tab, Enter, Space, Arrow keys）
- ✅ Screen reader 支持
- ✅ 焦点管理
- ✅ 适当的 ARIA roles 和 attributes

### 6.3 测试要点

- 使用键盘测试所有交互
- 使用 screen reader 测试
- 检查 ARIA 属性是否正确

## 7. 性能规范

### 7.1 渲染优化

- 使用 `React.memo` 避免不必要的重渲染
- 合理使用 `useMemo` 和 `useCallback`
- 避免在渲染函数中创建新对象/函数

### 7.2 包体积

- 避免引入大型依赖
- 支持 tree-shaking
- 懒加载大型组件

## 8. 代码质量

### 8.1 Linting

- 运行 `pnpm lint` 检查代码
- 提交前必须通过 lint 检查
- 遵循 ESLint 规则

### 8.2 代码审查检查清单

- [ ] 类型定义完整
- [ ] 有单元测试且通过
- [ ] 有 Storybook 文档
- [ ] 通过 lint 检查
- [ ] 支持可访问性
- [ ] Props 有 JSDoc 注释
- [ ] 遵循 className 命名规范
- [ ] 性能考虑合理
- [ ] 错误处理完善

## 9. 发布规范

### 9.1 版本管理

- 遵循 Semantic Versioning (SemVer)
- MAJOR.MINOR.PATCH

### 9.2 变更日志

- 维护 CHANGELOG.md
- 记录每次发布的变更
