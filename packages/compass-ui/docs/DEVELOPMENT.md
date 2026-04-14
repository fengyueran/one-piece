# Compass UI - 开发指南

本文档面向 Compass UI 的开发者和贡献者，提供详细的开发指引。

## 目录

- [环境准备](#环境准备)
- [项目结构](#项目结构)
- [开发流程](#开发流程)
- [组件开发](#组件开发)
- [测试指南](#测试指南)
- [样式开发](#样式开发)
- [文档编写](#文档编写)
- [构建与发布](#构建与发布)
- [开发规范](#开发规范)

## 环境准备

### 必需工具

- **Node.js**: >= 16.x
- **pnpm**: >= 8.x (必须使用 pnpm)
- **Git**: 最新版本

### 安装依赖

```bash
# 使用 pnpm 安装依赖
pnpm install
```

### 开发命令

```bash
# 开发模式（监听文件变化）
pnpm dev

# 构建生产版本
pnpm build

# 运行测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm test -- --coverage

# 运行测试（监听模式）
pnpm test -- --watch

# 代码检查
pnpm lint

# 启动文档站
pnpm docs:dev

# 构建文档站
pnpm docs:build

# 清理构建产物
pnpm clean
```

## 项目结构

```text
compass-ui/
├── src/                          # 源代码目录
│   ├── button/                   # Button 组件
│   ├── button-base/              # ButtonBase 基础组件
│   ├── theme/                    # 主题系统
│   ├── types/                    # 全局类型定义
│   └── index.ts                  # 主入口文件
├── docs/                         # 文档目录
│   ├── README.md                 # 文档导航
│   ├── API.md                    # API 参考文档
│   ├── DEVELOPMENT.md            # 开发指南（本文件）
│   ├── components/               # 组件文档
│   ├── guide/                    # 使用指南
│   └── CONTRIBUTING.md           # 贡献指南
├── dist/                         # 构建产物（自动生成）
├── coverage/                     # 测试覆盖率报告
├── node_modules/                 # 依赖包
├── .cursor/                      # Cursor 配置
│   └── rules/
│       └── index.mdc             # 开发规则文档
├── jest.config.js                # Jest 配置
├── jest.setup.js                 # Jest 设置文件
├── tsconfig.json                 # TypeScript 配置
├── package.json                  # 项目配置
├── README.md                     # 用户文档（主入口）
└── CHANGELOG.md                  # 变更日志
```

## 开发流程

### 1. 创建新组件

#### 步骤 1：创建组件目录

```bash
# 使用 kebab-case 命名
mkdir src/my-component
cd src/my-component
```

#### 步骤 2：创建文件

```bash
touch index.ts
touch my-component.tsx
touch my-component.test.tsx
touch types.ts  # 如果需要复杂类型定义
touch docs/components/my-component.md
```

#### 步骤 3：导出组件

在 `src/index.ts` 中添加导出：

```typescript
export { MyComponent } from './my-component'
export type { MyComponentProps } from './my-component'
```

## 测试指南

### 测试覆盖率要求

- 语句覆盖率 ≥ 80%
- 分支覆盖率 ≥ 75%
- 函数覆盖率 ≥ 80%
- 行覆盖率 ≥ 80%

### 运行测试

```bash
# 运行所有测试
pnpm test

# 运行特定文件的测试
pnpm test src/button/button.test.tsx

# 监听模式
pnpm test -- --watch

# 生成覆盖率报告
pnpm test -- --coverage

# 生成 HTML 格式覆盖率报告并在浏览器中打开
# macOS
pnpm test -- --coverage && open coverage/lcov-report/index.html

# 更新快照
pnpm test -- -u
```

### 测试最佳实践

1. **测试行为而非实现**：关注组件对外的行为，而不是内部实现细节
2. **使用语义化查询**：优先使用 `getByRole`、`getByLabelText`、`getByText`
3. **验证实际效果**：检查实际的样式值，而不只是元素存在
4. **独立测试**：每个测试应该独立，不依赖其他测试的执行顺序
5. **清晰的描述**：测试描述应该清楚说明测试的目的

## 文档编写

### 组件文档规范

#### 1. 基本要求

每个公开组件都应维护 `docs/components/[component].md` 文档页面，文件名使用 kebab-case。

#### 2. 页面结构

组件文档默认参考 `docs/components/button.md`，并保持以下结构顺序：

1. YAML frontmatter
2. `# <组件名> <中文名>`
3. 一句简短介绍
4. `## 何时使用`
5. `## 代码演示`
6. `## API`
7. `通用属性参考：[通用属性](/guide/common-props)`
8. 组件 token 或全局 token 章节（仅组件确实暴露时添加）

#### 3. 示例要求

- 使用真实、可运行的示例代码
- `## 代码演示` 下优先覆盖基础用法和关键 props
- 不写 Storybook、argTypes、内部实现文件等说明
- 仅展示公开 API，避免未导出的内部 props

#### 4. API 要求

- 表头顺序优先保持：参数 / 说明 / 类型 / 默认值
- 已属于通用属性的字段，例如 `className`、`style`，不要重复写入组件 API 表
- 与主题相关的变量，仅在组件真实暴露 token 时补充

#### 5. 参考实现

优先对齐以下文档：

- `docs/components/button.md`
- `docs/components/select.md`
- `docs/components/modal.md`

#### 6. 检查清单

- [ ] frontmatter、标题、简介齐全
- [ ] 包含 `## 何时使用`
- [ ] 包含 `## 代码演示`
- [ ] 包含 `## API`
- [ ] `## API` 下第一行是通用属性引用
- [ ] 示例代码与当前公开 API 一致
- [ ] 没有提到 Storybook 或内部实现

## 样式开发

### 使用 Emotion Styled

```typescript
import styled from '@emotion/styled'

const StyledComponent = styled.div`
  padding: ${({ theme }) => theme.spacing.md}px;
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  }
`
```

### 使用 Theme

```typescript
const StyledComponent = styled.button`
  /* 使用主题颜色 */
  background-color: ${({ theme }) => theme.colors.primary};
  color: #fff;

  /* 使用主题间距 */
  padding: ${({ theme }) => theme.spacing.md}px;
  margin: ${({ theme }) => theme.spacing.sm}px;

  /* 使用主题字体 */
  font-size: ${({ theme }) => theme.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};

  /* 使用主题圆角 */
  border-radius: ${({ theme }) => theme.borderRadius.md}px;

  /* 使用主题过渡 */
  transition: ${({ theme }) => theme.transitions.normal};

  /* 使用主题阴影 */
  box-shadow: ${({ theme }) => theme.shadows.sm};
`
```

### Props 传递

```typescript
// 使用 $ 前缀传递 transient props（不会传递到 DOM）
const StyledButton = styled.button<{
  $variant: 'primary' | 'secondary'
  $size: 'small' | 'large'
}>`
  ${({ $variant }) => $variant === 'primary' && 'background: blue;'}
  ${({ $size }) => $size === 'small' && 'padding: 4px;'}
`

// 使用
<StyledButton $variant="primary" $size="small" />
```

## 构建与发布

### 构建

```bash
# 清理旧的构建产物
pnpm clean

# 构建生产版本（默认清理旧的构建产物）
pnpm build
```

构建产物位于 `dist/` 目录：

- `index.js` - CommonJS 格式
- `index.mjs` - ES Module 格式
- `index.d.ts` - TypeScript 类型定义

### 版本管理

遵循 [Semantic Versioning](https://semver.org/)：

- **MAJOR** (1.0.0): 破坏性变更
- **MINOR** (0.1.0): 新功能，向后兼容
- **PATCH** (0.0.1): Bug 修复，向后兼容

### 公开发布流程

`compass-ui` 的发布前校验入口统一收口在仓库根脚本 `pnpm run release:verify:compass-ui`。该命令会先运行 `pnpm --filter @xinghunm/compass-ui test`，再调用 `packages/compass-ui/scripts/verify-public-api.mjs`，串联 `build`、`publint`、`pnpm pack` 和 `test-consumer` 的类型冒烟校验。

标准发布步骤如下：

```bash
# 1. 本地预检
pnpm run release:verify:compass-ui

# 2. 记录版本变更
pnpm changeset

# 3. 提交 changeset 后，由 CI release workflow 执行发布
```

CI 使用固定工作流 `.github/workflows/release.yml`。该 workflow 会执行以下步骤：

1. 使用 `pnpm@8.6.10` 安装依赖
2. 使用 `Node.js 22.14.0` 作为 trusted publishing 的 release job runtime
3. 执行 `pnpm run release:verify:compass-ui`
4. 通过 `changesets/action@v1` 运行 `pnpm changeset publish`

在 npm 后台需要为 `@xinghunm/compass-ui` 配置 Trusted Publisher，配置路径为 `npm package settings -> Trusted publishers`，并绑定当前 GitHub 仓库与工作流文件 `.github/workflows/release.yml`。

### 文档验证

文档入口与示例的固定校验命令是仓库根脚本 `pnpm run docs:verify:compass-ui`。该命令会执行两步：

1. `pnpm --filter @xinghunm/compass-ui docs:build`
2. `node packages/compass-ui/scripts/verify-docs-public-imports.mjs`

其中 `verify-docs-public-imports.mjs` 会扫描 `packages/compass-ui/docs/**/*.md` 和 `packages/compass-ui/README.md`，拦截以下问题：

- 使用 `src/`、`dist/` 等内部路径
- 使用未在 `package.json.exports` 中声明的 `@xinghunm/compass-ui/*` 子路径
- 使用仅在仓库内部 alias 下才能成立的导入

推荐在以下场景运行：

- 修改首页、安装指南、API 页面或任意组件文档之后
- 新增公开子路径或调整 `package.json.exports` 之后
- 准备提交与文档相关的变更之前

它与 `pnpm run release:verify:compass-ui` 的边界如下：

- `docs:verify:compass-ui` 负责文档站可构建和文档示例导入边界
- `release:verify:compass-ui` 负责包构建、`publint`、`pnpm pack` 与真实消费者类型冒烟

两者互补，不互相替代。

### 发布前检查清单

- [ ] `pnpm run release:verify:compass-ui` 通过
- [ ] `pnpm run docs:verify:compass-ui` 通过
- [ ] 需要发布的改动已通过 `pnpm changeset` 记录
- [ ] 文档站可构建 (`pnpm --filter @xinghunm/compass-ui docs:build`)
- [ ] npm Trusted Publisher 已绑定到 `.github/workflows/release.yml`

## 开发规范

### 1. 主题适配 (Theme)

- **必须使用主题变量（Design Token）**：所有组件样式必须基于 Theme System 开发，禁止硬编码颜色、间距、字体大小等值。
- **样式分离**：建议将样式定义分离到 `*.styles.ts` 文件中，保持组件逻辑清晰。
- **暗色模式**：确保组件通过主题变量（Design Token）自动适配 Light/Dark 模式。

### 2. ClassName 与结构

- **根元素支持**：所有组件的根元素必须支持传入 `className` 和 `style` 属性，并正确合并到 DOM 节点。
- **语义化 ClassName**：组件的关键内部结构必须添加语义化的静态 ClassName，遵循 BEM 命名风格 `compass-[component]-[part]`。
  - 示例：`compass-message`, `compass-message-content`, `compass-button-icon`
- **Ref 转发**：所有基础组件必须使用 `forwardRef` 将 ref 转发到底层 DOM 节点，确保组件可被引用。

### 3. 导出规范 (Export)

- **统一入口**：每个组件目录必须包含 `index.ts` 文件。
- **导出内容**：
  - 导出组件本体（Default 或 Named Export）。
  - 导出组件相关的 Props 类型定义 (`export * from './types'`)。
- **示例** (`src/message/index.ts`)：
  ```typescript
  import message from './message'
  export * from './types'
  export default message
  ```

### 4. 文件结构

每个组件应包含以下文件：

- `index.ts`: 导出入口
- `[component].tsx`: 组件实现
- `types.ts`: 类型定义
- `[component].test.tsx`: 单元测试
- `[component].styles.ts`: 样式定义 (Emotion，可按需创建)
- `docs/components/[component].md`: 组件文档

## 代码审查清单

提交代码前，请确保：

- [ ] 类型定义完整且准确
- [ ] 所有 props 都有 JSDoc 注释
- [ ] 单元测试已编写且通过
- [ ] 测试覆盖率达标（≥80%）
- [ ] 组件文档已创建并通过自检
- [ ] 代码通过 lint 检查
- [ ] 支持可访问性（A11y）
- [ ] 支持自定义 className 和 style
- [ ] 性能考虑合理
- [ ] 错误处理完善
- [ ] 组件已在 `src/index.ts` 导出

## 调试技巧

### 使用文档站调试

```bash
pnpm docs:dev
```

在浏览器中打开本地 Dumi 站点进行可视化调试。

### 使用 Jest 调试

```bash
# 运行单个测试文件
pnpm test src/button/button.test.tsx

# 监听模式（自动重新运行）
pnpm test -- --watch

# 只运行失败的测试
pnpm test -- --onlyFailures
```

### 查看测试覆盖率

```bash
pnpm test -- --coverage

# 在浏览器中查看详细报告
open coverage/lcov-report/index.html
```

_祝开发愉快！🎉_
