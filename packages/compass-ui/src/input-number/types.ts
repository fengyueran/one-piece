import { InputFieldProps } from '../input-field'

export interface InputNumberProps
  extends Omit<InputFieldProps, 'onChange' | 'value' | 'defaultValue' | 'type' | 'allowClear'> {
  /**
   * The current value.
   */
  value?: number | null
  /**
   * The default value.
   */
  defaultValue?: number | null
  /**
   * The minimum value.
   */
  min?: number
  /**
   * The maximum value.
   */
  max?: number
  /**
   * The step size for increment/decrement.
   * @default 1
   */
  step?: number
  /**
   * Callback when the value changes.
   */
  onChange?: (value: number | null) => void
  /**
   * Precision of the input value.
   */
  precision?: number
  /**
   * Whether to show increment/decrement buttons.
   * @default true
   */
  controls?: boolean
  /**
   * Whether to enable keyboard up/down keys.
   * @default true
   */
  keyboard?: boolean
  /**
   * Semantic class names for internal elements
   */
  classNames?: {
    root?: string
    input?: string
    inputWrapper?: string
    prefix?: string
    suffix?: string
    upHandler?: string
    downHandler?: string
  }
  /**
   * Semantic styles for internal elements
   */
  styles?: {
    root?: React.CSSProperties
    input?: React.CSSProperties
    inputWrapper?: React.CSSProperties
    prefix?: React.CSSProperties
    suffix?: React.CSSProperties
    upHandler?: React.CSSProperties
    downHandler?: React.CSSProperties
  }
}
