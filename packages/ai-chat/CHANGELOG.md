# @xinghunm/ai-chat

## 0.2.1

### Patch Changes

- 修复流式消息同时携带 markdown blocks 时会跳过逐步 reveal 的问题，恢复聊天内容的打字机显示效果。

  同时补充回归测试，覆盖流式 reveal 和 markdown block 共存场景。

## 0.2.0

### Minor Changes

- 新增基于 `ChatTransport` 的流式聊天接入能力，扩展公共导出，并支持通过 `renderMessageBlock` 自定义消息块渲染。

  同时优化聊天输入区和线程展示，并修复流式消息展示回退等问题。
