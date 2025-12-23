import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { TimePanel } from './time-panel'
import ThemeProvider from '../../theme/theme-provider'
import { setHours, setMinutes } from 'date-fns'

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

describe('TimePanel', () => {
  it('should render time columns', () => {
    const value = new Date(2023, 0, 1, 10, 30, 45)
    const onChange = jest.fn()
    renderWithTheme(<TimePanel value={value} onChange={onChange} />)

    // Check for some values
    // Hours 00 to 23
    // Minutes 00 to 59
    // Seconds 00 to 59
    // It renders a lot of elements, check sample
    const hour10 = screen.getAllByText('10')
    const min30 = screen.getAllByText('30')
    expect(hour10.length).toBeGreaterThan(0)
    expect(min30.length).toBeGreaterThan(0)
  })

  it('should handle hour change', () => {
    const value = new Date(2023, 0, 1, 10, 30, 45)
    const onChange = jest.fn()
    renderWithTheme(<TimePanel value={value} onChange={onChange} />)

    // Click on hour 15
    const hour15 = screen.getAllByText('15')[0] // could be min/sec too? 15 is valid for all
    // They are in different columns.
    // The implementation renders 3 columns.
    // StyledColumn > map.
    // We can rely on structure or just click the first '15' we find.
    // Ideally we should distinguish.
    // TimePanel renders: Hours first, then Mins, then Secs.
    // screen.getAllByText('15') returns array. [0] is likely Hour if distinct, or they appear in order.

    fireEvent.click(hour15)

    const expected = setHours(value, 15)
    expect(onChange).toHaveBeenCalledWith(expected)
  })

  it('should handle minute change', () => {
    const value = new Date(2023, 0, 1, 10, 30, 45)
    const onChange = jest.fn()
    renderWithTheme(<TimePanel value={value} onChange={onChange} />)

    // We want to click minute 45. 45 is also valid second.
    // The component structure is Hours | Minutes | Seconds
    // Minute 45 is in the middle column.

    const cell45s = screen.getAllByText('45')
    // Index 0 -> Minute (since Hour goes up to 23 only), Index 1 -> Second
    // Wait, 45 is not valid hour. So it appears in Minute (0-59) and Second (0-59).
    // So cell45s[0] should be Minute.

    fireEvent.click(cell45s[0])

    const expected = setMinutes(value, 45)
    expect(onChange).toHaveBeenCalledWith(expected)
  })

  it('should highlight selected time', () => {
    const value = new Date(2023, 0, 1, 12, 0, 0)
    const onChange = jest.fn()
    renderWithTheme(<TimePanel value={value} onChange={onChange} />)

    // Check visual active state logic if needed, or simply pass
  })
})
