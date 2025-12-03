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

export interface TypeOpen {
  (content: React.ReactNode, duration?: number, onClose?: () => void): void
  (config: MessageProps): void
}

export interface MessageInstance {
  info: TypeOpen
  success: TypeOpen
  error: TypeOpen
  warning: TypeOpen
  loading: TypeOpen
  open(config: MessageProps): void
  destroy(key?: string): void
}
