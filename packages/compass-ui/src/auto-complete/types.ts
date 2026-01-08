import React from 'react'
import { InputFieldProps } from '../input-field/types'

export interface AutoCompleteOption {
  value: string
  label?: React.ReactNode
  [key: string]: unknown
}

export interface AutoCompleteProps extends Omit<InputFieldProps, 'onChange' | 'onSelect'> {
  /**
   * Current value of the input
   */
  value?: string

  /**
   * Default value of the input
   */
  defaultValue?: string

  /**
   * Data source for suggestions
   */
  options?: AutoCompleteOption[]

  /**
   * Callback when searching (search value change)
   */
  onSearch?: (value: string) => void

  /**
   * Callback when selecting an option
   */
  onSelect?: (value: string, option: AutoCompleteOption) => void

  /**
   * Callback when input value changes
   */
  onChange?: (value: string) => void

  /**
   * Custom filter function or true to filter by label
   * default: true
   */
  filterOption?: boolean | ((inputValue: string, option: AutoCompleteOption) => boolean)

  /**
   * Whether the dropdown width should match the input width
   * default: true
   */
  dropdownMatchSelectWidth?: boolean | number

  /**
   * Content to show when no options match
   */
  notFoundContent?: React.ReactNode
}
