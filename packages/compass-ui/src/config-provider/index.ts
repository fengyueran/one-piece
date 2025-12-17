import ConfigProvider from './config-provider'
export type {
  ConfigProviderProps,
  Locale,
  ModalLocale,
  DatePickerLocale,
  PaginationLocale,
  ThemeConfig,
} from './types'

export { useConfig, ConfigContext } from './context'
export type { ConfigContextType } from './context'
export default ConfigProvider
