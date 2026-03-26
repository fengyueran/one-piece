# 发版流程

## 适用范围

当前仓库使用 `pnpm` 和 Changesets 管理包发布。
所有发版相关命令都应在仓库根目录执行。

## 推荐的第一步

在创建 changeset、升级版本或正式发布之前，先运行：

```bash
python3 .codex/skills/changeset-release/scripts/release_snapshot.py
```

用这份输出先确认：

- 当前包版本
- 可发布包列表
- 工作区依赖关系
- 待处理的 `.changeset` 文件

## 1. 创建 Changeset

当开发完成且用户希望准备发版时，运行：

```bash
pnpm changeset
```

在填写 changeset 摘要之前，先基于真实变更建立上下文：

- 用 `git log master..HEAD -- packages/<target>` 看目标包对应的提交
- 用 `git diff --name-only master...HEAD -- packages/<target>` 看真实改动范围
- 必要时用 `git show --stat <commit> -- packages/<target>` 补充细节

摘要要忠实反映真实内容，优先描述用户可感知的变化；如果这次主要是文档、示例、Storybook 或内部整理，也必须如实写明，不能夸大成不存在的新功能。

### 多包场景建议

如果不止一个包发生变更，优先多次运行该命令。

- 第一次运行：只选择 `compass-ui`，填写 UI 相关的变更说明。
- 第二次运行：只选择 `compass-hooks`，填写 Hooks 相关的变更说明。

这样可以让每个包的 changelog 更聚焦，避免把无关的发布说明混在一起。

## 2. 提交 Changeset

在团队协作或 CI 驱动的发版流程中，需要先提交生成的 `.changeset/*.md` 文件：

```bash
git add .changeset
git commit -m "chore: add changesets"
```

如果用户是在本地做快速发版，并且想直接进入版本升级，这一步可以跳过。

## 3. 升级版本

运行：

```bash
pnpm version-packages
```

这一步会消费 `.changeset` 文件，更新受影响包的版本号，并生成 changelog 条目。

建议重点检查：

- `package.json` 中的版本号变化
- 自动生成的 `CHANGELOG.md`
- 被删除的 `.changeset` 文件

然后提交结果：

```bash
git add .
git commit -m "chore: release version packages"
```

## 4. 发布

运行：

```bash
pnpm release
```

在当前仓库中，这个脚本会先对 `./packages/*` 执行 lint、test 和 build，然后再执行 `changeset publish`。

只有在用户明确授权时才执行发布，因为这一步会真正把包发布到 npm。
