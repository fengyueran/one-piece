import React from 'react'
import { Placement } from '@floating-ui/react'

import { MenuProps } from '../menu'

export interface DropdownProps {
  /**
   * Trigger mode
   * @default 'hover'
   */
  trigger?: 'click' | 'hover'

  /**
   * Placement of the dropdown menu
   * @default 'bottom-start'
   */
  placement?: Placement

  /**
   * The content of the dropdown menu
   */
  overlay?: React.ReactNode

  /**
   * The menu configuration (data-driven)
   */
  menu?: MenuProps

  /**
   * Whether the dropdown is visible (controlled)
   */
  visible?: boolean

  /**
   * Callback when visibility changes
   */
  onVisibleChange?: (visible: boolean) => void

  /**
   * The trigger element
   */
  children: React.ReactNode

  /**
   * Whether the dropdown is disabled
   */
  disabled?: boolean

  /**
   * Custom class name
   */
  className?: string

  /**
   * Custom style
   */
  style?: React.CSSProperties
}
