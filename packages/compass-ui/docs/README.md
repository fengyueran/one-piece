# Compass UI 文档入口说明

`packages/compass-ui/docs/` 是 `compass-ui` 当前唯一的对外文档入口，dumi 首页、组件目录、安装指南和 API 说明都从这里发布。

## 对外入口

- 首页：[`docs/index.md`](./index.md)
- 安装指南：[`docs/guide/getting-started.md`](./guide/getting-started.md)
- 组件目录：[`docs/components/index.md`](./components/index.md)
- API 参考：[`docs/API.md`](./API.md)

上面 4 个页面共同承担外部用户入口职责，内容必须保持一致：

- 首页负责回答“这是什么、先看哪里”
- 安装指南负责回答“怎么安装、怎么开始用”
- 组件目录负责回答“现在有哪些公开组件可以用”
- API 参考负责回答“哪些导入路径属于正式公开契约”

## 面向维护者的文档

以下文档用于维护和扩展组件库，不属于对外产品入口：

- [开发指南](./DEVELOPMENT.md)
- `docs/components/*.md` 中的具体组件页面

维护文档可以解释实现约束、测试方式和发布流程，但不能与首页和安装指南形成第二套对外叙事。

## 文档编写约束

- 所有示例只使用 `@xinghunm/compass-ui` 与已声明的公开子路径。
- 不在文档中引用 `src/`、`dist/` 或仅在仓库 alias 下成立的导入路径。
- 不新增 `apps/docs`、Storybook 或其他第二入口链接。
- 组件文档只描述已经实现且有验证支撑的行为，尤其是键盘和可访问性说明。

## 本地命令

```bash
# 启动文档站
pnpm --filter @xinghunm/compass-ui docs:dev

# 构建文档站
pnpm --filter @xinghunm/compass-ui docs:build

# 运行文档验证
pnpm run docs:verify:compass-ui
```
