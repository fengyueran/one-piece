# 组件模式参考

用这份参考来判断 Compass UI 新组件应该采用哪种目录和文件结构。

## 默认目录结构

大多数组件位于 `src/<component>/`。

常见文件：

- `index.ts`
- `types.ts`
- `<component>.tsx`
- `<component>.test.tsx`

可选文件：

- `<component>.styles.ts`
- 辅助文件，例如 `context.ts`、`utils.ts`、`confirm.tsx`、`use-*.tsx`

## 参考组件

### 简单组件

当组件主要是单个公开组件、props 比较直接时，默认参考 `src/button/`。

典型结构：

- `button.tsx`
- `types.ts`
- `index.ts`
- `button.test.tsx`
- 可选 `button.styles.ts`

### 输入类或样式较多的组件

当组件需要多个样式包裹层或视觉状态较多时，默认参考 `src/input-field/`。

典型结构：

- `input-field.tsx`
- `input-field.styles.ts`
- `types.ts`
- `index.ts`
- `input-field.test.tsx`

### 复杂或复合组件

当组件需要以下能力时，优先参考 `src/modal/` 或 `src/select/`：

- 辅助模块
- 静态挂载导出
- context
- 浮层或遮罩交互
- 多个相关公开入口

只有真实行为需要时才增加这些文件，不要为了“模板完整”而提前生成。

## 导出规则

对于 `src/<component>/index.ts`：

- 导出默认组件
- 导出公共类型
- 只有参考组件本身就有复合静态能力时，才增加静态挂载

对于根级 `src/index.ts`：

- 新增组件导出
- 新增公共类型导出
- 顺序优先和周围已有条目保持一致，不要盲目重新排序

## 文件生成规则

- 默认不要生成 `*.stories.tsx`
- 样式简单时不要强行拆出 `*.styles.ts`
- 不要在组件目录里额外创建 README 或其他说明文件
- 初始脚手架尽量小，只有实现明确需要时再加文件
