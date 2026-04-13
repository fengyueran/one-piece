# 代码库关注点

**分析日期：** 2026-04-13

## 技术债

**复杂组件与超大测试文件持续膨胀：**

- Issue: `ai-chat` 和 `compass-ui` 已出现高复杂度组件与超大测试文件，单文件承载过多职责，修改成本高且回归半径大。
- Files: `packages/ai-chat/src/components/chat-thread/components/chat-message-item.tsx`, `packages/ai-chat/src/components/chat-thread/index.tsx`, `packages/ai-chat/src/components/chat-thread/components/questionnaire-card.tsx`, `packages/ai-chat/src/store/chat-store.ts`, `packages/ai-chat/src/__tests__/components/chat-thread.test.tsx`, `packages/ai-chat/src/__tests__/components/chat-message-item.test.tsx`, `packages/compass-ui/src/select/select.tsx`, `packages/compass-ui/src/tree-select/tree-select.tsx`, `packages/compass-ui/src/form/form-store.ts`, `packages/compass-ui/src/form/form.test.tsx`
- Impact: 需求迭代时容易引入隐藏分支回归；测试文件过大也会降低定位效率，导致修复变更和测试变更相互耦合。
- Fix approach: 继续开发这些区域前先按渲染层、状态层、协议层拆分；优先抽离 `chat-thread` 的消息块渲染、问卷处理和时间线转换逻辑，再把超大测试按行为切分。

**跨包耦合偏强，公共 API 边界被绕过：**

- Issue: `@xinghunm/ai-chat` 直接依赖 `@xinghunm/compass-ui` 组件；示例应用直接把 `@xinghunm/ai-chat` 指到源码入口；文档示例直接引用 `compass-ui` 的 `src`/`dist` 内部路径。
- Files: `packages/ai-chat/package.json`, `packages/ai-chat/src/components/ai-chat/index.tsx`, `packages/ai-chat/src/components/chat-composer/components/chat-model-control.tsx`, `packages/ai-chat/src/components/chat-thread/components/questionnaire-card.tsx`, `apps/ai-chat-demo/tsconfig.json`, `apps/ai-chat-demo/vite.config.ts`, `packages/compass-ui/docs/components/tree-select.md`, `packages/compass-ui/docs/components/date-picker.md`, `packages/compass-ui/docs/components/config-provider.md`, `packages/compass-ui/docs/components/auto-complete.md`
- Impact: 包之间难以独立发布和独立重构；文档示例一旦被外部用户照搬，发布产物缺少对应内部路径时会直接构建失败。
- Fix approach: 对外示例只允许使用 `exports` 暴露的路径；示例应用如需联调源码，保持在开发配置层完成，不把源码路径别名写进公共文档与长期默认配置。

**约定与实际不一致：文件命名和 `index` 职责出现偏移：**

- Issue: 仓库中存在非 Kebab Case 文件，以及包含实际逻辑的 `index.tsx` / `index.ts`，与项目要求的“文件名使用 kebab-case”“index 仅作 barrel”不一致。
- Files: `apps/ai-chat-demo/src/App.tsx`, `packages/compass-ui/src/pagination/usePagination.ts`, `packages/compass-ui/src/date-picker/index.ts`, `packages/compass-ui/src/form/index.ts`, `packages/compass-ui/src/message/index.ts`, `packages/compass-ui/src/modal/index.ts`, `packages/ai-chat/src/components/ai-chat-provider/index.tsx`, `packages/ai-chat/src/components/chat-thread/index.tsx`, `packages/ai-chat/src/types/index.ts`
- Impact: 规范失效后，新增代码会继续沿着不一致的方式生长，降低代码地图稳定性，也削弱 `eslint-plugin-fsd-lint` 这类结构约束在仓内的说服力。
- Fix approach: 新增文件先收敛到 kebab-case；对已有 `index` 文件分批迁移，把静态属性拼装、组件组合和常量定义移到同目录具名文件后再导出。

**生成产物长期滞留工作区，干扰扫描与维护：**

- Issue: 工作区中存在大量本地生成目录和产物，虽然被 `.gitignore` 排除，但依旧会影响本地检索、审查和工具扫描结果。
- Files: `apps/ai-chat-demo/dist`, `apps/docs/.next`, `packages/compass-ui/docs-dist`, `packages/compass-ui/.dumi/tmp`, `packages/compass-ui/.dumi/tmp-production`, `.turbo`
- Impact: 风险定位时容易把构建产物误判为源码问题；搜索 `any`、`console`、安全关键词时会被大量噪音覆盖。
- Fix approach: 维护脚本增加定期清理；做仓库扫描时默认排除这些目录，并避免把本地产物当作“已有实现”继续引用。

## 已知问题

**`Select` 缺少键盘导航：**

- Symptoms: 打开 `Select` 后无法使用 `ArrowUp` / `ArrowDown` 在选项之间移动，键盘可达性不完整。
- Files: `packages/compass-ui/src/select/select.tsx`
- Trigger: 在启用搜索或普通下拉模式时仅使用键盘操作组件。
- Workaround: 当前只能通过鼠标点击选择；不适合作为无障碍要求较高的输入控件。

**示例应用在缺少环境变量时使用默认假 Token：**

- Symptoms: `ai-chat-demo` 在未配置环境变量时仍会带着 `Bearer dev-token` 发请求，行为看似正常启动，但会在接入真实后端时产生难定位的鉴权错误。
- Files: `apps/ai-chat-demo/src/App.tsx`, `apps/ai-chat-demo/vite.config.ts`
- Trigger: 本地启动 `apps/ai-chat-demo` 且未设置 `VITE_AI_CHAT_AUTH_TOKEN`。
- Workaround: 手动配置真实 token 或在本地代理层兼容该默认值；当前代码不会在启动时显式阻止误配置。

**文档示例存在不可发布路径：**

- Symptoms: 按文档复制代码到外部项目后，引用 `@xinghunm/compass-ui/src/...` 或 `@xinghunm/compass-ui/dist/...` 的示例可能在消费端构建失败。
- Files: `packages/compass-ui/docs/components/tree-select.md`, `packages/compass-ui/docs/components/date-picker.md`, `packages/compass-ui/docs/components/config-provider.md`, `packages/compass-ui/docs/components/auto-complete.md`
- Trigger: 外部使用者直接照搬文档示例，而不是在 monorepo 内部运行。
- Workaround: 手工改写为包根导出路径；当前文档未提供统一替代写法。

## 安全注意事项

**认证信息在组件上下文中广泛暴露：**

- Risk: `AiChatProvider` 会把 `authToken` 和 `apiBaseUrl` 放入 React Context，任何位于 provider 树内的组件、扩展渲染器或调试代码都能直接读取。
- Files: `packages/ai-chat/src/components/ai-chat-provider/index.tsx`, `packages/ai-chat/src/context/chat-context.ts`
- Current mitigation: `AiChatProvider` 支持传入 `transport` 以绕开内置 token 模式。
- Recommendations: 优先使用自定义 `transport`；继续保留内置适配器时，不要把敏感字段暴露到上下文对象，至少应把请求能力与敏感配置分离。

**示例应用默认代理到本地 HTTP 服务：**

- Risk: `ai-chat-demo` 缺少显式环境校验时会自动代理到 `http://localhost:8081`，并配合默认假 token 发起请求，容易把错误配置带入演示、录屏或调试环境。
- Files: `apps/ai-chat-demo/vite.config.ts`, `apps/ai-chat-demo/src/App.tsx`
- Current mitigation: 目标地址和 token 可以通过环境变量覆盖。
- Recommendations: 在应用启动时校验必要环境；未配置时直接报错，不要 silently fallback 到默认认证头。

**错误处理存在向控制台泄露内部上下文的倾向：**

- Risk: 多个组件和 hooks 直接 `console.error` 输出运行时错误，生产接入时可能暴露内部状态、校验细节或宿主集成信息。
- Files: `packages/compass-hooks/src/use-local-storage/use-local-storage.ts`, `packages/compass-ui/src/modal/modal.tsx`, `packages/compass-ui/src/modal/confirm.tsx`, `packages/compass-ui/src/modal/use-modal.tsx`, `packages/compass-ui/src/form/form-item.tsx`
- Current mitigation: 暂未发现统一日志抽象；错误至少没有被完全吞掉。
- Recommendations: 区分开发日志和生产日志；对外只暴露可诊断但不泄露上下文的消息，对内集中交给日志接口。

## 性能瓶颈

**聊天线程渲染链路会随会话长度线性膨胀：**

- Problem: `chat-thread` 相关组件在长会话下需要不断处理消息块拆分、时间线映射和多类型卡片渲染，缺少明确的窗口化边界。
- Files: `packages/ai-chat/src/components/chat-thread/index.tsx`, `packages/ai-chat/src/components/chat-thread/components/chat-message-item.tsx`, `packages/ai-chat/src/components/chat-thread/lib/chat-message-timeline.ts`, `packages/ai-chat/src/components/chat-thread/hooks/use-chat-message-reveal.ts`
- Cause: 单条消息渲染逻辑集中且分支多，消息列表增长后每次增量更新都会触发较重的派生计算与 DOM 更新。
- Improvement path: 把消息块归一化和时间线转换前置到 store 或 memo 化层；为长会话增加可配置分页或虚拟化策略。

**`Select` 大数据量场景缺少虚拟化与键盘状态管理：**

- Problem: 下拉展开时直接对 `filteredOptions` 做完整映射渲染，选项多时会放大渲染和交互开销。
- Files: `packages/compass-ui/src/select/select.tsx`
- Cause: 组件内部没有虚拟列表，也没有抽离高频交互状态，搜索、清空、展开都会触发完整重渲染。
- Improvement path: 在大选项集场景引入虚拟渲染；把高频交互状态与选项渲染解耦，并补齐键盘导航状态机。

**插件集成测试强依赖事先构建产物：**

- Problem: `eslint-plugin-fsd-lint` 的集成测试先构建 `dist`，再切换到测试工程执行 `eslint`，测试链路较慢且对本地环境敏感。
- Files: `packages/eslint-plugin-fsd-lint/package.json`, `packages/eslint-plugin-fsd-lint/test-project/eslint.config.js`
- Cause: 测试工程通过 `require('../dist/index.js')` 读取插件，而不是直接消费源码编译结果或临时打包结果。
- Improvement path: 让集成测试在同一进程内加载编译结果，或者为测试单独准备更轻量的构建入口，避免每次全量 `pnpm install`。

## 脆弱区域

**Floating UI 相关组件通过禁用 Hook 规则维持当前实现：**

- Files: `packages/compass-ui/src/dropdown/dropdown.tsx`, `packages/compass-ui/src/tooltip/tooltip.tsx`, `packages/compass-ui/src/select/select.tsx`, `packages/compass-ui/src/tree-select/tree-select.tsx`, `packages/compass-ui/src/date-picker/date-picker.tsx`, `packages/compass-ui/src/date-picker/date-range-picker.tsx`
- Why fragile: 多处依赖 `eslint-disable react-hooks/rules-of-hooks` 和 `@ts-expect-error`，说明当前写法已经踩在线上实现与 React 规则的边界上。
- Safe modification: 修改触发器、ref 合并、portal 关闭行为前，先补交互测试，再逐步改为不依赖规则豁免的结构。
- Test coverage: 有组件级测试，如 `packages/compass-ui/src/dropdown/dropdown.test.tsx`, `packages/compass-ui/src/tooltip/tooltip.test.tsx`, `packages/compass-ui/src/select/select.test.tsx`，但键盘导航、焦点管理和无障碍行为仍不完整。

**表单存储和错误模型对调用方约束强：**

- Files: `packages/compass-ui/src/form/form-store.ts`, `packages/compass-ui/src/form/form.tsx`, `packages/compass-ui/src/form/form-item.tsx`
- Why fragile: `validateFields` 直接抛出字面量对象 `errorEntity`，调用方一旦按 `instanceof Error` 处理就会失效；同时表单状态和回调联动密集。
- Safe modification: 修改校验返回协议前先统一错误对象形态；若继续使用自定义错误载荷，至少封装成稳定的 Error 子类。
- Test coverage: `packages/compass-ui/src/form/form.test.tsx` 覆盖较多，但主要是行为回归测试，错误协议本身的对外契约约束不强。

**发布配置和包元数据相互打架：**

- Files: `.changeset/config.json`, `packages/ai-chat/package.json`, `packages/compass-hooks/package.json`, `packages/compass-ui/package.json`, `packages/eslint-plugin-fsd-lint/package.json`
- Why fragile: 根 changesets 配置声明 `"access": "restricted"`，而多个包本身声明 `publishConfig.access: "public"`；发布行为依赖调用链优先级，配置意图不单一。
- Safe modification: 先统一“仓库级发布策略”和“包级覆盖策略”的唯一来源，再继续新增包或调整 release 脚本。
- Test coverage: 未检测到针对发布配置的自动校验，也未检测到 `.github/workflows` 下的 CI 发布预演。

## 扩展性边界

**聊天会话增长后缺少明确的渲染上限：**

- Current capacity: 未定义；当前实现默认把整个消息线程保留在前端状态并渲染到页面。
- Limit: 长会话、长 markdown、结构化消息块增多时，`chat-thread` 的派生计算和 DOM 数量会同步上升。
- Scaling path: 在 `packages/ai-chat/src/store/chat-store.ts` 和 `packages/ai-chat/src/components/chat-thread/index.tsx` 引入历史分页、窗口化列表或消息摘要策略。

**下拉与树选择在大选项集场景扩展性有限：**

- Current capacity: 未定义；`Select` 当前以完整数组映射渲染选项。
- Limit: 选项数扩大后，搜索输入和展开关闭都会受到完整重渲染影响。
- Scaling path: 优先在 `packages/compass-ui/src/select/select.tsx` 引入虚拟化；如果 `TreeSelect` 未来承载大树数据，再为 `packages/compass-ui/src/tree-select/tree-select.tsx` 增加异步加载和节点级缓存。

## 风险依赖

**`eslint-plugin-fsd-lint` 的 peer 约束与仓内实际测试环境脱节：**

- Risk: 包声明 `peerDependencies.eslint >=9.0.0`，但自身 `devDependencies.eslint` 仍是 `^8.0.0`，根仓库 `.eslintrc.js` 也是 ESLint 8 时代配置风格。
- Files: `packages/eslint-plugin-fsd-lint/package.json`, `packages/eslint-plugin-fsd-lint/test-project/eslint.config.js`, `.eslintrc.js`
- Impact: 对外承诺支持 ESLint 9，但仓内主路径并未以 ESLint 9 为默认开发环境，发布后容易出现“测试通过但用户接入失败”。
- Migration plan: 明确以 ESLint 9 为目标时，把开发依赖和根配置一并升级；否则下调 peer 范围并记录兼容矩阵。

**构建工具版本不统一：**

- Risk: `ai-chat` 使用 `tsup@8`，`compass-ui` 与 `compass-hooks` 使用 `tsup@7`，TypeScript 和打包语义漂移会增加排障成本。
- Files: `packages/ai-chat/package.json`, `packages/ai-chat/tsup.config.ts`, `packages/compass-ui/package.json`, `packages/compass-hooks/package.json`
- Impact: 同类问题在不同包上可能表现不一致，增加构建与产物差异的隐性成本。
- Migration plan: 统一打包工具主版本，并在根层记录共享构建约束。

## 缺失的关键能力

**缺少统一 CI / 发布预检流水线：**

- Problem: 仓库中未检测到 `.github/workflows` 或其他可见 CI 配置，发布前的 lint、test、build、changeset 校验仅靠本地脚本与人工执行。
- Blocks: 无法保证每次合并或发布都执行同一套验证；发布事故更依赖个人流程稳定性。

**应用层验证不完整：**

- Problem: `apps/ai-chat-demo` 没有 `lint` / `test` 脚本，`apps/docs` 没有 `test` 脚本，根 `turbo run test` 也不会为这些应用补齐质量闸门。
- Blocks: 示例应用和文档站可以在包测试全部通过时依旧失效，尤其是演示接线、环境变量和页面渲染问题。

**公共 API 防线不足：**

- Problem: 文档仍然暴露内部导入路径，仓内缺少自动检查“文档示例只能使用公开导出”的机制。
- Blocks: 发布后文档可信度下降，外部用户更容易依赖非稳定路径。

## 测试覆盖缺口

**`apps/docs` 基本无测试：**

- What's not tested: 文档首页渲染、依赖 `@xinghunm/compass-ui` 的页面集成、Next.js 构建后的可用性。
- Files: `apps/docs/pages/index.tsx`, `apps/docs/package.json`
- Risk: 文档站可能在组件库发布后仍保持表面可构建，但实际页面内容、导入路径或 SSR 行为已经失效。
- Priority: High

**`apps/ai-chat-demo` 只覆盖局部工具函数，没有覆盖主接线：**

- What's not tested: `App` 级别的 transport 装配、环境变量 fallback、`renderMessageBlock` 与问卷提交链路集成。
- Files: `apps/ai-chat-demo/src/App.tsx`, `apps/ai-chat-demo/src/approval-required-card.tsx`, `apps/ai-chat-demo/src/lib/pde-block-renderer.tsx`, `apps/ai-chat-demo/package.json`
- Risk: 示例应用很容易在包 API 调整后失效，但不会被根测试发现。
- Priority: High

**无障碍与键盘交互测试不足：**

- What's not tested: `Select` 的键盘导航、`TreeSelect` 焦点流、`Dropdown` / `Tooltip` 的 portal 关闭与焦点回收。
- Files: `packages/compass-ui/src/select/select.tsx`, `packages/compass-ui/src/tree-select/tree-select.tsx`, `packages/compass-ui/src/dropdown/dropdown.tsx`, `packages/compass-ui/src/tooltip/tooltip.tsx`
- Risk: 组件在鼠标场景下可用，但在键盘、读屏器和复杂嵌套容器里更容易出现回归。
- Priority: High

**发布链路没有自动化回归测试：**

- What's not tested: `changeset version` / `changeset publish` 之前的配置一致性、公开导出完整性、文档示例可消费性。
- Files: `.changeset/config.json`, `package.json`, `packages/compass-ui/docs/components/config-provider.md`, `packages/compass-ui/docs/components/tree-select.md`
- Risk: 版本发布和文档示例可能在本地脚本成功的情况下仍然产生错误产物或错误用法。
- Priority: High

**`eslint-plugin-fsd-lint` 对外兼容矩阵没有被充分验证：**

- What's not tested: 插件在 ESLint 9 主路径下的真实消费体验，以及和根仓 ESLint 8 配置并存时的回归边界。
- Files: `packages/eslint-plugin-fsd-lint/package.json`, `packages/eslint-plugin-fsd-lint/test-project/eslint.config.js`, `.eslintrc.js`
- Risk: 包本身声称的兼容范围与真实运行范围不一致，升级时容易出现隐蔽 breakage。
- Priority: Medium

---

_Concerns audit: 2026-04-13_
