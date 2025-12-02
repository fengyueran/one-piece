import React, { CSSProperties } from 'react'

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
  afterClose?: () => void
}
