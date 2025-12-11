import React from 'react'
import { SelectContextType } from './types'

export const SelectContext = React.createContext<SelectContextType | null>(null)

export const useSelectContext = () => {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error('Select compounds must be used within a Select component')
  }
  return context
}
