import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Dropdown from './dropdown'
import Button from '../button'
import Menu from '../menu'

describe('Dropdown', () => {
  const overlay = <div data-testid="overlay">Overlay Content</div>

  describe('Rendering', () => {
    it('should render trigger element', () => {
      render(
        <Dropdown overlay={overlay}>
          <Button>Trigger</Button>
        </Dropdown>,
      )
      expect(screen.getByText('Trigger')).toBeInTheDocument()
    })

    it('should not render overlay initially', () => {
      render(
        <Dropdown overlay={overlay}>
          <Button>Trigger</Button>
        </Dropdown>,
      )
      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument()
    })

    it('should render menu from menu prop', async () => {
      const items = [{ key: '1', label: 'Menu Item 1' }]
      const user = userEvent.setup()
      render(
        <Dropdown menu={{ items }}>
          <button>Trigger</button>
        </Dropdown>,
      )
      await user.hover(screen.getByText('Trigger'))
      expect(await screen.findByText('Menu Item 1')).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('should prefer overlay over menu prop', async () => {
      const items = [{ key: '1', label: 'Menu Item 1' }]
      const user = userEvent.setup()
      render(
        <Dropdown menu={{ items }} overlay={<div>Overlay Content</div>}>
          <button>Trigger</button>
        </Dropdown>,
      )
      await user.hover(screen.getByText('Trigger'))
      expect(await screen.findByText('Overlay Content')).toBeInTheDocument()
      expect(screen.queryByText('Menu Item 1')).not.toBeInTheDocument()
    })

    it('should apply disabled state', async () => {
      const handleVisibleChange = jest.fn()
      const user = userEvent.setup()
      render(
        <Dropdown overlay={overlay} disabled onVisibleChange={handleVisibleChange}>
          <Button>Trigger</Button>
        </Dropdown>,
      )
      await user.hover(screen.getByText('Trigger'))
      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument()
      expect(handleVisibleChange).not.toHaveBeenCalled()
    })
  })

  describe('Interactions', () => {
    it('should show overlay on hover by default', async () => {
      const user = userEvent.setup()
      render(
        <Dropdown overlay={overlay}>
          <Button>Trigger</Button>
        </Dropdown>,
      )

      await user.hover(screen.getByText('Trigger'))
      expect(await screen.findByTestId('overlay')).toBeInTheDocument()
    })

    it('should show overlay on click when trigger is click', async () => {
      const user = userEvent.setup()
      render(
        <Dropdown overlay={overlay} trigger="click">
          <Button>Trigger</Button>
        </Dropdown>,
      )

      await user.click(screen.getByText('Trigger'))
      expect(await screen.findByTestId('overlay')).toBeInTheDocument()
    })

    it('should call onVisibleChange when visibility changes', async () => {
      const handleVisibleChange = jest.fn()
      const user = userEvent.setup()
      render(
        <Dropdown overlay={overlay} trigger="click" onVisibleChange={handleVisibleChange}>
          <Button>Trigger</Button>
        </Dropdown>,
      )

      await user.click(screen.getByText('Trigger'))
      expect(handleVisibleChange).toHaveBeenCalledWith(true)
    })

    it('should call menu onClick when item is clicked', async () => {
      const handleMenuClick = jest.fn()
      const items = [{ key: '1', label: 'Menu Item 1' }]
      const user = userEvent.setup()
      render(
        <Dropdown menu={{ items, onClick: handleMenuClick }} trigger="click">
          <button>Trigger</button>
        </Dropdown>,
      )
      await user.click(screen.getByText('Trigger'))
      const item = await screen.findByText('Menu Item 1')
      await user.click(item)
      expect(handleMenuClick).toHaveBeenCalledTimes(1)
      expect(handleMenuClick).toHaveBeenCalledWith(expect.anything(), '1')
    })

    it('should close dropdown when menu item is clicked', async () => {
      const items = [{ key: '1', label: 'Menu Item 1' }]
      const user = userEvent.setup()
      render(
        <Dropdown menu={{ items }} trigger="click">
          <button>Trigger</button>
        </Dropdown>,
      )

      await user.click(screen.getByText('Trigger'))
      const item = await screen.findByText('Menu Item 1')
      await user.click(item)

      await waitFor(() => {
        expect(screen.queryByText('Menu Item 1')).not.toBeInTheDocument()
      })
    })

    it('should call onVisibleChange(false) when menu item is clicked', async () => {
      const handleVisibleChange = jest.fn()
      const items = [{ key: '1', label: 'Menu Item 1' }]
      const user = userEvent.setup()
      render(
        <Dropdown menu={{ items }} trigger="click" onVisibleChange={handleVisibleChange}>
          <button>Trigger</button>
        </Dropdown>,
      )

      await user.click(screen.getByText('Trigger'))
      expect(handleVisibleChange).not.toHaveBeenCalledWith(false)
      expect(handleVisibleChange).toHaveBeenCalledWith(true)

      const item = await screen.findByText('Menu Item 1')
      await user.click(item)

      expect(handleVisibleChange).toHaveBeenCalledWith(false)
    })

    it('should close dropdown when menu item is clicked (children mode)', async () => {
      const handleVisibleChange = jest.fn()
      const MenuContent = (
        <>
          <Menu.Item>Menu Item 1</Menu.Item>
        </>
      )
      const user = userEvent.setup()
      render(
        <Dropdown
          menu={{ children: MenuContent }}
          trigger="click"
          onVisibleChange={handleVisibleChange}
        >
          <button>Trigger</button>
        </Dropdown>,
      )

      await user.click(screen.getByText('Trigger'))
      const item = await screen.findByText('Menu Item 1')
      await user.click(item)

      expect(handleVisibleChange).toHaveBeenCalledWith(false)
    })

    it('should NOT close dropdown when closeOnSelect is false', async () => {
      const items = [{ key: '1', label: 'Menu Item 1' }]
      const user = userEvent.setup()
      render(
        <Dropdown menu={{ items }} trigger="click" closeOnSelect={false}>
          <button>Trigger</button>
        </Dropdown>,
      )

      await user.click(screen.getByText('Trigger'))
      const item = await screen.findByText('Menu Item 1')
      await user.click(item)

      // It should still be visible
      expect(await screen.findByText('Menu Item 1')).toBeInTheDocument()
    })
  })

  describe('State', () => {
    it('should respect visible prop (controlled)', () => {
      render(
        <Dropdown overlay={overlay} visible={true}>
          <Button>Trigger</Button>
        </Dropdown>,
      )
      expect(screen.getByTestId('overlay')).toBeInTheDocument()
    })

    it('should respect visible prop false (controlled)', () => {
      render(
        <Dropdown overlay={overlay} visible={false}>
          <Button>Trigger</Button>
        </Dropdown>,
      )
      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument()
    })
  })

  describe('Branches', () => {
    it('should not update internal state when controlled', async () => {
      const user = userEvent.setup()
      render(
        <Dropdown overlay={overlay} visible={false}>
          <Button>Trigger</Button>
        </Dropdown>,
      )
      // Should remain closed even if hovered
      await user.hover(screen.getByText('Trigger'))
      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument()
    })

    it('should render children only if no overlay/menu', () => {
      render(
        <Dropdown>
          <Button>Trigger</Button>
        </Dropdown>,
      )
      expect(screen.getByText('Trigger')).toBeInTheDocument()
      // Should not crash and just render trigger
    })

    it('should apply custom classNames and styles', async () => {
      const user = userEvent.setup()
      render(
        <Dropdown
          overlay={<div data-testid="overlay">Overlay</div>}
          trigger="click"
          classNames={{
            trigger: 'custom-trigger',
            overlay: 'custom-overlay',
            content: 'custom-content',
          }}
          styles={{
            trigger: { marginTop: '10px' },
            overlay: { zIndex: 9999 },
            content: { padding: '20px' },
          }}
        >
          <button>Trigger</button>
        </Dropdown>,
      )

      const trigger = screen.getByText('Trigger')
      expect(trigger).toHaveClass('custom-trigger')
      expect(trigger).toHaveStyle('margin-top: 10px')

      await user.click(trigger)

      const overlay = screen.getByTestId('overlay').parentElement?.parentElement // content -> overlay
      expect(overlay).toHaveClass('custom-overlay')
      expect(overlay).toHaveStyle('z-index: 9999')

      const content = screen.getByTestId('overlay').parentElement
      expect(content).toHaveClass('custom-content')
      expect(content).toHaveStyle('padding: 20px')
    })
  })

  describe('Accessibility', () => {
    it('should have correct ARIA attributes', async () => {
      render(
        <Dropdown overlay={overlay}>
          <Button>Trigger</Button>
        </Dropdown>,
      )
      const trigger = screen.getByRole('button', { name: 'Trigger' })
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(trigger).toHaveAttribute('aria-haspopup')

      const user = userEvent.setup()
      await user.hover(trigger)
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true')
      })
    })
  })

  describe('Style Merging & Customization', () => {
    it('should support overlayClassName and overlayStyle for styled-components compatibility', async () => {
      const user = userEvent.setup()
      render(
        <Dropdown
          overlay={<div data-testid="styled-overlay">Overlay</div>}
          trigger="click"
          overlayClassName="styled-modal-overlay"
          overlayStyle={{ backgroundColor: 'red' }}
        >
          <button>Trigger</button>
        </Dropdown>,
      )

      await user.click(screen.getByText('Trigger'))

      const overlayContainer = document.querySelector('.styled-modal-overlay')
      expect(overlayContainer).toBeInTheDocument()
      expect(overlayContainer).toHaveClass('compass-dropdown')
      expect(overlayContainer).toHaveStyle('background-color: rgb(255, 0, 0)')
    })

    it('should merge trigger styles and classes correctly', () => {
      render(
        <Dropdown className="dropdown-root-class" style={{ border: '1px solid black' }}>
          <button className="my-btn" style={{ color: 'blue' }}>
            Trigger
          </button>
        </Dropdown>,
      )

      const trigger = screen.getByText('Trigger')
      expect(trigger).toHaveClass('compass-dropdown-trigger')
      expect(trigger).toHaveClass('dropdown-root-class')
      expect(trigger).toHaveClass('my-btn')
      expect(trigger).toHaveStyle('border: 1px solid black')
      expect(trigger).toHaveStyle('color: rgb(0, 0, 255)')
    })
  })
})
