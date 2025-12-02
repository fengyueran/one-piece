import React from 'react'
import { createRoot } from 'react-dom/client'

import Modal from './modal'
import { ModalBaseProps } from './types'
import { InfoIcon, SuccessIcon, ErrorIcon, WarningIcon } from '../icons'
import { AnimationDuration } from './modal.styles'
import { ThemeProvider, defaultTheme } from '../theme'
import {
  ConfirmContent,
  IconWrapper,
  ContentWrapper,
  Title,
  Content,
  ConfirmFooter,
} from './confirm-styles'
import Button from '../button'

export interface ModalFuncProps extends Omit<ModalBaseProps, 'isOpen' | 'children'> {
  title?: React.ReactNode
  content?: React.ReactNode
  onOk?: () => void | Promise<void>
  onCancel?: () => void | Promise<void>
  okText?: string
  cancelText?: string
  icon?: React.ReactNode
  type?: 'info' | 'success' | 'error' | 'warning' | 'confirm'
}

const confirmDialog = (config: ModalFuncProps) => {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const root = createRoot(div)

  let currentConfig = { ...config, isOpen: false, confirmLoading: false }

  const destroy = () => {
    root.unmount()
    if (div.parentNode) {
      div.parentNode.removeChild(div)
    }
  }

  const render = (props: ModalFuncProps & { isOpen: boolean }) => {
    const {
      onOk,
      onCancel,
      title,
      content,
      icon,
      type = 'confirm',
      okText = 'OK',
      cancelText = 'Cancel',
      closable = false,
      confirmLoading,
      ...modalProps
    } = props

    const handleOk = async () => {
      if (onOk) {
        const returnValue = onOk()
        if (returnValue && typeof returnValue.then === 'function') {
          currentConfig = { ...currentConfig, confirmLoading: true }
          render(currentConfig)
          try {
            await returnValue
            close()
          } catch (e) {
            currentConfig = { ...currentConfig, confirmLoading: false }
            render(currentConfig)
            console.error('Modal confirm error', e)
            throw e
          }
        } else {
          close()
        }
      } else {
        close()
      }
    }

    const handleCancel = async () => {
      if (onCancel) {
        await onCancel()
      }
      close()
    }

    const close = () => {
      currentConfig = { ...currentConfig, isOpen: false, confirmLoading: false }
      render(currentConfig)
      setTimeout(() => {
        destroy()
      }, AnimationDuration) // Wait for animation
    }

    const iconMap: Record<string, React.ReactNode> = {
      info: <InfoIcon />,
      success: <SuccessIcon />,
      error: <ErrorIcon />,
      warning: <WarningIcon />,
    }

    const defaultIcon = iconMap[type] || <InfoIcon />

    root.render(
      <ThemeProvider theme={defaultTheme}>
        <Modal
          {...modalProps}
          width={416}
          closable={closable}
          onCancel={handleCancel}
          footer={
            <ConfirmFooter>
              {type === 'confirm' ? <Button onClick={handleCancel}>{cancelText}</Button> : null}
              <Button variant="primary" onClick={handleOk} loading={confirmLoading}>
                {okText}
              </Button>
            </ConfirmFooter>
          }
        >
          <ConfirmContent>
            <IconWrapper $type={type}>{icon || defaultIcon}</IconWrapper>
            <ContentWrapper>
              {title && <Title>{title}</Title>}
              {content && <Content>{content}</Content>}
            </ContentWrapper>
          </ConfirmContent>
        </Modal>
      </ThemeProvider>,
    )
  }

  render(currentConfig)

  // Trigger animation
  setTimeout(() => {
    currentConfig = { ...currentConfig, isOpen: true }
    render(currentConfig)
  }, 10)

  return {
    destroy: close,
    update: (newConfig: ModalFuncProps) => {
      currentConfig = { ...currentConfig, ...newConfig }
      render(currentConfig)
    },
  }
}

export const info = (props: ModalFuncProps) => confirmDialog({ ...props, type: 'info' })
export const success = (props: ModalFuncProps) => confirmDialog({ ...props, type: 'success' })
export const error = (props: ModalFuncProps) => confirmDialog({ ...props, type: 'error' })
export const warning = (props: ModalFuncProps) => confirmDialog({ ...props, type: 'warning' })
export const confirm = (props: ModalFuncProps) => confirmDialog({ ...props, type: 'confirm' })

export default confirm
