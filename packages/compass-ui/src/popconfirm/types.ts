import React from 'react'

import type { PopoverPlacement } from '../popover/types'

/**
 * Semantic class name slots exposed by {@link Popconfirm}.
 */
export interface PopconfirmClassNames {
  /** Class name for the trigger wrapper. */
  root?: string
  /** Class name for the floating overlay card. */
  overlay?: string
  /** Class name for the title node. */
  title?: string
  /** Class name for the description node. */
  description?: string
  /** Class name for the action button row. */
  actions?: string
}

/**
 * Semantic style slots exposed by {@link Popconfirm}.
 */
export interface PopconfirmStyles {
  /** Style for the trigger wrapper. */
  root?: React.CSSProperties
  /** Style for the floating overlay card. */
  overlay?: React.CSSProperties
  /** Style for the title node. */
  title?: React.CSSProperties
  /** Style for the description node. */
  description?: React.CSSProperties
  /** Style for the action button row. */
  actions?: React.CSSProperties
}

/**
 * Props for the lightweight anchored confirmation overlay component.
 */
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
