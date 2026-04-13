# 技术栈研究：`one-piece` 组件库主线

**项目：** `one-piece`  
**范围：** `stack` 维度，聚焦 `packages/compass-ui`  
**研究日期：** 2026-04-13  
**总体置信度：** 高

## 结论摘要

这个仓库不需要推倒重来。对“个人长期复用资产库 + 可公开发布 npm 包 + React 组件库主线”这类项目，2026 年上下最稳妥的路线不是追新，而是把**包构建、文档、测试、发布、类型校验、导出策略**收束成一条清晰的公开包交付链。

结合当前仓库状态，最合理的判断是：

- **继续沿用**：`pnpm workspace`、`turbo`、`TypeScript`、`Changesets`
- **优先补强**：测试体系、导出面、类型校验、发布安全、文档与 demo 的统一入口
- **应避免**：长期并存两套主文档系统、继续扩张运行时 CSS-in-JS 依赖面、把组件库构建切到不必要的复杂栈

对 `compass-ui` 而言，推荐的标准形态是：

1. 仓库层继续维持 `pnpm + turbo` monorepo。
2. 组件库构建短期继续用 `tsup`，但把 `publint`、`Are the Types Wrong?`、打包产物校验补上。
3. 公共文档与交互 demo 主入口收敛到 **Storybook 10**；`dumi` 可以作为过渡，但不应与 `Next` 文档站长期双轨并行。
4. 单元/组件测试主 runner 迁到 **Vitest**，真实浏览器组件测试与视觉回归交给 **Playwright**。
5. 发布继续用 **Changesets**，但发布鉴权升级为 **npm trusted publishing (OIDC)**，不要继续依赖长生命周期 npm token。
6. 样式层短期不强制重写 Emotion，但主题 contract 应逐步改成 **CSS Variables 优先**；中长期如需降运行时开销，再评估 `vanilla-extract`。

## 当前仓库判断

| 领域          | 当前状态                                                 | 判断                 | 说明                                             | 置信度 |
| ------------- | -------------------------------------------------------- | -------------------- | ------------------------------------------------ | ------ |
| Monorepo 编排 | `pnpm workspace` + `turbo`                               | 继续沿用             | 与目标高度匹配，迁移收益极低                     | 高     |
| 组件库构建    | `tsup` 单入口 `cjs+esm+dts`                              | 继续沿用，但补强     | 当前复杂度不值得立即迁构建器                     | 高     |
| 文档体系      | `packages/compass-ui` 的 `dumi` + `apps/docs` 的 Next 站 | 需要收敛             | 双入口会带来内容漂移和维护重复                   | 高     |
| Demo 体系     | `dumi` demo + 独立 demo app                              | 有条件保留           | 组件 demo 应并入主文档；集成 demo 才值得独立 app | 高     |
| 测试体系      | 包级 Jest；仓库中已出现 Vitest 风格测试文件              | 必须统一             | 当前已出现 runner 漂移迹象                       | 高     |
| 发布体系      | `Changesets` + 本地/CI publish                           | 继续沿用，但升级鉴权 | 发布策略对，安全性不够现代                       | 高     |
| 类型分发      | `types` + 根 `exports`                                   | 补强                 | 只导出根入口，缺稳定子路径与校验                 | 高     |
| 样式方案      | Emotion runtime styling                                  | 短期沿用             | 当前可用，但不应继续扩大绑定                     | 中高   |
| 主题方案      | JS token + Emotion theme                                 | 必须补强             | 对公开包来说，CSS 变量 contract 更稳             | 中高   |
| 对外兼容声明  | `react >=16.8.0`                                         | 应收紧               | 对公开包应声明真实测试范围，而不是“理论可用范围” | 高     |

## 推荐标准栈

### 1. Monorepo 与工程基线

| 类别          | 推荐                   | 对当前仓库建议           | 理由                                                 | 置信度 |
| ------------- | ---------------------- | ------------------------ | ---------------------------------------------------- | ------ |
| 工作区        | `pnpm workspace`       | 继续沿用                 | 对多包发布、filter、lockfile 管理都合适              | 高     |
| 任务编排      | `turbo`                | 继续沿用                 | 已接入，适合 build/test/lint/release 扇出            | 高     |
| 语言          | `TypeScript 5.x`       | 继续沿用，并提升编译配置 | 类型分发、公开 API、story/test 都依赖 TS             | 高     |
| Node 开发基线 | Node 22 LTS+           | 建议升级                 | npm trusted publishing 需 Node 22.14+ 与 npm 11.5.1+ | 高     |
| 包管理器      | `pnpm 10` 作为开发基线 | 建议升级                 | 当前 `pnpm@8.6.10` 偏旧，和 2026 工具链脱节          | 中高   |

**建议：**

- 仓库开发基线改为 `Node 22 LTS+`。
- 根 `packageManager` 升到 `pnpm@10`。
- 在仓库根补 `devEngines` 或至少更新 `engines`/CI matrix，避免本地与 CI 行为漂移。

### 2. 组件库构建

| 类别     | 推荐                                   | 对当前仓库建议                 | 理由                                                   | 置信度 |
| -------- | -------------------------------------- | ------------------------------ | ------------------------------------------------------ | ------ |
| 首选策略 | `tsup` 继续作为短期构建器              | 继续沿用                       | 当前 `compass-ui` 仍是单主入口，迁移收益有限           | 高     |
| 中期备选 | `tsdown`                               | 作为“复杂度升级后再迁移”的备选 | 在自动导出、`dts`、`publint`、`attw` 联动上更现代      | 中高   |
| 不推荐   | 直接把发布构建切到 `Vite library mode` | 避免引入                       | Vite 文档明确说高级发布流可直接用 `tsdown` 或 Rolldown | 高     |

**判断：**

- **现在不建议为 `compass-ui` 立即更换构建器。**
- 但应给现有 `tsup` 流程补上：
  - `declarationMap`
  - package lint
  - packed tarball 校验
  - 子路径导出生成/校验

**推荐落地：**

```bash
pnpm add -D publint @arethetypeswrong/core
```

并在 CI 中增加：

```bash
pnpm --filter @xinghunm/compass-ui build
pnpm exec publint packages/compass-ui
```

如果后续出现以下任一情况，再考虑迁到 `tsdown`：

- `compass-ui` 需要稳定维护大量 `subpath exports`
- 需要自动生成 `exports/main/module/types`
- 需要把 `publint`/`attw` 作为 build 阶段的一等公民

### 3. 文档站与 Demo

| 类别                    | 推荐                       | 对当前仓库建议                       | 理由                                                             | 置信度 |
| ----------------------- | -------------------------- | ------------------------------------ | ---------------------------------------------------------------- | ------ |
| 主文档栈                | `Storybook 10`             | 建议引入并逐步替代组件文档主入口     | Storybook 把故事、文档、交互、测试、AI manifest 放在同一套资产里 | 高     |
| 现有 `dumi`             | 过渡保留                   | 可短期保留，但不应长期作为唯一主方案 | 已有沉淀，迁移可分阶段做                                         | 中高   |
| `apps/docs` (Next 13.5) | 降级为项目级站点或逐步退场 | 不建议继续扩张为组件主文档站         | 与组件 docs 重叠；当前版本也明显滞后于 Next 16                   | 高     |
| 组件 demo               | 直接写在 stories 中        | 必须补强                             | 组件库的“文档即 demo”是最稳的公共交付方式                        | 高     |
| 独立 demo app           | 只保留集成级 demo          | 条件保留                             | 例如 `ai-chat-demo` 这类跨包、接后端、场景化验证才值得独立 app   | 高     |

**明确建议：**

- `compass-ui` 的公开文档/交互 demo 主入口应收敛到 **Storybook**。
- `apps/docs` 如果继续存在，更适合承载：
  - 仓库首页
  - 发布说明
  - monorepo 级开发文档
  - 非组件型说明页
- **不建议长期同时维护 `Next docs + dumi docs` 两套主文档面。**

**为什么更偏向 Storybook：**

- 官方文档已把 Storybook 明确定位为“isolated UI workshop”，同时覆盖文档、测试、分享。
- `Autodocs` 可以直接从 stories 生成组件文档。
- `build --docs` 能生成纯文档模式站点。
- 2026 年文档里已经出现了 AI manifests/MCP 能力，这对公开组件库是额外红利。

### 4. 测试策略

| 类别         | 推荐                                                 | 对当前仓库建议 | 理由                                        | 置信度 |
| ------------ | ---------------------------------------------------- | -------------- | ------------------------------------------- | ------ |
| 单元测试     | `Vitest`                                             | 建议迁移       | 与 Vite 生态和 ESM/TS 更顺，Jest 兼容成本低 | 高     |
| 组件测试     | `Vitest Browser Mode` + Playwright provider          | 强烈建议补上   | 官方明确推荐真实浏览器环境进行组件测试      | 高     |
| E2E/视觉回归 | `Playwright`                                         | 强烈建议引入   | 可做 story/page screenshot 与交互路径验证   | 高     |
| 不推荐       | 长期维持 Jest 为主，同时仓库内部散落 Vitest 风格测试 | 避免           | runner 混用只会增加心智负担和 CI 复杂度     | 高     |

**推荐分层：**

1. `Vitest` 负责纯逻辑单测和轻量 React 行为测试。
2. `Vitest Browser Mode + Playwright provider` 负责关键组件真实浏览器测试。
3. `Playwright` 负责：
   - Storybook 页面 smoke test
   - 视觉回归
   - 关键组件组合场景

**对当前仓库的直接建议：**

- 统一移除“没有 runner 依赖支撑的 Vitest 风格测试文件”这种半迁移状态。
- 给 `compass-ui` 定一个单一 testing contract：
  - `*.test.ts(x)` 默认走 `Vitest`
  - `*.browser.test.ts(x)` 走 `Vitest Browser`
  - `e2e/` 或 `visual/` 走 `Playwright`

### 5. 发布与版本策略

| 类别       | 推荐                                             | 对当前仓库建议 | 理由                               | 置信度 |
| ---------- | ------------------------------------------------ | -------------- | ---------------------------------- | ------ |
| 版本管理   | `Changesets`                                     | 继续沿用       | 对 monorepo 包发布仍是稳妥标准解   | 高     |
| 发布鉴权   | npm trusted publishing (OIDC)                    | 必须升级       | 官方明确推荐，避免长生命周期 token | 高     |
| 产物证明   | npm provenance                                   | 建议启用       | public package 场景下安全收益高    | 高     |
| 发布前校验 | `build + test + publint + attw + npm pack smoke` | 必须补强       | 现在缺 package 级分发校验          | 高     |

**明确建议：**

- 发布不要再依赖长期 npm token。
- 使用 GitHub Actions OIDC 直发 npm。
- 在 npm 包设置里启用：
  - trusted publisher
  - 2FA
  - disallow tokens

**推荐发布流水线：**

1. `pnpm turbo run lint test build --filter=./packages/*`
2. `pnpm --filter @xinghunm/compass-ui build`
3. `publint`
4. `npm pack` 后做 tarball smoke check
5. `changeset publish`

### 6. 类型分发

| 类别        | 推荐                                                   | 对当前仓库建议 | 理由                                                 | 置信度 |
| ----------- | ------------------------------------------------------ | -------------- | ---------------------------------------------------- | ------ |
| 主声明入口  | `types` 字段显式声明                                   | 继续沿用       | TypeScript 文档仍明确建议显式提供                    | 高     |
| 类型生成    | `d.ts` + `declarationMap`                              | 必须补强       | monorepo 内外跳转体验更好                            | 高     |
| TS 模块解析 | 以 `node16/node18/nodenext` 语义校验                   | 必须补强       | TypeScript 2026 文档已明确，不应再用旧 CommonJS 思维 | 高     |
| 兼容校验    | `Are the Types Wrong?`                                 | 建议纳入 CI    | 专门检查不同模块解析策略下的类型分发问题             | 高     |
| 不推荐      | 只生成 `index.d.ts`，但不验证 `exports` 与实现是否一致 | 避免           | 最容易出现“类型能补全、运行时报错”的公开包事故       | 高     |

**建议：**

- `compass-ui` 构建输出中开启 `declarationMap`。
- 对外包保留显式 `types` 字段，即便 `exports` 已含 `types` 条件。
- 在 CI 中把 `types` 正确性当成发布门槛，而不是“顺便产出”。

### 7. 样式方案

| 类别              | 推荐                                                                     | 对当前仓库建议 | 理由                                                  | 置信度 |
| ----------------- | ------------------------------------------------------------------------ | -------------- | ----------------------------------------------------- | ------ |
| 当前实现          | Emotion                                                                  | 短期继续沿用   | 已深度嵌入组件实现，立即重写成本高                    | 中高   |
| 公共样式 contract | CSS Variables                                                            | 必须补强       | 对主题切换、宿主覆写、跨框架消费都更稳                | 高     |
| 中长期备选        | `vanilla-extract`                                                        | 有条件评估     | 官方定位为 zero-runtime、强类型主题与变量系统         | 中高   |
| 不推荐            | 在组件库源码中引入 Tailwind 作为主样式方案                               | 避免           | Tailwind 更适合 app，不适合作为公共组件库内部样式实现 | 中高   |
| 不推荐            | 再引入第二套运行时 CSS-in-JS（如同时保留 Emotion 再加别的 runtime 方案） | 避免           | 运行时、样式优先级、SSR/打包体积都会更复杂            | 高     |

**核心判断：**

- **Emotion 现在不是必须重写的问题。**
- 真正的问题是：当前主题 token 主要停留在 JS/Emotion 上下文里，对外 contract 不够稳定。

因此建议路线是：

1. 保留 Emotion 实现层。
2. 先把设计 token 逐步改造成 **CSS custom properties 优先**。
3. 组件内部仍可从 Emotion 读取，但最终落到 CSS 变量。
4. 等 token contract 稳定后，再评估是否迁到 `vanilla-extract`。

### 8. 主题方案

| 类别     | 推荐                                         | 对当前仓库建议 | 理由                                                  | 置信度 |
| -------- | -------------------------------------------- | -------------- | ----------------------------------------------------- | ------ |
| 主题核心 | `ThemeProvider` + CSS Variables contract     | 补强现有方案   | 既保留 React 上下文能力，又把主题值暴露为平台原生变量 | 高     |
| 主题粒度 | 全局主题 + 局部主题覆盖                      | 继续沿用       | Emotion 和 vanilla-extract 都支持这种模型             | 高     |
| 主题产物 | 明确 `light` / `dark` / brand token contract | 必须补强       | 公开包需要稳定主题 API，而不是只暴露内部对象结构      | 高     |
| 不推荐   | 仅依赖 JS 对象 merge 做主题扩展              | 避免           | 对宿主应用覆写、SSR、非 React 消费都不友好            | 中高   |

**建议主题 contract 长这样：**

- `colors.*`
- `space.*`
- `radius.*`
- `font.*`
- `shadow.*`
- `motion.*`
- `component.*`

并把“可覆写的稳定 token 名称”视为 semver API。

### 9. 包导出策略

| 类别           | 推荐                                    | 对当前仓库建议 | 理由                                         | 置信度 |
| -------------- | --------------------------------------- | -------------- | -------------------------------------------- | ------ |
| 根导出         | `exports["."]`                          | 继续保留       | 仍然需要统一主入口                           | 高     |
| 子路径导出     | 显式稳定子路径导出                      | 必须补强       | 组件库常见消费方式，需要稳定、可控、可文档化 | 高     |
| 内部路径保护   | 不开放任意深导入                        | 必须执行       | Node 官方明确指出 `exports` 是公共接口边界   | 高     |
| `imports` 字段 | 包内 alias/self-reference 时再用        | 有条件引入     | 适合内部开发，不必一开始铺开                 | 中高   |
| 不推荐         | 直接开放 `./*` 或依赖未声明的深路径导入 | 避免           | 会冻结内部目录结构，后续难演进               | 高     |

**对 `compass-ui` 的建议导出面：**

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./button": {
      "types": "./dist/button.d.ts",
      "import": "./dist/button.js",
      "require": "./dist/button.cjs"
    },
    "./theme": {
      "types": "./dist/theme.d.ts",
      "import": "./dist/theme.js",
      "require": "./dist/theme.cjs"
    },
    "./package.json": "./package.json"
  }
}
```

**原则：**

- 小到中等规模导出面，优先**显式列出**。
- 组件数量继续上升后，再考虑脚本自动生成，不要手写放任漂移。
- Storybook 文档示例必须只使用这些公开导出路径，不能用内部深路径。

## 明确的“继续沿用 / 补强 / 避免”

### 推荐继续沿用

- `pnpm workspace`
- `turbo`
- `TypeScript`
- `Changesets`
- `tsup`（短期）
- Emotion（仅作为当前实现层，不再继续放大绑定）

### 推荐优先补强

- `Storybook 10` 作为 `compass-ui` 主文档与主 demo 入口
- `Vitest` 统一单测/组件测 runner
- `Playwright` 组件级真实浏览器测试与视觉回归
- `publint`
- `Are the Types Wrong?`
- npm trusted publishing (OIDC)
- `declarationMap`
- 显式 `subpath exports`
- CSS Variables 主题 contract
- React peer range 收紧到真实支持范围，例如 `^18.2.0 || ^19.0.0`

### 不推荐引入或继续维持

- 长期并存 `Next docs + dumi docs` 双主文档面
- 继续扩张 Jest 与 Vitest 混用状态
- 在组件库源码中引入 Tailwind 作为主样式实现
- 再引入第二套运行时 CSS-in-JS
- 公开包继续依赖长期 npm token 发布
- 放任未声明的深路径导入
- 继续声称 `react >=16.8.0` 这类过宽 peer 范围
- 把 `apps/docs` 的 Next 13.5 继续当作组件主文档长期投入

## 对当前仓库的落地建议顺序

1. **先统一测试栈**
   - 从 Jest 迁到 Vitest
   - 引入 Playwright
2. **再统一文档入口**
   - 引入 Storybook
   - 把高频组件 stories 补齐
3. **再补发布校验**
   - OIDC trusted publishing
   - `publint` + `attw`
4. **最后再演进导出与主题**
   - 显式子路径导出
   - CSS Variables token contract

## 最终推荐

如果只保留一句话建议：

**这个仓库应保持 `pnpm + turbo + Changesets` 不变，`compass-ui` 短期继续用 `tsup`，但文档收敛到 Storybook、测试收敛到 Vitest + Playwright、发布升级到 OIDC、主题逐步改成 CSS Variables contract；不要继续长期维护 `Next + dumi + Jest` 这种分裂式组件库交付链。**

## 参考来源

### 高置信度

- Node.js Packages / `exports` / conditional exports  
  https://nodejs.org/api/packages.html
- TypeScript Modules Reference  
  https://www.typescriptlang.org/docs/handbook/modules/reference.html
- TypeScript Declaration Publishing  
  https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html
- npm `package.json` docs  
  https://docs.npmjs.com/cli/v11/configuring-npm/package-json
- npm trusted publishing  
  https://docs.npmjs.com/trusted-publishers
- React versions  
  https://react.dev/versions
- Next.js docs  
  https://nextjs.org/docs
- Storybook docs / Autodocs / Docs build / AI manifests  
  https://storybook.js.org/docs/  
  https://storybook.js.org/docs/writing-docs/autodocs  
  https://storybook.js.org/docs/writing-docs/build-documentation  
  https://storybook.js.org/docs/ai/manifests
- Vitest docs / Browser Mode / Component Testing  
  https://vitest.dev/  
  https://vitest.dev/guide/browser/  
  https://vitest.dev/guide/browser/component-testing
- Playwright docs / Visual comparisons / Component testing  
  https://playwright.dev/docs/test-snapshots  
  https://playwright.dev/docs/test-components
- dumi docs  
  https://d.umijs.org/
- Vite library mode  
  https://vite.dev/guide/build#library-mode
- tsdown docs  
  https://tsdown.dev/options/package-exports  
  https://tsdown.dev/options/dts  
  https://tsdown.dev/options/lint
- Emotion theming  
  https://emotion.sh/docs/theming
- vanilla-extract  
  https://vanilla-extract.style/  
  https://vanilla-extract.style/documentation/theming/
- publint  
  https://publint.dev/docs/
- Are the Types Wrong?  
  https://arethetypeswrong.github.io/

### 低置信度或推断部分

- “Storybook 比 dumi 更适合作为公开 npm 组件库主入口”  
  这是基于官方能力边界、生态标准化程度和当前仓库双轨维护成本做出的**工程判断**，不是某个官方文档的单句结论。  
  **置信度：中高**
- “Emotion 应保留为短期实现层，但主题应转向 CSS Variables contract”  
  这是基于当前代码现状、公开包演进成本与零运行时主题方案趋势做出的**架构判断**。  
  **置信度：中高**
