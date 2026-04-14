import React from 'react'

/**
 * Props for the immediate boolean toggle switch component.
 */
export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange'> {
  /**
   * Current checked state.
   */
  checked?: boolean
  /**
   * Initial checked state for uncontrolled usage.
   */
  defaultChecked?: boolean
  /**
   * Visual size of the switch.
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large'
  /**
   * Validation status for form feedback.
   */
  status?: 'error' | 'warning'
  /**
   * Optional label rendered beside the switch.
   */
  children?: React.ReactNode
  /**
   * Content rendered inside the track when checked.
   */
  checkedChildren?: React.ReactNode
  /**
   * Content rendered inside the track when unchecked.
   */
  uncheckedChildren?: React.ReactNode
  /**
   * Callback fired with the next checked state.
   */
  onCheckedChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void
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
    track?: string
    thumb?: string
    inner?: string
    label?: string
  }
  /**
   * Semantic styles for internal elements.
   */
  styles?: {
    root?: React.CSSProperties
    input?: React.CSSProperties
    track?: React.CSSProperties
    thumb?: React.CSSProperties
    inner?: React.CSSProperties
    label?: React.CSSProperties
  }
}
