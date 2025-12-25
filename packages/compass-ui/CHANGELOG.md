# @xinghunm/compass-ui

## 0.3.0

### Minor Changes

- - Form 组件支持 `onFieldsChange` 属性
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
