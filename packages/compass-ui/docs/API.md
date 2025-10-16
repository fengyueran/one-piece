# API 文档

Compass UI 组件库的完整 API 参考文档。

## 组件

### 基础组件

- **[Button](./api/Button.md)** - 按钮组件，用于触发操作和事件

### 主题系统

- **[Theme](./api/Theme.md)** - 主题系统和 ThemeProvider 组件

## 快速开始

### 安装

```bash
pnpm add @xinghunm/compass-ui
```

### 基本使用

```tsx
import { Button, ThemeProvider } from '@xinghunm/compass-ui'

function App() {
  return (
    <ThemeProvider>
      <Button variant="primary">Hello Compass UI</Button>
    </ThemeProvider>
  )
}
```

## TypeScript 支持

所有组件都提供完整的 TypeScript 类型定义：

```typescript
import type { ButtonProps, Theme } from '@xinghunm/compass-ui'
```

## 可访问性

所有组件都遵循 WCAG 2.1 标准，支持：

- ✅ 键盘导航
- ✅ 屏幕阅读器
- ✅ ARIA 属性
- ✅ 焦点管理
- ✅ 颜色对比度

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 更多资源

- **[开发指南](./DEVELOPMENT.md)** - 组件开发和贡献指南
- **[贡献指南](./CONTRIBUTING.md)** - 如何参与项目贡献
- **[Storybook 文档](http://localhost:6006)** - 交互式组件示例

```bash
pnpm storybook
```

## 问题反馈

如有问题或建议，请：

1. 查看相关组件的 API 文档
2. 查看 [开发指南](./DEVELOPMENT.md)
3. 查看 [贡献指南](./CONTRIBUTING.md)
4. 在 GitHub 提交 Issue

---

_最后更新：2024-10-16_
