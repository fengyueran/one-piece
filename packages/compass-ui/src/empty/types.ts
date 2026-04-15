import type React from 'react'

/**
 * Semantic class name slots exposed by {@link Empty}.
 */
export interface EmptyClassNames {
  /** Class name for the root element. */
  root?: string
  /** Class name for the image container. */
  image?: string
  /** Class name for the title element. */
  title?: string
  /** Class name for the description element. */
  description?: string
  /** Class name for the action container. */
  action?: string
}

/**
 * Semantic style slots exposed by {@link Empty}.
 */
export interface EmptyStyles {
  /** Style for the root element. */
  root?: React.CSSProperties
  /** Style for the image container. */
  image?: React.CSSProperties
  /** Style for the title element. */
  title?: React.CSSProperties
  /** Style for the description element. */
  description?: React.CSSProperties
  /** Style for the action container. */
  action?: React.CSSProperties
}

/**
 * Empty state placeholder for lists, tables, panels and page sections.
 */
export interface EmptyProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Optional graphic shown above the text.
   */
  image?: React.ReactNode
  /**
   * Primary heading of the empty state.
   */
  title?: React.ReactNode
  /**
   * Supporting description rendered below the title.
   */
  description?: React.ReactNode
  /**
   * Optional action area.
   */
  action?: React.ReactNode
  /**
   * Visual density of the empty block.
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large'
  /**
   * Semantic class names for internal elements.
   */
  classNames?: EmptyClassNames
  /**
   * Semantic styles for internal elements.
   */
  styles?: EmptyStyles
}
