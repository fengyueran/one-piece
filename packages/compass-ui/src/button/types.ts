import { ButtonBaseProps } from '../button-base'

export interface ButtonProps extends ButtonBaseProps {
  /** Button type */
  variant?: 'primary' | 'default' | 'dashed' | 'text' | 'link'
  /** Button size */
  size?: 'small' | 'default' | 'large'
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
}
