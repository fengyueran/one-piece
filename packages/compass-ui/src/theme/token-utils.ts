import { Theme } from './types'

/**
 * Prefix for all Compass UI CSS variables
 */
export const CSS_VAR_PREFIX = 'compass'

/**
 * Converts a nested theme object into a flat object of CSS variables.
 * e.g. { colors: { primary: '#fff' } } -> { '--compass-colors-primary': '#fff' }
 */
export function themeToCssVariables(theme: Theme): Record<string, string | number> {
  const cssVars: Record<string, string | number> = {}

  function traverse(obj: unknown, path: string[]) {
    if (!obj || typeof obj !== 'object') return

    const record = obj as Record<string, unknown>
    Object.keys(record).forEach((key) => {
      const value = record[key]
      const currentPath = [...path, key]

      if (typeof value === 'string' || typeof value === 'number') {
        const varName = `--${CSS_VAR_PREFIX}-${currentPath.join('-')}`
        let cssValue: string | number = value

        // Add px to specific dimension keys if they are numbers
        if (typeof value === 'number') {
          if (['borderRadius', 'spacing', 'fontSize'].includes(currentPath[0])) {
            cssValue = `${value}px`
          }
        }

        cssVars[varName] = cssValue
      } else if (value && typeof value === 'object') {
        traverse(value, currentPath)
      }
    })
  }

  traverse(theme, [])
  return cssVars
}

/**
 * Helper to get the CSS variable name for a token path.
 * e.g. tokenVar('colors.primary') -> '--compass-colors-primary'
 */
export function tokenVar(path: string): string {
  return `--${CSS_VAR_PREFIX}-${path.replace(/\./g, '-')}`
}

/**
 * Helper to get the CSS variable usage string.
 * e.g. token('colors.primary') -> 'var(--compass-colors-primary)'
 * e.g. token('colors.primary', '#fff') -> 'var(--compass-colors-primary, #fff)'
 */
export function token(path: string, fallback?: string): string {
  const varName = tokenVar(path)
  return fallback ? `var(${varName}, ${fallback})` : `var(${varName})`
}
