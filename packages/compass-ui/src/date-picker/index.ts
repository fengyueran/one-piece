import DatePickerInternal from './date-picker'
import DateRangePicker from './date-range-picker'

type InternalDatePickerType = typeof DatePickerInternal

interface DatePickerInterface extends InternalDatePickerType {
  RangePicker: typeof DateRangePicker
}

const DatePicker = DatePickerInternal as DatePickerInterface
DatePicker.RangePicker = DateRangePicker

export type { DatePickerProps, DateRangePickerProps } from './types'

export default DatePicker
