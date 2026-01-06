# Compass UI 文档说明

本项目包含两类文档:

## 📚 用户文档 (通过 dumi 生成)

面向 **组件库使用者**,通过 `pnpm docs:dev` 启动,访问 http://localhost:8000

### 目录结构

```
docs/
├── index.md                    # 首页
├── guide/                      # 使用指南
│   └── getting-started.md      # 快速开始
└── components/                 # 组件文档
    ├── button.md               # Button 组件
    ├── steps.md                # Steps 组件
    └── ...                     # 其他组件
```

### 特点

- ✅ **代码可编辑** - 所有示例代码都可以在线编辑和预览
- ✅ **实时预览** - 修改代码后立即看到效果
- ✅ **响应式** - 支持移动端和桌面端
- ✅ **主题切换** - 支持亮色/暗色模式

## 🛠️ 开发文档

面向 **组件库贡献者和维护者**,独立于用户文档

### 文件位置

```
docs/
├── DEVELOPMENT.md              # 开发规范和指南
├── API.md                      # API 设计文档
└── README.md                   # 文档说明(本文件)
```

### 内容

- 组件开发规范
- TypeScript 规范
- 测试规范
- 样式规范
- 文档规范
- 发布流程

## 🚀 命令

```bash
# 启动用户文档 (dumi)
pnpm docs:dev

# 构建用户文档
pnpm docs:build

# 启动 Storybook (旧版,可选)
pnpm storybook
```

## 📝 编写组件文档

在 `docs/components/` 目录下创建 Markdown 文件:

```markdown
---
title: ComponentName 组件名
nav:
  title: 组件
  order: 2
group:
  title: 分组名
  order: 1
---

# ComponentName 组件名

组件描述

## 何时使用

- 使用场景 1
- 使用场景 2

## 代码演示

### 基础用法

描述

\`\`\`tsx
import React from 'react'
import { ComponentName } from '@xinghunm/compass-ui'

export default () => {
return <ComponentName>示例</ComponentName>
}
\`\`\`

## API

| 参数  | 说明 | 类型     | 默认值 |
| ----- | ---- | -------- | ------ |
| prop1 | 说明 | `string` | -      |
```

## 🔄 迁移说明

我们正在从 Storybook 迁移到 dumi:

- ✅ **已完成**: dumi 基础配置
- ✅ **已完成**: Steps 组件文档迁移
- ✅ **已完成**: Button 组件文档迁移
- 🚧 **进行中**: 其他组件文档迁移
- 📋 **待办**: 完全移除 Storybook (可选)

## 💡 为什么选择 dumi?

1. **更接近 Ant Design 风格** - 与 Ant Design 官网相同的文档工具
2. **代码可编辑** - 用户可以直接在文档中编辑和运行代码
3. **Markdown 优先** - 更简单的文档编写方式
4. **专为组件库设计** - 内置组件 API 解析等功能
5. **更好的 SEO** - 静态站点生成,利于搜索引擎收录
