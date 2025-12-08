import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Menu from './menu'
import { SearchIcon } from '../icons'

describe('Menu', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(
        <Menu>
          <Menu.Item>Item 1</Menu.Item>
        </Menu>,
      )
      expect(screen.getByText('Item 1')).toBeInTheDocument()
    })

    it('should render multiple menu items', () => {
      render(
        <Menu>
          <Menu.Item>Item 1</Menu.Item>
          <Menu.Item>Item 2</Menu.Item>
          <Menu.Item>Item 3</Menu.Item>
        </Menu>,
      )
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
      expect(screen.getByText('Item 3')).toBeInTheDocument()
    })

    it('should render items from items prop (data-driven)', () => {
      const items = [
        { key: '1', label: 'Item 1' },
        { key: '2', label: 'Item 2' },
        { key: '3', label: 'Item 3' },
      ]
      render(<Menu items={items} />)
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
      expect(screen.getByText('Item 3')).toBeInTheDocument()
    })

    it('should render with icon', () => {
      render(
        <Menu>
          <Menu.Item icon={<SearchIcon />}>Search</Menu.Item>
        </Menu>,
      )
      expect(screen.getByRole('img', { name: 'search' })).toBeInTheDocument()
      expect(screen.getByText('Search')).toBeInTheDocument()
    })

    it('should render icon from items prop', () => {
      const items = [
        {
          key: '1',
          label: 'Search',
          icon: <SearchIcon />,
        },
      ]
      render(<Menu items={items} />)
      expect(screen.getByRole('img', { name: 'search' })).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('should apply disabled state', () => {
      render(
        <Menu>
          <Menu.Item disabled>Disabled Item</Menu.Item>
        </Menu>,
      )
      const item = screen.getByText('Disabled Item')
      expect(item).toBeInTheDocument()
      expect(item.closest('.compass-menu-item')).toHaveClass('compass-menu-item--disabled')
    })

    it('should apply disabled state from items prop', () => {
      const items = [{ key: '1', label: 'Disabled Item', disabled: true }]
      render(<Menu items={items} />)
      const item = screen.getByText('Disabled Item')
      expect(item.closest('.compass-menu-item')).toHaveClass('compass-menu-item--disabled')
    })

    it('should apply danger state', () => {
      render(
        <Menu>
          <Menu.Item danger>Delete</Menu.Item>
        </Menu>,
      )
      const item = screen.getByText('Delete')
      expect(item.closest('.compass-menu-item')).toHaveClass('compass-menu-item--danger')
    })

    it('should apply danger state from items prop', () => {
      const items = [{ key: '1', label: 'Delete', danger: true }]
      render(<Menu items={items} />)
      const item = screen.getByText('Delete')
      expect(item.closest('.compass-menu-item')).toHaveClass('compass-menu-item--danger')
    })

    it('should apply custom className', () => {
      render(
        <Menu className="custom-menu">
          <Menu.Item>Item</Menu.Item>
        </Menu>,
      )
      expect(document.querySelector('.custom-menu')).toBeInTheDocument()
    })

    it('should apply custom className to menu item', () => {
      render(
        <Menu>
          <Menu.Item className="custom-item">Item</Menu.Item>
        </Menu>,
      )
      expect(document.querySelector('.custom-item')).toBeInTheDocument()
    })

    it('should apply custom style', () => {
      render(
        <Menu style={{ border: '1px solid red' }}>
          <Menu.Item>Item</Menu.Item>
        </Menu>,
      )
      const menu = document.querySelector('.compass-menu')
      expect(menu).toHaveStyle({ border: '1px solid red' })
    })

    it('should apply custom style to menu item', () => {
      render(
        <Menu>
          <Menu.Item style={{ color: 'red' }}>Item</Menu.Item>
        </Menu>,
      )
      const item = screen.getByText('Item').closest('.compass-menu-item')
      expect(item).toHaveStyle({ color: 'rgb(255, 0, 0)' })
    })
  })

  describe('Interactions', () => {
    it('should call onClick handler on menu item', () => {
      const handleClick = jest.fn()
      render(
        <Menu>
          <Menu.Item onClick={handleClick}>Click me</Menu.Item>
        </Menu>,
      )
      fireEvent.click(screen.getByText('Click me'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should call onClick handler from items prop', () => {
      const handleClick = jest.fn()
      const items = [{ key: '1', label: 'Click me', onClick: handleClick }]
      render(<Menu items={items} />)
      fireEvent.click(screen.getByText('Click me'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should call menu-level onClick handler with key', () => {
      const handleMenuClick = jest.fn()
      const items = [
        { key: 'item-1', label: 'Item 1' },
        { key: 'item-2', label: 'Item 2' },
      ]
      render(<Menu items={items} onClick={handleMenuClick} />)
      fireEvent.click(screen.getByText('Item 1'))
      expect(handleMenuClick).toHaveBeenCalledTimes(1)
      expect(handleMenuClick).toHaveBeenCalledWith(expect.anything(), 'item-1')
    })

    it('should call both item and menu onClick handlers', () => {
      const handleItemClick = jest.fn()
      const handleMenuClick = jest.fn()
      const items = [{ key: '1', label: 'Click me', onClick: handleItemClick }]
      render(<Menu items={items} onClick={handleMenuClick} />)
      fireEvent.click(screen.getByText('Click me'))
      expect(handleItemClick).toHaveBeenCalledTimes(1)
      expect(handleMenuClick).toHaveBeenCalledTimes(1)
    })

    it('should not call onClick when disabled', () => {
      const handleClick = jest.fn()
      render(
        <Menu>
          <Menu.Item disabled onClick={handleClick}>
            Disabled Item
          </Menu.Item>
        </Menu>,
      )
      fireEvent.click(screen.getByText('Disabled Item'))
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should not call onClick when disabled (items prop)', () => {
      const handleClick = jest.fn()
      const items = [{ key: '1', label: 'Disabled Item', disabled: true, onClick: handleClick }]
      render(<Menu items={items} />)
      fireEvent.click(screen.getByText('Disabled Item'))
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('State', () => {
    it('should render in normal state', () => {
      render(
        <Menu>
          <Menu.Item>Normal Item</Menu.Item>
        </Menu>,
      )
      const item = screen.getByText('Normal Item').closest('.compass-menu-item')
      expect(item).not.toHaveClass('compass-menu-item--disabled')
      expect(item).not.toHaveClass('compass-menu-item--danger')
    })

    it('should render in disabled state', () => {
      render(
        <Menu>
          <Menu.Item disabled>Disabled Item</Menu.Item>
        </Menu>,
      )
      const item = screen.getByText('Disabled Item').closest('.compass-menu-item')
      expect(item).toHaveClass('compass-menu-item--disabled')
    })

    it('should render in danger state', () => {
      render(
        <Menu>
          <Menu.Item danger>Danger Item</Menu.Item>
        </Menu>,
      )
      const item = screen.getByText('Danger Item').closest('.compass-menu-item')
      expect(item).toHaveClass('compass-menu-item--danger')
    })

    it('should render with both disabled and danger states', () => {
      render(
        <Menu>
          <Menu.Item disabled danger>
            Disabled Danger Item
          </Menu.Item>
        </Menu>,
      )
      const item = screen.getByText('Disabled Danger Item').closest('.compass-menu-item')
      expect(item).toHaveClass('compass-menu-item--disabled')
      expect(item).toHaveClass('compass-menu-item--danger')
    })
  })

  describe('Accessibility', () => {
    it('should have correct base className', () => {
      render(
        <Menu>
          <Menu.Item>Item</Menu.Item>
        </Menu>,
      )
      expect(document.querySelector('.compass-menu')).toBeInTheDocument()
      expect(document.querySelector('.compass-menu-item')).toBeInTheDocument()
    })

    it('should have correct content className', () => {
      render(
        <Menu>
          <Menu.Item>Item</Menu.Item>
        </Menu>,
      )
      expect(document.querySelector('.compass-menu-item-content')).toBeInTheDocument()
    })

    it('should have correct icon className', () => {
      render(
        <Menu>
          <Menu.Item icon={<SearchIcon />}>Search</Menu.Item>
        </Menu>,
      )
      expect(document.querySelector('.compass-menu-item-icon')).toBeInTheDocument()
    })

    it('should render complex content', () => {
      render(
        <Menu>
          <Menu.Item>
            <a href="https://example.com" target="_blank" rel="noopener noreferrer">
              Link Item
            </a>
          </Menu.Item>
        </Menu>,
      )
      expect(screen.getByText('Link Item')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should render empty menu', () => {
      render(<Menu />)
      expect(document.querySelector('.compass-menu')).toBeInTheDocument()
    })

    it('should render with empty items array', () => {
      render(<Menu items={[]} />)
      expect(document.querySelector('.compass-menu')).toBeInTheDocument()
    })

    it('should handle mixed children and items prop (items takes precedence)', () => {
      const items = [{ key: '1', label: 'From Items' }]
      render(
        <Menu items={items}>
          <Menu.Item>From Children</Menu.Item>
        </Menu>,
      )
      expect(screen.getByText('From Items')).toBeInTheDocument()
      expect(screen.queryByText('From Children')).not.toBeInTheDocument()
    })

    it('should render custom content in children', () => {
      render(
        <Menu>
          <div>Custom Header</div>
          <Menu.Item>Item 1</Menu.Item>
          <div>Custom Divider</div>
          <Menu.Item>Item 2</Menu.Item>
        </Menu>,
      )
      expect(screen.getByText('Custom Header')).toBeInTheDocument()
      expect(screen.getByText('Custom Divider')).toBeInTheDocument()
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })

    it('should handle ReactNode as label in items', () => {
      const items = [
        {
          key: '1',
          label: (
            <span>
              <strong>Bold</strong> Text
            </span>
          ),
        },
      ]
      render(<Menu items={items} />)
      expect(screen.getByText('Bold')).toBeInTheDocument()
      expect(screen.getByText('Text')).toBeInTheDocument()
    })

    it('should handle multiple clicks on same item', () => {
      const handleClick = jest.fn()
      render(
        <Menu>
          <Menu.Item onClick={handleClick}>Click me</Menu.Item>
        </Menu>,
      )
      const item = screen.getByText('Click me')
      fireEvent.click(item)
      fireEvent.click(item)
      fireEvent.click(item)
      expect(handleClick).toHaveBeenCalledTimes(3)
    })

    it('should not break with undefined onClick', () => {
      render(
        <Menu>
          <Menu.Item>No Handler</Menu.Item>
        </Menu>,
      )
      expect(() => {
        fireEvent.click(screen.getByText('No Handler'))
      }).not.toThrow()
    })
  })
})
