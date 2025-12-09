import { ThemeProviderProps } from '../theme/types'

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

export interface Locale {
  locale: string
  Modal: ModalLocale
  DatePicker: DatePickerLocale
}

export interface ConfigProviderProps extends Partial<ThemeProviderProps> {
  locale?: Locale
  children?: React.ReactNode
}
