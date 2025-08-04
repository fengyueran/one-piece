# One Piece 🏴‍☠️

> 个人开发者项目合集 - 组件库、工具库等

这是一个基于 Monorepo 架构的个人项目合集，包含了各种可复用的组件库、工具库和应用。

## 📦 包结构

### Packages
- `@one-piece/ui-components` - React 组件库
- `@one-piece/utils` - 通用工具库
- `@one-piece/hooks` - React Hooks 库
- `@one-piece/icons` - 图标库
- `@one-piece/themes` - 主题库

### Apps
- `docs` - 文档站点
- `playground` - 组件演示站点
- `examples` - 示例应用

### Tools
- `build` - 构建工具
- `eslint-config` - ESLint 配置
- `tsconfig` - TypeScript 配置

## 🚀 快速开始

### 安装依赖
```bash
pnpm install
```

### 开发
```bash
pnpm dev
```

### 构建
```bash
pnpm build
```

### 测试
```bash
pnpm test
```

### 代码检查
```bash
pnpm lint
```

## 🛠️ 技术栈

- **包管理**: pnpm + workspace
- **构建工具**: Turborepo
- **版本管理**: Changesets
- **语言**: TypeScript
- **代码规范**: ESLint + Prettier

## 📝 开发指南

### 添加新包
```bash
turbo gen workspace
```

### 发布新版本
```bash
pnpm changeset
pnpm version-packages
pnpm release
```

## 📄 许可证

MIT 