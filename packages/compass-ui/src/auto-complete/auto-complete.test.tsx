import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AutoComplete from './index'

describe('AutoComplete', () => {
  const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ]

  it('renders correctly', () => {
    render(<AutoComplete placeholder="Search..." />)
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  it('shows options when typing', async () => {
    render(<AutoComplete options={options} />)
    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: 'Option' } })

    await waitFor(() => {
      // Find by class name directly as text might be wrapped
      const list = document.querySelectorAll('.compass-auto-complete-option')
      expect(list.length).toBeGreaterThan(0)
      expect(list[0]).toHaveTextContent('Option 1')
    })
  })

  it('filters options correctly with default filter', async () => {
    render(<AutoComplete options={options} />)
    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: 'Option 1' } })

    await waitFor(() => {
      const list = document.querySelectorAll('.compass-auto-complete-option')
      expect(list.length).toBe(1)
      expect(list[0]).toHaveTextContent('Option 1')
    })
  })

  it('supports custom filterOption', async () => {
    // Filter by value includes
    const filterOption = (inputValue: string, option: any) => option.value.includes(inputValue)

    render(<AutoComplete options={options} filterOption={filterOption} />)
    const input = screen.getByRole('textbox')

    // Searching '2' should match Option 2 (value: '2')
    fireEvent.change(input, { target: { value: '2' } })

    await waitFor(() => {
      const list = document.querySelectorAll('.compass-auto-complete-option')
      expect(list.length).toBe(1)
      expect(list[0]).toHaveTextContent('Option 2')
    })
  })

  it('calls onSelect and onChange when option selected via click', async () => {
    const onSelect = jest.fn()
    const onChange = jest.fn()
    render(<AutoComplete options={options} onSelect={onSelect} onChange={onChange} />)
    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: 'Option' } })

    await waitFor(() => {
      const list = document.querySelectorAll('.compass-auto-complete-option')
      expect(list.length).toBeGreaterThan(0)
      fireEvent.click(list[0])
    })

    expect(onSelect).toHaveBeenCalledWith('1', expect.objectContaining({ value: '1' }))
    expect(onChange).toHaveBeenCalledWith('1')
    expect(input).toHaveValue('1')
  })

  it('calls onSearch when typing', () => {
    const onSearch = jest.fn()
    render(<AutoComplete onSearch={onSearch} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })
    expect(onSearch).toHaveBeenCalledWith('test')
  })

  it('handles keyboard navigation (ArrowDown, ArrowUp, Enter, Escape)', async () => {
    const onSelect = jest.fn()
    render(<AutoComplete options={options} onSelect={onSelect} />)
    const input = screen.getByRole('textbox')

    // Open dropdown
    fireEvent.change(input, { target: { value: 'Option' } })
    await waitFor(() => {
      expect(document.querySelector('.compass-auto-complete-dropdown')).toBeInTheDocument()
    })

    // ArrowDown -> Focus first option
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    const getOptions = () => document.querySelectorAll('.compass-auto-complete-option')
    expect(getOptions()[0]).toHaveClass('compass-auto-complete-option--active')

    // ArrowDown -> Focus second option
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(getOptions()[1]).toHaveClass('compass-auto-complete-option--active')

    // ArrowUp -> Focus first option again
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(getOptions()[0]).toHaveClass('compass-auto-complete-option--active')

    // Enter -> Select first option
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onSelect).toHaveBeenCalledWith('1', expect.objectContaining({ value: '1' }))

    // Dropdown should close
    await waitFor(() => {
      expect(document.querySelector('.compass-auto-complete-dropdown')).not.toBeInTheDocument()
    })
  })

  it('handles onBlur event', () => {
    const onBlur = jest.fn()
    render(<AutoComplete onBlur={onBlur} />)
    const input = screen.getByRole('textbox')

    fireEvent.focus(input)
    fireEvent.blur(input)

    expect(onBlur).toHaveBeenCalled()
  })
})
