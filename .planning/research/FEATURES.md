# Feature Landscape

**领域：** 公开发布的 React 组件库 / 设计系统（聚焦 `compass-ui`）
**研究日期：** 2026-04-13
**总体结论：** 当前阶段不应继续横向铺开“看起来很多”的组件数，而应先把公开组件库在早中期最影响采用率的基础输入、反馈、overlay、导航闭环补齐，并把现有高频复杂组件的可访问性、文档、demo 与发布可用性做实。

## 执行摘要

从 Material UI、Ant Design、React Aria 等公开文档看，成熟 React 组件库都会优先覆盖几个稳定大类：输入、反馈、导航、数据展示，以及主题 / 国际化 / 可访问性这样的横向基础设施。差异主要不在“有没有 Button”，而在“这些高频组件是否能在真实项目里稳定使用”，尤其是键盘交互、焦点管理、表单整合、国际化和文档示例完整度。

结合当前仓库，`compass-ui` 已经有 `button`、`form`、`select`、`date-picker`、`table`、`modal`、`tabs`、`tooltip`、`dropdown`、`message`、`progress`、`tree`、`tree-select`、`config-provider`、`theme`、`locale` 等中层能力，说明产品已经越过“完全从零”的阶段；但公开 adoption 仍有明显短板：基础输入族没有形成完整闭环，反馈族不完整，overlay 能力存在但抽象不稳定，而且 `select` 已暴露键盘导航缺口，这会直接影响外部用户判断其成熟度。

因此，下一阶段最合理的 scope 不是继续追求更多“中高级花活”，而是做一个可公开采用的 v1：先补齐缺失的基础输入与反馈组件，再把现有复杂组件的可访问性和 demo 质量拉到成熟组件库的基本线；等这些完成后，再进入 vNext 的差异化与更重型能力。

## 当前 `compass-ui` 覆盖判断

### 已有能力

- 基础与导航：`button`、`tabs`、`pagination`、`steps`、`menu`
- 数据录入：`form`、`input-field`、`input-number`、`select`、`auto-complete`、`date-picker`、`tree-select`
- 数据展示：`table`、`tree`、`progress`
- 反馈与 overlay：`message`、`modal`、`tooltip`、`dropdown`
- 横向基础设施：`config-provider`、`theme`、`locale`

### 主要缺口

- 缺少最常见的选择控件闭环：`checkbox`、`radio`、`switch`
- 文本录入闭环不完整：缺标准化 `input` / `textarea` 能力与统一 field API
- 反馈族不完整：缺 `alert`、`skeleton`、`spin/loading`、`empty`
- overlay 族不完整：缺 `drawer`、`popover` / `popconfirm`
- 信息展示基础件偏少：缺 `badge` / `tag`、`avatar`、`card` / `list` 等常见搭配件
- 已有复杂组件还没完全过“公开可采用”的质量线：`select` 键盘导航缺失，`dropdown` / `tooltip` / `tree-select` / `date-picker` 存在焦点与 Hook 脆弱区

## Table Stakes

这些能力不做，外部用户通常会直接判断“这个库还没到可采用阶段”。

| 功能 / 组件族                    | 为什么是 table stakes                                                     | `compass-ui` 建议 | 复杂度 | 关键依赖 / 前置                                                          |
| -------------------------------- | ------------------------------------------------------------------------- | ----------------- | ------ | ------------------------------------------------------------------------ |
| `checkbox` / `radio` / `switch`  | MUI 与 Ant Design 都把它们放在输入核心区；没有这组，表单闭环不成立        | **v1 必做**       | 低到中 | `form` 集成、键盘语义、组选中模型、主题状态 token                        |
| 标准化 `input` / `textarea` 体系 | 公开库需要可预测的文本输入 API；仅有 `input-field` 不足以替代通用输入体系 | **v1 必做**       | 中     | 抽共享 field 容器、状态样式、前后缀、清空、尺寸、校验态                  |
| `alert`                          | 反馈组件的最低门槛；`message` 适合瞬时提示，不适合页面内持续状态提示      | **v1 必做**       | 低     | 图标、语义色 token、可关闭行为                                           |
| `skeleton` + `spin/loading`      | 公开 demo 与实际项目都会大量用到；缺它们会逼用户混用外部库                | **v1 必做**       | 低     | 动效 token、可组合占位骨架 API                                           |
| `empty`                          | 表格、列表、搜索、筛选结果为空是高频场景；成熟组件库基本都会提供          | **v1 必做**       | 低     | 图标 / 插画槽位、文案插槽、与 `table` / `select` 集成                    |
| `drawer`                         | `modal` 之外最常见的侧边编辑 / 详情承载件；很多业务 UI 不会只靠对话框     | **v1 必做**       | 中     | 复用 overlay / portal / scroll lock / focus trap                         |
| `popover` / `popconfirm`         | `dropdown` 与 `tooltip` 不足以覆盖“锚点浮层 + 交互内容”场景               | **v1 必做**       | 中到高 | 统一 floating-ui 抽象、焦点回收、dismiss 规则                            |
| 现有高频复杂组件的 a11y 补齐     | React Aria 把键盘、焦点、i18n 视为生产级基线；现在 `select` 已有键盘缺口  | **v1 必做**       | 中到高 | `select` / `tree-select` / `date-picker` / `dropdown` 交互测试与语义修复 |
| 文档 / demo / 使用范式           | 对公开组件库来说，这本身就是“功能”；没有可复制示例和边界说明就难采用      | **v1 必做**       | 中     | dumi 文档、可运行 demo、公开导入路径、API 说明                           |

## Differentiators

这些能力很有价值，但不是当前阶段 adoption 的第一闸门。应该在 v1 可用之后再投入。

| 能力                                                            | 价值                                | 建议阶段   | 复杂度 | 说明                                           |
| --------------------------------------------------------------- | ----------------------------------- | ---------- | ------ | ---------------------------------------------- |
| `notification` 程序化通知中心                                   | 比 `message` 更完整，适合多区域通知 | vNext      | 中     | 可建立在现有 `message` 基础设施之上            |
| `badge` / `tag` / `avatar`                                      | 提升界面完整度与组合能力            | vNext 靠前 | 低     | 常用，但不如输入 / 反馈闭环紧急                |
| `card` / `list` / `divider` / `breadcrumb`                      | 提升页面装配效率                    | vNext      | 低到中 | 很适合公开 demo，但不是 adoption 第一阻塞项    |
| `segmented` / `toggle-group`                                    | 对管理台与筛选面板有用              | vNext      | 中     | 可等基础选择控件稳定后再抽象                   |
| 大数据场景增强：虚拟滚动 `select` / `tree-select`、表格高级能力 | 能拉开与“玩具库”的差距              | vNext      | 高     | 先把基础交互和可访问性打稳，再扩性能与复杂功能 |
| headless / styled 双层 API                                      | 适合长期差异化路线                  | vNext 以后 | 高     | 当前阶段先把 styled 组件做实更划算             |
| 组合式业务模式件                                                | 可形成品牌特色                      | vNext 以后 | 中到高 | 需建立在稳定基础件之上                         |

## Anti-Features

这些能力当前阶段应明确不做，避免 scope 失控。

| Anti-Feature                                           | 为什么现在不做                         | 现阶段替代策略                                         |
| ------------------------------------------------------ | -------------------------------------- | ------------------------------------------------------ |
| 重型 `data-grid` / `pro-table` / 列编辑表格            | 复杂度和维护成本远高于当前阶段收益     | 先把 `table` 的基础可用性、空态、loading、分页联动做好 |
| `upload` / 富文本编辑 / `transfer` / `cascader`        | 业务耦合重，边界多，容易拖慢整体节奏   | 等真实项目持续出现复用需求后再立项                     |
| 图表、时间线、导览、轮播、二维码等展示型组件           | 不是 adoption baseline，且容易分散精力 | 先补输入、反馈、overlay、空态                          |
| 设计系统平台化能力：token 平台、Figma 同步、规范站平台 | 超出当前“可发布组件库”目标             | 保持轻量 `theme` / `config-provider` 即可              |
| 移动端组件体系 / 响应式多端分化                        | 当前仓库明确以桌面 React 复用为主      | 只保证桌面优先与基础响应式可用                         |
| 过早追求差异化视觉组件                                 | 容易牺牲基础可用性                     | 先把成熟组件库里的高频常用件做扎实                     |

## v1 / vNext 功能分层

### v1：可公开采用的基础线

目标：让外部用户可以只用 `compass-ui` 完成一个常规后台 / 内容管理 / 工具型页面，而不是中途再引入另一套库补洞。

1. 补齐输入闭环
   - `checkbox`
   - `radio`
   - `switch`
   - 标准化 `input`
   - `textarea`
2. 补齐反馈闭环
   - `alert`
   - `skeleton`
   - `spin/loading`
   - `empty`
3. 补齐 overlay 闭环
   - `drawer`
   - `popover`
   - `popconfirm`
4. 修现有高频复杂件的 adoption 问题
   - `select` 键盘导航、焦点移动、ARIA 语义
   - `tree-select` / `dropdown` / `tooltip` / `date-picker` 的焦点管理与关闭行为
5. 做实公开使用质量
   - 每个高频组件都有可复制 demo
   - 文档只使用公开导出路径
   - API 说明、边界行为、空态 / loading / disabled 示例齐全

### vNext：把“能用”推进到“更完整”

1. 补充常见信息展示件
   - `badge`
   - `tag`
   - `avatar`
   - `card`
   - `list`
   - `divider`
   - `breadcrumb`
2. 扩展反馈与组合能力
   - `notification`
   - `result`
   - `segmented`
3. 提升复杂数据场景
   - 虚拟化 `select` / `tree-select`
   - 表格 loading / empty / expandable / selection 范式统一
4. 做出长期差异化基础
   - 更清晰的组合式 API
   - overlay / field / selection 内部 primitive 稳定化

## 当前阶段最高优先级组件

按“对 adoption 影响最大 + 与现有体系衔接最顺”排序：

1. `checkbox`
2. `radio`
3. `switch`
4. 标准化 `input`
5. `textarea`
6. `alert`
7. `skeleton`
8. `spin/loading`
9. `drawer`
10. `popover` / `popconfirm`

补充说明：

- 如果资源只够做一组，优先做“**输入闭环 + a11y 修复**”，因为这决定 `form` 是否真的能成为主入口。
- 如果资源能覆盖两组，再加“**反馈闭环**”，这样文档站与 demo 的完成度会立刻上一个台阶。
- `badge` / `tag` / `avatar` 很常见，但优先级低于上面 10 项，因为它们对 adoption 的阻塞性没那么强。

## 功能依赖关系

```text
标准化 input / textarea → form 体验一致性
checkbox / radio / switch → form 闭环成立
popover 抽象稳定 → select / auto-complete / tree-select / date-picker / popconfirm 更稳
drawer / modal 焦点管理统一 → overlay 族一致性提升
alert / skeleton / empty / loading → table / form / search demo 完整度提升
a11y 与键盘交互修复 → 公开采用门槛下降
```

## MVP 建议

优先投入：

1. 先修现有高频复杂件的可访问性与交互一致性，尤其是 `select`
2. 立刻补 `checkbox` / `radio` / `switch`
3. 统一文本输入 API，补齐 `input` / `textarea`
4. 补 `alert` / `skeleton` / `empty` / `spin`
5. 最后补 `drawer` 与 `popover` / `popconfirm`

明确延期：

- `data-grid` / `upload` / `transfer` / `cascader` / 富文本编辑器：复杂度高，且不是当前 adoption baseline
- 设计系统平台化与重型差异化路线：等 v1 被真实采用后再考虑

## 置信度说明

| 区域                             | 置信度 | 说明                                                           |
| -------------------------------- | ------ | -------------------------------------------------------------- |
| 公开组件库早期 table stakes 判断 | 高     | 与 MUI、Ant Design、React Aria 官方组件分类和质量主张一致      |
| `compass-ui` 当前缺口判断        | 高     | 基于仓库实际组件清单、导出面与 concern 文档                    |
| v1 / vNext 分层建议              | 中高   | 结论来自行业共识与当前仓库状态映射，属于研究推断               |
| anti-features 边界               | 中高   | 与项目当前目标和 monorepo 主线高度一致，但仍需后续真实使用验证 |

## Sources

- 项目背景：`.planning/PROJECT.md`
- 仓库结构：`.planning/codebase/STRUCTURE.md`
- 风险与缺口：`.planning/codebase/CONCERNS.md`
- Material UI 全量组件目录：<https://mui.com/material-ui/all-components/>
- Material UI 支持组件与分类：<https://mui.com/material-ui/getting-started/supported-components/>
- Ant Design 组件总览：<https://ant.design/components/overview/>
- React Aria 组件总览：<https://react-spectrum.adobe.com/react-aria/components.html>
- React Aria 质量主张（accessibility / focus / keyboard / i18n）：<https://react-aria.adobe.com/quality>
