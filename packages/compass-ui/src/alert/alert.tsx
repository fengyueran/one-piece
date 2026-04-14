import React from 'react'

import { CloseIcon, ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from '../icons'
import { AlertProps } from './types'
import {
  AlertAction,
  AlertCloseButton,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertRoot,
  AlertTitle,
} from './alert.styles'

const defaultIcons = {
  info: <InfoIcon />,
  success: <SuccessIcon />,
  warning: <WarningIcon />,
  error: <ErrorIcon />,
}

/**
 * Persistent inline feedback for pages and local containers.
 */
const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  const {
    type = 'info',
    title,
    description,
    action,
    icon,
    showIcon = true,
    closable = false,
    onClose,
    className,
    style,
    classNames,
    styles,
    children,
    ...rest
  } = props
  const [closed, setClosed] = React.useState(false)

  if (closed) {
    return null
  }

  const content = description ?? children

  return (
    <AlertRoot
      {...rest}
      ref={ref}
      $type={type}
      role={type === 'error' || type === 'warning' ? 'alert' : 'status'}
      className={`compass-alert compass-alert--${type} ${className || ''} ${classNames?.root || ''}`}
      style={{ ...style, ...styles?.root }}
    >
      {showIcon && (
        <AlertIcon
          $type={type}
          aria-hidden="true"
          className={`compass-alert-icon ${classNames?.icon || ''}`}
          style={styles?.icon}
        >
          {icon || defaultIcons[type]}
        </AlertIcon>
      )}
      <AlertContent
        className={`compass-alert-content ${classNames?.content || ''}`}
        style={styles?.content}
      >
        {title && (
          <AlertTitle
            className={`compass-alert-title ${classNames?.title || ''}`}
            style={styles?.title}
          >
            {title}
          </AlertTitle>
        )}
        {content && (
          <AlertDescription
            className={`compass-alert-description ${classNames?.description || ''}`}
            style={styles?.description}
          >
            {content}
          </AlertDescription>
        )}
      </AlertContent>
      {(action || closable) && (
        <AlertAction
          className={`compass-alert-action ${classNames?.action || ''}`}
          style={styles?.action}
        >
          {action}
          {closable && (
            <AlertCloseButton
              type="button"
              aria-label="关闭提示"
              className={`compass-alert-close ${classNames?.close || ''}`}
              style={styles?.close}
              onClick={() => {
                setClosed(true)
                onClose?.()
              }}
            >
              <CloseIcon />
            </AlertCloseButton>
          )}
        </AlertAction>
      )}
    </AlertRoot>
  )
})

Alert.displayName = 'Alert'

export default Alert
