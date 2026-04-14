import React from 'react'

export type PopoverPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

export interface PopoverClassNames {
  root?: string
  overlay?: string
  header?: string
  title?: string
  body?: string
}

export interface PopoverStyles {
  root?: React.CSSProperties
  overlay?: React.CSSProperties
  header?: React.CSSProperties
  title?: React.CSSProperties
  body?: React.CSSProperties
}

export interface PopoverProps {
  /**
   * 弹层标题。
   */
  title?: React.ReactNode

  /**
   * 弹层主体内容。
   */
  content?: React.ReactNode

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
  classNames?: PopoverClassNames

  /**
   * 语义化样式。
   */
  styles?: PopoverStyles
}
