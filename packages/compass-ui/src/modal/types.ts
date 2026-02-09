import React, { CSSProperties } from 'react'

/** Modal type */
export type ModalType = 'info' | 'success' | 'error' | 'warning' | 'confirm'

export interface ModalBaseProps {
  /** Whether the modal is open */
  isOpen: boolean
  /** Whether to show the mask */
  maskVisible?: boolean
  /** Custom footer content */
  footer?: React.ReactNode
  /** Modal content */
  children?: React.ReactNode
  /** Custom class name */
  className?: string
  /** Custom style */
  style?: CSSProperties
  /** Modal title */
  title?: React.ReactNode
  /** Custom header content */
  header?: React.ReactNode
  /** Whether to show the close button */
  closable?: boolean
  /** Width of the modal */
  width?: string | number
  /** Callback when the OK button is clicked */
  onOk?: (e?: React.MouseEvent<HTMLElement>) => void | Promise<void>
  /** Callback when the Cancel button is clicked */
  onCancel?: (e?: React.MouseEvent<HTMLElement>) => void | Promise<void>
  /** Text of the OK button */
  okText?: React.ReactNode
  /** Text of the Cancel button */
  cancelText?: React.ReactNode
  /** Whether the OK button is loading */
  confirmLoading?: boolean
  /** Callback when the modal is completely closed (after animation) */
  /** Callback when the modal is completely closed (after animation) */
  afterClose?: () => void

  /** Granular styles */
  styles?: {
    root?: React.CSSProperties
    mask?: React.CSSProperties
    content?: React.CSSProperties
    header?: React.CSSProperties
    body?: React.CSSProperties
    footer?: React.CSSProperties
  }

  /** Granular class names */
  classNames?: {
    root?: string
    mask?: string
    content?: string
    header?: string
    body?: string
    footer?: string
  }
}
