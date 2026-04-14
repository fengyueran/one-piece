import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import ThemeProvider from '../theme/theme-provider'
import Textarea from './textarea'

const renderWithTheme = (ui: React.ReactElement) => render(<ThemeProvider>{ui}</ThemeProvider>)

describe('Textarea', () => {
  it('should render a textarea with default semantics', () => {
    renderWithTheme(<Textarea placeholder="请输入描述" />)

    const textarea = screen.getByPlaceholderText('请输入描述')
    expect(textarea.tagName).toBe('TEXTAREA')
  })

  it('should support size and status classes', () => {
    const { container } = renderWithTheme(<Textarea size="small" status="warning" />)
    const wrapper = container.querySelector('.compass-textarea-wrapper')

    expect(container.querySelector('.compass-textarea')).toBeInTheDocument()
    expect(wrapper).toHaveClass('compass-textarea--small')
    expect(wrapper).toHaveClass('compass-textarea--warning')
  })

  it('should support prefix and suffix content', () => {
    renderWithTheme(<Textarea prefix={<span>前缀</span>} suffix={<span>后缀</span>} />)

    expect(screen.getByText('前缀')).toBeInTheDocument()
    expect(screen.getByText('后缀')).toBeInTheDocument()
  })

  it('should clear value and restore focus when allowClear is enabled', () => {
    const handleChange = jest.fn()
    renderWithTheme(<Textarea allowClear defaultValue="line" onChange={handleChange} />)

    const textarea = screen.getByRole('textbox')
    const clearButton = screen.getByRole('button')

    fireEvent.focus(textarea)
    fireEvent.click(clearButton)

    expect(handleChange).toHaveBeenCalled()
    expect(textarea).toHaveValue('')
    expect(textarea).toHaveFocus()
  })
})
