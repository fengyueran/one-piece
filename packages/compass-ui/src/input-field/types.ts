import React from 'react'

export interface InputFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /**
   * The type of input.
   * @default 'text'
   */
  type?: 'text' | 'password' | 'search'
  /**
   * If `true`, the input will take up the full width of its container.
   * @default false
   */
  fullWidth?: boolean
  /**
   * Start adornment for this component.
   */
  prefix?: React.ReactNode
  /**
   * End adornment for this component.
   */
  suffix?: React.ReactNode
  /**
   * If `true`, a clear icon will appear when the input has value.
   * @default false
   */
  allowClear?: boolean
  /**
   * The value of the input element, required for a controlled component.
   */
  value?: string | number
  /**
   * The default value. Use when the component is not controlled.
   */
  defaultValue?: string | number
  /**
   * The size of the component.
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large'
  /**
   * The callback function that is triggered when Enter key is pressed.
   */
  onPressEnter?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  /**
   * The validation status.
   */
  status?: 'error' | 'warning'
  /**
   * Semantic class names for internal elements
   */
  classNames?: {
    /** Class name for the root element */
    root?: string
    /** Class name for the input element */
    input?: string
    /** Class name for the prefix element */
    prefix?: string
    /** Class name for the suffix element */
    suffix?: string
    /** Class name for the clear button */
    clear?: string
  }
  /**
   * Semantic styles for internal elements
   */
  styles?: {
    /** Style for the root element */
    root?: React.CSSProperties
    /** Style for the input element */
    input?: React.CSSProperties
    /** Style for the prefix element */
    prefix?: React.CSSProperties
    /** Style for the suffix element */
    suffix?: React.CSSProperties
    /** Style for the clear button */
    clear?: React.CSSProperties
  }
}
