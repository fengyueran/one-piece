/**
 * @fileoverview Tests for layer-dependency rule
 * @author xinghunm
 */

import { RuleTester } from 'eslint'
import rule from '../layer-dependency'

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

ruleTester.run('layer-dependency', rule, {
  valid: [
    {
      code: `import { Button } from 'shared/ui/button';`,
      filename: '/project/src/entities/user/ui/UserCard.js',
    },
    {
      code: `import { UserEntity } from 'entities/user';`,
      filename: '/project/src/features/auth/model/auth.js',
    },
    {
      code: `import { AuthFeature } from 'features/auth';`,
      filename: '/project/src/widgets/header/ui/Header.js',
    },
    {
      code: `import { HeaderWidget } from 'widgets/header';`,
      filename: '/project/src/pages/home/ui/HomePage.js',
    },
    {
      code: `import { HomePage } from 'pages/home';`,
      filename: '/project/src/app/App.js',
    },
    {
      code: `import { utils } from './utils';`,
      filename: '/project/src/shared/lib/helpers.js',
    },
    // Test require() calls - valid cases
    {
      code: `const { Button } = require('shared/ui/button');`,
      filename: '/project/src/entities/user/ui/UserCard.js',
    },
    {
      code: `const UserEntity = require('entities/user');`,
      filename: '/project/src/features/auth/model/auth.js',
    },
    // Test with enabled: false configuration
    {
      code: `import { App } from 'app/App';`,
      filename: '/project/src/features/auth/model/auth.js',
      options: [{ enabled: false }],
    },
    {
      code: `const { HomePage } = require('pages/home');`,
      filename: '/project/src/widgets/header/ui/Header.js',
      options: [{ enabled: false }],
    },
  ],
  invalid: [
    {
      code: `import { App } from 'app/App';`,
      filename: '/project/src/features/auth/model/auth.js',
      errors: [
        {
          message:
            'Layer "features" (level 3) cannot import from higher layer "app" (level 6). Lower layers should not depend on higher layers.',
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: `import { HomePage } from 'pages/home';`,
      filename: '/project/src/widgets/header/ui/Header.js',
      errors: [
        {
          message:
            'Layer "widgets" (level 4) cannot import from higher layer "pages" (level 5). Lower layers should not depend on higher layers.',
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: `import { AuthFeature } from 'features/auth';`,
      filename: '/project/src/entities/user/model/user.js',
      errors: [
        {
          message:
            'Layer "entities" (level 2) cannot import from higher layer "features" (level 3). Lower layers should not depend on higher layers.',
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: `import { UserEntity } from 'entities/user';`,
      filename: '/project/src/shared/ui/button/Button.js',
      errors: [
        {
          message:
            'Layer "shared" (level 1) cannot import from higher layer "entities" (level 2). Lower layers should not depend on higher layers.',
          type: 'ImportDeclaration',
        },
      ],
    },
    // Test require() calls
    {
      code: `const { App } = require('app/App');`,
      filename: '/project/src/features/auth/model/auth.js',
      errors: [
        {
          message:
            'Layer "features" (level 3) cannot require from higher layer "app" (level 6). Lower layers should not depend on higher layers.',
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `const HomePage = require('pages/home');`,
      filename: '/project/src/widgets/header/ui/Header.js',
      errors: [
        {
          message:
            'Layer "widgets" (level 4) cannot require from higher layer "pages" (level 5). Lower layers should not depend on higher layers.',
          type: 'CallExpression',
        },
      ],
    },
  ],
})
