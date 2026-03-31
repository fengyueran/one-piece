# AI Chat 通用层与业务层拆分实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将 `packages/ai-chat` 收敛为真正的通用聊天组件库，把 PDE 业务语义、业务协议适配和业务展示迁移到 `apps/ai-chat-demo`。

**Architecture:** `ai-chat` 只保留通用 message/block 类型、通用卡片组件、通用流式传输接口和扩展点；PDE 领域协议通过 demo 应用中的 `transformStreamPacket` 和 `renderMessageBlock` 适配为通用 block。组件命名、文件命名和导出面全部去业务化，避免包级别领域泄漏。

**Tech Stack:** React 18、TypeScript、Emotion、Jest、Vite Demo、自定义 SSE transport

---

### Task 1: 固化通用层与业务层边界

**Files:**

- Create: `docs/plans/2026-03-31-ai-chat-generic-business-split.md`
- Modify: `packages/ai-chat/src/types/index.ts`
- Modify: `packages/ai-chat/src/index.ts`
- Modify: `apps/ai-chat-demo/src/App.tsx`

**Step 1: 定义通用 block 边界**

明确 `ai-chat` 中允许保留的通用 block：

- `markdown`
- `notice`
- `parameter_summary`
- `confirmation_card`
- `result_summary`
- `questionnaire`
- `custom`

明确 PDE 相关内容不得直接进入通用包：

- PDE 前缀命名
- `PLAN_OPTIONS`、`approval_required` 等业务事件名
- PDE 专属文案与领域字段语义

**Step 2: 明确扩展点归属**

保留并强调两个扩展点：

- `transformStreamPacket`
- `renderMessageBlock`

要求所有业务协议适配优先在 demo / app 层完成，而不是继续在 `ai-chat` 内部硬编码。

**Step 3: 校验导出面**

检查 `packages/ai-chat/src/index.ts`，确保只导出通用组件和通用类型，不导出带业务语义的命名。

---

### Task 2: 去除通用组件中的 PDE 命名污染

**Files:**

- Modify: `packages/ai-chat/src/components/chat-thread/components/pde-ai-notice-card.tsx`
- Modify: `packages/ai-chat/src/components/chat-thread/components/pde-ai-parameter-summary-card.tsx`
- Modify: `packages/ai-chat/src/components/chat-thread/components/pde-ai-result-summary-card.tsx`
- Modify: `packages/ai-chat/src/components/chat-thread/components/pde-ai-execution-confirmation-card.tsx`
- Modify: `packages/ai-chat/src/components/chat-thread/components/pde-ai-questionnaire-card.tsx`
- Modify: `packages/ai-chat/src/components/chat-thread/components/chat-message-item.tsx`

**Step 1: 重命名文件为中性名称**

按 kebab-case 改为：

- `notice-card.tsx`
- `parameter-summary-card.tsx`
- `result-summary-card.tsx`
- `execution-confirmation-card.tsx`
- `questionnaire-card.tsx`

**Step 2: 重命名组件符号**

对应组件名改为：

- `NoticeCard`
- `ParameterSummaryCard`
- `ResultSummaryCard`
- `ExecutionConfirmationCard`
- `QuestionnaireCard`

**Step 3: 更新 `chat-message-item.tsx` 引用**

移除 `PDEAI*` import，改为中性命名 import。  
保持现有 block 渲染逻辑不变，只做命名和职责去业务化。

**Step 4: 保持通用行为不回退**

保留现有：

- questionnaire 提交行为
- confirmation 交互行为
- summary / notice 展示能力

避免“为了去业务化而删通用能力”。

---

### Task 3: 将 PDE 业务协议适配迁移到 Demo 应用

**Files:**

- Modify: `apps/ai-chat-demo/src/App.tsx`
- Create: `apps/ai-chat-demo/src/lib/pde-stream-transform.ts`
- Create: `apps/ai-chat-demo/src/lib/pde-block-renderer.tsx`
- Create: `apps/ai-chat-demo/src/lib/pde-plan-options.ts`

**Step 1: 抽离 demo 中已有业务适配**

把当前 `App.tsx` 中的：

- `approval_required` 判断
- `transformStreamPacket`
- `renderMessageBlock`

迁移到独立文件，避免 demo 根组件堆叠业务解析逻辑。

**Step 2: 增加 PDE 计划模式适配入口**

新增对计划模式业务事件的映射层，目标是让 demo 负责把 PDE 返回转为通用 block，例如：

- `PLAN_OPTIONS` -> `questionnaire`
- PDE 执行确认事件 -> `confirmation_card`
- PDE 摘要事件 -> `result_summary` / `parameter_summary`

**Step 3: 保持 `ai-chat` 对业务协议无感**

所有类似 `PLAN_OPTIONS`、`approval_required` 的业务事件，都只允许在 demo 层识别与转换。

---

### Task 4: 调整流协议实现方向

**Files:**

- Modify: `packages/ai-chat/src/api/chat-stream.ts`
- Modify: `packages/ai-chat/src/transport/default-chat-transport.ts`
- Modify: `apps/ai-chat-demo/src/lib/pde-stream-transform.ts`

**Step 1: 保持默认 transport 只做通用解析**

默认解析器只负责：

- `payload[].delta.content` -> 文本流
- `data.blocks` -> 已结构化 block

不在通用层硬编码 PDE 的 `PLAN_OPTIONS`。

**Step 2: 在业务层定义新的业务事件协议**

优先采用显式 `type` 而不是把 JSON 混进 `content`：

- `plan_options`
- `approval_required`
- `execution_confirmation`

由 demo 层把这些事件映射到通用 block。

**Step 3: 如后端暂时未改协议**

在 demo 层容忍过渡方案，但过渡解析只能存在于 demo 中，不能回流到 `ai-chat` 通用包。

---

### Task 5: 更新测试覆盖

**Files:**

- Modify: `packages/ai-chat/src/__tests__/components/chat-message-item.test.tsx`
- Modify: `packages/ai-chat/src/__tests__/components/chat-thread.test.tsx`
- Modify: `packages/ai-chat/src/__tests__/hooks/use-chat-composer.test.tsx`
- Modify: `packages/ai-chat/src/__tests__/transport/default-chat-transport.test.ts`
- Create: `apps/ai-chat-demo/src/**/*.test.ts(x)`（如 demo 已配置测试）

**Step 1: 修正重命名后的组件测试引用**

将测试中的 `PDEAI*` 相关引用同步到中性命名。

**Step 2: 增加“通用层不认业务事件”的测试**

验证默认 transport 不会把 PDE 业务事件直接耦进通用层。

**Step 3: 增加“demo 层完成业务映射”的测试**

验证 demo 的 `transformStreamPacket` 可以把业务事件转成：

- `custom`
- `questionnaire`
- `confirmation_card`

---

### Task 6: 验证与收尾

**Files:**

- Modify: `packages/ai-chat/src/index.ts`
- Modify: `apps/ai-chat-demo/src/App.tsx`

**Step 1: 运行通用包测试**

Run:

```bash
pnpm --filter @xinghunm/ai-chat test -- --runInBand
```

Expected:

- 所有 `ai-chat` 单测通过

**Step 2: 运行 demo 构建**

Run:

```bash
pnpm --filter @one-piece/ai-chat-demo build
```

Expected:

- demo 构建通过
- `App.tsx` 正常引用抽离后的业务适配层

**Step 3: 人工检查命名与边界**

检查：

- `packages/ai-chat/src` 中不存在 `pde-ai-*` 文件
- `packages/ai-chat` 中不存在 PDE 命名组件符号
- 业务适配逻辑仅出现在 `apps/ai-chat-demo`
