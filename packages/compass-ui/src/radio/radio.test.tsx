import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import ThemeProvider from '../theme/theme-provider'
import Radio from './radio'

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

describe('Radio', () => {
  it('should support group exclusive selection', async () => {
    const handleChange = jest.fn()

    renderWithTheme(
      <Radio.Group defaultValue="apple" onChange={handleChange} aria-label="水果">
        <Radio value="apple">苹果</Radio>
        <Radio value="orange">橙子</Radio>
      </Radio.Group>,
    )

    const apple = screen.getByRole('radio', { name: '苹果' })
    const orange = screen.getByRole('radio', { name: '橙子' })

    expect(apple).toBeChecked()
    expect(orange).not.toBeChecked()

    await userEvent.click(orange)

    expect(orange).toBeChecked()
    expect(apple).not.toBeChecked()
    expect(handleChange).toHaveBeenCalledWith('orange', expect.any(Object))
  })

  it('should support options rendering for group', async () => {
    renderWithTheme(
      <Radio.Group
        options={[
          { label: '一档', value: 'low' },
          { label: '二档', value: 'high' },
        ]}
        defaultValue="low"
      />,
    )

    const low = screen.getByRole('radio', { name: '一档' })
    const high = screen.getByRole('radio', { name: '二档' })

    expect(low).toBeChecked()
    await userEvent.click(high)
    expect(high).toBeChecked()
  })

  it('should keep disabled radio group unchanged', async () => {
    const handleChange = jest.fn()

    renderWithTheme(
      <Radio.Group disabled defaultValue="left" onChange={handleChange}>
        <Radio value="left">左侧</Radio>
        <Radio value="right">右侧</Radio>
      </Radio.Group>,
    )

    const right = screen.getByRole('radio', { name: '右侧' })
    await userEvent.click(right)

    expect(right).toBeDisabled()
    expect(right).not.toBeChecked()
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('should apply size and status from group', () => {
    const { container } = renderWithTheme(
      <Radio.Group size="small" status="error" defaultValue="a">
        <Radio value="a">选项 A</Radio>
      </Radio.Group>,
    )

    expect(container.querySelector('.compass-radio-group')).toHaveClass('compass-radio-group--small')
    expect(container.querySelector('.compass-radio')).toHaveClass('compass-radio--error')
  })
})
