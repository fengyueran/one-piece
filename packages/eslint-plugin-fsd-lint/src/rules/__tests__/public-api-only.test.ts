/**
 * @fileoverview Tests for public-api-only rule
 * @author xinghunm
 */

import { RuleTester } from 'eslint'
import rule from '../public-api-only'

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

ruleTester.run('public-api-only', rule, {
  valid: [
    // Correct usage of public API (index files)
    {
      code: `import { UserEntity } from 'entities/user';`,
      filename: '/project/src/features/auth/model/auth.js',
    },
    {
      code: `import { AuthFeature } from 'features/auth';`,
      filename: '/project/src/widgets/header/ui/Header.js',
    },

    // Imports within the same module (allowed)
    {
      code: `import { utils } from './utils';`,
      filename: '/project/src/features/auth/lib/helpers.js',
    },
    {
      code: `import { config } from '../config/settings';`,
      filename: '/project/src/features/auth/lib/api.js',
    },

    // Direct import of index files (allowed)
    {
      code: `import { UserEntity } from 'entities/user/index';`,
      filename: '/project/src/features/auth/model/auth.js',
    },

    // Non-FSD layer imports (allowed)
    {
      code: `import React from 'react';`,
      filename: '/project/src/features/auth/ui/LoginForm.js',
    },
    {
      code: `import { lodash } from 'lodash';`,
      filename: '/project/src/shared/lib/utils.js',
    },

    // When rule is disabled (allowed)
    {
      code: `import { user } from 'entities/user/model/user';`,
      filename: '/project/src/features/auth/model/auth.js',
      options: [{ enabled: false }],
    },

    // require calls - correct usage of public API
    {
      code: `const { UserEntity } = require('entities/user');`,
      filename: '/project/src/features/auth/model/auth.js',
    },

    // Relative path imports within the same module
    {
      code: `import { helper } from '../lib/helper';`,
      filename: '/project/src/features/auth/ui/LoginForm.js',
    },

    // Path alias imports - correct usage of public API
    {
      code: `import { UserEntity } from '@/entities/user';`,
      filename: '/project/src/features/auth/model/auth.js',
      settings: {
        'fsd-lint': {
          pathAliases: {
            '@/': '/project/src/',
          },
        },
      },
    },
    {
      code: `import { AuthFeature } from '@/features/auth';`,
      filename: '/project/src/widgets/header/ui/Header.js',
      settings: {
        'fsd-lint': {
          pathAliases: {
            '@/': '/project/src/',
          },
        },
      },
    },

    // Custom alias imports - correct usage
    {
      code: `import { Button } from '@shared/ui';`,
      filename: '/project/src/features/auth/ui/LoginForm.js',
      settings: {
        'fsd-lint': {
          pathAliases: {
            '@shared/': '/project/src/shared/',
          },
        },
      },
    },
  ],

  invalid: [
    // Direct import of internal module files (should error)
    {
      code: `import { user } from 'entities/user/model/user';`,
      filename: '/project/src/features/auth/model/auth.js',
      errors: [
        {
          message:
            'Direct import from "model/user" in module "user" is not allowed. Use the public API instead: "entities/user".',
          type: 'ImportDeclaration',
        },
      ],
      output: `import { user } from 'entities/user';`,
    },

    {
      code: `import { ButtonComponent } from 'shared/ui/button/Button';`,
      filename: '/project/src/features/auth/ui/LoginForm.js',
      errors: [
        {
          message:
            'Direct import from "button/Button" in module "ui" is not allowed. Use the public API instead: "shared/ui".',
          type: 'ImportDeclaration',
        },
      ],
      output: `import { ButtonComponent } from 'shared/ui';`,
    },

    {
      code: `import { authModel } from 'features/auth/model/auth';`,
      filename: '/project/src/widgets/header/ui/Header.js',
      errors: [
        {
          message:
            'Direct import from "model/auth" in module "auth" is not allowed. Use the public API instead: "features/auth".',
          type: 'ImportDeclaration',
        },
      ],
      output: `import { authModel } from 'features/auth';`,
    },

    {
      code: `import { apiClient } from 'shared/api/client';`,
      filename: '/project/src/entities/user/model/user.js',
      errors: [
        {
          message:
            'Direct import from "client" in module "api" is not allowed. Use the public API instead: "shared/api".',
          type: 'ImportDeclaration',
        },
      ],
      output: `import { apiClient } from 'shared/api';`,
    },

    // require call violations
    {
      code: `const { user } = require('entities/user/model/user');`,
      filename: '/project/src/features/auth/model/auth.js',
      errors: [
        {
          message:
            'Direct import from "model/user" in module "user" is not allowed. Use the public API instead: "entities/user".',
          type: 'CallExpression',
        },
      ],
      output: `const { user } = require('entities/user');`,
    },

    // Path alias violations - direct import of internal files
    {
      code: `import { user } from '@/entities/user/model/user';`,
      filename: '/project/src/features/auth/model/auth.js',
      settings: {
        'fsd-lint': {
          pathAliases: {
            '@/': '/project/src/',
          },
        },
      },
      errors: [
        {
          message:
            'Direct import from "model/user" in module "user" is not allowed. Use the public API instead: "@/entities/user".',
          type: 'ImportDeclaration',
        },
      ],
      output: `import { user } from '@/entities/user';`,
    },

    {
      code: `import { ButtonComponent } from '@/shared/ui/button/Button';`,
      filename: '/project/src/features/auth/ui/LoginForm.js',
      settings: {
        'fsd-lint': {
          pathAliases: {
            '@/': '/project/src/',
          },
        },
      },
      errors: [
        {
          message:
            'Direct import from "button/Button" in module "ui" is not allowed. Use the public API instead: "@/shared/ui".',
          type: 'ImportDeclaration',
        },
      ],
      output: `import { ButtonComponent } from '@/shared/ui';`,
    },

    // Custom alias violations
    {
      code: `import { apiClient } from '@shared/api/client';`,
      filename: '/project/src/entities/user/model/user.js',
      settings: {
        'fsd-lint': {
          pathAliases: {
            '@shared/': '/project/src/shared/',
          },
        },
      },
      errors: [
        {
          message:
            'Direct import from "client" in module "api" is not allowed. Use the public API instead: "@shared/api".',
          type: 'ImportDeclaration',
        },
      ],
      output: `import { apiClient } from '@shared/api';`,
    },

    // Mixed alias types - using @/ for entities layer
    {
      code: `import { authModel } from '@/features/auth/model/auth';`,
      filename: '/project/src/widgets/header/ui/Header.js',
      settings: {
        'fsd-lint': {
          pathAliases: {
            '@/': '/project/src/',
          },
        },
      },
      errors: [
        {
          message:
            'Direct import from "model/auth" in module "auth" is not allowed. Use the public API instead: "@/features/auth".',
          type: 'ImportDeclaration',
        },
      ],
      output: `import { authModel } from '@/features/auth';`,
    },
  ],
})
