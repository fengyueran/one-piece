import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Tooltip from './tooltip'
import type { TooltipPlacement } from './types'

describe('Tooltip', () => {
  describe('Rendering', () => {
    it('should render trigger element', () => {
      render(
        <Tooltip content="Tooltip content">
          <button>Trigger</button>
        </Tooltip>,
      )

      expect(screen.getByText('Trigger')).toBeInTheDocument()
    })

    it('should not render overlay initially', () => {
      render(
        <Tooltip content="Tooltip content">
          <button>Trigger</button>
        </Tooltip>,
      )

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })

    it('should render plain text children', async () => {
      const user = userEvent.setup()
      render(<Tooltip content="Tooltip content">Hover me</Tooltip>)

      await user.hover(screen.getByText('Hover me'))
      expect(await screen.findByRole('tooltip')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('should show tooltip on hover by default', async () => {
      const user = userEvent.setup()
      render(
        <Tooltip content="Tooltip content">
          <button>Trigger</button>
        </Tooltip>,
      )

      await user.hover(screen.getByText('Trigger'))
      expect(await screen.findByRole('tooltip')).toHaveTextContent('Tooltip content')
    })

    it('should show tooltip on focus in hover mode', async () => {
      const user = userEvent.setup()
      render(
        <Tooltip content="Tooltip content">
          <button>Trigger</button>
        </Tooltip>,
      )

      await user.tab()
      expect(await screen.findByRole('tooltip')).toHaveTextContent('Tooltip content')
    })

    it('should show tooltip on click when trigger is click', async () => {
      const user = userEvent.setup()
      render(
        <Tooltip content="Tooltip content" trigger="click">
          <button>Trigger</button>
        </Tooltip>,
      )

      await user.click(screen.getByText('Trigger'))
      expect(await screen.findByRole('tooltip')).toHaveTextContent('Tooltip content')
    })

    it('should call onOpenChange', async () => {
      const user = userEvent.setup()
      const onOpenChange = jest.fn()
      render(
        <Tooltip content="Tooltip content" trigger="click" onOpenChange={onOpenChange}>
          <button>Trigger</button>
        </Tooltip>,
      )

      await user.click(screen.getByText('Trigger'))
      expect(onOpenChange).toHaveBeenCalledWith(true)
    })
  })

  describe('Props', () => {
    it('should support controlled mode', () => {
      render(
        <Tooltip content="Tooltip content" open>
          <button>Trigger</button>
        </Tooltip>,
      )

      expect(screen.getByRole('tooltip')).toHaveTextContent('Tooltip content')
    })

    it('should render arrow and placement data', () => {
      render(
        <Tooltip content="Tooltip content" open placement="right">
          <button>Trigger</button>
        </Tooltip>,
      )

      expect(document.querySelector('.compass-tooltip-arrow')).toBeInTheDocument()
      expect(document.querySelector('.compass-tooltip')).toHaveAttribute('data-placement', 'right')
    })

    it('should support 12 placements', () => {
      const placements: TooltipPlacement[] = [
        'top-start',
        'top',
        'top-end',
        'left-start',
        'left',
        'left-end',
        'right-start',
        'right',
        'right-end',
        'bottom-start',
        'bottom',
        'bottom-end',
      ]

      placements.forEach((placement) => {
        const { unmount } = render(
          <Tooltip content="Tooltip content" open placement={placement}>
            <button>Trigger</button>
          </Tooltip>,
        )

        expect(document.querySelector('.compass-tooltip')).toHaveAttribute(
          'data-placement',
          placement,
        )
        expect(document.querySelector('.compass-tooltip-arrow')).toBeInTheDocument()
        unmount()
      })
    })

    it('should respect disabled state', async () => {
      const user = userEvent.setup()
      render(
        <Tooltip content="Tooltip content" disabled>
          <button>Trigger</button>
        </Tooltip>,
      )

      await user.hover(screen.getByText('Trigger'))
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })

    it('should not render overlay when content is empty', async () => {
      const user = userEvent.setup()
      render(
        <Tooltip>
          <button>Trigger</button>
        </Tooltip>,
      )

      await user.hover(screen.getByText('Trigger'))
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })

    it('should render numeric content', () => {
      render(
        <Tooltip content={0} open>
          <button>Trigger</button>
        </Tooltip>,
      )

      expect(screen.getByRole('tooltip')).toHaveTextContent('0')
    })

    it('should sync arrow background with custom content background', () => {
      render(
        <Tooltip
          content="Tooltip content"
          open
          styles={{ content: { background: 'rgb(22, 119, 255)' } }}
        >
          <button>Trigger</button>
        </Tooltip>,
      )

      expect(document.querySelector('.compass-tooltip-arrow')).toHaveStyle({
        background: 'rgb(22, 119, 255)',
      })
    })

    it('should support fragment children as trigger', async () => {
      const user = userEvent.setup()
      render(
        <Tooltip content="Tooltip content">
          <>
            <span>Part A</span>
            <span>Part B</span>
          </>
        </Tooltip>,
      )

      await user.hover(screen.getByText('Part A'))
      expect(await screen.findByRole('tooltip')).toHaveTextContent('Tooltip content')
    })

    it('should keep tooltip open when clicking inside overlay', async () => {
      const user = userEvent.setup()
      render(
        <Tooltip content={<input aria-label="tooltip-input" />} trigger="click">
          <button>Trigger</button>
        </Tooltip>,
      )

      await user.click(screen.getByText('Trigger'))
      await user.click(screen.getByLabelText('tooltip-input'))

      expect(screen.getByRole('tooltip')).toBeInTheDocument()
    })

    it('should close click tooltip on escape and expose describedby', async () => {
      const user = userEvent.setup()
      render(
        <Tooltip content="Tooltip content" trigger="click">
          <button>Trigger</button>
        </Tooltip>,
      )

      const trigger = screen.getByRole('button', { name: 'Trigger' })
      await user.click(trigger)
      await screen.findByRole('tooltip')

      const describedBy = trigger.getAttribute('aria-describedby')
      expect(describedBy).toBeTruthy()
      expect(screen.getByRole('tooltip')).toHaveAttribute('id', describedBy)

      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
      })
    })
  })
})
