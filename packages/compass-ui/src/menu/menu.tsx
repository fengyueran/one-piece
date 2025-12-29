import React, { useContext } from 'react'
import { MenuProps, MenuItemProps } from './types'
import { StyledMenu, StyledMenuItem, IconWrapper } from './menu.styles'
import { MenuContext } from './context'

const Menu: React.FC<MenuProps> & { Item: typeof MenuItem } = ({
  children,
  items,
  className,
  style,
  onClick,
  selectedKeys,
  defaultSelectedKeys = [],
  onSelect,
}) => {
  const parentMenuContext = useContext(MenuContext)
  const [internalSelectedKeys, setInternalSelectedKeys] =
    React.useState<(string | number)[]>(defaultSelectedKeys)

  const mergedSelectedKeys = selectedKeys ?? internalSelectedKeys

  const handleItemClick = (e: React.MouseEvent, key?: string | number) => {
    onClick?.(e, key)
    parentMenuContext.onItemClick?.(e, key)

    if (key !== undefined) {
      if (selectedKeys === undefined) {
        setInternalSelectedKeys([key])
      }
      onSelect?.([key])
    }
  }

  return (
    <MenuContext.Provider
      value={{ onItemClick: handleItemClick, selectedKeys: mergedSelectedKeys }}
    >
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
  const isSelected = eventKey !== undefined && context.selectedKeys?.includes(eventKey)

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return
    onClick?.(e)
    context.onItemClick?.(e, eventKey)
  }

  return (
    <StyledMenuItem
      className={`compass-menu-item ${disabled ? 'compass-menu-item--disabled' : ''} ${
        danger ? 'compass-menu-item--danger' : ''
      } ${isSelected ? 'compass-menu-item--selected' : ''} ${className || ''}`}
      style={style}
      onClick={handleClick}
      $disabled={disabled}
      $danger={danger}
      $selected={isSelected}
    >
      {icon && <IconWrapper className="compass-menu-item-icon">{icon}</IconWrapper>}
      <span className="compass-menu-item-content">{children}</span>
    </StyledMenuItem>
  )
}

Menu.Item = MenuItem

export default Menu
