---
title: 组件总览
nav:
  title: 组件
  order: 2
group:
  title: 介绍
  order: 0
---

# 组件总览

这里展示 `Compass UI` 当前已经公开发布并提供文档的组件。建议先从高频基础组件开始，再进入表单、数据展示和反馈类组件。

## 如何浏览

- 想先安装并跑通第一个示例：看 [快速开始](/guide/getting-started)
- 想确认哪些导入路径是正式公开 API：看 [API 参考](/api)
- 想查看单个组件的用法、示例和参数表：直接进入下方组件页面

## 基础组件

- [Button 按钮](/components/button)
- [Checkbox 多选框](/components/checkbox)
- [Input 输入框](/components/input)
- [InputField 输入框](/components/input-field)
- [InputNumber 数字输入框](/components/input-number)
- [Progress 进度条](/components/progress)
- [Radio 单选框](/components/radio)
- [Steps 步骤条](/components/steps)
- [Switch 开关](/components/switch)
- [Tabs 标签页](/components/tabs)
- [Textarea 文本域](/components/textarea)

## 表单与选择

- [Select 选择器](/components/select)
- [AutoComplete 自动完成](/components/auto-complete)
- [TreeSelect 树选择器](/components/tree-select)
- [DatePicker 日期选择器](/components/date-picker)
- [Form 表单](/components/form)

## 导航与数据展示

- [Menu 菜单](/components/menu)
- [Dropdown 下拉菜单](/components/dropdown)
- [Table 表格](/components/table)
- [Tree 树形控件](/components/tree)
- [Pagination 分页](/components/pagination)
- [Tooltip 文字提示](/components/tooltip)

## 反馈与全局配置

- [Modal 对话框](/components/modal)
- [Message 全局提示](/components/message)
- [ConfigProvider 全局配置](/components/config-provider)
- [ThemeProvider 主题上下文](/components/theme-provider)

## 当前范围说明

当前目录聚焦已经公开导出且适合在真实项目中直接消费的组件能力：

- 优先补齐高频常用组件，而不是追求一次性覆盖完整设计系统。
- 文本输入场景默认优先使用 `Input` 与 `Textarea`，`InputField` 只作为兼容入口保留。
- 文档页会逐步补充键盘和可访问性说明，但只记录已经被自动化验证覆盖的行为。
- 更复杂的 overlay、选择器稳态化和更广的组件覆盖面会在后续阶段继续推进。

## 暂未纳入本阶段的内容

- 不提供第二套文档入口或独立 demo app。
- 不承诺与大型成熟框架同等覆盖面。
- 不在这里列出尚未公开发布或尚未有稳定文档的实验性能力。
