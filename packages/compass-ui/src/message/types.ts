import React from 'react'

export type MessageType = 'info' | 'success' | 'error' | 'warning' | 'loading'

export interface MessageProps {
  key?: string
  type?: MessageType
  content: React.ReactNode
  duration?: number
  onClose?: () => void
  icon?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export interface MessageInstance {
  info(content: React.ReactNode, duration?: number, onClose?: () => void): void
  success(content: React.ReactNode, duration?: number, onClose?: () => void): void
  error(content: React.ReactNode, duration?: number, onClose?: () => void): void
  warning(content: React.ReactNode, duration?: number, onClose?: () => void): void
  loading(content: React.ReactNode, duration?: number, onClose?: () => void): void
  open(config: MessageProps): void
  destroy(): void
}
