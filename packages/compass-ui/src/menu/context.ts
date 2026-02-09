import React, { createContext } from 'react'
import { MenuProps } from './types'

export interface MenuContextProps {
  onItemClick?: (e: React.MouseEvent, key?: string | number) => void
  selectedKeys?: (string | number)[]
  styles?: MenuProps['styles']
  classNames?: MenuProps['classNames']
}

export const MenuContext = createContext<MenuContextProps>({})
