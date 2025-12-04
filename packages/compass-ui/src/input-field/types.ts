import React from 'react'

export interface InputFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /**
   * The type of input.
   * @default 'text'
   */
  type?: 'text' | 'password' | 'search'
  /**
   * The label content.
   */
  label?: React.ReactNode
  /**
   * The error content.
   */
  error?: boolean | React.ReactNode
  /**
   * The helper text content.
   */
  helperText?: React.ReactNode
  /**
   * If `true`, the input will take up the full width of its container.
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
}
