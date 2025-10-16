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

# 启动 Storybook
pnpm storybook

# 构建 Storybook
pnpm build-storybook

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
│   └── CONTRIBUTING.md           # 贡献指南
├── dist/                         # 构建产物（自动生成）
├── coverage/                     # 测试覆盖率报告
├── node_modules/                 # 依赖包
├── .cursor/                      # Cursor 配置
│   └── rules/
│       └── index.mdc             # 开发规则文档
├── .storybook/                   # Storybook 配置
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
touch my-component.stories.tsx
touch types.ts  # 如果需要复杂类型定义
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

# 更新快照
pnpm test -- -u
```

### 测试最佳实践

1. **测试行为而非实现**：关注组件对外的行为，而不是内部实现细节
2. **使用语义化查询**：优先使用 `getByRole`、`getByLabelText`、`getByText`
3. **验证实际效果**：检查实际的样式值，而不只是元素存在
4. **独立测试**：每个测试应该独立，不依赖其他测试的执行顺序
5. **清晰的描述**：测试描述应该清楚说明测试的目的

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

### 发布前检查清单

- [ ] 所有测试通过 (`pnpm test`)
- [ ] 测试覆盖率达标 (`pnpm test -- --coverage`)
- [ ] 代码检查通过 (`pnpm lint`)
- [ ] 构建成功 (`pnpm build`)
- [ ] Storybook 正常 (`pnpm storybook`)
- [ ] 更新 CHANGELOG.md
- [ ] 更新版本号 (`package.json`)

## 代码审查清单

提交代码前，请确保：

- [ ] 类型定义完整且准确
- [ ] 所有 props 都有 JSDoc 注释
- [ ] 单元测试已编写且通过
- [ ] 测试覆盖率达标（≥80%）
- [ ] Storybook stories 已创建
- [ ] 代码通过 lint 检查
- [ ] 支持可访问性（A11y）
- [ ] 支持自定义 className 和 style
- [ ] 性能考虑合理
- [ ] 错误处理完善
- [ ] 组件已在 `src/index.ts` 导出

## 调试技巧

### 使用 Storybook 调试

```bash
pnpm storybook
```

在浏览器中打开 http://localhost:6006 进行可视化调试。

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

---

_祝开发愉快！🎉_
