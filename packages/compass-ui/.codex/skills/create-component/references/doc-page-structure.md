# 文档页面结构

组件文档默认参考 `docs/components/button.md` 的结构与写法。

## 必备结构

顺序保持如下：

1. YAML frontmatter
2. `# <组件名> <中文名>`
3. 一句简短介绍
4. `## 何时使用`
5. `## 代码演示`
6. `## API`
7. `通用属性参考：[通用属性](/guide/common-props)`
8. 组件 token 或全局 token 章节（仅在确实需要时添加）

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

## 写作风格

- 保持直接、客观
- 使用与现有组件文档一致的中文表达
- 不要提 Storybook、内部实现文件、或非公共 props
