/**
 * @fileoverview Tests for naming-convention rule
 * @author xinghunm
 */

import { RuleTester } from 'eslint'
import rule from '../naming-convention'

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
})

ruleTester.run('naming-convention', rule, {
  valid: [
    {
      code: `const button = () => <button>Click me</button>;`,
      filename: '/project/src/shared/ui/button/button.js',
    },
    {
      code: `export const authFeature = {};`,
      filename: '/project/src/features/auth/ui/login-form.jsx',
    },
    {
      code: `export default {};`,
      filename: '/project/src/widgets/header/index.js',
    },
    {
      code: `const test = {};`,
      filename: '/project/src/shared/utils/helper-functions.test.js',
    },
    {
      code: `const types = {};`,
      filename: '/project/src/shared/types/user-types.d.ts',
    },
    // Test the case when the rule is enabled (default behavior)
    {
      code: `const button = () => <button>Click me</button>;`,
      filename: '/project/src/shared/ui/button/button.js',
      options: [{ enabled: true }],
    },
    // Test the case when the rule is disabled (even if the file name is not conforming to the convention)
    {
      code: `const Button = () => <button>Click me</button>;`,
      filename: '/project/src/shared/ui/button/BadComponentName.js',
      options: [{ enabled: false }],
    },
    {
      code: `const component = {};`,
      filename: '/project/src/BadDirectory/component/test-file.js',
      options: [{ enabled: false }],
    },
  ],
  invalid: [
    {
      code: `const Button = () => <button>Click me</button>;`,
      filename: '/project/src/shared/ui/button/BadComponentName.js',
      errors: [
        {
          messageId: 'invalidFile',
          data: { name: 'BadComponentName.js' },
          type: 'Program',
        },
      ],
    },
    {
      code: `const utils = {};`,
      filename: '/project/src/shared/lib/ApiUtils.js',
      errors: [
        {
          messageId: 'invalidFile',
          data: { name: 'ApiUtils.js' },
          type: 'Program',
        },
      ],
    },
    {
      code: `const utils = {};`,
      filename: '/project/src/shared/BadFolder/helper.js',
      errors: [
        {
          messageId: 'invalidDir',
          data: { name: 'BadFolder' },
          type: 'Program',
        },
      ],
    },
  ],
})
