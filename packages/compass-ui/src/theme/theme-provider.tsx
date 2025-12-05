import React, { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react'

import { Theme as CompassTheme, ThemeMode, DeepPartial, ThemeProviderProps } from './types'
import { defaultTheme } from './default-theme'
import { darkTheme as builtinDarkTheme } from './dark-theme'

interface ThemeContextType {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  toggleTheme: () => void
  theme: CompassTheme
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  theme: commonTheme,
  lightTheme: customLightTheme,
  darkTheme: customDarkTheme,
  defaultMode = 'light',
}) => {
  const [mode, setMode] = useState<ThemeMode>(defaultMode)

  useEffect(() => {
    setMode(defaultMode)
  }, [defaultMode])

  const mergedTheme: CompassTheme = useMemo(() => {
    const baseTheme = mode === 'dark' ? builtinDarkTheme : defaultTheme
    const modeTheme = mode === 'dark' ? customDarkTheme : customLightTheme

    const mergeThemeObjects = (...themes: (DeepPartial<CompassTheme> | undefined)[]) => {
      const result = { ...baseTheme }

      themes.forEach((t) => {
        if (!t) return
        if (t.colors) result.colors = { ...result.colors, ...t.colors }
        if (t.spacing) result.spacing = { ...result.spacing, ...t.spacing }
        if (t.borderRadius) result.borderRadius = { ...result.borderRadius, ...t.borderRadius }
        if (t.fontSize) result.fontSize = { ...result.fontSize, ...t.fontSize }
        if (t.fontWeight) result.fontWeight = { ...result.fontWeight, ...t.fontWeight }
        if (t.lineHeight) result.lineHeight = { ...result.lineHeight, ...t.lineHeight }
        if (t.shadows) result.shadows = { ...result.shadows, ...t.shadows }
        if (t.transitions) result.transitions = { ...result.transitions, ...t.transitions }
        if (t.breakpoints) result.breakpoints = { ...result.breakpoints, ...t.breakpoints }
        if (t.components) {
          result.components = {
            ...result.components,
            button: t.components.button
              ? {
                  ...result.components.button,
                  padding: {
                    ...result.components.button.padding,
                    ...t.components.button.padding,
                  },
                  fontSize: {
                    ...result.components.button.fontSize,
                    ...t.components.button.fontSize,
                  },
                  borderRadius: {
                    ...result.components.button.borderRadius,
                    ...t.components.button.borderRadius,
                  },
                }
              : result.components.button,
            message: { ...result.components.message, ...t.components.message },
            modal: { ...result.components.modal, ...t.components.modal },
            progress: { ...result.components.progress, ...t.components.progress },
            steps: { ...result.components.steps, ...t.components.steps },
            input: t.components.input
              ? {
                  ...result.components.input,
                  ...t.components.input,
                  padding: {
                    ...result.components.input.padding,
                    ...t.components.input.padding,
                  },
                  fontSize: {
                    ...result.components.input.fontSize,
                    ...t.components.input.fontSize,
                  },
                }
              : result.components.input,
          }
        }
      })

      return result
    }

    return mergeThemeObjects(commonTheme, modeTheme)
  }, [mode, commonTheme, customLightTheme, customDarkTheme])

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggleTheme,
      theme: mergedTheme,
    }),
    [mode, mergedTheme],
  )

  return (
    <ThemeContext.Provider value={value}>
      <EmotionThemeProvider theme={mergedTheme}>{children}</EmotionThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default ThemeProvider
