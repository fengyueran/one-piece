# Compass UI Token 重构总结

## 概述

本次重构的目标是统一 `compass-ui` 库中所有组件的样式实现，使用标准的 `token()` 工具函数来访问设计 token，替代之前混乱的 `theme.xxx`、`getComponentTheme()` 和 `getThemeToken()` 访问方式。

## 重构原则

### Token 覆盖分级

1. **Must Have (必须覆盖)**
   - 全局基础 Token：Colors, Typography, Spacing, Radius, Shadows
   - 组件语义化变量：backgrounds, borders, 交互状态, 关键尺寸

2. **Should Have (应该覆盖)**
   - 组件特定的次要属性：padding, margin, fontSize 变体
   - 常用的交互状态：hover, active, disabled, focus

3. **Could Have (可以覆盖)**
   - 次要调整：secondary spacing, icon sizes, animation parameters

4. **Won't Have (不覆盖)**
   - 布局和结构属性：display, position, complex transforms
   - 这些应通过 `styles` 和 `classNames` props 来控制

## 已重构的组件

### 核心组件

| 组件        | 文件                                  | 状态    | 备注                                    |
| ----------- | ------------------------------------- | ------- | --------------------------------------- |
| Button      | `button/button.styles.ts`             | ✅ 完成 | 统一使用 token()，覆盖所有尺寸和状态    |
| Input       | `input-field/input-field.styles.ts`   | ✅ 完成 | 移除 getThemeToken/getComponentTheme    |
| InputNumber | `input-number/input-number.styles.ts` | ✅ 完成 | 继承 Input 样式并扩展                   |
| Select      | `select/select.styles.ts`             | ✅ 完成 | 已使用 token()                          |
| Modal       | `modal/modal.styles.ts`               | ✅ 完成 | 清理混合访问方式                        |
| Menu        | `menu/menu.styles.ts`                 | ✅ 完成 | 已使用 token()                          |
| Dropdown    | `dropdown/dropdown.styles.ts`         | ✅ 完成 | 重命名 DropdownMenu -> OverlayContainer |

### 表单组件

| 组件     | 文件                       | 状态    | 备注                   |
| -------- | -------------------------- | ------- | ---------------------- |
| Form     | `form/form.styles.ts`      | ✅ 完成 | Token 化 spacing       |
| FormItem | `form/form-item.styles.ts` | ✅ 完成 | 移除 getComponentTheme |

### 数据展示组件

| 组件       | 文件                                | 状态    | 备注             |
| ---------- | ----------------------------------- | ------- | ---------------- |
| Table      | `table/table.styles.ts`             | ✅ 完成 | 已使用 token()   |
| Tabs       | `tabs/tabs.styles.ts`               | ✅ 完成 | 已使用 token()   |
| Tree       | `tree/tree.styles.ts`               | ✅ 完成 | 已使用 token()   |
| TreeSelect | `tree-select/tree-select.styles.ts` | ✅ 完成 | 统一使用 token() |
| Steps      | `steps/steps.styles.ts`             | ✅ 完成 | 已使用 token()   |
| Pagination | `pagination/pagination.styles.ts`   | ✅ 完成 | 已使用 token()   |

### 反馈组件

| 组件     | 文件                          | 状态    | 备注              |
| -------- | ----------------------------- | ------- | ----------------- |
| Message  | `message/message.styles.ts`   | ✅ 完成 | 重构全部样式      |
| Progress | `progress/progress.styles.ts` | ✅ 完成 | 统一 token() 访问 |

### 高级组件

| 组件         | 文件                                    | 状态    | 备注           |
| ------------ | --------------------------------------- | ------- | -------------- |
| DatePicker   | `date-picker/date-picker.styles.ts`     | ✅ 完成 | 大规模重构     |
| AutoComplete | `auto-complete/auto-complete.styles.ts` | ✅ 完成 | 统一样式 token |

## 主要修改模式

### 之前的访问方式

```typescript
// 混乱的访问方式
background-color: ${({ theme }) => theme.colors?.background || '#fff'};
padding: ${({ theme }) => getComponentTheme(theme, 'button').padding?.md || '0 16px'};
color: ${({ theme }) => theme?.components?.message?.contentColor || '#333'};
```

### 重构后的访问方式

```typescript
// 统一使用 token()
background-color: ${token('colors.background', '#fff')};
padding: ${token('components.button.padding.md', '0 16px')};
color: ${token('components.message.contentColor', token('colors.text', '#333'))};
```

## Token 命名规范

### 全局 Token

- `colors.{name}`: 基础颜色
- `fontSize.{size}`: 字体大小 (xs, sm, md, lg, xl)
- `spacing.{size}`: 间距 (xs, sm, md, lg, xl)
- `borderRadius.{size}`: 圆角
- `shadows.{level}`: 阴影

### 组件 Token

- `components.{component}.{property}`: 组件特定属性
- `components.{component}.{property}.{variant}`: 属性变体

## 优势

1. **一致性**：所有组件使用统一的 token 访问方式
2. **可维护性**：更容易理解和修改主题
3. **类型安全**：通过 TypeScript 提供更好的类型提示
4. **可扩展性**：易于添加新的 token 和组件
5. **CSS 变量映射**：Token 自动映射为 CSS 变量（`--compass-*`）

## 相关文档

- [设计 Token 工具](../src/theme/token-utils.ts)
- [样式定制文档](../docs/components/index.md#样式定制)
- [ConfigProvider 使用](../docs/components/index.md#configprovider-全局配置)

## 后续工作

1. 确保所有新增组件都遵循 token 规范
2. 定期审查和优化 token 结构
3. 补充缺失的 token 定义
4. 完善文档和示例
