import { Theme, DeepPartial, ThemeMode } from '../theme/types'

export interface ModalLocale {
  okText: string
  cancelText: string
  justOkText: string
}

export interface DatePickerLocale {
  monthBeforeYear?: boolean
  yearFormat: string
  monthFormat: string
  quarterFormat: string
  today: string
  now: string
  backToToday: string
  ok: string
  timeSelect: string
  dateSelect: string
  weekSelect: string
  clear: string
  month: string
  year: string
  previousMonth: string
  nextMonth: string
  monthSelect: string
  yearSelect: string
  decadeSelect: string
  dayFormat: string
  dateFormat: string
  dateTimeFormat: string
  previousYear: string
  nextYear: string
  previousDecade: string
  nextDecade: string
  previousCentury: string
  nextCentury: string
  shortWeekDays: string[]
  weekDays: string[]
  months: string[]
  shortMonths: string[]
  hour: string
  minute: string
  second: string
  startDate: string
  endDate: string
  weekFormat: string
}

export interface PaginationLocale {
  items_per_page: string
  jump_to: string
  jump_to_confirm: string
  page: string
  prev_page: string
  next_page: string
  prev_5: string
  next_5: string
  prev_3: string
  next_3: string
}

export interface Locale {
  locale: string
  Modal: ModalLocale
  DatePicker: DatePickerLocale
  Pagination: PaginationLocale
}

export interface ThemeConfig {
  token?: DeepPartial<Theme>
  light?: DeepPartial<Theme>
  dark?: DeepPartial<Theme>
  defaultMode?: ThemeMode
}

export interface ConfigProviderProps {
  /**
   * The global configuration locale.
   */
  locale?: Locale
  /**
   * Theme configuration.
   */
  theme?: ThemeConfig
  children?: React.ReactNode
}
