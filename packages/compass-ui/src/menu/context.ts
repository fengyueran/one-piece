import React, { createContext } from 'react'

export interface MenuContextProps {
  onItemClick?: (e: React.MouseEvent, key?: string | number) => void
}

export const MenuContext = createContext<MenuContextProps>({})
