import React, { CSSProperties } from 'react'

export type DrawerPlacement = 'left' | 'right'

export interface DrawerClassNames {
  root?: string
  mask?: string
  content?: string
  header?: string
  title?: string
  body?: string
  footer?: string
}

export interface DrawerStyles {
  root?: React.CSSProperties
  mask?: React.CSSProperties
  content?: React.CSSProperties
  header?: React.CSSProperties
  title?: React.CSSProperties
  body?: React.CSSProperties
  footer?: React.CSSProperties
}

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
