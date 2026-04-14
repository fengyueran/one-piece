import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Button from '../button'
import { ThemeProvider, defaultTheme } from '../theme'
import Drawer from './drawer'

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={defaultTheme}>{ui}</ThemeProvider>)
}

describe('Drawer', () => {
  it('should render content and expose dialog semantics when open', () => {
    renderWithTheme(
      <Drawer isOpen title="编辑资料">
        <div>Drawer Content</div>
      </Drawer>,
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByText('编辑资料')).toBeInTheDocument()
    expect(screen.getByText('Drawer Content')).toBeInTheDocument()
  })

  it('should call onCancel when mask is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = jest.fn()

    renderWithTheme(
      <Drawer isOpen onCancel={onCancel}>
        <div>Drawer Content</div>
      </Drawer>,
    )

    const mask = document.querySelector('.compass-drawer-mask')
    expect(mask).toBeInTheDocument()

    if (mask) {
      await user.click(mask)
    }

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('should call onCancel when close button is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = jest.fn()

    renderWithTheme(
      <Drawer isOpen title="编辑资料" onCancel={onCancel}>
        <div>Drawer Content</div>
      </Drawer>,
    )

    await user.click(screen.getByLabelText('Close'))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('should call onCancel when Escape is pressed', async () => {
    const user = userEvent.setup()
    const onCancel = jest.fn()

    renderWithTheme(
      <Drawer isOpen title="编辑资料" onCancel={onCancel}>
        <button>Inside action</button>
      </Drawer>,
    )

    await waitFor(() => {
      expect(document.querySelector('.compass-drawer-content')).toHaveFocus()
    })

    await user.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('should restore focus to trigger after close', async () => {
    const user = userEvent.setup()

    const Example = () => {
      const [open, setOpen] = React.useState(false)

      return (
        <>
          <Button onClick={() => setOpen(true)}>Open Drawer</Button>
          <Drawer isOpen={open} title="编辑资料" onCancel={() => setOpen(false)}>
            <button>Inside action</button>
          </Drawer>
        </>
      )
    }

    renderWithTheme(<Example />)

    const trigger = screen.getByRole('button', { name: 'Open Drawer' })
    await user.click(trigger)

    await waitFor(() => {
      expect(document.querySelector('.compass-drawer-content')).toHaveFocus()
    })

    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(trigger).toHaveFocus()
    })
  })

  it('should call afterClose when transition ends', () => {
    const afterClose = jest.fn()
    const { rerender } = renderWithTheme(
      <Drawer isOpen afterClose={afterClose}>
        <div>Drawer Content</div>
      </Drawer>,
    )

    rerender(
      <ThemeProvider theme={defaultTheme}>
        <Drawer isOpen={false} afterClose={afterClose}>
          <div>Drawer Content</div>
        </Drawer>
      </ThemeProvider>,
    )

    const content = document.querySelector('.compass-drawer-content')
    expect(content).toBeInTheDocument()

    if (content) {
      fireEvent.transitionEnd(content)
    }

    expect(afterClose).toHaveBeenCalledTimes(1)
  })
})
