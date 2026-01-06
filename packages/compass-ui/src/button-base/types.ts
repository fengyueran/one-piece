export interface ButtonBaseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Whether to enable ripple effect */
  hasRipple?: boolean
  children?: React.ReactNode
}
