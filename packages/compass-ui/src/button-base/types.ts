export interface ButtonBaseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Whether to enable ripple effect */
  hasRipple?: boolean
  /** Ripple background color */
  rippleBgColor?: string
  /** Ripple opacity */
  rippleOpacity?: number
}
