/**
 * @fileoverview Tests for folder-structure rule
 * @author xinghunm
 */

import { RuleTester } from 'eslint'
import rule from '../folder-structure'

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

ruleTester.run('folder-structure', rule, {
  valid: [
    // requirePublicApi test
    {
      code: `export { Button } from './Button';`,
      filename: '/project/src/shared/ui/button/index.js',
      options: [{ requirePublicApi: false }],
    },
    // strictLayerStructure test - valid layer structure
    {
      code: `export const Widget = {};`,
      filename: '/project/src/widgets/header/index.js',
      options: [{ requirePublicApi: false, strictLayerStructure: true }],
    },
    {
      code: `export const Page = {};`,
      filename: '/project/src/pages/home/index.js',
      options: [{ requirePublicApi: false, strictLayerStructure: true }],
    },
    {
      code: `export const App = {};`,
      filename: '/project/src/app/index.js',
      options: [{ requirePublicApi: false, strictLayerStructure: true }],
    },
    // strictLayerStructure disabled, invalid layer should pass
    {
      code: `export const Invalid = {};`,
      filename: '/project/src/invalid-layer/component.js',
      options: [{ requirePublicApi: false, strictLayerStructure: false }],
    },
  ],
  invalid: [
    // requirePublicApi test
    {
      code: `const Button = () => {};`,
      filename: '/project/src/shared/ui/button/Button.js',
      errors: [
        {
          message:
            'Missing required file: Module "ui" in layer "shared" must have an index file for public API',
          type: 'Program',
        },
      ],
      options: [{ requirePublicApi: true }],
    },
    {
      code: `export const UserEntity = {};`,
      filename: '/project/src/entities/user/model/user.js',
      errors: [
        {
          message:
            'Missing required file: Module "user" in layer "entities" must have an index file for public API',
          type: 'Program',
        },
      ],
      options: [{ requirePublicApi: true }],
    },
    {
      code: `export const AuthFeature = {};`,
      filename: '/project/src/features/auth/ui/LoginForm.js',
      errors: [
        {
          message:
            'Missing required file: Module "auth" in layer "features" must have an index file for public API',
          type: 'Program',
        },
      ],
      options: [{ requirePublicApi: true }],
    },
    // strictLayerStructure 测试 - 无效的层级结构
    {
      code: `export const Invalid = {};`,
      filename: '/project/src/invalid-layer/component.js',
      errors: [
        {
          message:
            'Folder structure violation: "invalid-layer" is not a valid FSD layer. Must be one of: shared, entities, features, widgets, pages, app',
          type: 'Program',
        },
      ],
      options: [{ requirePublicApi: false, strictLayerStructure: true }],
    },
    {
      code: `export const WrongLayer = {};`,
      filename: '/project/src/components/Button.js',
      errors: [
        {
          message:
            'Folder structure violation: "components" is not a valid FSD layer. Must be one of: shared, entities, features, widgets, pages, app',
          type: 'Program',
        },
      ],
      options: [{ requirePublicApi: false, strictLayerStructure: true }],
    },
  ],
})
