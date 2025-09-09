import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const require = createRequire(import.meta.url)

// Load the built plugin from parent directory using relative path
const fsdPlugin = require(join(__dirname, '../dist/index.js'))

export default [
  {
    files: ['**/*.js', '**/*.jsx'],
    plugins: {
      '@xinghunm/fsd-lint': fsdPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      ...fsdPlugin.configs.recommended.rules,
    },
  },
]
