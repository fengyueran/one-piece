import React from 'react'

export interface ItemType {
  /**
   * Unique key
   */
  key: string | number

  /**
   * Label content
   */
  label: React.ReactNode

  /**
   * Icon element
   */
  icon?: React.ReactNode

  /**
   * Whether the item is disabled
   */
  disabled?: boolean

  /**
   * Danger state
   */
  danger?: boolean

  /**
   * Click handler
   */
  onClick?: (e: React.MouseEvent) => void

  /**
   * Custom class name
   */
  className?: string

  /**
   * Custom style
   */
  style?: React.CSSProperties
}

export interface MenuProps {
  /**
   * Menu content (legacy)
   */
  children?: React.ReactNode

  /**
   * Menu items (data-driven)
   */
  items?: ItemType[]

  /**
   * Custom class name
   */
  className?: string

  /**
   * Custom style
   */
  style?: React.CSSProperties

  /**
   * Menu click handler
   */
  onClick?: (e: React.MouseEvent, key?: string | number) => void
}

export interface MenuItemProps {
  /**
   * Item content
   */
  children: React.ReactNode

  /**
   * Click handler
   */
  onClick?: (e: React.MouseEvent) => void

  /**
   * Whether the item is disabled
   */
  disabled?: boolean

  /**
   * Icon element
   */
  icon?: React.ReactNode

  /**
   * Danger state
   */
  danger?: boolean

  /**
   * Custom class name
   */
  className?: string

  /**
   * Custom style
   */
  style?: React.CSSProperties
}
