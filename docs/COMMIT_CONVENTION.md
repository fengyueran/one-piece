# Git Commit 规范

本项目采用 [Conventional Commits](https://www.conventionalcommits.org/) 规范来标准化 commit 消息格式。

## Commit 消息格式

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Type 类型

- **feat**: 新功能 (feature)
- **fix**: 修复 bug
- **docs**: 文档更新
- **style**: 代码格式化，不影响代码运行的变动
- **refactor**: 重构，既不是新增功能，也不是修复 bug 的代码变动
- **perf**: 性能优化
- **test**: 增加测试或修改测试
- **chore**: 构建过程或辅助工具的变动
- **ci**: CI/CD 相关的变动
- **build**: 影响构建系统或外部依赖的变动
- **revert**: 回滚之前的 commit

### Scope 范围（可选）

用于说明 commit 影响的范围，比如：

- `ui-components`: UI组件库相关
- `utils`: 工具库相关
- `docs`: 文档相关
- `build`: 构建相关

### 示例

```bash
# 新功能
feat(ui-components): 添加 Button 组件的 loading 状态

# 修复 bug
fix(utils): 修复 formatDate 函数的时区问题

# 文档更新
docs: 更新 README 中的安装说明

# 重构
refactor(ui-components): 重构 Button 组件的样式系统

# 性能优化
perf(utils): 优化数组处理函数的性能

# 构建相关
chore: 升级依赖版本
```

## 规则说明

1. **type** 必须是小写
2. **description** 不能为空
3. **description** 不能以句号结尾
4. 整个 header 不能超过 100 个字符
5. 如果有 breaking change，需要在 footer 中说明

## 工具配置

项目已配置以下工具来确保 commit 规范：

- **Commitlint**: 验证 commit 消息格式
- **Husky**: 管理 git hooks
- **Lint-staged**: 在提交前运行代码检查

当你提交代码时，系统会自动：

1. 运行 `lint-staged` 检查和格式化代码
2. 验证 commit 消息是否符合规范

如果不符合规范，提交将被拒绝，请按照提示修改后重新提交。
