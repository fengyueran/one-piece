# 文档页面结构

组件文档默认参考 `docs/components/button.md` 的风格与写法，但章节组织应以当前 `compass-ui` 组件页的稳定模式为准，而不是机械复制旧模板。

## 必备结构

必须包含以下核心部分：

1. YAML frontmatter
2. `# <组件名> <中文名>`
3. 一句简短介绍
4. `## 何时使用`
5. `## 代码演示`
6. `## API`
7. `通用属性参考：[通用属性](/guide/common-props)`

## 常见可选结构

按组件实际情况补充，不要求每页都出现：

- `## 键盘与可访问性`
- `## 兼容说明`
- `## 边界说明`
- `## 交互边界与可访问性`
- `## 当前约束`
- `## 主题变量 (Design Token)`

如果组件支持 token 覆盖，通常还会在 `## 代码演示` 下补一个 `### 自定义主题` 示例。

## Frontmatter 形态

保持与 Button 一致的写法：

```md
---
title: Button 按钮
nav:
  title: 组件
  order: 2
group:
  title: 通用
  order: 1
---
```

可以按组件分类调整标题和分组，但格式风格保持一致。

## 代码演示要求

在 `## 代码演示` 下：

- 使用 `###` 子标题
- 先给基础用法
- 只写真实存在的公共 API 示例
- 保持示例精简且可运行
- 不要写占位伪代码
- 如果组件支持主题覆盖，优先补一个真实可运行的 `### 自定义主题` 示例

## API 章节要求

在 `## API` 标题下面，先补这一行：

`通用属性参考：[通用属性](/guide/common-props)`

用 Markdown 表格描述公共 props。

如果某个属性已经属于通用属性，例如 `className`、`style`，不要在组件自己的 API 表里重复列出。

表头顺序优先保持和 Button 一致：

- 参数
- 说明
- 类型
- 默认值

如果组件还暴露了相关类型，再在主表之后继续补充。

如果组件公开了 `classNames` / `styles`：

- 在主 API 表后补 `### classNames / styles 插槽`
- 明确说明 `classNames` 与 `styles` 使用同一套 slot key
- 用表格列出所有 slot 名和对应语义，不要只写 `XXXProps['classNames']`

## 主题变量章节要求

仅在组件确实暴露 token 时添加。

- 标题统一为 `## 主题变量 (Design Token)`
- 必须放在文档最后，不能在它后面再出现新的二级标题
- 表头统一为 `Token Name` / `Description` / `Default`
- `Default` 必须与 `src/theme/default-theme.ts` 中的真实默认值一致
- 如果组件还会跟随全局 token 变化，必须在表格后补一句简短说明
- 不再使用旧的 `<details>`、`组件 Token`、`全局 Token` 展开块

## 写作风格

- 保持直接、客观
- 使用与现有组件文档一致的中文表达
- 不要提 Storybook、内部实现文件、或非公共 props
