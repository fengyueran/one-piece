import React from 'react'

import { ThemeProvider } from '../theme'
import { ConfigContext } from './context'
import { ConfigProviderProps } from './types'

export const ConfigProvider: React.FC<ConfigProviderProps> = (props) => {
  const { children, locale, theme } = props

  // Create a separate component/render for pure ConfigContext provider if needed,
  // but here we just wrap ThemeProvider and ConfigContext together.

  return (
    <ConfigContext.Provider value={{ locale }}>
      <ThemeProvider
        theme={theme?.token}
        lightTheme={theme?.light}
        darkTheme={theme?.dark}
        defaultMode={theme?.defaultMode}
      >
        {children}
      </ThemeProvider>
    </ConfigContext.Provider>
  )
}

export default ConfigProvider
