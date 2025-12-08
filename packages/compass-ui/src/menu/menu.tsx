import React from 'react'
import { MenuProps, MenuItemProps } from './types'
import { StyledMenu, StyledMenuItem, IconWrapper } from './menu.styles'

export const MenuItem: React.FC<MenuItemProps> = ({
  children,
  onClick,
  disabled,
  icon,
  danger,
  className,
  style,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return
    onClick?.(e)
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
  return (
    <StyledMenu className={`compass-menu ${className || ''}`} style={style}>
      {items
        ? items.map((item) => (
            <MenuItem
              key={item.key}
              onClick={(e) => {
                item.onClick?.(e)
                onClick?.(e, item.key)
              }}
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
  )
}

Menu.Item = MenuItem

export default Menu
