# 架构模式研究：以组件库为核心的多包前端资产仓库

**项目：** one-piece  
**研究维度：** Architecture  
**研究日期：** 2026-04-13  
**总体信心：** HIGH

## 结论摘要

这类仓库中长期最稳健的形态，不是“一个大 UI 包 + 若干随手放的旁系包”，而是一个**单向依赖、公共 API 严格收口、应用层只做消费与验证**的资产 monorepo。对当前仓库，最合适的主结构是：`compass-hooks` 作为底层运行时能力，`compass-ui` 作为核心公开产品，`ai-chat` 作为依赖 UI 的邻接产品包，`apps/docs` 作为唯一对外文档入口，`apps/*-demo` 作为场景验证和集成实验场。

当前仓库最大的问题不是“包太多”，而是**边界还不够硬**：`apps/ai-chat-demo` 通过 alias 直连 `packages/ai-chat/src/index.ts`，`compass-ui` 文档示例直接引用 `src/*` 和 `dist/*` 内部路径，而真正有内容的组件文档在 `packages/compass-ui/docs`，`apps/docs` 反而接近空壳。这会让“对外承诺的 API”“仓内真实消费方式”“开发时的联调方式”三者持续分叉。

推荐方向很明确：**继续共仓，但把仓库分成五层**。

1. `tools/*` 与配置型包：只提供配置，不承载业务。
2. foundation packages：`compass-hooks`，未来如有必要再补 `compass-tokens`。
3. core product package：`compass-ui`，这是当前主线和最高稳定性目标。
4. adjacent product packages：`ai-chat`、eslint/plugin 等，它们可以共仓，但必须保持对 core package 的单向依赖。
5. consumer apps：`apps/docs`、`apps/ai-chat-demo` 等，只消费公开包，不拥有共享业务逻辑。

这意味着文档站与 demo 的关系也要重新定义：**文档站是公开 API 的展示与说明层，demo 是高保真验证环境，不是文档系统的替代品。** `apps/docs` 应成为唯一对外文档入口；`apps/*-demo` 继续保留，但只服务复杂交互、真实环境接线、业务适配验证。

## 推荐架构

```text
root
├─ tools/
│  └─ tsconfig                # 共享配置，不依赖业务包
├─ packages/
│  ├─ compass-hooks           # foundation runtime
│  ├─ compass-ui              # core public UI library
│  ├─ ai-chat                 # adjacent package built on compass-ui
│  └─ eslint-plugin-fsd-lint  # tooling package, independent vertical
└─ apps/
   ├─ docs                    # canonical public docs site
   └─ ai-chat-demo            # scenario/integration lab
```

**推荐依赖方向：**

```text
tools/* -> no runtime deps on business packages

compass-hooks -> no internal runtime dependency
compass-ui -> compass-hooks
ai-chat -> compass-ui
eslint-plugin-fsd-lint -> independent

apps/docs -> compass-ui (later can also consume ai-chat docs content)
apps/ai-chat-demo -> ai-chat -> compass-ui
```

**硬规则：**

- `apps/*` 只能依赖 `packages/*` 和外部依赖，不能被任何包反向依赖。
- foundation package 不能依赖 core product package。
- 邻接产品包可以依赖 `compass-ui`，但不能反向把自己的类型、状态、文档需求倒灌回 `compass-ui`。
- 所有公开消费路径必须经过 `package.json.exports`，不允许文档、demo、示例代码使用 `src/*` 或 `dist/*` 私有路径。

## 组件边界与职责

| 层级       | 包/应用                           | 角色                                           | 可以依赖            | 不能依赖                          | 稳定性要求 |
| ---------- | --------------------------------- | ---------------------------------------------- | ------------------- | --------------------------------- | ---------- |
| 配置层     | `tools/tsconfig`                  | 提供共享编译配置                               | TypeScript          | 任何业务包                        | 高         |
| 基础层     | `packages/compass-hooks`          | 提供可复用 hooks 和轻量运行时工具              | React、外部基础依赖 | `compass-ui`、`ai-chat`、`apps/*` | 高         |
| 核心产品层 | `packages/compass-ui`             | 对外公开 UI 组件、主题、locale、icons、form 等 | `compass-hooks`     | `apps/*`、`ai-chat`               | 最高       |
| 邻接产品层 | `packages/ai-chat`                | 复用 `compass-ui` 的领域组件包                 | `compass-ui`        | `apps/*`                          | 中高       |
| 工具产品层 | `packages/eslint-plugin-fsd-lint` | 工程规则插件                                   | ESLint 生态         | UI 包                             | 中高       |
| 文档层     | `apps/docs`                       | 统一展示公开 API、示例、迁移说明               | 公开包              | `src/*`、demo 私有代码            | 高         |
| 验证层     | `apps/ai-chat-demo`               | 真实环境接线、复杂交互验证                     | 公开包              | 被其他包依赖                      | 中         |

## 文档站与 Demo 的关系

### 推荐关系

`apps/docs` 应该是**唯一对外文档站**。它的职责是：

- 展示安装方式、公开 API、示例代码、迁移说明。
- 作为“消费者视角”验证：文档里的代码必须能在外部项目按公开导出直接运行。
- 承载轻量交互示例和组件 playground。

`apps/*-demo` 应该是**场景 demo / 集成实验场**。它的职责是：

- 验证复杂流程、环境变量、代理、业务协议、长链路交互。
- 允许出现宿主环境适配代码、mock、业务 renderer、代理配置。
- 不承担公开 API 定义，不作为对外安装文档的事实来源。

### 对当前仓库的具体判断

- `packages/compass-ui/docs` 目前承载了实际组件文档内容。
- `apps/docs` 目前只是一个很薄的 Next 页面。
- 这会导致“真正的文档系统”藏在包里，而“应用层文档站”没有成为主入口。

**推荐做法：**

1. 短期不必立刻推翻 dumi 内容，但要把它视为**待迁移的文档内容源**，不是最终站点边界。
2. 中期把 `apps/docs` 升级为唯一文档站，消费各包的文档内容或自动生成内容。
3. 对 `compass-ui` 来说，文档页面可以继续放在包附近维护，但编译和对外访问入口必须统一收敛到 `apps/docs`。

### 为什么要这样做

- 文档站应该代表“外部消费者如何使用包”，所以它必须按公开导出消费包。
- demo 应用天然会为了联调速度做很多仓内特权配置，这些配置不适合作为对外范式。
- 一个包一个独立文档系统会让导航、搜索、版本、设计语言和部署持续分裂。

## Public API 边界

这是当前最需要收紧的地方。

### 公开边界原则

Node 的 `package.json.exports` 本质上就是包的公开接口定义。对一个面向 npm 发布的资产仓库，**只有 `exports` 中声明的入口才算公开 API**。

因此推荐把公开接口分成两层：

### 第一层：根入口

适合 80% 使用场景，保持低认知负担。

```text
@xinghunm/compass-ui
@xinghunm/compass-hooks
@xinghunm/ai-chat
```

### 第二层：少量稳定子路径

只为确实需要独立消费、且准备长期维护 semver 的能力开放。

对 `compass-ui`，更合理的稳定子路径是：

```text
@xinghunm/compass-ui/theme
@xinghunm/compass-ui/locale
@xinghunm/compass-ui/icons
```

如果未来需要更强 tree-shaking 或按组件引入，再考虑：

```text
@xinghunm/compass-ui/button
@xinghunm/compass-ui/select
```

但前提是你愿意长期维护这些子路径的兼容性。

### 明确禁止

- 文档中出现 `@xinghunm/compass-ui/src/...`
- 文档中出现 `@xinghunm/compass-ui/dist/...`
- demo 默认通过 tsconfig alias / vite alias 指向源码入口，并把这种方式当作常态
- 用 docs 的 alias 去修补一个实际上未公开的导出

### 对当前仓库的落点

现在文档已经引用：

- `@xinghunm/compass-ui/src/tree-select/types`
- `@xinghunm/compass-ui/src/date-picker/types`
- `@xinghunm/compass-ui/src/auto-complete/types`
- `@xinghunm/compass-ui/dist/locale/zh_CN`
- `@xinghunm/compass-ui/dist/locale/en_US`

这说明当前文档已经越过了公开边界。最稳妥的修正不是“继续给文档配 alias”，而是二选一：

1. 这些能力确实要公开，那就补正式 `exports`。
2. 这些能力不打算长期支持，那就从文档里移除，改用根入口可表达的写法。

我更推荐：

- `locale` 和 `icons` 可以升格为稳定子路径。
- 组件内部 `types` 先不要直接公开成细碎路径，优先从根入口导出公共类型。

## 数据与依赖流向

### 依赖流向

```text
consumer apps
  -> core/adjacent packages
    -> foundation packages
      -> external libs
```

### 信息流向

```text
docs app
  -> read public exports
  -> render examples
  -> publish docs

demo app
  -> read public exports
  -> wire env/proxy/mock/business adapters
  -> validate complex scenarios
```

### 当前仓库的关键改造点

- `apps/ai-chat-demo` 现在通过 `paths` 和 `vite.resolve.alias` 直连 `packages/ai-chat/src/index.ts`。
- 这在开发体验上很快，但会绕过 `dist` 和 `exports`，导致 demo 验证不到真正发布物。

**更稳健的做法：**

- 发布型包继续使用 **compiled package** 策略。
- `demo/docs` 默认消费 workspace 包名。
- 本地开发依赖 `turbo dev` 或包级 `dev` watch 产出 `dist`，而不是长期 alias 到 `src`。

这比 JIT 源码直连更接近真实 npm 消费，也更能提早暴露导出缺失、类型丢失、打包问题。

## 推荐构建顺序

### 仓库级 build order

```text
1. tools/*
2. packages/compass-hooks
3. packages/compass-ui
4. packages/ai-chat
5. packages/eslint-plugin-fsd-lint
6. apps/docs
7. apps/ai-chat-demo
```

### 解释

1. `tools/*` 是配置前置条件。
2. `compass-hooks` 是基础层，应最先稳定产出。
3. `compass-ui` 是当前核心产品，所有 UI 相关上层都建立在它之上。
4. `ai-chat` 依赖 `compass-ui`，因此必须后置。
5. `eslint-plugin-fsd-lint` 是独立垂直，可与第 2-4 步并行，但在“认知顺序”上建议单独看待，不放进 UI 主链。
6. `apps/docs` 作为对外文档消费者，应在相关包构建完成后运行，验证公开导出。
7. `apps/ai-chat-demo` 最后执行，验证复杂集成和真实流程。

### 推荐任务分层

**发布验证链：**

```text
lint -> test -> build -> docs build -> demo build
```

**本地开发链：**

```text
packages/compass-hooks dev
-> packages/compass-ui dev
-> packages/ai-chat dev
-> apps/docs dev / apps/ai-chat-demo dev
```

### 推荐的 Turbo 边界强化

可以给包打 tag，然后用 `turbo boundaries` 或现有 lint 规则做单向依赖约束。

建议 tag：

- `foundation`
- `core-ui`
- `adjacent-ui`
- `tooling`
- `app`

建议规则：

- `app` 可以依赖 `foundation`、`core-ui`、`adjacent-ui`、`tooling`
- `adjacent-ui` 可以依赖 `foundation`、`core-ui`
- `core-ui` 只能依赖 `foundation`
- `foundation` 不能依赖任何上层 tag

## 包职责拆分建议

### 核心建议

不要把所有能力继续往 `compass-ui` 里堆。更稳健的是：

### `packages/compass-hooks`

继续做底层 hooks 与轻量 runtime helpers。

适合放入：

- 通用交互 hooks
- storage / lifecycle hooks
- 不依赖 UI 视觉语义的轻量工具

不适合放入：

- 明显只为某个组件服务的 hook
- 含主题语义、组件协议或 DOM 结构假设的代码

### `packages/compass-ui`

保持为**核心公开 UI 产品**，职责集中在：

- 组件
- 主题系统
- locale
- icons
- form/stateful UI primitives

不建议承担：

- AI 业务协议
- demo 业务适配
- 文档站私有实现

### `packages/ai-chat`

保留为**建立在 `compass-ui` 上的领域包**，不要混回 `compass-ui`。

理由：

- 它的变化频率、协议复杂度、对 transport/store 的要求都明显不同于基础组件库。
- 它比一般 UI 组件更接近一个“垂直产品包”，不是 design system 基石。

### `packages/eslint-plugin-fsd-lint`

可以继续共仓，但应明确它是**工具纵线**，不是 UI 纵线的一部分。

它应该共享：

- 根级发布流程
- 版本管理基础设施
- CI 约束

它不应该共享：

- UI 架构依赖
- 文档系统耦合
- 运行时抽象

## 是否继续共仓维护非 UI 包

**结论：要，但要设准入规则。**

当前仓库继续共仓维护非 UI 包是合理的，因为它们仍然属于“个人长期复用前端资产”这个统一产品面，且共享同一套发布、版本、测试和 monorepo 运维成本。

### 继续共仓的条件

一个包满足以下至少两条，就值得继续留在这个 monorepo：

1. 会被仓内其他包或应用直接消费。
2. 需要共享同一套 changesets、版本、CI、工作区工具链。
3. 面向同一类前端开发者受众，复用同一品牌或发布命名空间。
4. 与核心 UI 资产存在明确协作关系，但不造成反向耦合。

按这个标准：

- `compass-hooks`：应留。
- `ai-chat`：应留。
- `eslint-plugin-fsd-lint`：可以留。
- 未来的工程配置包：可以留。

### 不建议继续往仓里加的包

- 与前端资产线无关的后端服务代码
- 只服务单一业务项目、没有公共发布价值的业务包
- 需要完全独立发布节奏和独立品牌叙事的实验产品

也就是说，**问题不在“非 UI 包能不能共仓”，而在“它是否仍属于同一资产平台”。**

## 现在就该做 / 可以后做 / 暂时不要做

## 现在就该做

1. **把 `apps/docs` 定义为唯一对外文档入口。**  
   即使短期仍复用 `packages/compass-ui/docs` 的内容源，也要停止“包内 docs 是正式文档站、`apps/docs` 只是壳”的状态。

2. **收紧 public API 边界。**  
   清理所有 `src/*`、`dist/*` 文档导入；对确实需要公开的 `locale`、`icons` 明确补 `exports`，其余内部类型改走根入口导出。

3. **把 `apps/ai-chat-demo` 从长期源码 alias 模式切回包名消费模式。**  
   开发阶段通过 `turbo dev` / `tsup --watch` 解决联调速度，而不是默认绕过发布产物。

4. **在仓库层定义包分层规则。**  
   至少形成书面规则；更进一步可以接入 `turbo boundaries` 或扩展现有 lint 规则，把 `foundation -> core-ui -> adjacent-ui -> app` 固化下来。

5. **把构建链改成“先包、后应用”。**  
   文档站和 demo 都应作为公开包消费者来验证，而不是作为源码旁路。

## 可以后做

1. **抽出 `compass-ui` 的稳定子路径。**  
   先从 `./locale`、`./icons`、`./theme` 开始，确认命名和长期维护策略后再决定是否开放组件级子路径。

2. **为 `apps/docs` 建立多包文档能力。**  
   当前先以 `compass-ui` 为主，后续再收纳 `ai-chat`、hooks、eslint/plugin 的包文档入口。

3. **视第二消费者出现情况，再决定是否拆 `compass-tokens` 或 `compass-primitives`。**  
   只有当主题 token、无样式 primitive、跨框架消费变成真实需求时，这种拆分才有价值。

4. **视 `ai-chat` 的复用模式，再决定是否拆 `ai-chat-core` / `ai-chat-ui`。**  
   只有出现 headless consumer、非 `compass-ui` 皮肤、或协议层独立复用需求时再拆。

## 暂时不要做

1. **不要把 `ai-chat` 合并回 `compass-ui`。**  
   这会把高变化率领域逻辑污染核心组件库。

2. **不要为追求“整齐”而立即拆出大量微包。**  
   现在仓库的主要问题是边界不硬，不是包数量不够多。

3. **不要继续维护“包内 dumi 站 + app 文档站”双主入口。**  
   可以短期并存，但不能长期双主入口。

4. **不要把 demo 当成公开文档的事实标准。**  
   demo 可以很复杂、很特权；文档不行。

5. **不要在这个仓库继续收纳无关产品线。**  
   保持“前端可复用资产平台”这一主语，不要让 monorepo 变成杂物箱。

## 对 roadmap 的直接含义

如果后续要按阶段推进，架构上最合理的优先级是：

1. 先修 public API 边界与 docs/demo 分工。
2. 再补 `compass-ui` 的组件能力与文档完整度。
3. 然后再考虑 `ai-chat` 的中期演进和其它辅助包。

原因很简单：如果边界不收紧，组件补得越多，未来迁移文档、修正导出、调整发布流程的成本就越高。

## 来源

- 官方：Turborepo 仓库结构与 internal packages 文档  
  https://turborepo.dev/docs/crafting-your-repository/structuring-a-repository  
  https://turborepo.dev/docs/core-concepts/internal-packages  
  结论使用：`apps/* + packages/*` 分层、库包优先 compiled package、任务按依赖图执行。

- 官方：Turborepo `boundaries` 文档  
  https://turborepo.dev/docs/reference/boundaries  
  结论使用：用 tag 和规则固化单向依赖边界。

- 官方：pnpm workspace 文档  
  https://pnpm.io/workspaces  
  结论使用：`workspace:*` 只解析本地包，发布时自动重写为 semver 版本，适合 publishable monorepo。

- 官方：Node.js packages / exports 文档  
  https://nodejs.org/api/packages.html  
  结论使用：`exports` 是公开接口边界；未声明子路径不应被消费者依赖。

- 仓库现状证据  
  `.planning/PROJECT.md`  
  `.planning/codebase/ARCHITECTURE.md`  
  `.planning/codebase/STRUCTURE.md`  
  `.planning/codebase/CONCERNS.md`  
  `packages/compass-ui/package.json`  
  `packages/ai-chat/package.json`  
  `apps/ai-chat-demo/tsconfig.json`  
  `apps/ai-chat-demo/vite.config.ts`  
  `packages/compass-ui/.dumirc.ts`

## 信心说明

| 主题                 | 信心        | 说明                                                                             |
| -------------------- | ----------- | -------------------------------------------------------------------------------- |
| 分层与 build order   | HIGH        | 由当前仓库依赖图 + Turborepo/pnpm 官方文档共同支持                               |
| public API 边界      | HIGH        | 由 Node `exports` 语义和仓库现状直接支持                                         |
| docs 与 demo 分工    | MEDIUM-HIGH | 来自仓库现状、主流组件库实践和 monorepo 经验归纳，方向明确但具体落地可有多种实现 |
| 是否继续共仓非 UI 包 | MEDIUM-HIGH | 更偏产品边界判断，但与当前仓库目标高度一致                                       |
