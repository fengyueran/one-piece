export interface ButtonBaseProps {
  /** Whether to enable ripple effect */
  hasRipple?: boolean
  /** Custom class name */
  className?: string
  /** Custom style */
  style?: React.CSSProperties
  /** Whether the button is disabled */
  disabled?: boolean
  /** Ripple background color */
  rippleBgColor?: string
  /** Ripple opacity */
  rippleOpacity?: number
  /** Button content */
  children?: React.ReactNode
  /** Click event handler */
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}
