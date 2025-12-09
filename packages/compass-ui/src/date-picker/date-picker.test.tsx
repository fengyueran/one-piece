import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DatePicker from './index'
import { format } from 'date-fns'
import ThemeProvider from '../theme/theme-provider'

const { RangePicker: DateRangePicker } = DatePicker

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

describe('DatePicker', () => {
  it('renders input correctly', () => {
    renderWithTheme(<DatePicker placeholder="Select date" />)
    expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument()
  })

  it('opens calendar on click', async () => {
    renderWithTheme(<DatePicker />)
    const input = screen.getByRole('textbox')
    await userEvent.click(input)
    expect(screen.getByText(format(new Date(), 'yyyy年 MM月'))).toBeInTheDocument()
  })

  it('selects a date', async () => {
    const handleChange = jest.fn()
    renderWithTheme(<DatePicker onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    await userEvent.click(input)

    // Click on the 15th of current month
    const day = screen.getAllByText('15').find((el) => el.tagName === 'DIV')
    if (day) await userEvent.click(day)

    expect(handleChange).toHaveBeenCalled()
  })

  it('supports year picker mode', async () => {
    renderWithTheme(<DatePicker picker="year" />)
    const input = screen.getByRole('textbox')
    await userEvent.click(input)

    const currentYear = new Date().getFullYear()
    expect(screen.getByText(currentYear.toString())).toBeInTheDocument()
  })

  it('supports time selection with OK button', async () => {
    const handleChange = jest.fn()
    renderWithTheme(<DatePicker showTime onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    await userEvent.click(input)

    // Select a date
    const day = screen.getAllByText('15').find((el) => el.tagName === 'DIV')
    if (day) await userEvent.click(day)

    // Should not call onChange yet (only on OK)
    expect(handleChange).not.toHaveBeenCalled()

    // Click OK
    const okButton = screen.getByText('确定')
    await userEvent.click(okButton)

    expect(handleChange).toHaveBeenCalled()
  })
})

describe('DateRangePicker', () => {
  it('renders inputs correctly', () => {
    renderWithTheme(<DateRangePicker placeholder={['开始日期', '结束日期']} />)
    expect(screen.getByPlaceholderText('开始日期')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('结束日期')).toBeInTheDocument()
  })

  it('opens calendar on click', async () => {
    renderWithTheme(<DateRangePicker />)
    const inputs = screen.getAllByRole('textbox')
    await userEvent.click(inputs[0])
    expect(screen.getByText(format(new Date(), 'yyyy年 MM月'))).toBeInTheDocument()
  })

  it('selects range in normal order (start -> end)', async () => {
    const handleChange = jest.fn()
    renderWithTheme(<DateRangePicker onChange={handleChange} />)
    const inputs = screen.getAllByRole('textbox')

    // Click start input
    await userEvent.click(inputs[0])

    // Select start date (15th)
    const day15 = screen.getAllByText('15').find((el) => el.tagName === 'DIV')
    if (day15) await userEvent.click(day15)

    // Should switch to end selection but not call onChange yet
    expect(handleChange).not.toHaveBeenCalled()

    // Select end date (20th)
    const day20 = screen.getAllByText('20').find((el) => el.tagName === 'DIV')
    if (day20) await userEvent.click(day20)

    // Should call onChange and close
    expect(handleChange).toHaveBeenCalled()
    // Note: checking if closed is tricky without querying for absence of calendar
    await waitFor(() => {
      expect(screen.queryByText(format(new Date(), 'yyyy年 MM月'))).not.toBeInTheDocument()
    })
  })

  it('selects range in reverse order (end -> start)', async () => {
    const handleChange = jest.fn()
    renderWithTheme(<DateRangePicker onChange={handleChange} />)
    const inputs = screen.getAllByRole('textbox')

    // Click end input
    await userEvent.click(inputs[1])

    // Select end date (20th)
    const day20 = screen.getAllByText('20').find((el) => el.tagName === 'DIV')
    if (day20) await userEvent.click(day20)

    // Should switch to start selection but not call onChange yet
    expect(handleChange).not.toHaveBeenCalled()

    // Select start date (15th)
    const day15 = screen.getAllByText('15').find((el) => el.tagName === 'DIV')
    if (day15) await userEvent.click(day15)

    // Should call onChange and close
    expect(handleChange).toHaveBeenCalled()
    await waitFor(() => {
      expect(screen.queryByText(format(new Date(), 'yyyy年 MM月'))).not.toBeInTheDocument()
    })
  })

  it('requires full re-selection when modifying existing range', async () => {
    const handleChange = jest.fn()
    // Initial range: 10th - 25th
    const initialStart = new Date()
    initialStart.setDate(10)
    const initialEnd = new Date()
    initialEnd.setDate(25)

    renderWithTheme(
      <DateRangePicker defaultValue={[initialStart, initialEnd]} onChange={handleChange} />,
    )
    const inputs = screen.getAllByRole('textbox')

    // Click start input to modify
    await userEvent.click(inputs[0])

    // Select new start date (12th)
    const day12 = screen.getAllByText('12').find((el) => el.tagName === 'DIV')
    if (day12) await userEvent.click(day12)

    // Should NOT close yet (waiting for end date confirmation)
    expect(screen.getByText(format(new Date(), 'yyyy年 MM月'))).toBeInTheDocument()
    expect(handleChange).not.toHaveBeenCalled()

    // Select end date (25th again or new one)
    const day25 = screen.getAllByText('25').find((el) => el.tagName === 'DIV')
    if (day25) await userEvent.click(day25)

    // Now it should close
    expect(handleChange).toHaveBeenCalled()
    await waitFor(() => {
      expect(screen.queryByText(format(new Date(), 'yyyy年 MM月'))).not.toBeInTheDocument()
    })
  })
})
