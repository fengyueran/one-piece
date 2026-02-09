import React from 'react'

export type SelectValue = string | number | (string | number)[]

export interface SelectOption {
  label: React.ReactNode
  value: string | number
  disabled?: boolean
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
  /** Custom class name */
  className?: string
  /** Custom style */
  style?: React.CSSProperties

  /**
   * Granular styles for internal components
   */
  styles?: {
    root?: React.CSSProperties
    trigger?: React.CSSProperties
    dropdown?: React.CSSProperties
    option?: React.CSSProperties
    tag?: React.CSSProperties
  }

  /**
   * Granular class names for internal components
   */
  classNames?: {
    root?: string
    trigger?: string
    dropdown?: string
    option?: string
    tag?: string
  }

  /**
   * Custom option renderer
   */
  optionRender?: (
    option: SelectOption,
    info: { index: number; selected: boolean },
  ) => React.ReactNode
  /**
   * Custom label renderer (for the selected value in the trigger)
   */
  labelRender?: (props: SelectOption) => React.ReactNode
  /**
   * Custom selected icon in the dropdown menu
   */
  menuItemSelectedIcon?: React.ReactNode
}

export interface OptionProps {
  value: string | number
  children?: React.ReactNode
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
  menuItemSelectedIcon?: React.ReactNode
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
  menuItemSelectedIcon?: React.ReactNode
}
