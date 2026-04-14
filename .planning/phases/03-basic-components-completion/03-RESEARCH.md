# Phase 3: 基础组件补齐 - Research

**Researched:** 2026-04-14
**Domain:** 基础表单控件、输入组件标准化与页面状态组件
**Confidence:** HIGH

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

- Phase 3 只覆盖 `checkbox`、`radio`、`switch`、`input`、`textarea`、`alert`、`empty`、`skeleton`、`spin-loading`，不额外扩展示型组件。
- `checkbox`、`radio`、`switch` 需要形成一致的基础交互和表单集成体验，但不重写整套表单引擎。
- `COMP-04` 通过现有 `InputField` 向 `Input` 门面收口来完成，而不是推倒重做输入系统。
- `InputField` 在一个阶段内允许保留兼容导出，但文档和推荐用法必须切到 `Input`。
- `Textarea` 必须与 `Input` 共享尽可能一致的状态与尺寸 API。
- `alert`、`empty`、`skeleton`、`spin-loading` 只承担页面内反馈与状态闭环，不承担 overlay 责任。
- 所有基础组件都必须接入已经建立的公开导入、dumi 文档和 smoke 验证链路。

### the agent's Discretion

- `Input` 与 `InputField` 的兼容层如何落地
- 布尔控件 group API 的具体设计
- 页面状态组件先和哪些现有组件或页面结构做最小集成

### Deferred Ideas (OUT OF SCOPE)

- 复杂 overlay / 选择器键盘行为统一
- 新增公开子路径或第二套文档入口
- 追求大而全的展示型组件覆盖

</user_constraints>

<research_summary>

## Summary

Phase 3 最合适的实现方式不是九个组件各自散着做，而是拆成三条收口明确的产品线：布尔选择控件、文本输入标准化、页面状态组件。仓库当前已经有成熟的 `InputField`、`Form`、`Table`、`docs:verify:compass-ui` 和 colocated Jest 测试，这意味着新工作重点不在基础设施，而在于把这些已有能力组织成更清晰的公开组件面。

对 `Input` 而言，最稳妥的方案是新增一个语义化门面组件并保留 `InputField` 兼容导出，让下游组件与文档逐步迁移，而不是直接删掉 `InputField`。对 `checkbox`、`radio`、`switch` 而言，优先保证浏览器语义、键盘可达性、组选中和与 `Form` 的最小兼容，比一开始追求复杂视觉形态更重要。对 `alert`、`empty`、`skeleton`、`spin-loading` 而言，应把它们设计成可直接放进页面或容器的“状态组件”，并尽量让 `Table` 等现有组件复用，而不是继续把状态 UI 散落在各个组件内部。

**Primary recommendation:** 按“布尔选择控件 -> 输入标准化 -> 页面状态组件”三条计划线顺序推进，每条线都同时完成实现、文档和 targeted verify。
</research_summary>

<standard_stack>

## Standard Stack

The established libraries/tools for this domain:

### Core

| Library / Tool                    | Version               | Purpose                      | Why Standard                         |
| --------------------------------- | --------------------- | ---------------------------- | ------------------------------------ |
| `react` + `@emotion/styled`       | workspace             | 基础组件实现与样式           | `compass-ui` 已全面采用这一栈        |
| `jest` + `@testing-library/react` | `^29.7.0` / `^16.3.0` | 组件行为、表单和可访问性测试 | 仓库已有稳定测试基线                 |
| `@testing-library/user-event`     | `^14.6.1`             | 键盘与受控/非受控交互验证    | 适合布尔控件与输入行为测试           |
| `dumi` + `docs:verify:compass-ui` | repo-local            | 文档示例与 smoke 校验        | Phase 2 已收口成唯一公开文档链路     |
| `tsup` + `package.json.exports`   | repo-local            | 公开导出和打包               | 新组件最终都必须从根入口稳定打包暴露 |

### Supporting

| Asset                  | Purpose                   | When to Use                                     |
| ---------------------- | ------------------------- | ----------------------------------------------- |
| `src/input-field/*`    | 文本输入行为与样式基座    | `Input` 标准化与 `Textarea` API 对齐时复用      |
| `src/form/*`           | 现有表单项和校验上下文    | 布尔控件接入 `FormItem` 或验证 value 语义时使用 |
| `src/table/*`          | 空态与 loading 真实消费点 | `Empty` 与 `SpinLoading` 首批集成验证           |
| `docs/components/*.md` | 组件文档模板与 dumi 示例  | 所有新组件文档页                                |

### Alternatives Considered

| Instead of            | Could Use                      | Tradeoff                                 |
| --------------------- | ------------------------------ | ---------------------------------------- |
| `InputField` 平滑迁移 | 直接重命名并一次性替换全部引用 | 风险高，容易打断现有组件与文档           |
| 原生语义控件 + 轻包装 | 完全自定义 div/role 驱动控件   | 可控性高，但无障碍与表单兼容成本明显更高 |
| 独立页面状态组件      | 继续把 empty/loading 散落内部  | 短期更快，但难以形成统一的消费模型       |

</standard_stack>

<architecture_patterns>

## Architecture Patterns

### Pattern 1: 兼容门面标准化

**What:** 为已有 `InputField` 增加新的 `Input` 公开门面，并保留兼容导出作为过渡层。
**When to use:** 现有实现已被多个组件依赖，但对外语义需要收口时。

### Pattern 2: 共享控制语义，不共享过度抽象

**What:** `checkbox`、`radio`、`switch` 共享尺寸、禁用、错误和表单语义，但不急于抽出一个过度通用的“万能控件基类”。
**When to use:** 多个基础控件存在相似交互，但未来视觉和 DOM 结构可能仍不同。

### Pattern 3: 页面状态组件作为容器级 building blocks

**What:** `Alert`、`Empty`、`Skeleton`、`SpinLoading` 直接服务页面或容器状态，而不是绑定某个单一业务组件。
**When to use:** 需要构建统一的空态、加载态和持续反馈体验。

### Anti-Patterns to Avoid

- **一次性打破 `InputField` 兼容:** 会把 Phase 3 变成大规模迁移和回归测试。
- **只做视觉壳，不做语义和键盘:** 基础组件如果没有可达性和表单语义，很快会形成技术债。
- **把状态组件做成只能在某个组件内部使用:** 会错失 Phase 3 “页面状态闭环”的真正价值。

</architecture_patterns>

<dont_hand_roll>

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem                  | Don't Build                      | Use Instead                               | Why                                    |
| ------------------------ | -------------------------------- | ----------------------------------------- | -------------------------------------- |
| 输入框重新造轮子         | 新起一套与 `InputField` 无关实现 | 复用 `InputField` 基础并向 `Input` 收口   | 当前已有稳定实现与下游依赖             |
| 布尔控件复杂视觉系统     | 先做完整设计系统级状态矩阵       | 先保证语义、键盘和组选中闭环              | 当前阶段重心是高频可复用能力           |
| 加载和空态的内部私有实现 | 每个组件继续自己维护 loading UI  | 独立 `Empty` / `Skeleton` / `SpinLoading` | 便于页面级复用，也能统一文档与公开 API |

**Key insight:** Phase 3 的难点不是“如何渲染一个控件”，而是“如何让这些控件从第一天开始就处在统一的公开 API、文档和验证体系里”。
</dont_hand_roll>

<common_pitfalls>

## Common Pitfalls

### Pitfall 1: `Input` 和 `InputField` 双轨长期失控

**What goes wrong:** 新增了 `Input`，但内部和文档仍然大面积继续使用 `InputField`，最终形成双重真相源。
**How to avoid:** Phase 3 明确 `Input` 是推荐门面，`InputField` 只保留兼容出口与迁移缓冲。

### Pitfall 2: 布尔控件只看视觉，不验证真实语义

**What goes wrong:** `checkbox`、`radio`、`switch` 看起来能点，但缺少原生输入语义、键盘支持或组选中行为。
**How to avoid:** 测试里优先验证 `role`、选中态、`disabled`、键盘切换和与 `Form` 的最小交互。

### Pitfall 3: 页面状态组件与现有消费点脱节

**What goes wrong:** `Empty`、`Skeleton`、`SpinLoading` 单独存在，但 `Table` 或页面容器仍继续使用私有实现。
**How to avoid:** 在 plan 里安排至少一个真实消费点回归验证，而不是只写孤立组件测试。

</common_pitfalls>

<code_examples>

## Code Examples

### 当前根入口仍以 `InputField` 作为文本输入门面

```ts
// Source: packages/compass-ui/src/index.ts
export { default as InputField } from './input-field'
export type { InputFieldProps } from './input-field'
```

### `InputField` 已有独立目录、样式和测试

```text
packages/compass-ui/src/input-field/
├── index.ts
├── input-field.tsx
├── input-field.styles.ts
├── input-field.test.tsx
└── types.ts
```

### 仓库已具备 `Form` 与 `Table` 测试基线

```text
packages/compass-ui/src/form/form.test.tsx
packages/compass-ui/src/table/table.test.tsx
```

</code_examples>

<open_questions>

## Open Questions

1. **`InputField` 兼容层是否需要运行时弃用提示**
   - Recommendation: Phase 3 先采用文档级迁移说明，不加运行时 warning，避免污染消费者控制台

2. **`radio` 是否需要单独 `RadioGroup` 导出**
   - Recommendation: 计划中按“`Radio` + `RadioGroup` 或 `Radio.Group` 之一”实现，但以最符合现有导出风格为准

3. **`SpinLoading` 是否要替代现有全部 loading 表现**
   - Recommendation: Phase 3 只建立公共组件并接入代表性场景，不强制一次性替换全部内部 loading UI

</open_questions>

---

_Phase: 03-basic-components-completion_
_Research completed: 2026-04-14_
