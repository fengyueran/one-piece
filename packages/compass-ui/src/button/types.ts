import { ButtonBaseProps } from '../button-base'

export interface ButtonProps extends ButtonBaseProps {
  /** Button type */
  variant?: 'primary' | 'default' | 'dashed' | 'text' | 'link'
  /** Button size */
  size?: 'small' | 'medium' | 'large'
  /** Button shape */
  shape?: 'default' | 'circle' | 'round'
  /** Whether the button is disabled */
  disabled?: boolean
  /** Whether the button is in loading state */
  loading?: boolean
  /** Whether the button is a danger button */
  danger?: boolean
  /** Whether the button fits the width of its parent container */
  block?: boolean
  /** Button icon */
  icon?: React.ReactNode
  /** Custom class names for internal elements */
  classNames?: {
    root?: string
    icon?: string
    text?: string
    loading?: string
  }
  /** Custom styles for internal elements */
  styles?: {
    root?: React.CSSProperties
    icon?: React.CSSProperties
    text?: React.CSSProperties
    loading?: React.CSSProperties
  }
}
