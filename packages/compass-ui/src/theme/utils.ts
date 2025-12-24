import { defaultTheme } from './default-theme'
import { Theme } from './types'

/**
 * Helper to get specific component theme with fallback to default theme
 */
export const getComponentTheme = <K extends keyof Theme['components']>(
  theme: Partial<Theme> | undefined,
  componentKey: K,
): Theme['components'][K] => {
  return theme?.components?.[componentKey] || defaultTheme.components[componentKey]
}

/**
 * Helper to get global theme token with fallback to default theme
 * e.g. getThemeToken(theme, 'colors'), getThemeToken(theme, 'spacing')
 */
export const getThemeToken = <K extends keyof Theme>(
  theme: Partial<Theme> | undefined,
  tokenKey: K,
): Theme[K] => {
  return theme?.[tokenKey] || defaultTheme[tokenKey]
}

/**
 * Deep merge two objects.
 * Simple implementation for theme merging.
 */
export function deepMerge<T extends Record<string, unknown>, S extends Record<string, unknown>>(
  target: T,
  source: S,
): T & S {
  if (!source) {
    return target as T & S
  }
  if (!target) {
    return source as T & S
  }

  const result = { ...target } as unknown as Record<string, unknown>
  const src = source as unknown as Record<string, unknown>

  Object.keys(src).forEach((key) => {
    const targetValue = result[key]
    const sourceValue = src[key]

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      result[key] = [...targetValue, ...sourceValue]
    } else if (
      targetValue &&
      typeof targetValue === 'object' &&
      sourceValue &&
      typeof sourceValue === 'object'
    ) {
      result[key] = deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>,
      )
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue
    }
  })

  return result as T & S
}
