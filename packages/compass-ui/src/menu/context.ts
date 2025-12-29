import React, { createContext } from 'react'

export interface MenuContextProps {
  onItemClick?: (e: React.MouseEvent, key?: string | number) => void
  selectedKeys?: (string | number)[]
}

export const MenuContext = createContext<MenuContextProps>({})
