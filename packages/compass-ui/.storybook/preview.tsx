import type { Preview, StoryFn } from '@storybook/react'
import React from 'react'
import { ThemeProvider } from '../src/theme'
import prettier from 'prettier-v2/standalone'
import parserBabel from 'prettier-v2/parser-babel'
import parserTypeScript from 'prettier-v2/parser-typescript'

const preview: Preview = {
  decorators: [
    (Story: StoryFn) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,

      source: {
        state: 'open',
        excludeDecorators: true,
        transform: (code: string) => {
          const cleanCode = code.trim()

          // 1. 防止重复处理：如果代码中已经包含了生成的结构，直接返回
          // 检测 import React 或 const App 定义
          if (cleanCode.includes('import React') || cleanCode.includes('const App: React.FC')) {
            return code
          }

          // 2. 检测是否为 Story 对象定义（非 JSX/TSX 渲染代码）
          // 如果代码以 { 开头，且包含 args: 或 parameters:，且不包含 render:，则认为是 Story 对象，直接返回
          if (
            cleanCode.startsWith('{') &&
            (cleanCode.includes('args:') || cleanCode.includes('parameters:')) &&
            !cleanCode.includes('render:')
          ) {
            return code
          }

          // 3. 提取 render 函数内容
          let renderCode = cleanCode
          let functionArgs = '()'

          if (cleanCode.includes('render:')) {
            const renderIndex = cleanCode.indexOf('render:')
            let tempCode = cleanCode.substring(renderIndex + 'render:'.length).trim()

            // Helper to clean up body (remove trailing comma/brace from Story object)
            const cleanBody = (body: string) => {
              if (body.startsWith('{')) {
                // Block body: find matching closing brace
                let balance = 0
                let endIndex = -1
                for (let i = 0; i < body.length; i++) {
                  if (body[i] === '{') balance++
                  if (body[i] === '}') {
                    balance--
                    if (balance === 0) {
                      endIndex = i
                      break
                    }
                  }
                }
                if (endIndex !== -1) {
                  return body.substring(0, endIndex + 1)
                }
                return body
              } else {
                // Implicit return: remove trailing comma or closing brace of the Story object
                let cleaned = body
                if (cleanCode.startsWith('{') && cleaned.endsWith('}')) {
                  cleaned = cleaned.substring(0, cleaned.length - 1).trim()
                }
                if (cleaned.endsWith(',')) {
                  cleaned = cleaned.substring(0, cleaned.length - 1).trim()
                }
                return cleaned
              }
            }

            // Check for Arrow Function
            // 1. Check for (args) => ... or (args: Type) => ...
            if (tempCode.startsWith('(')) {
              let balance = 0
              let endIndex = -1
              for (let i = 0; i < tempCode.length; i++) {
                if (tempCode[i] === '(') balance++
                if (tempCode[i] === ')') {
                  balance--
                  if (balance === 0) {
                    endIndex = i
                    break
                  }
                }
              }

              if (endIndex !== -1) {
                const potentialArgs = tempCode.substring(0, endIndex + 1)
                const afterArgs = tempCode.substring(endIndex + 1).trim()
                if (afterArgs.startsWith('=>')) {
                  functionArgs = potentialArgs
                  renderCode = cleanBody(afterArgs.substring(2).trim())
                } else {
                  // Not an arrow function, likely wrapped JSX: (<div />)
                  // In this case, args are empty
                  renderCode = tempCode.substring(1, endIndex)
                }
              }
            }
            // 2. Check for simple args => ... (no parens)
            else {
              const arrowIndex = tempCode.indexOf('=>')
              if (arrowIndex !== -1) {
                const potentialArgs = tempCode.substring(0, arrowIndex).trim()
                // Ensure potentialArgs is a valid identifier (simple check) and doesn't contain complex chars like < or { (unless destructuring)
                // For safety, if it looks like a variable, assume it's args
                if (!potentialArgs.includes('<') && !potentialArgs.includes('return')) {
                  functionArgs = potentialArgs
                  renderCode = cleanBody(tempCode.substring(arrowIndex + 2).trim())
                } else {
                  // Fallback
                  renderCode = cleanBody(tempCode)
                }
              } else {
                // No arrow, fallback
                renderCode = cleanBody(tempCode)
              }
            }
          }

          renderCode = renderCode.trim()
          if (!renderCode) return code

          // 4. 二次检查：如果提取后的代码仍然像是一个 Story 对象（比如 render 提取失败），则不处理
          if (
            renderCode.startsWith('{') &&
            (renderCode.includes('args:') || renderCode.includes('parameters:'))
          ) {
            return code
          }

          // 5. 构建 React import
          const needsUseState = renderCode.includes('useState')
          const reactImports = ['React']
          if (needsUseState) reactImports.push('useState')
          const reactImportLine = `import ${reactImports.length === 1 ? 'React' : `React, { ${reactImports.slice(1).join(', ')} }`} from 'react'`

          const importsByPackage: Record<string, string[]> = {}
          const uiPackage = '@xinghunm/compass-ui'

          const componentsToCheck = ['Button', 'Modal', 'ThemeProvider', 'Progress', 'message']
          componentsToCheck.forEach((component) => {
            if (renderCode.includes(`<${component}`) || renderCode.includes(`${component}.`)) {
              if (!importsByPackage[uiPackage]) importsByPackage[uiPackage] = []
              importsByPackage[uiPackage].push(component)
            }
          })

          let componentImportLines = ''
          Object.entries(importsByPackage).forEach(([pkg, comps]) => {
            const unique = Array.from(new Set(comps))
            componentImportLines += `\nimport { ${unique.join(', ')} } from '${pkg}'`
          })

          // Add ModalProps to import if used in args
          if (functionArgs.includes('ModalProps') && !componentImportLines.includes('ModalProps')) {
            // Hacky way to add it, or just rely on the user to ignore the missing type in the snippet
            // But better to try to include it if we can.
            // Since we know we are in compass-ui, we can try to add it.
            if (importsByPackage[uiPackage]) {
              // It's already constructed string, let's just append it to the regex check above or modify the string.
              // Simpler: just replace the import line.
              componentImportLines = componentImportLines.replace('Modal }', 'Modal, ModalProps }')
            }
          }

          const rawSource = `${reactImportLine}${componentImportLines}

const App: React.FC = ${functionArgs} => ${renderCode}
`
          try {
            return prettier.format(rawSource, {
              parser: 'typescript',
              plugins: [parserBabel, parserTypeScript],
              semi: false,
              singleQuote: true,
              printWidth: 80,
            })
          } catch (e) {
            // 如果格式化失败，返回原始内容（而不是包装后的 rawSource），避免显示错误的包装代码
            console.error('Prettier format error:', e)
            return code
          }
        },
      },

      canvas: {
        sourceState: 'shown',
      },

      codePanel: true,
    },
  },
}

export default preview
