import React, { useContext, forwardRef } from 'react'
import { MenuProps, MenuItemProps } from './types'
import { StyledMenu, StyledMenuItem, IconWrapper } from './menu.styles'
import { MenuContext } from './context'

const InternalMenu = forwardRef<HTMLUListElement, MenuProps>((props, ref) => {
  const {
    children,
    items,
    onClick,
    selectedKeys,
    defaultSelectedKeys = [],
    onSelect,
    className,
    style,
    styles,
    classNames,
    ...rest
  } = props

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
      value={{ onItemClick: handleItemClick, selectedKeys: mergedSelectedKeys, styles, classNames }}
    >
      <StyledMenu
        ref={ref}
        className={`compass-menu ${className || ''} ${classNames?.root || ''}`}
        style={{ ...style, ...styles?.root }}
        role="menu"
        {...rest}
      >
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
})

export const MenuItem = forwardRef<HTMLLIElement, MenuItemProps>((props, ref) => {
  const { children, onClick, disabled, icon, danger, eventKey, className, style, ...rest } = props
  const context = useContext(MenuContext)
  const isSelected = eventKey !== undefined && context.selectedKeys?.includes(eventKey)

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return
    onClick?.(e)
    context.onItemClick?.(e, eventKey)
  }

  return (
    <StyledMenuItem
      ref={ref}
      className={`compass-menu-item ${disabled ? 'compass-menu-item--disabled' : ''} ${
        danger ? 'compass-menu-item--danger' : ''
      } ${isSelected ? 'compass-menu-item--selected' : ''} ${context.classNames?.item || ''} ${
        className || ''
      }`}
      style={{ ...context.styles?.item, ...style }}
      onClick={handleClick}
      $disabled={disabled}
      $danger={danger}
      $selected={isSelected}
      role="menuitem"
      aria-disabled={disabled}
      aria-selected={isSelected}
      {...rest}
    >
      {icon && (
        <IconWrapper
          className={`compass-menu-item-icon ${context.classNames?.icon || ''}`}
          style={context.styles?.icon}
        >
          {icon}
        </IconWrapper>
      )}
      <span
        className={`compass-menu-item-content ${context.classNames?.content || ''}`}
        style={context.styles?.content}
      >
        {children}
      </span>
    </StyledMenuItem>
  )
})

MenuItem.displayName = 'MenuItem'
InternalMenu.displayName = 'Menu'

type MenuComponent = typeof InternalMenu & {
  Item: typeof MenuItem
}

const Menu = InternalMenu as MenuComponent
Menu.Item = MenuItem

export default Menu
