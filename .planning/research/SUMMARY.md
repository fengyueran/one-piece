# 项目研究摘要

**项目：** one-piece  
**领域：** 面向公开发布的 React 组件库与前端资产 monorepo  
**研究日期：** 2026-04-13  
**总体置信度：** 高

## 执行摘要

`one-piece` 当前最值得推进的，不是继续横向扩张组件数量，而是把 `compass-ui` 收敛成一条真实可发布、可文档化、可验证的公开组件库主线。4 份 research 的共同结论很一致：仓库底座不需要推倒重来，应该继续沿用 `pnpm workspace + turbo + TypeScript + Changesets`，短期保留 `tsup` 作为构建器，但必须先把公开 API 边界、文档入口、测试链路、发布校验和主题 contract 补齐。

这类产品的专家做法也很一致：先确保“外部用户按公开导出和官方文档就能稳定用起来”，再补齐 v1 table stakes，最后才进入复杂交互稳态化和差异化演进。对当前仓库，v1 不是“再多做十几个组件”，而是先解决文档引用内部路径、发布配置双重真相源、demo 绕过真实消费链路、复杂组件无障碍基线不足这些根问题；否则组件补得越多，后续返工成本越高。

最重要的风险有三类。第一，文档、导出面和真实发布物不一致，会直接损害公开采用。第二，发布与验证链路不收口，会让每次发版都依赖人工经验。第三，过早追求复杂组件和差异化，会把维护资源从 table stakes 与无障碍稳定性上抽走。对应的缓解策略很明确：先收口契约，再统一文档与验证，再补 v1 必需组件，最后才处理复杂 overlay/selection 组件的长期边界。

## 关键发现

### 推荐技术方向

当前最合理的技术方向是“保底不换底座，优先补交付链”。也就是继续使用 `pnpm workspace`、`turbo`、`TypeScript 5.x`、`Changesets` 与 `tsup`，但把测试、文档、导出、主题和发布鉴权升级到公开 npm 包应有的标准。研究没有支持“大迁移重构”；相反，所有高价值动作都集中在收敛和补强。

对外文档面必须只有一个。架构研究强调 `apps/docs` 应是唯一对外入口；技术栈研究强调组件级文档与交互 demo 应收敛到 Storybook 10。综合判断后，推荐的落地是：**对外保持单入口，组件文档与 demo 能力收敛到 Storybook，`apps/docs` 负责仓库级入口、导航与聚合，不再长期并存 `dumi + Next docs` 双主入口。**

**核心技术建议：**

- `pnpm workspace`：继续作为 monorepo 工作区基线，适合多包发布与本地联调。
- `turbo`：继续作为任务编排核心，用依赖图驱动“先包后应用”的构建顺序。
- `TypeScript 5.x`：继续作为公开 API 与类型分发基础，并补 `declarationMap` 与导出校验。
- `tsup`：短期继续作为 `compass-ui` 构建器；当前复杂度还不值得迁构建栈。
- `Storybook 10`：作为组件文档、交互 demo、可视验证的主能力层。
- `Vitest`：统一单元测试与轻量组件行为测试 runner，结束 Jest/Vitest 混用。
- `Playwright`：承担真实浏览器组件测试、视觉回归、Storybook 页面 smoke test。
- `Changesets`：继续用于版本管理与发版编排，但发布鉴权改为 npm trusted publishing（OIDC）。
- `CSS Variables`：作为主题 contract 的优先形态；Emotion 可短期保留为实现层，但不应继续扩张绑定。

**关键版本与约束：**

- Node 基线建议升级到 `22 LTS+`。
- `pnpm` 建议升级到 `10`。
- React peer range 应收紧到真实支持范围，例如 `^18.2.0 || ^19.0.0`，不再使用过宽声明。

### 当前阶段 Table Stakes

当前阶段的目标不是“像 Ant Design 那样全覆盖”，而是让外部用户可以只依赖 `compass-ui` 搭出一个常规后台 / 工具型页面，不需要再引入第二套组件库补洞。基于现有仓库能力，v1 的 table stakes 很明确，优先级也足够集中。

**v1 必做：**

- `checkbox` / `radio` / `switch`：补齐表单选择控件闭环。
- 标准化 `input` / `textarea`：形成可预测的文本输入 API，而不是仅依赖现有 `input-field`。
- `alert`：补齐页面内持续状态反馈。
- `skeleton` / `spin-loading` / `empty`：补齐 loading 与空态闭环，直接提升文档与真实页面可用性。
- `drawer`：补齐侧边编辑 / 详情承载件。
- `popover` / `popconfirm`：补齐交互型锚点浮层能力。
- 高风险复杂组件的 a11y 与交互修复：优先修 `select`，并覆盖 `tree-select`、`date-picker`、`dropdown`、`tooltip` 的焦点管理与关闭行为。
- 文档与 demo 质量：每个高频组件都必须有只使用公开导出路径的可运行示例。

**v1 后做，但值得纳入 vNext：**

- `badge` / `tag` / `avatar`
- `card` / `list` / `divider` / `breadcrumb`
- `notification` / `result` / `segmented`
- 表格与选择器的虚拟化和更复杂数据场景能力
- 更成熟的组合式 API 与长期差异化基础

**当前明确不要做：**

- `data-grid` / `pro-table` / 列编辑表格
- `upload` / 富文本编辑 / `transfer` / `cascader`
- 图表、轮播、时间线、二维码等展示型组件
- 移动端组件体系分化
- 设计系统平台化能力（token 平台、Figma 同步、重型元数据平台）
- 通过增加“新版本并存组件”来绕过旧组件治理，例如长期并存 `NewSelect` 之类双轨组件

### 架构推进顺序

研究对推进顺序的判断非常一致：**先契约，后文档与验证，再组件补齐，最后复杂交互稳态化。** 这是一个典型的“先收边界，再放能力”的组件库路线，而不是“先堆功能，再回头治理”。

**主要层级与职责：**

1. `tools/*`：共享配置层，只提供工程配置，不承载业务或运行时逻辑。
2. `packages/compass-hooks`：foundation 层，提供可复用 hooks 与轻量 runtime 能力。
3. `packages/compass-ui`：核心公开产品层，承载组件、主题、locale、icons 与 form / overlay 等基础能力。
4. `packages/ai-chat`：邻接产品层，建立在 `compass-ui` 之上，但不能反向耦合回组件库主线。
5. `apps/docs` 与 `apps/*-demo`：消费者层，只消费公开包，不得以内部 alias 作为长期默认路径。

**关键架构规则：**

- 公开 API 只认 `package.json.exports`；文档与 demo 不得再引用 `src/*` 或 `dist/*`。
- 应用层必须按“真实消费者”方式使用包，不能长期绕过发布产物。
- `foundation -> core-ui -> adjacent-ui -> app` 保持单向依赖。
- `compass-ui` 继续作为主线，不要把 `ai-chat` 合并回核心组件库。

### 最重要的风险与不该做的事

1. **文档与导出面不一致**  
   风险：文档能跑、npm 用户不能用，直接伤害 adoption。  
   处理：所有示例只允许使用公开导出；需要公开的能力正式补 `exports`，不再靠 alias 兜底。

2. **发布配置与验证链路不统一**  
   风险：首次公开发布、换 CI、换账号时容易出事故。  
   处理：统一 Changesets 与 npm access 策略，补 `publint`、类型分发校验、`npm pack` 与消费者冒烟测试，并切到 OIDC trusted publishing。

3. **在复杂交互组件上长期全自研**  
   风险：焦点管理、键盘导航、ARIA 语义持续拖累维护。  
   处理：在 Phase 4 明确评估 Radix / React Aria / Floating UI 的边界分工，不要继续把所有复杂行为硬扛在自研层。

4. **范围失控，先补目录再补质量**  
   风险：组件数上涨，但稳定可用组件占比低。  
   处理：建立准入标准，v1 只做 table stakes，不插入低频炫技组件。

5. **把 demo 当成公开文档事实来源**  
   风险：文档和真实消费方式继续分叉。  
   处理：demo 只负责复杂场景验证；公开 API、安装方式与示例以单一文档入口为准。

## 对 Roadmap 的直接含义

基于研究结果，v1 最合理的阶段结构是 4 个阶段。这个顺序不只是“看起来合理”，而是由当前仓库最主要的技术债依赖关系决定的。

### Phase 1：公开 API 与发布基线收口

**为什么先做：**  
这是所有后续工作的地基。当前最危险的问题是对外承诺不真实，而不是功能不够多。只要 `exports`、发布配置、消费路径和 peer 约束不收口，后面每新增一个组件，返工成本都会更高。

**这一阶段交付：**

- 清理文档与示例中的 `src/*`、`dist/*` 内部导入
- 定义稳定公开导出面：至少明确根入口与 `theme` / `locale` / `icons` 等必要子路径
- 统一 Changesets 与 npm access 策略
- 引入 `publint`、类型分发校验、`npm pack`、消费者冒烟测试
- 切换到 npm trusted publishing（OIDC）
- 收紧 React peer 范围与 Node / pnpm 工程基线

**这一阶段解决的问题：**

- 推荐技术方向中的发布安全、导出边界、类型分发
- 风险中的“文档与导出不一致”“发布配置双重真相源”

**这一阶段明确不要做：**

- 不新增复杂组件
- 不启动视觉差异化或平台化工作

### Phase 2：文档入口、示例与验证链路统一

**为什么第二个做：**  
当公开契约收口后，必须立刻让文档和验证链路按真实消费方式运行，否则 Phase 1 的约束会再次被绕过。这个阶段的目标是让文档、stories、测试和 demo 从“仓库内部方便”转向“对外真实可用”。

**这一阶段交付：**

- 对外文档单入口定型
- 组件文档与交互 demo 收敛到 Storybook 能力层
- `apps/docs` 作为统一入口承载仓库级说明、导航与聚合
- `Vitest + Playwright` 测试分层定型
- 建立 docs/story 消费验证、键盘交互 smoke 与基础 a11y 检查
- `apps/*-demo` 改为默认消费 workspace 包名，而不是长期 alias 到源码

**这一阶段解决的问题：**

- 文档可信度
- 测试只看覆盖率、不看消费者链路
- docs / demo 双轨混乱

**这一阶段明确不要做：**

- 不把 `apps/docs` 扩成第二套组件文档系统
- 不继续维护 `dumi + Next docs` 双主入口作为长期方案

### Phase 3：v1 Table Stakes 补齐

**为什么第三个做：**  
到这个阶段，公开契约和文档验证已经稳定，补基础组件才能真正形成可发布的 v1，而不是把新组件继续叠加在旧问题之上。

**这一阶段交付：**

- `checkbox` / `radio` / `switch`
- 标准化 `input` / `textarea`
- `alert`
- `skeleton` / `spin-loading` / `empty`
- 必要的组件文档、API 说明、空态 / loading / disabled 示例

**这一阶段对应的能力：**

- 当前阶段 table stakes 的输入闭环与反馈闭环
- `form` 体系的一致体验

**这一阶段必须避免：**

- 一次性并行开太多中低优先级组件
- 把 `badge` / `tag` / `avatar` 之类“常见但不阻塞 adoption”的组件插队到更前面

### Phase 4：复杂交互组件稳态化

**为什么最后做：**  
复杂组件是长期成本最高的部分，应该在基础契约、文档和 v1 高优先级组件已经站稳之后集中治理。否则团队会在“缺基础件”和“修复杂交互”之间反复切换。

**这一阶段交付：**

- `select` 键盘导航、焦点管理、ARIA 语义修复
- `tree-select` / `date-picker` / `dropdown` / `tooltip` / `popover` / `popconfirm` 的交互边界统一
- `drawer` 的 overlay 体系集成
- 复杂行为的基础层方案定型：明确哪些能力继续自研，哪些交给成熟 primitives / hooks

**这一阶段的关键决策：**

- 是否继续以现有 Floating UI 抽象为主
- 哪些行为适合接入 Radix / React Aria 等成熟基础层
- 如何避免通过双轨新组件掩盖迁移问题

**这一阶段明确不要做：**

- 不引入无截止日期的 `New*` 替代组件并长期共存
- 不把复杂交互问题包装成“以后再统一修”的技术债黑洞

### 阶段排序 rationale

- 先做 Phase 1，是因为当前最大风险是公开契约失真，而不是功能空缺。
- Phase 2 紧跟其后，是为了让文档、测试和 demo 按真实公开消费方式工作，防止 Phase 1 约束失效。
- Phase 3 再补 table stakes，能让 v1 形成真正可采用的组件闭环。
- Phase 4 最后治理复杂交互，避免复杂组件持续绑架前面更高价值的基础工作。

### Research Flags

**建议在规划时继续做专项 research 的阶段：**

- **Phase 2：** 需要决定 Storybook 与 `apps/docs` 的最终组合方式，是跳转、嵌入还是内容聚合；这会影响文档工程形态。
- **Phase 4：** 需要专项研究复杂交互基础层选型，尤其是 Radix / React Aria / Floating UI 的职责边界与迁移成本。

**可直接按标准模式推进、通常不需要额外 research-phase 的阶段：**

- **Phase 1：** `exports`、publint、类型分发校验、OIDC、消费者冒烟测试都属于成熟模式。
- **Phase 3：** `checkbox` / `radio` / `switch` / `input` / `textarea` / `alert` / `empty` 等属于非常标准的组件库工作。

## 置信度评估

| 区域         | 置信度 | 说明                                                         |
| ------------ | ------ | ------------------------------------------------------------ |
| 技术方向     | 高     | 主要由官方文档与当前仓库状态共同支持，结论稳定。             |
| 功能分层     | 高     | table stakes 与 anti-features 判断与主流组件库分类高度一致。 |
| 架构推进顺序 | 高     | 与当前 monorepo 依赖图、公开 API 边界问题直接对应。          |
| 风险判断     | 高     | 大部分风险已在当前仓库中出现具体信号，不是抽象推测。         |

**总体置信度：高**

### 仍需在 requirements / planning 阶段确认的空白

- `apps/docs` 与 Storybook 的最终对外形态：单站整合还是单入口跳转，需要在实现前拍板。
- 复杂 overlay / selection 基础层的长期策略：继续自研、局部引入 primitives，还是分层重构。
- 子路径导出的首批开放范围：是否只开放 `theme` / `locale` / `icons`，还是同步开放组件级子路径。
- 主题 contract 的首个稳定范围：先覆盖色彩 / spacing / radius / typography，还是同步覆盖 motion / component tokens。

## 来源

### 主要研究文档

- `.planning/research/STACK.md`
- `.planning/research/FEATURES.md`
- `.planning/research/ARCHITECTURE.md`
- `.planning/research/PITFALLS.md`

### 高置信度官方来源

- Node.js `packages` / `exports`
- TypeScript modules / declaration publishing
- npm trusted publishing / package publishing
- Turborepo repository structuring / internal packages / boundaries
- pnpm workspace
- Storybook docs / autodocs / accessibility / docs build
- Vitest browser mode / component testing
- Playwright component testing / visual comparisons
- React Aria / Radix Primitives / WAI-ARIA APG

### 研究结论一句话版

**v1 先收口公开契约、文档和验证链路，再补输入 / 反馈 / overlay 的 table stakes，最后治理复杂交互；不要继续双文档主入口、不要让 demo 绕过真实消费链路、不要在基础不稳时追求重型组件和平台化。**

---

_研究完成：2026-04-13_  
_可直接进入 requirements 定义：是_
