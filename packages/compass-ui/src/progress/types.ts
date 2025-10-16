import { ReactNode } from 'react'

export type ProgressType = 'line' | 'circle'
export type ProgressSize = 'small' | 'medium' | 'large' | number | { width: number; height: number }
export type ProgressStatus = 'normal' | 'success' | 'error' | 'warning'

export interface ProgressProps {
  /** Progress type */
  type?: ProgressType
  /** Progress percentage (0-100) */
  percent?: number
  /** Progress size - for line: height (string/number) or { width, height }, for circle: diameter */
  size?: ProgressSize
  /** Progress status */
  status?: ProgressStatus
  /** Show percentage text */
  showInfo?: boolean
  /** Custom format function for percentage text */
  format?: (percent?: number) => ReactNode
  /** Stroke width for line progress or circle progress */
  strokeWidth?: number
  /** Stroke color */
  strokeColor?: string | { from: string; to: string; direction?: string }
  /** Trail color (background color) */
  trailColor?: string
  /** Whether to show success icon when percent is 100 */
  success?: ReactNode
  /** Custom className */
  className?: string
  /** Custom style */
  style?: React.CSSProperties
}

export interface LinearProgressProps extends Omit<ProgressProps, 'type' | 'strokeWidth'> {
  type?: 'line'
}

export interface CircleProgressProps extends Omit<ProgressProps, 'type'> {
  type?: 'circle'
}
