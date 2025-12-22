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
  const isJSX = startChar === '<'

  if (isBlock || isParen || isJSX) {
    const endChar = isBlock ? '}' : isParen ? ')' : '>'
    let balance = 0
    let jsxDepth = 0
    let inString: string | null = null
    let inCommentLine = false
    let inCommentBlock = false

    for (let i = 0; i < body.length; i++) {
      const char = body[i]
      const nextChar = body[i + 1] || ''

      // If we are in a string, handle escape and closure
      if (inString) {
        if (char === '\\') {
          i++ // skip next char (escaped)
          continue
        }
        if (char === inString) {
          inString = null
        }
        continue
      }

      // If we are in a comment
      if (inCommentLine) {
        if (char === '\n') inCommentLine = false
        continue
      }
      if (inCommentBlock) {
        if (char === '*' && nextChar === '/') {
          inCommentBlock = false
          i++
        }
        continue
      }

      // Start of comment?
      if (char === '/' && nextChar === '/') {
        inCommentLine = true
        i++
        continue
      }
      if (char === '/' && nextChar === '*') {
        inCommentBlock = true
        i++
        continue
      }

      // Start of string?
      if (char === '"' || char === "'" || char === '`') {
        inString = char
        continue
      }

      // Handle standard brackets
      if (char === '{' || char === '(' || char === '[') {
        balance++
        continue
      }
      if (char === '}' || char === ')' || char === ']') {
        balance--
        // For Block/Paren mode, check if we are done
        if (!isJSX && balance === 0 && char === endChar) {
          return isBlock ? body.substring(0, i + 1) : body.substring(1, i).trim()
        }
        continue
      }

      // Handle JSX
      if (isJSX && balance === 0) {
        // Case 1: Closing Tag Start </...
        if (char === '<' && nextChar === '/') {
          jsxDepth--
        }
        // Case 2: Self-Closing End />
        else if (char === '/' && nextChar === '>') {
          jsxDepth--
        }
        // Case 3: Opening Tag Start <Tag or Fragment <>
        else if (char === '<' && /[a-zA-Z0-9_$]/.test(nextChar || '')) {
          jsxDepth++
        } else if (char === '<' && nextChar === '>') {
          // Fragment start
          jsxDepth++
        }

        // Check for end of JSX
        // The expression ends when jsxDepth is 0 AND we hit the closing '>'
        if (jsxDepth === 0 && char === '>') {
          // If Fragment end </>, we hit > here, jsxDepth is 0.
          return body.substring(0, i + 1)
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
  const handlers = [
    'onChange',
    'onPressEnter',
    'onClick',
    'onFocus',
    'onBlur',
    'onVisibleChange',
    'onExpand',
    'onCheck',
    'onSelect',
  ]

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
  'Tree',
]

/**
 * Generate imports string
 */
export const generateImports = (renderCode: string, functionArgs: string): { imports: string } => {
  // 5. Build React import
  const hooks = ['useState', 'useEffect', 'useRef', 'useCallback', 'useMemo']
  const reactImports = ['React']

  hooks.forEach((hook) => {
    if (renderCode.includes(hook)) {
      reactImports.push(hook)
    }
  })

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
/**
 * Convert args object to JSX string props
 */
const argsToSource = (args: any): string => {
  if (!args || Object.keys(args).length === 0) return ''

  return Object.entries(args)
    .filter(([key, value]) => {
      // Filter out children, style, className if handled elsewhere or default checks
      if (key === 'children') return false
      // Filter out functions/actions usually
      if (typeof value === 'function' && key.startsWith('on')) return false
      // Filter undefined
      if (value === undefined) return false
      return true
    })
    .map(([key, value]) => {
      if (value === true) return key
      if (value === false) return `${key}={false}`
      if (typeof value === 'string') return `${key}="${value}"`
      if (typeof value === 'number') return `${key}={${value}}`
      if (typeof value === 'object') return `${key}={${JSON.stringify(value)}}`
      return `${key}={${value}}`
    })
    .join(' ')
}

/**
 * Main transform function that combines all steps
 */
export const transformSource = (code: string, storyContext?: any): string => {
  // Try to use the original source from context if available
  // BUT only if it looks like it contains a custom render function we want to preserve.
  // If it's just a simple args object, we prefer the dynamic code passed by Storybook.
  const originalSource = storyContext?.parameters?.docs?.source?.originalSource

  let cleanCode = code.trim()

  if (originalSource && (originalSource.includes('render:') || originalSource.includes('=>'))) {
    cleanCode = originalSource.trim()
  }

  // If manual source (type: 'code'), context might not contain args or we shouldn't touch it?
  // But usually we want to keep transform.
  if (shouldSkipTransform(cleanCode)) {
    // If we skipped based on originalSource being an object,
    // we might want to fall back to processing the dynamic 'code' instead which is usually JSX
    if (cleanCode !== code.trim()) {
      cleanCode = code.trim()
      if (shouldSkipTransform(cleanCode)) return code
    } else {
      return code
    }
  }

  let { renderCode, functionArgs } = extractRenderInfo(cleanCode)

  renderCode = renderCode.trim()
  if (!renderCode) return code

  renderCode = cleanEmptyHandlers(renderCode)

  // Inject args if present
  if (storyContext?.args) {
    const argsProps = argsToSource(storyContext.args)
    // simplistic replacement: look for {...args}
    if (renderCode.includes('{...args}')) {
      renderCode = renderCode.replace('{...args}', argsProps)
    } else if (renderCode.includes('{...args}')) {
      // already handled above
    }
  }

  const { imports } = generateImports(renderCode, functionArgs)

  const rawSource = `${imports}

    const App: React.FC = ${functionArgs} => ${renderCode}
    `
  return formatSource(rawSource)
}
