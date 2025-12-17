import prettier from 'prettier-v2/standalone'
import parserBabel from 'prettier-v2/parser-babel'
import parserTypeScript from 'prettier-v2/parser-typescript'

/**
 * Helper to clean up body (remove trailing comma/brace from Story object or wrapping parens)
 */
export const extractBodyContent = (body: string): string => {
  const startChar = body[0]
  const isBlock = startChar === '{'
  const isParen = startChar === '('

  if (isBlock || isParen) {
    const endChar = isBlock ? '}' : ')'
    let balance = 0

    for (let i = 0; i < body.length; i++) {
      if (body[i] === startChar) balance++
      if (body[i] === endChar) {
        balance--
        if (balance === 0) {
          // If it's a block {}, include the braces. If it's (), unwrap them.
          return isBlock ? body.substring(0, i + 1) : body.substring(1, i).trim()
        }
      }
    }
    // If not balanced (shouldn't happen in valid code), return valid part or whole
    return body
  }

  // Fallback for simple implicit returns or untracked formats
  let cleaned = body
  if (cleaned.endsWith(',')) {
    cleaned = cleaned.substring(0, cleaned.length - 1).trim()
  }
  // Remove trailing brace if it looks like the end of the Story object
  if (cleaned.endsWith('}')) {
    cleaned = cleaned.substring(0, cleaned.length - 1).trim()
  }

  return cleaned
}

/**
 * Extract render function body and arguments
 */
export const extractRenderInfo = (
  cleanCode: string,
): { renderCode: string; functionArgs: string } => {
  let renderCode = cleanCode
  let functionArgs = '()'

  if (cleanCode.includes('render:')) {
    const renderIndex = cleanCode.indexOf('render:')
    const tempCode = cleanCode.substring(renderIndex + 'render:'.length).trim()

    // 1. Check for Arrow Function: (args) => ... or (args: Type) => ...
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
          renderCode = extractBodyContent(afterArgs.substring(2).trim())
        } else {
          // Not an arrow function, likely wrapped JSX: (<div />)
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
          renderCode = extractBodyContent(tempCode.substring(arrowIndex + 2).trim())
        } else {
          // Fallback
          renderCode = extractBodyContent(tempCode)
        }
      } else {
        // No arrow, fallback
        renderCode = extractBodyContent(tempCode)
      }
    }
  }

  return { renderCode: renderCode.trim(), functionArgs }
}

/**
 * Remove empty event handlers
 */
export const cleanEmptyHandlers = (code: string): string => {
  let result = code
  // Common handlers
  const handlers = ['onChange', 'onPressEnter', 'onClick', 'onFocus', 'onBlur']

  handlers.forEach((handler) => {
    const regex = new RegExp(`\\s*${handler}=\\{\\(\\)\\s*=>\\s*\\{\\}\\}`, 'g')
    result = result.replace(regex, '')
  })

  // Component specific fix (keep here for now or move to specific cleaner)
  result = result.replace(
    /onClick:\s*\(\)\s*=>\s*\{\},?/g,
    'onClick: (e, key) => alert(`Menu clicked! Key: ${key}`),',
  )

  return result
}

/**
 * Known components to check for auto-import
 */
const KNOWN_COMPONENTS = [
  'ConfigProvider',
  'Button',
  'Modal',
  'ThemeProvider',
  'Progress',
  'message',
  'InputField',
  'InputNumber',
  'Steps',
  'Dropdown',
  'Menu',
  'DatePicker',
  'Pagination',
]

/**
 * Generate imports string
 */
export const generateImports = (renderCode: string, functionArgs: string): { imports: string } => {
  // 5. 构建 React import
  const needsUseState = renderCode.includes('useState')
  const reactImports = ['React']
  if (needsUseState) reactImports.push('useState')
  const reactImportLine = `import ${reactImports.length === 1 ? 'React' : `React, { ${reactImports.slice(1).join(', ')} }`} from 'react'`

  const importsByPackage: Record<string, string[]> = {}
  const uiPackage = '@xinghunm/compass-ui'

  KNOWN_COMPONENTS.forEach((component) => {
    if (renderCode.includes(`<${component}`) || renderCode.includes(`${component}.`)) {
      if (!importsByPackage[uiPackage]) importsByPackage[uiPackage] = []
      importsByPackage[uiPackage].push(component)
    }
  })

  let componentImportLines = ''
  Object.entries(importsByPackage).forEach(([pkg, comps]) => {
    const unique = Array.from(new Set(comps))

    // Hacky fix for ModalProps if needed
    if (functionArgs.includes('ModalProps') && unique.includes('Modal') && pkg === uiPackage) {
      const idx = unique.indexOf('Modal')
      if (idx !== -1) {
        unique[idx] = 'Modal, ModalProps'
      }
    }

    componentImportLines += `\nimport { ${unique.join(', ')} } from '${pkg}'`
  })

  return { imports: `${reactImportLine}${componentImportLines}` }
}

/**
 * Check if code should be skipped
 */
export const shouldSkipTransform = (cleanCode: string): boolean => {
  // 1. Prevent repeat processing
  if (cleanCode.includes('import React') || cleanCode.includes('const App: React.FC')) {
    return true
  }

  // 1.1 Manual source check
  if (
    cleanCode.includes('import ') &&
    cleanCode.includes('from ') &&
    cleanCode.includes('const App')
  ) {
    return true
  }

  // 2. Story object definition check
  if (
    cleanCode.startsWith('{') &&
    (cleanCode.includes('args:') || cleanCode.includes('parameters:')) &&
    !cleanCode.includes('render:')
  ) {
    return true
  }

  return false
}

/**
 * Format code using Prettier
 */
export const formatSource = (source: string): string => {
  try {
    return prettier.format(source, {
      parser: 'typescript',
      plugins: [parserBabel, parserTypeScript],
      semi: false,
      singleQuote: true,
      printWidth: 80,
    })
  } catch (e) {
    // If format fails, return original source
    console.error('Prettier format error:', e)
    return source
  }
}

/**
 * Main transform function that combines all steps
 */
export const transformSource = (code: string): string => {
  const cleanCode = code.trim()
  if (shouldSkipTransform(cleanCode)) {
    return code
  }

  let { renderCode, functionArgs } = extractRenderInfo(cleanCode)

  renderCode = renderCode.trim()
  if (!renderCode) return code

  renderCode = cleanEmptyHandlers(renderCode)

  //   // Double check
  //   if (
  //     renderCode.startsWith('{') &&
  //     (renderCode.includes('args:') || renderCode.includes('parameters:'))
  //   ) {
  //     return code
  //   }

  const { imports } = generateImports(renderCode, functionArgs)

  const rawSource = `${imports}

    const App: React.FC = ${functionArgs} => ${renderCode}
    `
  return formatSource(rawSource)
}
