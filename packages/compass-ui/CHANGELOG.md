# @xinghunm/compass-ui

## 0.7.1

### Patch Changes

- ### Bug Fixes
  - **FormItem**: 使用 ref 同步校验状态和错误信息，修复异步校验中状态不一致的问题
  - **InputField**: 修复 status 样式类名未正确添加的问题，补充 `compass-input-field--${status}` class

## 0.7.0

### Minor Changes

- - 新增 `Table` 和 `AutoComplete` 组件。
  - 为基础组件、表单组件、导航组件及数据展示组件添加语义化定制支持。
  - 增强 `ThemeProvider`，支持 Token 合并及语义化定制工具函数。
  - `Tree` 组件新增 `onlyLeafSelect` 属性及节点选择功能。
  - 引入 Dumi 进行文档管理，并更新组件文档。
  - 优化 `Modal` 样式，更新项目配置。

## 0.6.0

### Minor Changes

- - TreeSelect: 新增 `titleRender` 和 `switcherIcon` 属性支持
  - Message: 修复 props 传递问题，避免将 `key` 直接传递给组件

## 0.5.0

### Minor Changes

- Form 组件支持自定义 help 以及优化了 help 的显示方式
- 更新了 InputField 的眼睛图标

## 0.4.0

### Minor Changes

- 添加了 Tabs 和 TreeSelect 组件，修复了 Menu 和 Dropdown 的 bug。

## 0.3.0

### Minor Changes

- Form 组件支持 `onFieldsChange` 属性
- 新增 `Form.useWatch` 钩子

## 0.2.0

### Minor Changes

- - **新增**: Form 表单组件，支持字段管理、表单验证、表单联动等功能
  - **新增**: FormItem 表单项组件，支持标签、错误提示、字段校验
  - **新增**: Form 组件支持主题配置，可通过 Design Token 自定义样式
  - **优化**: ThemeProvider 使用通用深度合并函数，提升扩展性

### Patch Changes

- Updated dependencies
  - @xinghunm/compass-hooks@0.1.0

## 0.1.0

### Minor Changes

- feat: 发布完整的组件库初始版本

  包含以下组件和功能：
  - **通用**: Button (按钮), Icons (图标), ConfigProvider (全局配置)
  - **导航**: Menu (菜单), Dropdown (下拉菜单), Pagination (分页), Steps (步骤条)
  - **数据录入**: InputField (输入框), InputNumber (数字输入), Select (选择器), DatePicker (日期选择), Tree (树形控件)
  - **反馈**: Modal (对话框), Message (全局提示), Progress (进度条)
  - **其他**: 完整的主题系统 (明亮/暗黑模式) 和国际化支持 (中/英)
