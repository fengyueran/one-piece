import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import ThemeProvider from '../theme/theme-provider'
import Switch from './switch'

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

describe('Switch', () => {
  it('should toggle in uncontrolled mode', async () => {
    const handleCheckedChange = jest.fn()

    renderWithTheme(
      <Switch defaultChecked={false} onCheckedChange={handleCheckedChange} aria-label="通知开关" />,
    )

    const switchControl = screen.getByRole('switch', { name: '通知开关' })
    expect(switchControl).toHaveAttribute('aria-checked', 'false')

    await userEvent.click(switchControl)

    expect(switchControl).toHaveAttribute('aria-checked', 'true')
    expect(handleCheckedChange).toHaveBeenCalledWith(true, expect.any(Object))
  })

  it('should support controlled checked state', async () => {
    const handleCheckedChange = jest.fn()

    renderWithTheme(
      <Switch checked={false} onCheckedChange={handleCheckedChange} aria-label="受控开关" />,
    )

    const switchControl = screen.getByRole('switch', { name: '受控开关' })
    await userEvent.click(switchControl)

    expect(handleCheckedChange).toHaveBeenCalledWith(true, expect.any(Object))
    expect(switchControl).toHaveAttribute('aria-checked', 'false')
  })

  it('should remain unchanged when disabled', async () => {
    renderWithTheme(<Switch disabled defaultChecked aria-label="禁用开关" />)

    const switchControl = screen.getByRole('switch', { name: '禁用开关' })
    await userEvent.click(switchControl)

    expect(switchControl).toBeDisabled()
    expect(switchControl).toHaveAttribute('aria-checked', 'true')
  })

  it('should render size and status classes', () => {
    const { container } = renderWithTheme(
      <Switch size="small" status="error" aria-label="状态开关" />,
    )

    const root = container.querySelector('.compass-switch')
    expect(root).toHaveClass('compass-switch--small')
    expect(root).toHaveClass('compass-switch--error')
    expect(screen.getByRole('switch', { name: '状态开关' })).toHaveAttribute('aria-invalid', 'true')
  })
})
