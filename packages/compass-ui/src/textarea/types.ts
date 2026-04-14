import type React from 'react'

export interface TextareaClassNames {
  /** Class name for the root element */
  root?: string
  /** Class name for the textarea element */
  textarea?: string
  /** Class name for the prefix element */
  prefix?: string
  /** Class name for the suffix element */
  suffix?: string
  /** Class name for the clear button */
  clear?: string
}

export interface TextareaStyles {
  /** Style for the root element */
  root?: React.CSSProperties
  /** Style for the textarea element */
  textarea?: React.CSSProperties
  /** Style for the prefix element */
  prefix?: React.CSSProperties
  /** Style for the suffix element */
  suffix?: React.CSSProperties
  /** Style for the clear button */
  clear?: React.CSSProperties
}

/**
 * Standard multi-line text input props.
 */
export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'prefix'> {
  /**
   * Whether the textarea takes the full width of its container.
   * @default false
   */
  fullWidth?: boolean
  /**
   * Content displayed before the textarea.
   */
  prefix?: React.ReactNode
  /**
   * Content displayed after the textarea.
   */
  suffix?: React.ReactNode
  /**
   * Whether to show a clear control when there is content.
   * @default false
   */
  allowClear?: boolean
  /**
   * Component size.
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large'
  /**
   * Validation status.
   */
  status?: 'error' | 'warning'
  /**
   * Called when the user presses Enter.
   */
  onPressEnter?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void
  /**
   * Semantic class names for internal elements.
   */
  classNames?: TextareaClassNames
  /**
   * Semantic styles for internal elements.
   */
  styles?: TextareaStyles
}
