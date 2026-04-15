import React, { useState } from 'react'

import Button from '../button'
import Popover from '../popover'
import {
  PopconfirmActions,
  PopconfirmContent,
  PopconfirmDescription,
  PopconfirmTitle,
} from './popconfirm.styles'
import { PopconfirmProps } from './types'

const Popconfirm: React.FC<PopconfirmProps> = ({
  title,
  description,
  children,
  trigger = 'click',
  placement = 'top',
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  onConfirm,
  onCancel,
  okText = '确定',
  cancelText = '取消',
  disabled = false,
  className,
  style,
  classNames,
  styles,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const handleOpenChange = (nextOpen: boolean) => {
    if (disabled) {
      return
    }

    if (!isControlled) {
      setUncontrolledOpen(nextOpen)
    }

    if (!nextOpen) {
      setConfirmLoading(false)
    }

    onOpenChange?.(nextOpen)
  }

  const closePopover = () => {
    if (!isControlled) {
      setUncontrolledOpen(false)
    }
    setConfirmLoading(false)
    onOpenChange?.(false)
  }

  const handleCancel = (event: React.MouseEvent<HTMLElement>) => {
    onCancel?.(event)
    closePopover()
  }

  const handleConfirm = async (event: React.MouseEvent<HTMLElement>) => {
    if (!onConfirm) {
      closePopover()
      return
    }

    const result = onConfirm(event)
    if (result && typeof result.then === 'function') {
      setConfirmLoading(true)
      try {
        await result
        closePopover()
      } catch (error) {
        setConfirmLoading(false)
        throw error
      }
      return
    }

    closePopover()
  }

  return (
    <Popover
      title={null}
      content={
        <PopconfirmContent className={`compass-popconfirm ${classNames?.overlay || ''}`}>
          <PopconfirmTitle
            className={`compass-popconfirm-title ${classNames?.title || ''}`}
            style={styles?.title}
          >
            {title}
          </PopconfirmTitle>
          {description ? (
            <PopconfirmDescription
              className={`compass-popconfirm-description ${classNames?.description || ''}`}
              style={styles?.description}
            >
              {description}
            </PopconfirmDescription>
          ) : null}
          <PopconfirmActions
            className={`compass-popconfirm-actions ${classNames?.actions || ''}`}
            style={styles?.actions}
          >
            <Button variant="text" size="small" onClick={handleCancel}>
              {cancelText}
            </Button>
            <Button variant="primary" size="small" onClick={handleConfirm} loading={confirmLoading}>
              {okText}
            </Button>
          </PopconfirmActions>
        </PopconfirmContent>
      }
      trigger={trigger}
      placement={placement}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={handleOpenChange}
      disabled={disabled}
      className={className}
      style={style}
      classNames={{ root: classNames?.root }}
      styles={{ root: styles?.root, overlay: styles?.overlay }}
    >
      {children}
    </Popover>
  )
}

Popconfirm.displayName = 'Popconfirm'

export default Popconfirm
