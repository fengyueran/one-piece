export type DatePickerMode = 'date' | 'week' | 'month' | 'quarter' | 'year'

export interface DatePickerProps {
  /** Selected date (JS Date) */
  value?: Date | null
  /** Default selected date (JS Date) (Only effective on mount) */
  defaultValue?: Date | null
  /** Callback when date changes */
  onChange?: (date: Date | null) => void
  /** Picker mode */
  picker?: DatePickerMode
  /** Whether to show time picker */
  showTime?: boolean
  /** Date format string */
  format?: string
  /** Disabled state */
  disabled?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Clearable */
  clearable?: boolean
  /** Custom class name */
  className?: string
  /** Custom style */
  style?: React.CSSProperties
}

export interface DateRangePickerProps {
  /** Selected date range */
  value?: [Date | null, Date | null]
  /** Default selected date range */
  defaultValue?: [Date | null, Date | null]
  /** Callback when date range changes */
  onChange?: (dates: [Date | null, Date | null]) => void
  /** Picker mode */
  picker?: DatePickerMode
  /** Whether to show time picker */
  showTime?: boolean
  /** Date format string */
  format?: string
  /** Disabled state */
  disabled?: boolean
  /** Placeholder text */
  placeholder?: [string, string]
  /** Clearable */
  clearable?: boolean
  /** Custom class name */
  className?: string
  /** Custom style */
  style?: React.CSSProperties
}
