import { defaultTheme } from './default-theme'
import { Theme } from './types'

/**
 * Helper to get theme colors with fallback to default theme
 */
export const getThemeColors = (theme: any): Theme['colors'] => {
  return theme?.colors || defaultTheme.colors
}

/**
 * Helper to get specific component theme with fallback to default theme
 */
export const getComponentTheme = <K extends keyof Theme['components']>(
  theme: any,
  componentKey: K,
): Theme['components'][K] => {
  return theme?.components?.[componentKey] || defaultTheme.components[componentKey]
}
