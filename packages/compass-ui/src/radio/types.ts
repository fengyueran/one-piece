import React from 'react'

export interface RadioOption {
  /**
   * Label rendered for the option.
   */
  label: React.ReactNode
  /**
   * Option value.
   */
  value: string | number
  /**
   * Whether this option is disabled.
   */
  disabled?: boolean
}

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange'> {
  /**
   * Radio content displayed on the right side.
   */
  children?: React.ReactNode
  /**
   * Current checked state.
   */
  checked?: boolean
  /**
   * Initial checked state for uncontrolled usage.
   */
  defaultChecked?: boolean
  /**
   * Option value.
   */
  value?: string | number
  /**
   * Visual size of the radio.
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large'
  /**
   * Validation status for form feedback.
   */
  status?: 'error' | 'warning'
  /**
   * Native change callback.
   */
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  /**
   * Semantic class names for internal elements.
   */
  classNames?: {
    root?: string
    input?: string
    control?: string
    dot?: string
    label?: string
  }
  /**
   * Semantic styles for internal elements.
   */
  styles?: {
    root?: React.CSSProperties
    input?: React.CSSProperties
    control?: React.CSSProperties
    dot?: React.CSSProperties
    label?: React.CSSProperties
  }
}

export interface RadioGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /**
   * Controlled selected value.
   */
  value?: string | number
  /**
   * Initial selected value for uncontrolled usage.
   */
  defaultValue?: string | number
  /**
   * Shared radio name.
   */
  name?: string
  /**
   * Disable all radios inside the group.
   * @default false
   */
  disabled?: boolean
  /**
   * Visual size applied to child radios.
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large'
  /**
   * Validation status for child radios.
   */
  status?: 'error' | 'warning'
  /**
   * Layout direction for the group.
   * @default 'vertical'
   */
  direction?: 'horizontal' | 'vertical'
  /**
   * Radio children.
   */
  children?: React.ReactNode
  /**
   * Shortcut options config.
   */
  options?: RadioOption[]
  /**
   * Callback fired with next value.
   */
  onChange?: (
    value: string | number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void
  /**
   * Semantic class names for internal elements.
   */
  classNames?: {
    root?: string
  }
  /**
   * Semantic styles for internal elements.
   */
  styles?: {
    root?: React.CSSProperties
  }
}
