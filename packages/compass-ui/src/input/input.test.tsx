import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Input from './input'
import ThemeProvider from '../theme/theme-provider'

const renderWithTheme = (ui: React.ReactElement) => render(<ThemeProvider>{ui}</ThemeProvider>)

describe('Input', () => {
  it('should render with default text semantics', () => {
    renderWithTheme(<Input placeholder="请输入内容" />)

    const input = screen.getByPlaceholderText('请输入内容')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
  })

  it('should apply semantic class names for size and status', () => {
    const { container } = renderWithTheme(<Input size="large" status="error" />)
    const wrapper = container.querySelector('.compass-input-wrapper')

    expect(container.querySelector('.compass-input')).toBeInTheDocument()
    expect(wrapper).toHaveClass('compass-input--large')
    expect(wrapper).toHaveClass('compass-input--error')
  })

  it('should support allowClear while keeping focus on the input', () => {
    const handleChange = jest.fn()
    renderWithTheme(<Input allowClear defaultValue="hello" onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    const clearButton = screen.getByRole('button')

    fireEvent.focus(input)
    fireEvent.click(clearButton)

    expect(handleChange).toHaveBeenCalled()
    expect(input).toHaveValue('')
    expect(input).toHaveFocus()
  })

  it('should call onPressEnter when pressing Enter', () => {
    const handlePressEnter = jest.fn()
    renderWithTheme(<Input onPressEnter={handlePressEnter} />)

    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter', code: 'Enter', charCode: 13 })

    expect(handlePressEnter).toHaveBeenCalledTimes(1)
  })
})
