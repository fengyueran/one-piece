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
