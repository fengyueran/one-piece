---
name: create-component
description: 为当前仓库中的 Compass UI 组件库创建或脚手架化新组件。用于在 src/ 下新增组件目录、选择合适的文件结构、更新 src/index.ts 导出、补充测试，以及编写遵循现有 Button 文档结构的 docs/components 组件文档页面。适用于可以只放在单个 component tsx 文件中的简单组件，也适用于需要按需拆分 component styles 文件的复杂组件。
---

# 创建组件

## 概述

创建新组件时，优先复用当前仓库已有组件模式，而不是生成通用模板。先找到最接近的现有组件作为参照，尽量保持文件最少，同时始终补齐测试和文档。

## 工作流

### 1. 先找最接近的现有组件

在动手写文件前，先检查 `src/` 下的现有组件目录，并选一个最接近的参考实现。

- 简单展示型组件默认参考 `button`
- 需要单独样式文件的组件默认参考 `input-field`
- 带复合导出、辅助模块或复杂交互的组件默认参考 `modal` 或 `select`

如果用户明确提到某个组件和现有组件相似，就优先阅读那个组件目录并保持风格一致。

## 2. 选择最小可行文件结构

默认使用满足需求的最小结构。

### 简单组件

创建：

- `src/<component>/index.ts`
- `src/<component>/types.ts`
- `src/<component>/<component>.tsx`
- `src/<component>/<component>.test.tsx`
- `docs/components/<component>.md`

如果样式很少且只在本组件内使用，直接写在 `<component>.tsx` 中，不额外拆分样式文件。

### 需要样式拆分的组件

只有在以下情况才新增 `src/<component>/<component>.styles.ts`：

- 样式复杂
- 需要多个 styled primitive
- 或仓库中相似组件已经采用了这种拆分方式

### 复杂组件

只有在真实行为需要时才增加额外文件，例如：

- `context.ts`
- `utils.ts`
- `use-*.tsx`
- 次级组件文件

默认不要生成 `*.stories.tsx`。

## 3. 按仓库约定实现组件

实现时遵循以下规则：

- 主组件放在 `src/<component>/<component>.tsx`
- 公共类型放在 `src/<component>/types.ts`
- 在 `src/<component>/index.ts` 中导出默认组件和公共类型
- 更新根级 `src/index.ts`，导出新组件及其公共类型
- 命名、导出风格、类型写法优先对齐最近的参考组件
- 尽量复用现有 theme token 和工具函数，不额外发明新模式
- 除非用户明确要求更大 API 面，否则保持公共 API 精简

是否拆出 `*.styles.ts`，优先看“与最接近现有组件是否一致”，而不是追求抽象上的统一。

## 4. 为公共行为编写测试

始终添加 `src/<component>/<component>.test.tsx`。

至少覆盖：

- 基础渲染
- 关键 props 分支
- 重要交互
- 相关无障碍或键盘行为
- 涉及受控/非受控时的对应行为

完成后运行新组件的定向测试。

## 5. 编写组件文档

始终创建 `docs/components/<component>.md`。

写文档前先阅读：

- `docs/components/button.md`
- `references/doc-page-structure.md`

组件文档风格默认参考 Button 页面，但不要机械复制旧章节顺序。优先对齐当前 `compass-ui` 已稳定下来的页面结构、中文表达和表格风格。

必须包含：

- frontmatter
- 页面标题
- 一句简短的组件说明
- `## 何时使用`
- `## 代码演示`
- `## API`
- `## API` 下方先写 `通用属性参考：[通用属性](/guide/common-props)`，再开始 API 表格
- 已经属于通用属性的字段，例如 `className`、`style`，不要在组件自己的 API 表里重复列出
- 如果组件存在明确的键盘、焦点、ARIA 或语义行为，补 `## 键盘与可访问性` 或同等语义章节
- 如果组件存在迁移信息、兼容入口、交互边界或当前限制，按需补 `## 兼容说明`、`## 边界说明`、`## 交互边界与可访问性`、`## 当前约束` 等可选章节
- 仅在组件确实暴露 token 时再写主题变量部分；不要为了凑模板硬加

主题变量部分的规则：

- 如果组件支持主题覆盖，优先在 `## 代码演示` 中提供一个 `### 自定义主题` 示例
- 再使用 `## 主题变量 (Design Token)` 说明可配置 token
- token 表格统一使用 `Token Name` / `Description` / `Default`
- 默认值应与 `src/theme/default-theme.ts` 保持一致
- 组件如果同时受全局 token 影响，可在表格后补一行简短说明，不再使用旧的 `<details>`、`组件 Token`、`全局 Token` 块

示例代码必须真实、可复制，不要写伪代码。不要加入 Storybook 专属说明，也不要在文档里提 stories。

## 6. 收尾检查

结束前确认：

- `src/index.ts` 已补充导出
- 新组件的定向测试已运行
- 只在仓库工作流确实需要时再运行格式化
- `docs/components/<component>.md` 已创建并符合 Button 文档结构

## 参考资料

按需阅读：

- `references/component-patterns.md`：组件文件布局与导出规则
- `references/doc-page-structure.md`：组件文档结构要求
