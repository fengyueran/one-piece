---
title: Alert 警告提示
nav:
  title: 组件
  order: 2
group:
  title: 反馈
  order: 4
---

# Alert 警告提示

`Alert` 用于页面或容器内部的持续反馈。它会稳定留在当前布局中，适合解释风险、成功状态、注意事项或可恢复错误。

## 何时使用

- 需要在页面内持续展示一段反馈，而不是几秒后自动消失时
- 需要把反馈和上下文内容放在一起，例如表单顶部、详情页头部、卡片正文中
- 需要提示后续动作，例如“去处理”“查看详情”“重新尝试”

## 不适合的场景

- 临时性、全局浮出的提示：请使用 `Message`
- 需要打断用户决策的确认流程：请使用 `Modal`
- 单纯展示进度百分比：请使用 `Progress`

## 代码演示

### 基础用法

```tsx
import React from 'react'
import { Alert } from '@xinghunm/compass-ui'

export default () => (
  <Alert type="info" title="环境提示" description="当前正在使用测试环境，请勿录入真实生产数据。" />
)
```

### 不同类型

```tsx
import React from 'react'
import { Alert } from '@xinghunm/compass-ui'

export default () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <Alert type="success" title="保存成功" description="配置已写入并将在下次发布时生效。" />
    <Alert type="warning" title="即将过期" description="当前令牌将在 2 小时后失效，请及时刷新。" />
    <Alert type="error" title="同步失败" description="远端服务暂时不可用，请稍后重试。" />
  </div>
)
```

### 带操作区和关闭按钮

```tsx
import React from 'react'
import { Alert, Button } from '@xinghunm/compass-ui'

export default () => (
  <Alert
    type="warning"
    title="仍有待处理项"
    description="你可以先保存草稿，或立即去补齐缺失字段。"
    action={<Button size="small">查看详情</Button>}
    closable
  />
)
```

### 自定义主题

```tsx
import React from 'react'
import { Alert, ConfigProvider } from '@xinghunm/compass-ui'

export default () => (
  <ConfigProvider
    theme={{
      token: {
        components: {
          alert: {
            borderRadius: '12px',
            warning: {
              backgroundColor: '#fff7ed',
              borderColor: '#fdba74',
              accentColor: '#ea580c',
            },
          },
        },
      },
    }}
  >
    <Alert
      type="warning"
      title="主题已覆盖"
      description="你可以针对不同反馈类型单独配置背景、边框和强调色。"
    />
  </ConfigProvider>
)
```

更多可配置字段见 [主题 Token](/guide/theme-tokens)。

## 键盘与可访问性

- `Alert` 使用语义化角色输出反馈内容
- `warning` 和 `error` 默认使用 `role="alert"`，更适合需要立即被辅助技术感知的内容
- 可关闭时会提供可聚焦的关闭按钮

## 边界说明

- `Alert` 是页面内构件，不负责全局消息队列
- `Alert` 不会像 `Message` 一样自动消失
- 如果你需要列表、表格或页面在“没有内容”时的占位，请改用 `Empty`

## API

通用属性参考：[通用属性](/guide/common-props)

| 属性          | 说明                                    | 类型                                          | 默认值   |
| ------------- | --------------------------------------- | --------------------------------------------- | -------- |
| `type`        | 反馈类型                                | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` |
| `title`       | 标题内容                                | `ReactNode`                                   | -        |
| `description` | 描述内容                                | `ReactNode`                                   | -        |
| `children`    | 备用主体内容，未传 `description` 时使用 | `ReactNode`                                   | -        |
| `action`      | 右侧操作区                              | `ReactNode`                                   | -        |
| `icon`        | 自定义图标                              | `ReactNode`                                   | -        |
| `showIcon`    | 是否显示图标                            | `boolean`                                     | `true`   |
| `closable`    | 是否显示关闭按钮                        | `boolean`                                     | `false`  |
| `onClose`     | 关闭后的回调                            | `() => void`                                  | -        |
| `classNames`  | 语义化类名覆写                          | `AlertProps['classNames']`                    | -        |
| `styles`      | 语义化样式覆写                          | `AlertProps['styles']`                        | -        |

### classNames / styles 插槽

`classNames` 与 `styles` 使用相同的 slot key。

| 插槽名        | 说明     |
| ------------- | -------- |
| `root`        | 根容器   |
| `icon`        | 图标区域 |
| `content`     | 内容区域 |
| `title`       | 标题区域 |
| `description` | 描述文本 |
| `action`      | 操作区   |
| `close`       | 关闭按钮 |

## 主题变量 (Design Token)

| Token Name                                 | Description      | Default               |
| ------------------------------------------ | ---------------- | --------------------- |
| `components.alert.padding`                 | 容器内边距       | `12px 16px`           |
| `components.alert.borderRadius`            | 容器圆角         | `8px`                 |
| `components.alert.titleColor`              | 标题文字颜色     | `rgba(0, 0, 0, 0.88)` |
| `components.alert.descriptionColor`        | 描述文字颜色     | `#595959`             |
| `components.alert.iconSize`                | 图标尺寸         | `18px`                |
| `components.alert.closeColor`              | 关闭按钮颜色     | `#8c8c8c`             |
| `components.alert.closeHoverColor`         | 关闭按钮悬停颜色 | `#1f1f1f`             |
| `components.alert.focusRingColor`          | 焦点高亮颜色     | `#1677ff`             |
| `components.alert.info.backgroundColor`    | 信息态背景色     | `#e6f4ff`             |
| `components.alert.info.borderColor`        | 信息态边框色     | `#91caff`             |
| `components.alert.info.accentColor`        | 信息态强调色     | `#1677ff`             |
| `components.alert.success.backgroundColor` | 成功态背景色     | `#f6ffed`             |
| `components.alert.success.borderColor`     | 成功态边框色     | `#b7eb8f`             |
| `components.alert.success.accentColor`     | 成功态强调色     | `#52c41a`             |
| `components.alert.warning.backgroundColor` | 警告态背景色     | `#fffbe6`             |
| `components.alert.warning.borderColor`     | 警告态边框色     | `#ffe58f`             |
| `components.alert.warning.accentColor`     | 警告态强调色     | `#faad14`             |
| `components.alert.error.backgroundColor`   | 错误态背景色     | `#fff2f0`             |
| `components.alert.error.borderColor`       | 错误态边框色     | `#ffccc7`             |
| `components.alert.error.accentColor`       | 错误态强调色     | `#ff4d4f`             |

Alert 还会跟随全局 `colors.text`、`colors.textSecondary`、`colors.info*`、`colors.success*`、`colors.warning*`、`colors.error*`、`spacing.*`、`borderRadius.*` 与 `fontSize.*` 等 token 变化，但组件级覆盖优先使用 `components.alert.*`。
