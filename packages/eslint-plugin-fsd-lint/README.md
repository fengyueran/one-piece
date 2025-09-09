# @xinghunm/eslint-plugin-fsd-lint

[![npm version](https://badge.fury.io/js/@xinghunm%2Feslint-plugin-fsd-lint.svg)](https://badge.fury.io/js/@xinghunm%2Feslint-plugin-fsd-lint)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

基于特性分层设计架构原则（FSD）的前端项目结构验证 ESLint 插件。

## 安装

```bash
npm install --save-dev @xinghunm/eslint-plugin-fsd-lint
# 或者
yarn add --dev @xinghunm/eslint-plugin-fsd-lint
# 或者
pnpm add --save-dev @xinghunm/eslint-plugin-fsd-lint
```

## 快速开始

### 基础配置

将插件添加到你的 ESLint 配置中：

**`.eslintrc.js` (ESLint 8.x 及以下版本)**

```javascript
module.exports = {
  plugins: ['@xinghunm/fsd-lint'],
  extends: ['plugin:@xinghunm/fsd-lint/recommended'],
}
```

**`eslint.config.js` (ESLint 9.0+)**

```javascript
import fsdLint from '@xinghunm/eslint-plugin-fsd-lint'

export default [
  {
    plugins: {
      '@xinghunm/fsd-lint': fsdLint,
    },
    rules: {
      // 严格模式把 recommended 换成 strict 就行。
      ...fsdLint.configs.recommended.rules,
    },
  },
]
```

### 手动配置

如果你希望手动配置规则：

```javascript
// eslint.config.js
import fsdLint from '@xinghunm/eslint-plugin-fsd-lint'

export default [
  {
    plugins: {
      '@xinghunm/fsd-lint': fsdLint,
    },
    rules: {
      '@xinghunm/fsd-lint/layer-dependency': 'error',
      '@xinghunm/fsd-lint/same-layer-isolation': 'error',
      '@xinghunm/fsd-lint/public-api-only': 'error',
      '@xinghunm/fsd-lint/folder-structure': 'warn',
      '@xinghunm/fsd-lint/naming-convention': 'warn',
    },
  },
]
```

### 可用配置

- `plugin:@xinghunm/fsd-lint/recommended` - 推荐配置，包含以下规则:

  ```js
  {
    '@xinghunm/fsd-lint/layer-dependency': 'error',
    '@xinghunm/fsd-lint/same-layer-isolation': 'error',
    '@xinghunm/fsd-lint/public-api-only': 'error',
    '@xinghunm/fsd-lint/folder-structure': 'warn',
    '@xinghunm/fsd-lint/naming-convention': 'warn'
  }
  ```

- `plugin:@xinghunm/fsd-lint/strict` - 严格配置，所有规则都设置为 'error':

  ```js
  {
    '@xinghunm/fsd-lint/layer-dependency': 'error',
    '@xinghunm/fsd-lint/same-layer-isolation': 'error',
    '@xinghunm/fsd-lint/public-api-only': 'error',
    '@xinghunm/fsd-lint/folder-structure': 'error',
    '@xinghunm/fsd-lint/naming-convention': 'error'
  }
  ```

## 全局配置选项

插件支持通过 ESLint 的 `settings` 配置全局选项，这些选项会影响所有规则的行为：

### `srcRootDir`

指定 FSD 项目的根目录绝对路径。当你的项目结构不是标准的 `src/` 目录时，可以通过此选项指定实际的 FSD 根目录。

```javascript
// eslint.config.js
export default [
  {
    plugins: {
      '@xinghunm/fsd-lint': fsdLint,
    },
    settings: {
      'fsd-lint': {
        srcRootDir: '/absolute/path/to/your/fsd/root', // 例如：'/Users/username/project/apps/web/src'
      },
    },
    rules: {
      ...fsdLint.configs.recommended.rules,
    },
  },
]
```

**使用场景：**

- 项目使用非标准目录结构（如 `apps/web/src/`、`packages/frontend/src/` 等）
- 多包项目中需要为不同包指定不同的 FSD 根目录
- 项目根目录不叫 `src`（如 `source/`、`client/` 等）

### `pathAliases`

配置路径别名映射，用于解析 `@/` 或其他自定义别名的导入路径。

```javascript
// eslint.config.js
export default [
  {
    plugins: {
      '@xinghunm/fsd-lint': fsdLint,
    },
    settings: {
      'fsd-lint': {
        pathAliases: {
          '@/': '/absolute/path/to/src', // 标准 @ 别名
          '~/': '/absolute/path/to/src', // 自定义 ~ 别名
          'components/': '/absolute/path/to/src/shared/ui', // 组件别名
        },
      },
    },
    rules: {
      ...fsdLint.configs.recommended.rules,
    },
  },
]
```

**使用场景：**

- 项目使用 `@/` 别名指向 src 目录
- 使用 Vite、Webpack 等构建工具的路径别名
- 需要支持多个自定义别名的复杂项目

### 完整配置示例

```javascript
// eslint.config.js
import fsdLint from '@xinghunm/eslint-plugin-fsd-lint'
import { resolve } from 'path'

export default [
  {
    plugins: {
      '@xinghunm/fsd-lint': fsdLint,
    },
    settings: {
      'fsd-lint': {
        // 指定 FSD 根目录
        srcRootDir: resolve(__dirname, 'src'),
        // 配置路径别名
        pathAliases: {
          '@/': resolve(__dirname, 'src'),
        },
      },
    },
    rules: {
      ...fsdLint.configs.recommended.rules,
    },
  },
]
```

**注意事项：**

- `srcRootDir` 和 `pathAliases` 中的路径必须是绝对路径
- 如果不配置这些选项，插件会自动检测项目结构（查找 `src` 目录或 FSD 层级目录）
- 配置了 `srcRootDir` 后，插件将优先使用该路径而不是自动检测

## 规则详解

本插件提供 5 个核心规则，确保你的项目严格遵循 FSD 架构原则：

### `@xinghunm/fsd-lint/layer-dependency`

强制执行 FSD 层级依赖约束。低层级不能从高层级导入。

#### 规则说明

此规则检查所有的 import 和 require 语句，确保：**低层级不能从高层级导入模块**。

**层级结构（从高到低）：**

```text
  ┌─────────────┐
  │    app/     │ ← level 6：最上层，应用入口，可以使用所有下层
  └─────────────┘
        ↓
  ┌─────────────┐
  │   pages/    │ ← level 5：页面层，可以使用下面4层
  └─────────────┘
        ↓
  ┌─────────────┐
  │  widgets/   │ ← level 4：组件层，可以使用下面3层
  └─────────────┘
        ↓
  ┌─────────────┐
  │ features/   │ ← level 3：功能层，可以使用下面2层
  └─────────────┘
        ↓
  ┌─────────────┐
  │ entities/   │ ← level 2：实体层，只能使用最下层
  └─────────────┘
        ↓
  ┌─────────────┐
  │  shared/    │ ← level 1：最下层，共享层，不依赖任何上层
  └─────────────┘
```

#### layer-dependency 配置选项

```javascript
// 禁用规则的配置
// eslint.config.js
export default [
  {
    plugins: {
      '@xinghunm/fsd-lint': fsdLintPlugin,
    },
    rules: {
      '@xinghunm/fsd-lint/layer-dependency': [
        'error',
        {
          enabled: false, // 默认为 true，设置为 false 可禁用此规则
        },
      ],
    },
  },
]
```

#### layer-dependency 错误示例

```javascript
// 在 shared/ui/Button.jsx 中
import { UserCard } from 'entities/user' // shared (level 1) 不能从 entities (level 2) 导入
const { AuthFeature } = require('features/auth') // shared 不能从 features 导入

// 在 entities/user/model/user.js 中
import { LoginForm } from 'features/auth' // entities (level 2) 不能从 features (level 3) 导入

// 在 features/auth/ui/LoginForm.jsx 中
import { Header } from 'widgets/header' // features (level 3) 不能从 widgets (level 4) 导入
const { HomePage } = require('pages/home') // features 不能从 pages 导入
```

#### layer-dependency 正确示例

```javascript
// 在 features/auth/ui/LoginForm.jsx 中
import { Button } from 'shared/ui' // features 可以从 shared 导入
import { User } from 'entities/user' // features 可以从 entities 导入
const { api } = require('shared/api') // 支持 require 语法

// 在 widgets/header/ui/Header.jsx 中
import { AuthFeature } from 'features/auth' // widgets 可以从 features 导入
import { UserEntity } from 'entities/user' // widgets 可以从 entities 导入
import { Button } from 'shared/ui' // widgets 可以从 shared 导入

// 在 pages/home/ui/HomePage.jsx 中
import { HeaderWidget } from 'widgets/header' // pages 可以从 widgets 导入

// 在 app/App.jsx 中
import { HomePage } from 'pages/home' // app 可以从 pages 导入
```

### `@xinghunm/fsd-lint/same-layer-isolation`

同一层级的不同切片（slice）之间应该保持隔离，不能直接相互导入。

**规则说明：**

- 同一层级（features、widgets、pages）的不同切片之间不能相互导入
- 可以从更低层级导入（如 features 可以导入 entities 和 shared）
- 可以在同一切片内部进行导入
- 可以导入外部依赖包
- 规则仅对 features、widgets、pages 三个层级生效，其他层级不受此规则约束

**配置选项：**

```javascript
// eslint.config.js
export default [
  {
    plugins: {
      '@xinghunm/fsd-lint': fsdLintPlugin,
    },
    rules: {
      '@xinghunm/fsd-lint/same-layer-isolation': [
        'error',
        {
          enabled: false, // 默认为 true，设置为 false 可禁用此规则
        },
      ],
    },
  },
]
```

**错误示例：**

```javascript
// 在 features/auth/model/index.js 中
import { profileModel } from 'features/profile/model' // 直接从同级模块导入
const { cartLogic } = require('features/cart/model') // require 同级模块也不允许

// 在 widgets/header/ui/Header.js 中
import { CartWidget } from 'widgets/cart' //  widgets 层内部模块互相导入

// 在 pages/about/ui/AboutPage.js 中
import { HomePage } from 'pages/home' // pages 层内部模块互相导入
```

**正确示例：**

```javascript
// 在 features/auth/model/index.js 中
import { User } from 'entities/user' // 从低层级导入
import { api } from 'shared/api' // 从 shared 层导入
const { Button } = require('shared/ui/button') // require shared 层模块

// 在同一模块内部导入
import { AuthModel } from '../model/auth' // 同一切片内部导入
import { utils } from './utils' // 相对路径导入

// 导入外部包
import { external } from 'external-package' // 外部依赖包
```

### `@xinghunm/fsd-lint/public-api-only`

强制使用公共 API（index 文件）而不是直接从模块内部导入，确保模块之间的松耦合和更好的封装性。

#### public-api-only规则说明

此规则检查所有的 import 和 require 语句，确保：

- **跨模块导入必须使用公共 API** - 从其他 FSD 模块导入时，只能通过 index 文件导入
- **模块内部导入允许** - 同一模块内的相对路径导入是被允许的
- **非 FSD 导入不受影响** - 第三方库和非 FSD 结构的导入不会被检查

#### public-api-only 配置选项

```javascript
// 禁用规则的配置
// eslint.config.js
export default [
  {
    plugins: {
      '@xinghunm/fsd-lint': fsdLintPlugin,
    },
    rules: {
      '@xinghunm/fsd-lint/public-api-only': [
        'error',
        {
          enabled: false, // 默认为 true，设置为 false 可禁用此规则
        },
      ],
    },
  },
]
```

#### public-api-only 错误示例

```javascript
// 直接从模块内部文件导入
import { LoginForm } from 'features/auth/ui/LoginForm'
import { userModel } from 'entities/user/model/user'
import { Button } from 'shared/ui/button/Button'

// 使用 require 直接导入内部文件
const { authApi } = require('features/auth/api/auth')
```

#### public-api-only 正确示例

```javascript
// 通过公共 API（index 文件）导入
import { LoginForm } from 'features/auth'
import { userModel } from 'entities/user'
import { Button } from 'shared/ui'

// 同一模块内的相对路径导入（允许）
import { utils } from './utils'
import { config } from '../config/settings'

// 非 FSD 层级的导入（允许）
import React from 'react'
import { lodash } from 'lodash'

// 使用 require 通过公共 API 导入
const { UserEntity } = require('entities/user')
```

#### 自动修复

此规则支持自动修复功能。当检测到违规的直接导入时，会自动将导入路径修复为对应的公共 API 路径。

**修复前：**

```javascript
import { LoginForm } from 'features/auth/ui/LoginForm'
```

**修复后：**

```javascript
import { LoginForm } from 'features/auth'
```

### `@xinghunm/fsd-lint/folder-structure`

验证FSD文件夹结构约定，确保项目遵循正确的层级架构。

#### folder-structure 规则说明

此规则验证以下两个核心方面：

- **层级结构验证** - 确保文件位于正确的 FSD 层级中
- **模块索引文件检查** - 验证特定层级的模块是否包含必需的公共 API 文件

#### 支持的 FSD 层级

规则支持以下 6 个标准 FSD 层级：

- `app` - 应用层配置
- `pages` - 应用页面
- `widgets` - 独立的 UI 块
- `features` - 业务功能特性
- `entities` - 业务实体
- `shared` - 共享的可复用代码

#### folder-structure 配置选项

##### `requirePublicApi` (默认: `true`)

控制是否要求模块提供公共 API（index 文件）。

- 当设为 `true` 时，`shared`、`entities`、`features`、`widgets` 层级的每个模块都必须包含 `index.js` 或 `index.ts` 文件
- 当设为 `false` 时，跳过公共 API 检查

##### `strictLayerStructure` (默认: `true`)

控制是否强制执行严格的层级结构规则。

- 当设为 `true` 时，验证文件是否位于有效的 fsd 层级中
- 当设为 `false` 时，跳过层级结构验证

#### folder-structure 配置示例

```javascript
// 宽松配置
// eslint.config.js
export default [
  {
    plugins: {
      '@xinghunm/fsd-lint': fsdLintPlugin,
    },
    rules: {
      '@xinghunm/fsd-lint/folder-structure': [
        'warn',
        {
          requirePublicApi: false, // 不要求公共 API
          strictLayerStructure: false, // 不强制层级结构
        },
      ],
    },
  },
]
```

#### folder-structure 错误示例

```text
错误：无效的层级
文件位置：src/invalid-layer/UserService.js
错误信息：Folder structure violation: "invalid-layer" is not a valid fsd layer

错误：缺少 index 文件
文件位置：src/features/user-auth/ui/LoginForm.tsx
但 src/features/user-auth/ 目录中没有 index.ts 或 index.js
错误信息：Missing required file: Module "user-auth" in layer "features" must have an index file for public API
```

### `@xinghunm/fsd-lint/naming-convention`

强制执行文件和目录命名约定，要求使用 kebab-case 格式。

**规则说明：**

- 文件名必须使用 kebab-case 格式（例如：`user-profile.ts`、`api-client.js`）
- 目录名必须使用 kebab-case 格式（例如：`user-management/`、`api-utils/`）
- `index.*` 文件不受此规则限制
- 支持复合扩展名（例如：`user.test.ts`、`types.d.ts`）

#### naming-convention 配置选项

```javascript
// eslint.config.js
export default [
  {
    plugins: {
      '@xinghunm/fsd-lint': fsdLintPlugin,
    },
    rules: {
      '@xinghunm/fsd-lint/naming-convention': [
        'error',
        {
          enabled: true, // 默认为 true，设置为 false 可禁用此规则
        },
      ],
    },
  },
]
```

#### naming-convention 示例

**正确的命名：**

```text
src/
├── user-management/
│   ├── index.ts
│   ├── user-profile.ts
│   └── user-settings.component.ts
└── api-client/
    ├── index.ts
    └── http-client.ts
```

**错误的命名：**

```text
src/
├── userManagement/          # 应该使用 user-management
│   ├── userProfile.ts       # 应该使用 user-profile.ts
│   └── UserSettings.ts      # 应该使用 user-settings.ts
└── APIClient/               # 应该使用 api-client
    └── HTTPClient.ts        # 应该使用 http-client.ts
```

## 项目结构示例

```text
src/
├── app/
│   ├── providers/
│   ├── styles/
│   └── index.tsx
├── pages/
│   ├── home/
│   │   ├── ui/
│   │   │   └── HomePage.tsx
│   │   └── index.ts
│   └── profile/
│       ├── ui/
│       │   └── ProfilePage.tsx
│       └── index.ts
├── widgets/
│   └── header/
│       ├── ui/
│       │   └── Header.tsx
│       └── index.ts
├── features/
│   ├── auth/
│   │   ├── ui/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── model/
│   │   │   └── authStore.ts
│   │   ├── api/
│   │   │   └── authApi.ts
│   │   └── index.ts
│   └── theme-switcher/
│       ├── ui/
│       │   └── ThemeToggle.tsx
│       └── index.ts
├── entities/
│   └── user/
│       ├── ui/
│       │   └── UserCard.tsx
│       ├── model/
│       │   └── userModel.ts
│       ├── api/
│       │   └── userApi.ts
│       └── index.ts
└── shared/
    ├── ui/
    │   ├── Button/
    │   │   ├── Button.tsx
    │   │   └── index.ts
    │   └── index.ts
    ├── lib/
    │   ├── utils/
    │   └── hooks/
    ├── api/
    │   └── base.ts
    └── config/
        └── constants.ts
```

## 许可证

本项目基于 [MIT](LICENSE) 许可证开源。

## 支持项目

如果这个项目对你有帮助，请给我们一个 ⭐️！这将帮助更多开发者发现这个工具。
