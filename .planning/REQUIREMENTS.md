# Requirements: one-piece

**Defined:** 2026-04-13
**Core Value:** 用尽可能低的重复建设成本，持续沉淀一套能在真实项目里稳定复用、可独立发布、带完整文档和 demo 的前端资产。

## v1 Requirements

### 发布契约

- [ ] **PUBL-01**: 外部用户可以只通过 `package.json.exports` 中声明的公开入口使用 `@xinghunm/compass-ui`，不需要引用 `src/*` 或 `dist/*` 内部路径
- [ ] **PUBL-02**: `@xinghunm/compass-ui` 的 peer 依赖、Node 与 pnpm 基线、包访问级别和版本发布策略在仓库内只有一套权威配置
- [ ] **PUBL-03**: 每次发布前都可以自动校验 `npm pack` 产物、类型分发和公开导出是否可用
- [ ] **PUBL-04**: 消费者项目可以通过公开包名安装并完成最小接入验证，而不依赖仓库内 alias 或源码直连
- [ ] **PUBL-05**: 仓库可以用稳定、可重复的发布流程把 `compass-ui` 发布到 npm，而不依赖人工经验记忆

### 文档与验证

- [ ] **DOCS-01**: 外部用户可以从单一对外文档入口理解 `compass-ui` 的安装方式、公开 API 和组件使用方式
- [ ] **DOCS-02**: 每个纳入 v1 范围的核心组件都提供只使用公开导出路径的可运行示例
- [ ] **DOCS-03**: 组件文档、交互 demo 和测试使用同一套真实消费方式，不再分别依赖不同入口或内部路径
- [ ] **DOCS-04**: 仓库可以对组件文档和 demo 做基础 smoke 检查，提前发现公开示例失效
- [ ] **DOCS-05**: 核心组件至少具备基础键盘交互和可访问性验证，而不是只验证静态渲染

### 基础组件

- [ ] **COMP-01**: 用户可以使用 `checkbox` 组件完成单项布尔选择，并获得一致的禁用、错误和尺寸表现
- [ ] **COMP-02**: 用户可以使用 `radio` 组件完成互斥单选，并获得一致的组选中状态和表单集成体验
- [ ] **COMP-03**: 用户可以使用 `switch` 组件完成即时状态切换，并获得一致的受控/非受控行为
- [ ] **COMP-04**: 用户可以使用标准化的 `input` 组件完成常见文本输入，而不是依赖语义不清的临时输入封装
- [ ] **COMP-05**: 用户可以使用标准化的 `textarea` 组件完成多行文本输入，并获得一致的状态与尺寸 API
- [ ] **COMP-06**: 用户可以使用 `alert` 组件在页面内展示持续性状态反馈
- [ ] **COMP-07**: 用户可以使用 `empty`、`skeleton` 和 `spin-loading` 处理空态、骨架态和加载态，形成基础页面状态闭环

### 复杂交互

- [ ] **INTR-01**: 用户可以通过键盘完整操作 `select`，包括打开、导航、选择和关闭
- [ ] **INTR-02**: 用户可以在 `tree-select`、`date-picker`、`dropdown` 和 `tooltip` 中获得一致的焦点管理和关闭行为
- [ ] **INTR-03**: 用户可以使用 `popover` 和 `popconfirm` 承载锚点交互，并获得一致的 overlay 行为
- [ ] **INTR-04**: 用户可以使用 `drawer` 承载侧边编辑或详情场景，并与现有 overlay 体系一致协作
- [ ] **INTR-05**: 仓库对复杂交互组件形成明确的基础层策略，能够说明哪些行为继续自研、哪些行为应交给成熟 primitives 或 hooks

## v2 Requirements

### 常见展示组件

- **DISP-01**: 用户可以使用 `badge`、`tag` 和 `avatar` 完成常见的轻量展示场景
- **DISP-02**: 用户可以使用 `card`、`list`、`divider` 和 `breadcrumb` 组织常规后台页面结构
- **DISP-03**: 用户可以使用 `notification`、`result` 和 `segmented` 处理更完整的反馈和状态切换场景

### 高级能力

- **ADV-01**: 表格、选择器等复杂组件具备虚拟化和更高数据量场景支持
- **ADV-02**: 主题 contract 扩展到更成熟的 design token 体系和长期差异化能力
- **ADV-03**: 文档站和组件演示形成更强的聚合与导航能力

## Out of Scope

| Feature                                      | Reason                                                        |
| -------------------------------------------- | ------------------------------------------------------------- |
| Ant Design 级别的全量组件覆盖                | 当前目标是先补齐高频复用能力，而不是追求大而全                |
| `data-grid`、`pro-table`、列编辑表格         | 复杂度高且不是当前 adoption 的最短路径                        |
| `upload`、富文本编辑、`transfer`、`cascader` | 高复杂度低优先级，当前阶段不应分散资源                        |
| 图表、轮播、时间线、二维码等展示型组件       | 不是当前组件库主线需求                                        |
| 移动端组件体系                               | 当前仓库主要面向桌面端 React 复用场景                         |
| 复杂设计系统平台能力                         | 如 token 平台、设计资产同步、重型元数据平台，当前价值密度不足 |
| 把 `ai-chat` 继续扩成当前主线                | 当前阶段资源优先投入 `compass-ui`                             |

## Traceability

| Requirement | Phase   | Status  |
| ----------- | ------- | ------- |
| PUBL-01     | Phase 1 | Pending |
| PUBL-02     | Phase 1 | Pending |
| PUBL-03     | Phase 1 | Pending |
| PUBL-04     | Phase 1 | Pending |
| PUBL-05     | Phase 1 | Pending |
| DOCS-01     | Phase 2 | Pending |
| DOCS-02     | Phase 2 | Pending |
| DOCS-03     | Phase 2 | Pending |
| DOCS-04     | Phase 2 | Pending |
| DOCS-05     | Phase 2 | Pending |
| COMP-01     | Phase 3 | Pending |
| COMP-02     | Phase 3 | Pending |
| COMP-03     | Phase 3 | Pending |
| COMP-04     | Phase 3 | Pending |
| COMP-05     | Phase 3 | Pending |
| COMP-06     | Phase 3 | Pending |
| COMP-07     | Phase 3 | Pending |
| INTR-01     | Phase 4 | Pending |
| INTR-02     | Phase 4 | Pending |
| INTR-03     | Phase 4 | Pending |
| INTR-04     | Phase 4 | Pending |
| INTR-05     | Phase 4 | Pending |

**Coverage:**

- v1 requirements: 22 total
- Mapped to phases: 22
- Unmapped: 0 ✓
- Coverage status: 所有 v1 requirement 已完成 phase 映射，且每项仅映射一次

---

_Requirements defined: 2026-04-13_
_Last updated: 2026-04-13 after roadmap initialization_
