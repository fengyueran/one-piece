---
name: changeset-release
description: 说明此 pnpm monorepo 的 Changesets 发版流程。用于在当前仓库中准备或执行包发布，包括按包创建 changeset、提交发版元数据、运行 `pnpm version-packages`、检查版本与 CHANGELOG 变更，以及在明确授权后执行 `pnpm release`。
---

# Changeset 发版

## 概览

使用这个 skill 在当前仓库中执行基于 `pnpm` 和 Changesets 的发版流程。
默认保持“一个 changeset 只描述一个包的变更”，让 changelog 更清晰、更易审阅。

## 工作流

1. 先确认用户要执行的阶段：创建 changeset、升级版本，还是正式发布。
2. 始终在仓库根目录执行命令，确保 Changesets 和 Turbo 脚本解析正确。
3. 在版本升级或发布前，先运行 `python3 .codex/skills/changeset-release/scripts/release_snapshot.py`，汇总包信息、工作区依赖和待处理 changeset。
4. 在 `pnpm release` 前必须停下并单独确认，因为这一步会把包真正发布到 npm。
5. 不得把“创建 changeset”“执行 `pnpm version-packages`”或笼统的“帮我发版”理解为运行 `pnpm release` 的授权；只有用户在当前上下文中明确二次确认“现在执行发布”后，才能继续。

## 发布快照

- 在任何发版动作前，都先从仓库根目录运行 `python3 .codex/skills/changeset-release/scripts/release_snapshot.py`。
- 当结构化输出更有用时，使用 `python3 .codex/skills/changeset-release/scripts/release_snapshot.py --json`。
- 在创建 changeset、执行 `pnpm version-packages`、执行 `pnpm release` 之前，都先阅读快照输出。
- 用快照明确说明：
  - 哪些包可发布
  - 当前各包版本号
  - 工作区依赖关系，例如 `@xinghunm/compass-ui -> @xinghunm/compass-hooks`
  - 是否存在待处理的 `.changeset/*.md` 文件

## 忽略的包

以下包已在 `.changeset/config.json` 的 `ignore` 中配置，不参与 changeset 发版流程：

- `@one-piece/docs` — 文档站点
- `@one-piece/ai-chat-demo` — AI Chat 演示应用

为这些包创建 changeset 或升级版本时，Changesets 会自动跳过它们。如果用户要求为被忽略的包发版，需先说明该包已被排除，并确认是否要调整 `ignore` 配置。

## 创建 Changeset

- 运行 `pnpm changeset`。
- 在写摘要前，先根据真实内容建立上下文，不要凭感觉概括。至少检查目标包相关的 `git log`、`git diff --name-only`、必要时再看 `git show --stat`。
- 摘要必须基于真实提交和真实文件变更生成，优先描述用户可感知的变化；不要臆造功能点，也不要把内部改动包装成不存在的用户价值。
- 如果变更主要是文档、示例、Storybook、测试或内部整理，就如实写清楚，不要误写成组件能力新增。
- 如果多个包都有改动，优先多次运行该命令，而不是把无关更新混进同一个 changeset。
- 保持一个包对应一个 changeset。例如，将 `compass-ui` 的组件变更与 `compass-hooks` 的 Hook 变更分开描述。
- 生成后检查 `.changeset/*.md`，确保每个文件都只描述一个包的用户可感知变更。

## 提交 Changeset

- 在团队协作或 CI 发版场景下，先提交 `.changeset` 文件，再做版本升级。
- 使用：

```bash
git add .changeset
git commit -m "chore: add changesets"
```

- 如果用户明确是在本地做一次性快速发版，并且马上执行版本升级，可以跳过这次中间提交。

## 升级版本

- 运行 `pnpm version-packages`。
- 检查所有生成的变更，重点关注：
  - 各包 `package.json` 中的版本号更新
  - 各包 `CHANGELOG.md` 的内容更新
  - 被消费并删除的 `.changeset` 文件
- 提交版本号和 changelog 产物：

```bash
git add .
git commit -m "chore: release version packages"
```

## 发布

- 只有在用户单独明确允许时才运行 `pnpm release`。
- 这里的“单独明确允许”指：在完成发布前检查、展示快照或总结待发布包之后，单独发起一次确认，并得到用户当前消息中的明确同意。
- 不得把前面的 changeset 创建、版本升级、提交版本产物，或笼统的“执行发版流程”视为 `pnpm release` 的授权。
- 如果当前分支是 `main`、`master`，或是已跟踪远端的发布分支，仍然必须执行这次单独确认，不能省略。
- 当前仓库中的 `pnpm release` 定义为：

```bash
turbo run lint test build --filter=./packages/* && changeset publish
```

- 只有命令成功退出，才能说明发布成功。
- 如果发布失败，要明确指出失败发生在 lint、test、build，还是 `changeset publish` 阶段。

## 验证

- 在版本升级前，先总结受影响的包。
- 在 `pnpm version-packages` 之后，总结最终的版本变更和 changelog 变化。
- 在 `pnpm release` 之后，汇报已发布的包，或说明阻塞发布的错误。
- 修改 bundled script 后必须实际测试。对这个 skill，至少运行一次 `python3 .codex/skills/changeset-release/scripts/release_snapshot.py`，并确认命令成功退出。
- 需要更完整的项目约定与示例时，读取 [references/release-flow.md](references/release-flow.md)。
