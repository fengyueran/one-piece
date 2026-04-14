# API 参考

本页只描述 `compass-ui` 当前已经声明在 `package.json.exports` 中的公开 API。对外示例和文档验证都以这里的导入边界为准。

## 文档入口

- 想先安装并运行第一个示例：看 [快速开始](/guide/getting-started)
- 想浏览当前组件列表：看 [组件总览](/components)
- 想了解维护和验证流程：看 [开发指南](./DEVELOPMENT.md)

## 根入口

根入口适合放“高频门面能力”，也就是业务代码最常直接用到的组件、配置入口和主题默认值。

```ts
import {
  Alert,
  Button,
  Checkbox,
  ConfigProvider,
  Empty,
  Input,
  Radio,
  Skeleton,
  SpinLoading,
  Switch,
  Textarea,
  ThemeProvider,
  defaultTheme,
} from '@xinghunm/compass-ui'
```

根入口当前主要包含：

- 已公开组件：如 `Button`、`Input`、`Textarea`、`Select`、`DatePicker`、`Table`、`Modal`
- 新增基础布尔选择控件：`Checkbox`、`Radio`、`Switch`
- 新增页面状态组件：`Alert`、`Empty`、`Skeleton`、`SpinLoading`
- 兼容入口：`InputField` 仍然保留，但新代码推荐直接使用 `Input`
- 全局配置与主题门面：`ConfigProvider`、`ThemeProvider`、`useTheme`
- 常用主题默认值与主要类型：`defaultTheme`、`Theme`、组件 Props 类型

## `@xinghunm/compass-ui/theme`

`/theme` 子路径用于主题系统本身。这里更偏向主题上下文和主题扩展能力，而不是业务组件。

```ts
import { ThemeProvider, defaultTheme } from '@xinghunm/compass-ui/theme'
```

适合场景：

- 你只想按主题系统拆分导入
- 你在封装更上层的主题基础设施
- 你需要和根入口门面保持更明确的分层

## `@xinghunm/compass-ui/locale`

`/locale` 子路径承载语言包资源。它属于资源型子路径，不建议和根入口的组件门面混在一起理解。

```ts
import { zhCN, enUS } from '@xinghunm/compass-ui/locale'
```

适合场景：

- 为 `ConfigProvider` 提供语言包
- 在应用层按语言环境切换组件文案

## `@xinghunm/compass-ui/icons`

`/icons` 子路径承载图标资源，避免把大量图标名称都堆进根入口命名空间。

```ts
import { SearchIcon, CloseIcon } from '@xinghunm/compass-ui/icons'
```

适合场景：

- 需要在菜单、步骤条、输入组件等位置复用图标
- 想保持组件 API 与资源型导出分层清晰

## 导入边界

当前文档与示例允许的正式公开路径只有下面 4 类：

- `@xinghunm/compass-ui`
- `@xinghunm/compass-ui/theme`
- `@xinghunm/compass-ui/locale`
- `@xinghunm/compass-ui/icons`

以下路径不属于公开 API：

- `@xinghunm/compass-ui/src/...`
- `@xinghunm/compass-ui/dist/...`
- 任何未在 `exports` 中声明的 `@xinghunm/compass-ui/*`
- 任何依赖仓库内部 alias 才能工作的导入写法

## 类型导入示例

```ts
import type {
  ButtonProps,
  CheckboxProps,
  EmptyProps,
  InputProps,
  RadioGroupProps,
  SkeletonProps,
  SpinLoadingProps,
  SwitchProps,
  TextareaProps,
  Theme,
} from '@xinghunm/compass-ui'
```

## 关于可访问性说明

组件文档会逐步补充键盘与可访问性章节，但这里只承诺已经由自动化测试覆盖的基础行为。更复杂的 overlay、焦点管理与高级交互会在后续阶段继续补齐。

## Select 当前交互契约

- `Select` 当前对外暴露的是基础 `combobox` / `listbox` 语义，触发器或搜索输入会同步 `aria-expanded`、`aria-controls`、`aria-activedescendant`。
- 非搜索模式下，关闭状态按 `Enter` 或 `ArrowDown` 会展开菜单；展开后按 `ArrowDown` / `ArrowUp` 移动激活项，按 `Enter` 或 `Space` 确认当前激活项。
- 搜索模式下，输入框会在展开后自动获得焦点。输入过滤条件后，使用 `ArrowDown` / `ArrowUp` 导航，按 `Enter` 选择当前激活项。
- `Escape` 会关闭当前展开的菜单；`disabled` 状态不会打开菜单，也不会响应键盘选择。
- `allowClear` 只负责清空当前值，不额外承诺保留或返回被清空项的 option 对象。

## 页面状态组件边界

- `Alert`：页面内持续反馈，不替代 `Message`
- `Empty`：无结果或无内容时的占位，不表达“正在加载”
- `Skeleton`：结构已知时的占位加载
- `SpinLoading`：通用等待态，支持独立使用或包裹内容形成覆盖式加载
