import React from 'react'

export interface TabsProps {
  /** Current active tab key */
  activeKey?: string
  /** Default active tab key */
  defaultActiveKey?: string
  /** Callback when active tab changes */
  onChange?: (activeKey: string) => void
  /** Tab items */
  items?: TabItem[]
  /** Tab bar extra content */
  tabBarExtraContent?: React.ReactNode
  /** Tab position */
  tabPosition?: 'top' | 'right' | 'bottom' | 'left'
  /** Tab type */
  type?: 'line' | 'card' | 'editable-card'
  /** Tab size */
  size?: 'small' | 'default' | 'large'
  /** Custom className */
  className?: string
  /** Custom style */
  style?: React.CSSProperties
  /** Children (TabPane components) */
  children?: React.ReactNode
  /** Callback when tab is edited */
  onEdit?: (targetKey: string, action: 'add' | 'remove') => void
}

export interface TabItem {
  key: string
  label: React.ReactNode
  children?: React.ReactNode
  disabled?: boolean
  closable?: boolean
  icon?: React.ReactNode
}

export interface TabPaneProps {
  /** Key of the tab pane */
  key?: string
  /** Label of the tab pane */
  tab: React.ReactNode
  /** Content of the tab pane */
  children?: React.ReactNode
  /** Whether the tab pane is disabled */
  disabled?: boolean
  /** Whether the tab pane is active (internal use) */
  active?: boolean
  /** Custom className */
  className?: string
  /** Custom style */
  style?: React.CSSProperties
}
