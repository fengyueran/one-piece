import React from 'react'

import type { PopoverPlacement } from '../popover/types'

export interface PopconfirmClassNames {
  root?: string
  overlay?: string
  title?: string
  description?: string
  actions?: string
}

export interface PopconfirmStyles {
  root?: React.CSSProperties
  overlay?: React.CSSProperties
  title?: React.CSSProperties
  description?: React.CSSProperties
  actions?: React.CSSProperties
}

export interface PopconfirmProps {
  /**
   * 确认标题。
   */
  title: React.ReactNode

  /**
   * 补充描述。
   */
  description?: React.ReactNode

  /**
   * 触发元素。
   */
  children: React.ReactElement

  /**
   * 触发方式。
   * @default 'click'
   */
  trigger?: 'click' | 'hover'

  /**
   * 弹层位置。
   * @default 'top'
   */
  placement?: PopoverPlacement

  /**
   * 受控展开状态。
   */
  open?: boolean

  /**
   * 非受控默认展开状态。
   * @default false
   */
  defaultOpen?: boolean

  /**
   * 展开状态变化回调。
   */
  onOpenChange?: (open: boolean) => void

  /**
   * 点击确认按钮后的回调。支持 Promise。
   */
  onConfirm?: (event?: React.MouseEvent<HTMLElement>) => void | Promise<void>

  /**
   * 点击取消按钮后的回调。
   */
  onCancel?: (event?: React.MouseEvent<HTMLElement>) => void

  /**
   * 确认按钮文案。
   * @default '确定'
   */
  okText?: React.ReactNode

  /**
   * 取消按钮文案。
   * @default '取消'
   */
  cancelText?: React.ReactNode

  /**
   * 是否禁用。
   * @default false
   */
  disabled?: boolean

  /**
   * 自定义触发器类名。
   */
  className?: string

  /**
   * 自定义触发器样式。
   */
  style?: React.CSSProperties

  /**
   * 语义化类名。
   */
  classNames?: PopconfirmClassNames

  /**
   * 语义化样式。
   */
  styles?: PopconfirmStyles
}
