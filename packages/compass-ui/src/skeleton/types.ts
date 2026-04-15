import type React from 'react'

/**
 * Semantic class name slots exposed by {@link Skeleton}.
 */
export interface SkeletonClassNames {
  /** Class name for the root element. */
  root?: string
  /** Class name for the avatar placeholder. */
  avatar?: string
  /** Class name for the title placeholder. */
  title?: string
  /** Class name for the paragraph row placeholders. */
  row?: string
}

/**
 * Semantic style slots exposed by {@link Skeleton}.
 */
export interface SkeletonStyles {
  /** Style for the root element. */
  root?: React.CSSProperties
  /** Style for the avatar placeholder. */
  avatar?: React.CSSProperties
  /** Style for the title placeholder. */
  title?: React.CSSProperties
  /** Style for the paragraph row placeholders. */
  row?: React.CSSProperties
}

/**
 * Loading placeholder component for content blocks.
 */
export interface SkeletonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Whether the skeleton placeholder is shown.
   * @default true
   */
  loading?: boolean
  /**
   * Whether the placeholder should animate.
   * @default true
   */
  active?: boolean
  /**
   * Whether to render an avatar placeholder.
   * @default false
   */
  avatar?: boolean
  /**
   * Whether to render a title placeholder.
   * @default true
   */
  title?: boolean
  /**
   * Number of paragraph placeholder rows.
   * @default 3
   */
  rows?: number
  /**
   * Whether rows should be fully rounded.
   * @default false
   */
  round?: boolean
  /**
   * Content rendered when `loading` is false.
   */
  children?: React.ReactNode
  /**
   * Semantic class names for internal elements.
   */
  classNames?: SkeletonClassNames
  /**
   * Semantic styles for internal elements.
   */
  styles?: SkeletonStyles
}
