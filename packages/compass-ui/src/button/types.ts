import { ButtonBaseProps } from '../button-base'

export interface ButtonProps extends ButtonBaseProps {
  variant?: 'primary' | 'default' | 'dashed' | 'text' | 'link'
  size?: 'small' | 'default' | 'large'
  shape?: 'default' | 'circle' | 'round'
  disabled?: boolean
  loading?: boolean
  danger?: boolean
  block?: boolean
  icon?: React.ReactNode
}
