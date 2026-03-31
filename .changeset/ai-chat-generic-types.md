---
'@xinghunm/ai-chat': major
---

将 `@xinghunm/ai-chat` 的结构化执行与结果摘要类型从 PDE 领域命名调整为通用命名：

- `ExecutionProposal.equationKey` -> `resourceKey`
- `ExecutionProposal.equationName` -> `resourceName`
- `ExecutionProposal.solverName` -> `executorName`
- `ResultSummary.taskId` -> `summaryId`

这是一处 breaking change。业务协议适配需要在应用层完成字段映射后，再传入通用 `ChatMessageBlock`。
