# Compass UI Component Theme Tokenization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为新增高频组件补齐组件级主题 token，使它们不仅能跟随全局 token，还能通过 `components.*` 做精细化配置。

**Architecture:** 计划分两轮完成。第一轮覆盖 `P0 + P1` 组件：`checkbox / radio / switch / alert / empty / skeleton / spin-loading`；第二轮覆盖 `P2` overlay 组件：`popover / popconfirm / drawer`。实现方式统一为三层收口：先扩展 `Theme` 类型与 `defaultTheme`，再让样式文件走 `components.xxx.* -> 全局 token -> 字面默认值` 的 fallback 链，最后用 `ThemeProvider` 合并测试与受影响组件测试验证行为不回退。

**Tech Stack:** React 18, TypeScript, Emotion, Jest, Dumi, tsup

---

### Task 1: 扩展主题测试基线

**Files:**

- Modify: `packages/compass-ui/src/theme/theme-provider.test.tsx`

**Step 1: 写失败测试**

- 为 `checkbox / switch / alert / empty / skeleton / spin-loading` 增加 `components.*` 合并断言。
- 重点验证：只覆盖某几个组件 token 时，其它默认主题字段仍保留。

**Step 2: 运行测试确认 RED**

Run: `pnpm --filter @xinghunm/compass-ui test -- --runInBand src/theme/theme-provider.test.tsx`
Expected: FAIL，提示新增组件 token 字段不存在或无法读取。

### Task 2: 扩展 Theme 类型与默认主题

**Files:**

- Modify: `packages/compass-ui/src/theme/types.ts`
- Modify: `packages/compass-ui/src/theme/default-theme.ts`

**Step 1: 在 Theme 类型里新增组件级主题结构**

- `CheckboxTheme`
- `RadioTheme`
- `SwitchTheme`
- `AlertTheme`
- `EmptyTheme`
- `SkeletonTheme`
- `SpinLoadingTheme`

**Step 2: 在 `Theme.components` 上注册这些新主题**

- 保持命名与组件目录一致，避免缩写和歧义。

**Step 3: 在 `defaultTheme.components` 中补默认值**

- 尺寸相关值统一按 `small / medium / large` 分层。
- 焦点高亮单独保留 `focusRingColor`。
- 反馈类组件按结构性 token 而不是大而全设计。

### Task 3: 为布尔控件接入组件级 token

**Files:**

- Modify: `packages/compass-ui/src/checkbox/checkbox.styles.ts`
- Modify: `packages/compass-ui/src/radio/radio.styles.ts`
- Modify: `packages/compass-ui/src/switch/switch.styles.ts`

**Step 1: 让尺寸、颜色、焦点环先走组件级 token**

- `checkbox`: 尺寸、边框、选中背景、禁用背景、icon 色、label 色、focus ring
- `radio`: 尺寸、圆点尺寸、边框、圆点颜色、label 色、focus ring
- `switch`: 轨道宽高、thumb 尺寸、thumb 位移、选中/未选中背景、thumb 背景、label 色、focus ring

**Step 2: 保持全局 token fallback**

- 组件级 token 没给值时，不改变当前默认观感。

### Task 4: 为状态组件接入组件级 token

**Files:**

- Modify: `packages/compass-ui/src/alert/alert.styles.ts`
- Modify: `packages/compass-ui/src/empty/empty.styles.ts`
- Modify: `packages/compass-ui/src/skeleton/skeleton.styles.ts`
- Modify: `packages/compass-ui/src/spin-loading/spin-loading.styles.ts`

**Step 1: 把结构性样式切到组件级 token**

- `alert`: padding、borderRadius、title/description 色、iconSize、close/focus ring、type-level bg/border/accent
- `empty`: padding、gap、image size、title/description 色、action gap
- `skeleton`: gap、avatarSize、rowGap、blockHeight、base/shimmer 色、radius
- `spin-loading`: indicatorColor、tipColor、overlayBg、overlayBlur、size

**Step 2: 不扩大到 overlay 组件**

- `popover / drawer / popconfirm` 仍留到下一轮。

### Task 5: 验证

**Files:**

- Modify: any touched file if verification exposes issues

**Step 1: 跑主题测试**

Run: `pnpm --filter @xinghunm/compass-ui test -- --runInBand src/theme/theme-provider.test.tsx`
Expected: PASS

**Step 2: 跑受影响组件测试**

Run: `pnpm --filter @xinghunm/compass-ui test -- --runInBand src/checkbox/checkbox.test.tsx src/radio/radio.test.tsx src/switch/switch.test.tsx src/alert/alert.test.tsx src/empty/empty.test.tsx src/skeleton/skeleton.test.tsx src/spin-loading/spin-loading.test.tsx`
Expected: PASS

**Step 3: 跑构建**

Run: `pnpm --filter @xinghunm/compass-ui build`
Expected: PASS

**Step 4: 跑文档校验**

Run: `pnpm run docs:verify:compass-ui`
Expected: PASS（允许已知 `.dumirc.ts` 与 `Browserslist` warning）

### Task 6: 为 overlay 组件补组件级 token

**Files:**

- Modify: `packages/compass-ui/src/theme/types.ts`
- Modify: `packages/compass-ui/src/theme/default-theme.ts`
- Modify: `packages/compass-ui/src/theme/theme-provider.test.tsx`
- Modify: `packages/compass-ui/src/popover/popover.styles.ts`
- Modify: `packages/compass-ui/src/popconfirm/popconfirm.styles.ts`
- Modify: `packages/compass-ui/src/drawer/drawer.styles.ts`

**Step 1: 扩展 overlay 主题结构**

- `PopoverTheme`
- `PopconfirmTheme`
- `DrawerTheme`

**Step 2: 在默认主题补齐默认值**

- `Popover`: padding、标题/正文颜色字号、最小/最大宽度
- `Popconfirm`: 最小宽度、描述间距、按钮区间距
- `Drawer`: zIndex、maskColor、backdropBlur、contentBg、boxShadow、header/body/footer padding、titleColor、borderColor

**Step 3: 让样式文件接入组件级 token**

- `popover` 保留现有 `components.popover.*`，补全遗漏字段并统一命名
- `popconfirm` 新增 `components.popconfirm.*`
- `drawer` 从临时复用 `components.modal.*` 迁移到 `components.drawer.*`，保留全局 fallback

**Step 4: 增加主题合并验证**

Run: `pnpm --filter @xinghunm/compass-ui test -- --runInBand src/theme/theme-provider.test.tsx`
Expected: PASS，并验证 overlay 新 token 可被 `ThemeProvider` 合并。

**Step 5: 跑 overlay 相关测试与构建**

Run: `pnpm --filter @xinghunm/compass-ui test -- --runInBand src/popover/popover.test.tsx src/popconfirm/popconfirm.test.tsx src/drawer/drawer.test.tsx`
Expected: PASS

Run: `pnpm --filter @xinghunm/compass-ui build`
Expected: PASS
