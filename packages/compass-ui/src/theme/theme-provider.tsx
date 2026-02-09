import React, { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { ThemeProvider as EmotionThemeProvider, Global, css } from '@emotion/react'

import { Theme as CompassTheme, ThemeMode, DeepPartial, ThemeProviderProps } from './types'
import { defaultTheme } from './default-theme'
import { darkTheme as builtinDarkTheme } from './dark-theme'
import { deepMerge } from './utils'
import { themeToCssVariables } from './token-utils'

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
  global,
}) => {
  const [mode, setMode] = useState<ThemeMode>(defaultMode)
  const parentContext = useContext(ThemeContext)
  const isNested = !!parentContext

  // Default global to true if not nested, false if nested
  const shouldInjectGlobal = global ?? !isNested

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

  const cssVariables = useMemo(() => themeToCssVariables(mergedTheme), [mergedTheme])

  return (
    <ThemeContext.Provider value={value}>
      <EmotionThemeProvider theme={mergedTheme}>
        {shouldInjectGlobal && (
          <Global
            styles={css({
              ':root': cssVariables,
            })}
          />
        )}
        <div
          className="compass-theme-scope"
          style={
            {
              display: 'contents',
              ...(!shouldInjectGlobal ? cssVariables : {}),
            } as React.CSSProperties
          }
        >
          {children}
        </div>
      </EmotionThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    return {
      mode: 'light',
      setMode: () => {},
      toggleTheme: () => {},
      theme: defaultTheme,
    } as ThemeContextType
  }
  return context
}

export default ThemeProvider
