export type DatePickerMode = 'date' | 'week' | 'month' | 'quarter' | 'year'

export interface DatePickerStyles {
  root?: React.CSSProperties
  input?: React.CSSProperties
  popup?: React.CSSProperties
  header?: React.CSSProperties
  body?: React.CSSProperties
  footer?: React.CSSProperties
  day?: React.CSSProperties
}

export interface DatePickerClassNames {
  root?: string
  input?: string
  popup?: string
  header?: string
  body?: string
  footer?: string
  day?: string
}

export interface DatePickerSharedProps {
  /** Picker mode */
  picker?: DatePickerMode
  /** Whether to show time picker */
  showTime?: boolean
  /** Date format string */
  format?: string
  /** Disabled state */
  disabled?: boolean
  /** Clearable */
  clearable?: boolean
  /** Custom class name */
  className?: string
  /** Custom style */
  style?: React.CSSProperties
  /** Whether the picker should take up the full width of its container */
  fullWidth?: boolean
  /** Validation status */
  status?: 'error' | 'warning'
  /**
   * Granular styles for internal components
   */
  styles?: DatePickerStyles
  /**
   * Granular class names for internal components
   */
  classNames?: DatePickerClassNames
}

export interface DatePickerProps extends DatePickerSharedProps {
  /** Selected date (JS Date) */
  value?: Date | null
  /** Default selected date (JS Date) (Only effective on mount) */
  defaultValue?: Date | null
  /** Callback when date changes */
  onChange?: (date: Date | null) => void
  /** Placeholder text */
  placeholder?: string
}

export interface DateRangePickerProps extends DatePickerSharedProps {
  /** Selected date range */
  value?: [Date | null, Date | null]
  /** Default selected date range */
  defaultValue?: [Date | null, Date | null]
  /** Callback when date range changes */
  onChange?: (dates: [Date | null, Date | null]) => void
  /** Placeholder text */
  placeholder?: [string, string]
}
