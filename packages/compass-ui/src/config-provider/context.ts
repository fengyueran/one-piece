import { createContext, useContext } from 'react'
import { Locale } from './types'

export interface ConfigContextType {
  locale?: Locale
}

export const ConfigContext = createContext<ConfigContextType>({
  locale: undefined,
})

export const useConfig = () => {
  return useContext(ConfigContext)
}
