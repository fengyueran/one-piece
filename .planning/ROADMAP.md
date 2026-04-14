# 路线图：one-piece

## 概览

`one-piece` 的 v1 路线不是继续横向扩张组件目录，而是先把 `@xinghunm/compass-ui` 收口成一个外部用户可以按公开契约稳定安装、阅读、验证和发布的组件库主线。当前 roadmap 按研究结论拆成 4 个阶段，顺序为：先公开契约与发布基线，再统一文档与验证链路，再补齐基础组件闭环，最后把复杂交互组件稳态化。

## 阶段

**阶段编号说明：**

- 整数阶段（1、2、3）：正常规划内的 milestone 工作
- 小数阶段（2.1、2.2）：中途插入的紧急工作（标记为 `INSERTED`）

小数阶段按数值顺序插入在相邻整数阶段之间。

- [x] **Phase 1: 公开契约与发布基线** - 收口 `compass-ui` 的公开导出、消费方式和发布前校验基线。 (completed 2026-04-13)
- [x] **Phase 2: 文档入口与验证统一** - 把文档、demo 与测试链路统一到真实公开消费路径。 (completed 2026-04-14)
- [ ] **Phase 3: 基础组件补齐** - 补齐 v1 必需的表单、反馈、加载与空态基础组件。
- [ ] **Phase 4: 复杂交互稳态化** - 统一 overlay 与选择类组件的键盘、焦点和基础层策略。

## 阶段详情

### Phase 1: 公开契约与发布基线

**Goal**: 外部消费者和仓库维护者都只依赖公开导出与单一发布基线使用和发布 `@xinghunm/compass-ui`
**Depends on**: Nothing (first phase)
**Requirements**: [PUBL-01, PUBL-02, PUBL-03, PUBL-04, PUBL-05]
**Success Criteria** (what must be TRUE):

1. 外部消费者项目只通过公开包名与 `package.json.exports` 声明入口即可完成安装和最小接入，不需要引用 `src/*` 或 `dist/*` 内部路径。
2. `@xinghunm/compass-ui` 的 peer 依赖、Node 与 pnpm 基线、包访问级别和发版策略在仓库内只有一套权威定义，不再出现双重真相源。
3. 每次发布前都可以自动校验 `npm pack` 产物、类型分发和公开导出是否真实可用，而不是靠人工经验判断。
4. 维护者可以按稳定、可重复的流程完成 `compass-ui` 发布，不依赖本地 alias、源码直连或隐性手工步骤。
   **Plans**: 01-01, 01-02, 01-03

### Phase 2: 文档入口与验证统一

**Goal**: 外部用户可以从单一入口理解并验证 `compass-ui`，且文档、demo、测试都复用同一条真实消费链路
**Depends on**: Phase 1
**Requirements**: [DOCS-01, DOCS-02, DOCS-03, DOCS-04, DOCS-05]
**Success Criteria** (what must be TRUE):

1. 外部用户可以从单一对外文档入口完成安装、浏览公开 API，并找到核心组件的使用方式。
2. 每个纳入 v1 范围的核心组件都提供只使用公开导出路径的可运行示例，不再依赖内部路径或仓库别名。
3. 组件文档、交互 demo 和自动化测试共享同一套真实消费方式，公开示例失效可以被 smoke 检查提前发现。
4. 核心组件在文档与 demo 链路下具备基础键盘交互和可访问性验证，而不是只验证静态渲染。
   **Plans**: 02-01, 02-02, 02-03
   **UI hint**: yes

### Phase 3: 基础组件补齐

**Goal**: 外部用户可以只依赖 `compass-ui` 完成常见表单输入、状态反馈、加载态与空态闭环
**Depends on**: Phase 2
**Requirements**: [COMP-01, COMP-02, COMP-03, COMP-04, COMP-05, COMP-06, COMP-07]
**Success Criteria** (what must be TRUE):

1. 用户可以使用 `checkbox`、`radio` 和 `switch` 完成布尔选择、互斥单选和即时切换，并获得一致的禁用、错误、尺寸与组选中表现。
2. 用户可以使用标准化的 `input` 和 `textarea` 完成常见文本输入与多行输入，并获得一致、可预测的状态与尺寸 API。
3. 用户可以使用 `alert`、`empty`、`skeleton` 和 `spin-loading` 覆盖页面内持续反馈、空态、骨架态和加载态，形成基础页面状态闭环。
4. 这些基础组件都有与公开 API 一致的文档示例和验证方式，外部消费者可以直接按文档接入。
   **Plans**: 03-01 (complete), 03-02, 03-03
   **UI hint**: yes

### Phase 4: 复杂交互稳态化

**Goal**: 复杂选择与 overlay 组件具备一致的键盘、焦点和关闭行为，并形成可持续维护的基础层策略
**Depends on**: Phase 3
**Requirements**: [INTR-01, INTR-02, INTR-03, INTR-04, INTR-05]
**Success Criteria** (what must be TRUE):

1. 用户可以通过键盘完整操作 `select`，包括打开、导航、选择和关闭，且交互行为稳定可预测。
2. 用户在 `tree-select`、`date-picker`、`dropdown` 和 `tooltip` 中获得一致的焦点管理与关闭行为，不会因组件不同而切换心智模型。
3. 用户可以使用 `popover`、`popconfirm` 和 `drawer` 承载锚点交互或侧边编辑场景，并与现有 overlay 体系一致协作。
4. 仓库内对复杂交互基础层的职责边界有明确说明，能够解释哪些行为继续自研、哪些交给成熟 primitives 或 hooks，不再依赖临时实现。
   **Plans**: TBD
   **UI hint**: yes

## 进度

**执行顺序：**
阶段按数值顺序执行：1 → 2 → 3 → 4

| Phase                 | Plans Complete | Status      | Completed  |
| --------------------- | -------------- | ----------- | ---------- |
| 1. 公开契约与发布基线 | 3/3            | Complete    | 2026-04-13 |
| 2. 文档入口与验证统一 | 3/3            | Complete    | 2026-04-14 |
| 3. 基础组件补齐       | 1/3            | In progress | -          |
| 4. 复杂交互稳态化     | 0/TBD          | Not started | -          |
