import type React from 'react'

/**
 * Semantic class name slots exposed by {@link SpinLoading}.
 */
export interface SpinLoadingClassNames {
  /** Class name for the root element. */
  root?: string
  /** Class name for the overlay element when children exist. */
  overlay?: string
  /** Class name for the indicator element. */
  indicator?: string
  /** Class name for the tip element. */
  tip?: string
  /** Class name for the wrapped content. */
  content?: string
}

/**
 * Semantic style slots exposed by {@link SpinLoading}.
 */
export interface SpinLoadingStyles {
  /** Style for the root element. */
  root?: React.CSSProperties
  /** Style for the overlay element when children exist. */
  overlay?: React.CSSProperties
  /** Style for the indicator element. */
  indicator?: React.CSSProperties
  /** Style for the tip element. */
  tip?: React.CSSProperties
  /** Style for the wrapped content. */
  content?: React.CSSProperties
}

/**
 * Reusable loading state component for both inline and overlay scenarios.
 */
export interface SpinLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the loading state is active.
   * @default true
   */
  spinning?: boolean
  /**
   * Optional custom indicator content. When omitted, the default spinner is used.
   */
  indicator?: React.ReactNode
  /**
   * Supporting loading message rendered below the spinner.
   */
  tip?: React.ReactNode
  /**
   * Spinner size token or explicit pixel size.
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large' | number
  /**
   * Children to wrap. When provided, the spinner renders as an overlay.
   */
  children?: React.ReactNode
  /**
   * Semantic class names for internal elements.
   */
  classNames?: SpinLoadingClassNames
  /**
   * Semantic styles for internal elements.
   */
  styles?: SpinLoadingStyles
}
