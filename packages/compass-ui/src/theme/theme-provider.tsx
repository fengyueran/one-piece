import React, { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react'

import { Theme as CompassTheme, ThemeMode, DeepPartial, ThemeProviderProps } from './types'
import { defaultTheme } from './default-theme'
import { darkTheme as builtinDarkTheme } from './dark-theme'
import { deepMerge } from './utils'

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
      let result = { ...baseTheme }

      themes.forEach((t) => {
        if (t) {
          result = deepMerge(result, t)
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
