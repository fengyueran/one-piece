import React from 'react'
import { Placement } from '@floating-ui/react'

import { MenuProps } from '../menu'

/**
 * Dropdown component properties
 */
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
   * Custom root element class name
   */
  className?: string

  /**
   * Custom root element style
   */
  style?: React.CSSProperties

  /**
   * Custom overlay element class name
   */
  overlayClassName?: string

  /**
   * Custom overlay element style
   */
  overlayStyle?: React.CSSProperties

  /**
   * Semantic class names for internal elements
   */
  classNames?: {
    /** Class name for the trigger element */
    trigger?: string
    /** Class name for the overlay container */
    overlay?: string
    /** Class name for the content wrapper */
    content?: string
  }

  /**
   * Semantic styles for internal elements
   */
  styles?: {
    /** Style for the trigger element */
    trigger?: React.CSSProperties
    /** Style for the overlay container */
    overlay?: React.CSSProperties
    /** Style for the content wrapper */
    content?: React.CSSProperties
  }

  /**
   * Whether to close the dropdown when a menu item is selected
   * @default true
   */
  closeOnSelect?: boolean
}
