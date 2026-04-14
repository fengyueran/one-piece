import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import ThemeProvider from '../theme/theme-provider'
import Checkbox from './checkbox'

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

describe('Checkbox', () => {
  it('should toggle in uncontrolled mode', async () => {
    renderWithTheme(<Checkbox defaultChecked={false}>接收更新</Checkbox>)

    const checkbox = screen.getByRole('checkbox', { name: '接收更新' })
    expect(checkbox).not.toBeChecked()

    await userEvent.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  it('should respect controlled checked state and expose checked from change event', async () => {
    const handleChange = jest.fn()

    renderWithTheme(
      <Checkbox checked={false} onChange={handleChange}>
        控制模式
      </Checkbox>,
    )

    const checkbox = screen.getByRole('checkbox', { name: '控制模式' })
    await userEvent.click(checkbox)

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange.mock.calls[0][0].target.checked).toBe(true)
    expect(checkbox).not.toBeChecked()
  })

  it('should keep disabled checkbox immutable', async () => {
    const handleChange = jest.fn()

    renderWithTheme(
      <Checkbox disabled defaultChecked onChange={handleChange}>
        禁用项
      </Checkbox>,
    )

    const checkbox = screen.getByRole('checkbox', { name: '禁用项' })
    await userEvent.click(checkbox)

    expect(checkbox).toBeDisabled()
    expect(checkbox).toBeChecked()
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('should render size and status classes', () => {
    const { container } = renderWithTheme(
      <Checkbox size="large" status="error">
        错误项
      </Checkbox>,
    )

    const root = container.querySelector('.compass-checkbox')
    expect(root).toHaveClass('compass-checkbox--large')
    expect(root).toHaveClass('compass-checkbox--error')
    expect(screen.getByRole('checkbox', { name: '错误项' })).toHaveAttribute('aria-invalid', 'true')
  })

  it('should support keyboard toggle with space', async () => {
    renderWithTheme(<Checkbox>键盘切换</Checkbox>)

    const checkbox = screen.getByRole('checkbox', { name: '键盘切换' })
    checkbox.focus()
    fireEvent.keyDown(checkbox, { key: ' ', code: 'Space' })
    fireEvent.click(checkbox)

    expect(checkbox).toBeChecked()
  })
})
