import type React from 'react'

/**
 * Semantic class name slots exposed by {@link Alert}.
 */
export interface AlertClassNames {
  /** Class name for the root element. */
  root?: string
  /** Class name for the icon container. */
  icon?: string
  /** Class name for the content container. */
  content?: string
  /** Class name for the title element. */
  title?: string
  /** Class name for the description element. */
  description?: string
  /** Class name for the action container. */
  action?: string
  /** Class name for the close button. */
  close?: string
}

/**
 * Semantic style slots exposed by {@link Alert}.
 */
export interface AlertStyles {
  /** Style for the root element. */
  root?: React.CSSProperties
  /** Style for the icon container. */
  icon?: React.CSSProperties
  /** Style for the content container. */
  content?: React.CSSProperties
  /** Style for the title element. */
  title?: React.CSSProperties
  /** Style for the description element. */
  description?: React.CSSProperties
  /** Style for the action container. */
  action?: React.CSSProperties
  /** Style for the close button. */
  close?: React.CSSProperties
}

/**
 * Inline feedback component used inside pages or containers.
 *
 * `Alert` is intended for persistent local feedback. It is not a replacement
 * for the transient global `Message` API.
 */
export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Visual intent of the alert.
   * @default 'info'
   */
  type?: 'info' | 'success' | 'warning' | 'error'
  /**
   * Optional alert title shown above the description.
   */
  title?: React.ReactNode
  /**
   * Main alert content.
   */
  description?: React.ReactNode
  /**
   * Optional inline action area rendered at the end of the alert.
   */
  action?: React.ReactNode
  /**
   * Custom icon. When omitted, the component uses the default icon for `type`.
   */
  icon?: React.ReactNode
  /**
   * Whether to show the icon block.
   * @default true
   */
  showIcon?: boolean
  /**
   * Whether the alert can be dismissed locally.
   * @default false
   */
  closable?: boolean
  /**
   * Callback fired after the alert is dismissed.
   */
  onClose?: () => void
  /**
   * Semantic class names for internal elements.
   */
  classNames?: AlertClassNames
  /**
   * Semantic styles for internal elements.
   */
  styles?: AlertStyles
}
