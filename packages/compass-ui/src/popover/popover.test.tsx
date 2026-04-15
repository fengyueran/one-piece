import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Popover from './popover'

describe('Popover', () => {
  it('should open on click by default and expose aria-controls', async () => {
    const user = userEvent.setup()
    render(
      <Popover title="Popover title" content="Popover content">
        <button>Trigger</button>
      </Popover>,
    )

    const trigger = screen.getByRole('button', { name: 'Trigger' })
    await user.click(trigger)

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveTextContent('Popover title')
    expect(dialog).toHaveTextContent('Popover content')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(dialog).toHaveAttribute('id', trigger.getAttribute('aria-controls'))
  })

  it('should close on outside click', async () => {
    const user = userEvent.setup()
    render(
      <Popover title="Popover title" content="Popover content">
        <button>Trigger</button>
      </Popover>,
    )

    await user.click(screen.getByRole('button', { name: 'Trigger' }))
    expect(await screen.findByRole('dialog')).toBeInTheDocument()

    await user.click(document.body)

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('should stay open when clicking inside overlay', async () => {
    const user = userEvent.setup()
    render(
      <Popover content={<button>Inside action</button>}>
        <button>Trigger</button>
      </Popover>,
    )

    await user.click(screen.getByRole('button', { name: 'Trigger' }))
    await user.click(screen.getByRole('button', { name: 'Inside action' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
