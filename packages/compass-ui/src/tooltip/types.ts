import React from 'react'

export type TooltipPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'

export interface TooltipClassNames {
  /**
   * Custom class name for the trigger root.
   */
  root?: string

  /**
   * Custom class name for the floating overlay container.
   */
  overlay?: string

  /**
   * Custom class name for the tooltip content node.
   */
  content?: string

  /**
   * Custom class name for the tooltip arrow node.
   */
  arrow?: string
}

export interface TooltipStyles {
  /**
   * Inline style applied to the trigger root.
   */
  root?: React.CSSProperties

  /**
   * Inline style applied to the floating overlay container.
   */
  overlay?: React.CSSProperties

  /**
   * Inline style applied to the tooltip content node.
   */
  content?: React.CSSProperties

  /**
   * Inline style applied to the tooltip arrow node.
   */
  arrow?: React.CSSProperties
}

export interface TooltipProps {
  /**
   * Tooltip content
   */
  content?: React.ReactNode

  /**
   * Trigger element. Fragment and non-element nodes will be wrapped with a span.
   */
  children: React.ReactNode

  /**
   * Trigger mode
   * @default 'hover'
   */
  trigger?: 'hover' | 'click'

  /**
   * Tooltip placement
   * @default 'top'
   */
  placement?: TooltipPlacement

  /**
   * Controlled open state
   */
  open?: boolean

  /**
   * Default open state
   */
  defaultOpen?: boolean

  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void

  /**
   * Whether the tooltip is disabled
   */
  disabled?: boolean

  /**
   * Mouse enter delay in ms
   * @default 0
   */
  mouseEnterDelay?: number

  /**
   * Mouse leave delay in ms
   * @default 100
   */
  mouseLeaveDelay?: number

  /**
   * Custom root element class name
   */
  className?: string

  /**
   * Custom root element style
   */
  style?: React.CSSProperties

  /**
   * Semantic class names
   */
  classNames?: TooltipClassNames

  /**
   * Semantic styles
   */
  styles?: TooltipStyles
}
