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
      expect(
        screen.getAllByText((_, node) => node?.textContent === 'Option 1')[0],
      ).toBeInTheDocument()
    })
    expect(
      screen.getAllByText((_, node) => node?.textContent === 'Option 2')[0],
    ).toBeInTheDocument()
  })

  it('filters options correctly', async () => {
    render(<AutoComplete options={options} />)
    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: 'Option 1' } })

    await waitFor(() => {
      expect(
        screen.getAllByText((_, node) => node?.textContent === 'Option 1')[0],
      ).toBeInTheDocument()
    })
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument()
  })

  it('calls onSelect when option selected', async () => {
    const onSelect = jest.fn()
    const onChange = jest.fn()
    render(<AutoComplete options={options} onSelect={onSelect} onChange={onChange} />)
    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: 'Option' } })

    await waitFor(() => {
      expect(
        screen.getAllByText((_, node) => node?.textContent === 'Option 1')[0],
      ).toBeInTheDocument()
    })

    fireEvent.click(screen.getAllByText((_, node) => node?.textContent === 'Option 1')[0])

    expect(onSelect).toHaveBeenCalledWith('1', options[0])
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
})
