import React from 'react'

/**
 * Props for the boolean checkbox input component.
 */
export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /**
   * Checkbox content displayed on the right side.
   */
  children?: React.ReactNode
  /**
   * Visual size of the checkbox.
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large'
  /**
   * Validation status for form feedback.
   */
  status?: 'error' | 'warning'
  /**
   * Whether the checkbox should render indeterminate state.
   * @default false
   */
  indeterminate?: boolean
  /**
   * Semantic class names for internal elements.
   */
  classNames?: {
    root?: string
    input?: string
    control?: string
    label?: string
    indicator?: string
  }
  /**
   * Semantic styles for internal elements.
   */
  styles?: {
    root?: React.CSSProperties
    input?: React.CSSProperties
    control?: React.CSSProperties
    label?: React.CSSProperties
    indicator?: React.CSSProperties
  }
}
