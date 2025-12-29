import React, { useContext } from 'react'
import { MenuProps, MenuItemProps } from './types'
import { StyledMenu, StyledMenuItem, IconWrapper } from './menu.styles'
import { MenuContext } from './context'

export const MenuItem: React.FC<MenuItemProps> = ({
  children,
  onClick,
  disabled,
  icon,
  danger,
  className,
  style,
  eventKey,
}) => {
  const context = useContext(MenuContext)

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return
    onClick?.(e)
    context.onItemClick?.(e, eventKey)
  }

  return (
    <StyledMenuItem
      className={`compass-menu-item ${disabled ? 'compass-menu-item--disabled' : ''} ${
        danger ? 'compass-menu-item--danger' : ''
      } ${className || ''}`}
      style={style}
      onClick={handleClick}
      $disabled={disabled}
      $danger={danger}
    >
      {icon && <IconWrapper className="compass-menu-item-icon">{icon}</IconWrapper>}
      <span className="compass-menu-item-content">{children}</span>
    </StyledMenuItem>
  )
}

const Menu: React.FC<MenuProps> & { Item: typeof MenuItem } = ({
  children,
  items,
  className,
  style,
  onClick,
}) => {
  const parentMenuContext = useContext(MenuContext)

  const handleItemClick = (e: React.MouseEvent, key?: string | number) => {
    onClick?.(e, key)
    parentMenuContext.onItemClick?.(e, key)
  }

  return (
    <MenuContext.Provider value={{ onItemClick: handleItemClick }}>
      <StyledMenu className={`compass-menu ${className || ''}`} style={style}>
        {items
          ? items.map((item) => (
              <MenuItem
                key={item.key}
                eventKey={item.key}
                onClick={item.onClick}
                disabled={item.disabled}
                danger={item.danger}
                icon={item.icon}
                className={item.className}
                style={item.style}
              >
                {item.label}
              </MenuItem>
            ))
          : children}
      </StyledMenu>
    </MenuContext.Provider>
  )
}

Menu.Item = MenuItem

export default Menu
