import React from 'react'
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react'
import { Theme as CompassTheme } from './types'
import { defaultTheme } from './default-theme'

export interface ThemeProviderProps {
  children: React.ReactNode
  theme?: Partial<CompassTheme>
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, theme: customTheme }) => {
  const mergedTheme: CompassTheme = React.useMemo(() => {
    if (!customTheme) return defaultTheme

    return {
      colors: { ...defaultTheme.colors, ...customTheme.colors },
      spacing: { ...defaultTheme.spacing, ...customTheme.spacing },
      borderRadius: {
        ...defaultTheme.borderRadius,
        ...customTheme.borderRadius,
      },
      fontSize: { ...defaultTheme.fontSize, ...customTheme.fontSize },
      fontWeight: { ...defaultTheme.fontWeight, ...customTheme.fontWeight },
      lineHeight: { ...defaultTheme.lineHeight, ...customTheme.lineHeight },
      shadows: { ...defaultTheme.shadows, ...customTheme.shadows },
      transitions: { ...defaultTheme.transitions, ...customTheme.transitions },
      breakpoints: { ...defaultTheme.breakpoints, ...customTheme.breakpoints },
    }
  }, [customTheme])

  return <EmotionThemeProvider theme={mergedTheme}>{children}</EmotionThemeProvider>
}

export default ThemeProvider
