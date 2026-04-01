# @xinghunm/ai-chat

## 1.0.1

### Patch Changes

- 修复了流式更新场景下自定义消息块的合并行为。带有稳定 `blockKey` 的自定义块现在可以按策略选择替换旧块、忽略重复块，避免审批卡片等内容在更新时重复堆积或丢失锚点。

## 1.0.0

### Major Changes

- a260642: 本次 `@xinghunm/ai-chat` 相对 `@xinghunm/ai-chat@0.4.0` 的更新主要包括：
  - 将结构化执行与结果摘要类型从 PDE 领域命名调整为通用命名：
    - `ExecutionProposal.equationKey` -> `resourceKey`
    - `ExecutionProposal.equationName` -> `resourceName`
    - `ExecutionProposal.solverName` -> `executorName`
    - `ResultSummary.taskId` -> `summaryId`
  - 改进 plan 问卷交互，补充过期问卷处理与相关状态展示。
  - 用户消息改为纯文本渲染，避免粘贴 Markdown、公式或长文本时被误解析。
  - 长用户消息支持默认折叠、长文本自动换行，以及输入框按内容自动增高和手动展开。
  - 输入区布局调整为更稳定的面板式布局，并限制最大宽度以改善阅读与编辑体验。

  这是一次 breaking change。若宿主应用消费了结构化消息类型，需要先完成字段映射适配，再升级到这个版本。

## 0.4.0

### Minor Changes

- 新增 `messageRenderOrder="timeline"` 配置，支持按时间线顺序混排文本与结构化消息块。
- 修复审批卡等自定义消息块在流式输出中的插入位置、显隐切换和完成态回退问题。
- 保留卡片前后 markdown 文本的段落结构、reveal 效果以及时间线锚点稳定性。

## 0.2.2

### Patch Changes

- 66343ee: - 修复对话流式渲染时新增内容跳动的问题
  - 让最新一轮对话在发送后更稳定地贴近对话区顶部展示
  - 点击停止后，停止按钮会显示加载中的 spinner，明确反馈停止请求正在处理中

## 0.2.1

### Patch Changes

- 修复流式消息同时携带 markdown blocks 时会跳过逐步 reveal 的问题，恢复聊天内容的打字机显示效果。

  同时补充回归测试，覆盖流式 reveal 和 markdown block 共存场景。

## 0.2.0

### Minor Changes

- 新增基于 `ChatTransport` 的流式聊天接入能力，扩展公共导出，并支持通过 `renderMessageBlock` 自定义消息块渲染。

  同时优化聊天输入区和线程展示，并修复流式消息展示回退等问题。
