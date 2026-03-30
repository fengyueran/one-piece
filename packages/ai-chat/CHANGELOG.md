# @xinghunm/ai-chat

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
