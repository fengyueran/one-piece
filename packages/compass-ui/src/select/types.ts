import React from 'react'

export type SelectValue = string | number | (string | number)[]

export interface SelectOption {
  label: React.ReactNode
  value: string | number
  disabled?: boolean
  [key: string]: any
}

export interface SelectProps {
  /**
   * Selected value(s)
   */
  value?: SelectValue

  /**
   * Default selected value(s)
   */
  defaultValue?: SelectValue

  /**
   * Callback when value changes
   */
  onChange?: (value: SelectValue, option?: SelectOption | SelectOption[]) => void

  /**
   * Options for data-driven rendering
   */
  options?: SelectOption[]

  /**
   * Whether to allow multiple selection
   */
  multiple?: boolean

  /**
   * Used for setting specific mode, e.g. 'tags' (combined with multiple)
   */
  mode?: 'multiple' | 'tags'

  /**
   * Whether the select is disabled
   */
  disabled?: boolean

  /**
   * Whether the select is loading
   */
  loading?: boolean

  /**
   * Whether to show search input
   */
  showSearch?: boolean

  /**
   * Placeholder text
   */
  placeholder?: string

  /**
   * Whether to allow clearing the selection
   */
  allowClear?: boolean

  /**
   * Custom class name
   */
  className?: string

  /**
   * Custom style
   */
  style?: React.CSSProperties

  /**
   * Size of the select input
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large'

  /**
   * Status of the select input
   */
  status?: 'error' | 'warning'

  /**
   * Custom dropdown width
   */
  dropdownStyle?: React.CSSProperties

  /**
   * Custom dropdown class name
   */
  dropdownClassName?: string

  /**
   * Children for declarative usage
   */
  children?: React.ReactNode

  /**
   * Trigger mode
   * @default 'click'
   */
  trigger?: 'click' | 'hover'
}

export interface OptionProps {
  value: string | number
  children?: React.ReactNode
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
  /**
   * Internal prop to pass label if children is complex
   */
  label?: React.ReactNode
}

export interface SelectContextType {
  value: SelectValue
  onSelect: (value: string | number, option: SelectOption) => void
  multiple: boolean
  searchValue: string
  activeValue: string | number | null
  setActiveValue: (value: string | number | null) => void
}
