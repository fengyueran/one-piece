/**
 * @fileoverview Tests for same-layer-isolation rule
 * @author xinghunm
 */

import { RuleTester } from 'eslint'
import rule from '../same-layer-isolation'

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

ruleTester.run('same-layer-isolation', rule, {
  valid: [
    {
      code: `import { Button } from 'shared/ui/button';`,
      filename: '/project/src/features/auth/ui/LoginForm.js',
    },
    {
      code: `import { UserEntity } from 'entities/user';`,
      filename: '/project/src/features/auth/model/auth.js',
    },
    {
      code: `import { config } from 'shared/config';`,
      filename: '/project/src/shared/lib/api.js',
    },
    {
      code: `const { Button } = require('shared/ui/button');`,
      filename: '/project/src/features/auth/ui/LoginForm.js',
    },
    {
      code: `import { ProductList } from 'features/product-list';`,
      filename: '/project/src/features/user-profile/ui/UserProfile.js',
      options: [{ enabled: false }],
    },
    {
      code: `import { external } from 'external-package';`,
      filename: '/project/src/features/auth/ui/LoginForm.js',
    },
    {
      code: `import { AuthModel } from '../model/auth';`,
      filename: '/project/src/features/auth/ui/LoginForm.js',
    },
    {
      code: `import { utils } from './utils';`,
      filename: '/project/src/features/auth/ui/LoginForm.js',
    },
    {
      code: `import { ProductList } from 'features/product-list';`,
      filename: '/project/src/entities/user/model/user.js',
    },
    {
      code: `import { OrderEntity } from 'entities/order';`,
      filename: '/project/src/shared/lib/api.js',
    },
  ],
  invalid: [
    {
      code: `import { ProductList } from 'features/product-list';`,
      filename: '/project/src/features/user-profile/ui/UserProfile.js',
      errors: [
        {
          message:
            'Module "user-profile" in layer "features" cannot import from sibling module "product-list" in the same layer. Modules in the same layer should be isolated from each other.',
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: `import { CartWidget } from 'widgets/cart';`,
      filename: '/project/src/widgets/header/ui/Header.js',
      errors: [
        {
          message:
            'Module "header" in layer "widgets" cannot import from sibling module "cart" in the same layer. Modules in the same layer should be isolated from each other.',
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: `import { HomePage } from 'pages/home';`,
      filename: '/project/src/pages/about/ui/AboutPage.js',
      errors: [
        {
          message:
            'Module "about" in layer "pages" cannot import from sibling module "home" in the same layer. Modules in the same layer should be isolated from each other.',
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: `const { ProductList } = require('features/product-list');`,
      filename: '/project/src/features/user-profile/ui/UserProfile.js',
      errors: [
        {
          message:
            'Module "user-profile" in layer "features" cannot import from sibling module "product-list" in the same layer. Modules in the same layer should be isolated from each other.',
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `const cartWidget = require('widgets/cart');`,
      filename: '/project/src/widgets/header/ui/Header.js',
      errors: [
        {
          message:
            'Module "header" in layer "widgets" cannot import from sibling module "cart" in the same layer. Modules in the same layer should be isolated from each other.',
          type: 'CallExpression',
        },
      ],
    },
  ],
})
