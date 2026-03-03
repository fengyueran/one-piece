# @xinghunm/compass-ui

## 0.8.0

### Minor Changes

- ### Features
  - **Select**
    - 新增 `popupRender(menu)`，支持对下拉弹层内容进行二次扩展。
    - 优化扩展菜单布局：菜单区独立滚动，扩展区可固定显示，长列表下无需滚到底。
    - 同步补充 Select 文档示例与相关测试覆盖。
  - **Form**
    - `validateFields` 新增 `validateOnly` 模式（`validateFields({ validateOnly: true })`）。
    - `validateOnly` 仅计算合法性，不更新错误展示状态，适合仅控制 `isSubmittable` 场景。
    - 补充类型、文档和测试覆盖。
  - **Theme / Select Tokens**
    - 增强 Select 主题 token（dropdown/options/tags/minHeight 等）。
    - 增强深色主题覆盖（含 select/table 相关 token 继承与覆盖）。
    - 修正 InputField clear 按钮选择器命名。

  ### Fixes
  - **Select**
    - 修复 `popupRender` 内部输入框点击导致下拉自动收起的问题（阻止浮层事件冒泡触发 reference toggle）。

  ### Docs / Tests
  - InputField 文档新增 `maxLength` API 与使用示例。
  - InputField 增加 `maxLength` 属性测试。
  - Select 增加 `popupRender` 相关回归测试（含输入框点击不收起场景）。

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
