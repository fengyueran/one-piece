# Phase 4: 复杂交互稳态化 - Research

**Researched:** 2026-04-14
**Domain:** `Floating UI` 驱动的复杂交互组件、一致的 overlay 交互契约、`Popover/Popconfirm/Drawer` 补齐
**Confidence:** HIGH

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

- Phase 4 只解决复杂交互稳态化，不再扩基础组件或展示组件。
- 先在现有 `@floating-ui/react` 基础上做共享约定，不在本阶段整体迁移到新的 headless 体系。
- `Select` 必须补齐完整键盘导航和基础 `aria` 语义。
- `tree-select`、`date-picker`、`dropdown`、`tooltip` 要统一焦点与关闭行为。
- 必须补 `Popover`、`Popconfirm`、`Drawer`。
- 需要一份明确的复杂交互基础层策略说明。
- 文档只记录已经被自动化验证覆盖的交互行为。

### the agent's Discretion

- 共享 overlay helper 的目录布局
- `Popover` / `Popconfirm` API 设计
- `Drawer` 与 `Modal` 的复用边界

### Deferred Ideas (OUT OF SCOPE)

- 整体切换到 Radix / React Aria / Headless UI
- overlay 动画系统大改
- 移动端触屏交互优化

</user_constraints>

<research_summary>

## Summary

Phase 4 最重要的不是“再加几个浮层组件”，而是把当前已经散落在 `select`、`tree-select`、`dropdown`、`tooltip`、`date-picker` 中的交互逻辑收成一套可复用、可解释的契约。代码库已经明确暴露出同一个问题：大量组件都直接使用 `useFloating`、`useDismiss`、`useClick`、`useHover`、`useRole`，但各自对打开、关闭、键盘和焦点的处理不完全一致，测试也还停留在“鼠标能点开”的层次。

最稳妥的实现路径是分四步推进：先单独把 `Select` 键盘状态机和 `combobox/listbox` 语义补齐；再抽出现有 overlay 组件的共享交互契约，统一 `tree-select`、`date-picker`、`dropdown`、`tooltip` 的焦点和关闭行为；接着在这套共享约定上实现 `Popover` 和 `Popconfirm`；最后用 `Drawer` 和策略文档把 Phase 4 收尾。这样既能控制改动半径，也能避免在已有脆弱组件上同时做多种方向的重构。

**Primary recommendation:** 把 Phase 4 拆成 4 个顺序 plan，围绕 `Select`、现有 overlay 契约、锚点浮层新组件、侧边浮层与基础层策略四条线推进。
</research_summary>

<standard_stack>

## Standard Stack

The established libraries/tools for this domain:

### Core

| Library / Tool                                   | Version    | Purpose                             | Why Standard                              |
| ------------------------------------------------ | ---------- | ----------------------------------- | ----------------------------------------- |
| `@floating-ui/react`                             | `^0.27.16` | 现有浮层定位、交互与关闭基础        | 仓库已有大量复杂交互组件建立在它之上      |
| `jest` + `@testing-library/react` + `user-event` | repo-local | 键盘、焦点、打开/关闭行为测试       | 现有组件测试已在这套体系上                |
| `ReactDOM.createPortal`                          | React 18   | `Modal` / `Drawer` 一类 portal 渲染 | `Modal` 已使用这一模式                    |
| `dumi` + `docs:verify:compass-ui`                | repo-local | 文档与公开导入 smoke                | 复杂交互文档仍必须复用 Phase 2 的对外链路 |

### Supporting

| Asset                                                                               | Purpose                                  | When to Use     |
| ----------------------------------------------------------------------------------- | ---------------------------------------- | --------------- |
| `packages/compass-ui/src/modal/*`                                                   | `Drawer` 的 portal / mask / 关闭模式参考 | `Drawer` 实现期 |
| `packages/compass-ui/src/select/*`                                                  | `combobox/listbox` 与键盘模型的主要落点  | `INTR-01`       |
| `packages/compass-ui/src/dropdown/*`, `tooltip/*`, `tree-select/*`, `date-picker/*` | 共享 overlay 契约的主要落点              | `INTR-02`       |

### Alternatives Considered

| Instead of                                  | Could Use                             | Tradeoff                           |
| ------------------------------------------- | ------------------------------------- | ---------------------------------- |
| 继续沿用 `Floating UI` 并抽共享约定         | 引入 Radix / React Aria / Headless UI | 长期可能更稳，但本阶段迁移半径过大 |
| 分阶段收口                                  | 一次性把所有 overlay 全改掉           | 风险高，回归面和定位难度都会放大   |
| `Drawer` 复用 `Modal` 的 portal / mask 模式 | 新写一套完全不同的 overlay 管线       | 会让关闭与焦点行为再次分叉         |

</standard_stack>

<architecture_patterns>

## Architecture Patterns

### Pattern 1: 共享 overlay interaction contract

**What:** 把打开方式、关闭方式、焦点回收、外部点击与 Escape 的共性整理成共享 helper 或约定。
**When to use:** 多个组件都基于 `Floating UI`，但交互行为需要一致时。

### Pattern 2: 键盘优先的选择器状态机

**What:** 对 `Select` 单独建立激活项、打开态、搜索输入、确认选择与关闭规则，而不是只用点击切换。
**When to use:** `Select` 是复杂交互里最关键也最容易成为其他组件心智模板的入口时。

### Pattern 3: 轻量提示与交互浮层分层

**What:** `Tooltip` 只承载轻量提示；需要确认或可点击内容时使用 `Popover` / `Popconfirm`。
**When to use:** 避免单个组件承担过多 overlay 角色时。

### Pattern 4: 侧边浮层复用 portal / mask 规则

**What:** `Drawer` 与 `Modal` 在 portal、mask、关闭和焦点约束上保持一致，但布局和动画单独处理。
**When to use:** 需要新增侧边交互容器而不想复制一套完全不同的 overlay 基建时。

### Anti-Patterns to Avoid

- **每个浮层组件继续各自管理一套打开/关闭规则**
- **让 `Tooltip` 承载交互式内容**
- **在同一阶段同时迁移基础库和补新组件**

</architecture_patterns>

<dont_hand_roll>

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem                 | Don't Build               | Use Instead                                | Why                      |
| ----------------------- | ------------------------- | ------------------------------------------ | ------------------------ |
| 浮层定位与外部点击关闭  | 自写定位和点击外部检测    | 继续用 `Floating UI` 的定位与 dismiss 能力 | 现有栈已经深度依赖       |
| `Drawer` 的 portal 容器 | 新造一套 body portal 管线 | 参考 `Modal` 的 portal 与 mask 模式        | 可减少行为分叉           |
| 文档交互验证            | 新接浏览器级测试框架      | 继续扩大 Jest + `user-event` 的覆盖        | 当前项目已有稳定测试链路 |

**Key insight:** Phase 4 的价值不在“把组件数量做满”，而在“让现有复杂交互停止各自为政”。
</dont_hand_roll>

<common_pitfalls>

## Common Pitfalls

### Pitfall 1: `Select` 修好了，但其他浮层心智仍然割裂

**What goes wrong:** `Select` 的键盘完整了，但 `Dropdown` / `TreeSelect` / `DatePicker` 关闭时机、焦点回收和 Escape 行为仍然不一致。
**How to avoid:** Phase 4 必须显式抽出共享契约，而不是只修单一组件。

### Pitfall 2: 新增 `Popover` / `Popconfirm` 又复制一份旧逻辑

**What goes wrong:** 新组件能用，但只是把 `Dropdown` / `Tooltip` 的实现复制过来，技术债继续扩散。
**How to avoid:** 要求 `Popover` / `Popconfirm` 依赖已经在 04-02 形成的共享基础。

### Pitfall 3: `Drawer` 和 `Modal` 两套 overlay 模型分叉

**What goes wrong:** `Drawer` 在关闭按钮、mask、Escape 和焦点限制上跟 `Modal` 完全不同，用户体验和维护成本都更差。
**How to avoid:** 明确规定 `Drawer` 复用 `Modal` 的 portal / mask / close 约束，只单独处理侧边布局。

</common_pitfalls>

<code_examples>

## Code Examples

### 现有复杂组件大量直接依赖 `Floating UI`

```text
packages/compass-ui/src/select/select.tsx
packages/compass-ui/src/dropdown/dropdown.tsx
packages/compass-ui/src/tooltip/tooltip.tsx
packages/compass-ui/src/tree-select/tree-select.tsx
packages/compass-ui/src/date-picker/date-picker.tsx
packages/compass-ui/src/date-picker/date-range-picker.tsx
```

### 当前已知问题已经明确指出 `Select` 缺少键盘导航

```text
.planning/codebase/CONCERNS.md
- `Select` 缺少 `ArrowUp` / `ArrowDown` 导航
- Floating UI 相关组件的键盘导航、焦点管理和无障碍行为仍不完整
```

### `Modal` 已提供 portal + mask 的可复用模式

```tsx
// Source: packages/compass-ui/src/modal/modal.tsx
return ReactDOM.createPortal(<BaseModal {...res}>{children}</BaseModal>, document.body)
```

</code_examples>

<open_questions>

## Open Questions

1. **共享 overlay helper 放在哪一层**
   - Recommendation: 放在 `packages/compass-ui/src` 内部可复用目录中，先服务 Phase 4 组件，不对外公开

2. **`Popover` / `Popconfirm` 是否允许完全交互式内容**
   - Recommendation: `Popover` 允许；`Popconfirm` 保持“确认型轻交互”，避免做成 mini-modal

3. **`Drawer` 是否需要命令式 API**
   - Recommendation: Phase 4 先做声明式组件 API，命令式 `useDrawer` 留到未来再评估

</open_questions>

---

_Phase: 04-complex-interaction-stabilization_
_Research completed: 2026-04-14_
