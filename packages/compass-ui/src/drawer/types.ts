import React, { CSSProperties } from 'react'

/**
 * Supported placement values for {@link Drawer}.
 */
export type DrawerPlacement = 'left' | 'right'

/**
 * Semantic class name slots exposed by {@link Drawer}.
 */
export interface DrawerClassNames {
  /** Class name for the portal root wrapper. */
  root?: string
  /** Class name for the backdrop mask. */
  mask?: string
  /** Class name for the drawer panel element. */
  content?: string
  /** Class name for the header wrapper. */
  header?: string
  /** Class name for the title node. */
  title?: string
  /** Class name for the body wrapper. */
  body?: string
  /** Class name for the footer wrapper. */
  footer?: string
}

/**
 * Semantic style slots exposed by {@link Drawer}.
 */
export interface DrawerStyles {
  /** Style for the portal root wrapper. */
  root?: React.CSSProperties
  /** Style for the backdrop mask. */
  mask?: React.CSSProperties
  /** Style for the drawer panel element. */
  content?: React.CSSProperties
  /** Style for the header wrapper. */
  header?: React.CSSProperties
  /** Style for the title node. */
  title?: React.CSSProperties
  /** Style for the body wrapper. */
  body?: React.CSSProperties
  /** Style for the footer wrapper. */
  footer?: React.CSSProperties
}

/**
 * Props for the page-level side panel overlay component.
 */
export interface DrawerProps {
  /**
   * Whether the drawer is open.
   */
  isOpen: boolean

  /**
   * Drawer content.
   */
  children?: React.ReactNode

  /**
   * Whether to show the mask.
   * @default true
   */
  maskVisible?: boolean

  /**
   * Drawer title.
   */
  title?: React.ReactNode

  /**
   * Custom header content.
   */
  header?: React.ReactNode

  /**
   * Custom footer content.
   */
  footer?: React.ReactNode

  /**
   * Whether to show the close button.
   * @default true
   */
  closable?: boolean

  /**
   * Drawer placement.
   * @default 'right'
   */
  placement?: DrawerPlacement

  /**
   * Drawer width.
   * @default 420
   */
  width?: string | number

  /**
   * Callback when the drawer requests to close.
   */
  onCancel?: (event?: React.MouseEvent<HTMLElement>) => void | Promise<void>

  /**
   * Callback fired after the close transition finishes.
   */
  afterClose?: () => void

  /**
   * Custom class name for the trigger root.
   */
  className?: string

  /**
   * Custom content style.
   */
  style?: CSSProperties

  /**
   * Granular class names.
   */
  classNames?: DrawerClassNames

  /**
   * Granular inline styles.
   */
  styles?: DrawerStyles
}
