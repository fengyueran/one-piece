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
  describe('Rendering', () => {
    it('should render input correctly', () => {
      renderWithTheme(<DatePicker placeholder="Select date" />)
      expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument()
    })

    it('should render with default class', () => {
      const { container } = renderWithTheme(<DatePicker />)
      expect(container.querySelector('.compass-date-picker')).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('should apply disabled state', () => {
      renderWithTheme(<DatePicker disabled placeholder="Disabled date" />)
      const input = screen.getByPlaceholderText('Disabled date')
      expect(input).toBeDisabled()
    })

    it('should show clear button when clearable is true and has value', async () => {
      const handleChange = jest.fn()
      renderWithTheme(<DatePicker defaultValue={new Date()} clearable onChange={handleChange} />)

      const input = screen.getByRole('textbox')
      await userEvent.hover(input.parentElement!) // Hover to show clear button

      // Note: compass-ui InputField usually shows clear button on hover or always if visible prop is handled.
      // Based on InputField implementation, it has .compass-input-clear-button.
      // We might need to query by class or role.
      const clearBtn = screen.getByRole('button', { hidden: true }) // hidden because it might be physically hidden until hover
      expect(clearBtn).toBeInTheDocument()

      fireEvent.click(clearBtn)
      expect(handleChange).toHaveBeenCalledWith(null)
      expect(input).toHaveValue('')
    })

    it('should format date according to format prop', () => {
      const date = new Date(2023, 0, 1) // 2023-01-01
      renderWithTheme(<DatePicker value={date} format="yyyy/MM/dd" />)
      expect(screen.getByRole('textbox')).toHaveValue('2023/01/01')
    })

    it('should apply fullWidth style', () => {
      const { container } = renderWithTheme(<DatePicker fullWidth />)
      expect(container.firstChild).toHaveStyle('width: 100%')
    })
  })

  describe('Interactions', () => {
    it('should open calendar on click', async () => {
      renderWithTheme(<DatePicker />)
      const input = screen.getByRole('textbox')
      await userEvent.click(input)
      expect(screen.getByText(format(new Date(), 'yyyy年 MM月'))).toBeInTheDocument()
    })

    it('should select a date', async () => {
      const handleChange = jest.fn()
      renderWithTheme(<DatePicker onChange={handleChange} />)

      const input = screen.getByRole('textbox')
      await userEvent.click(input)

      const day = screen.getAllByText('15').find((el) => el.tagName === 'DIV')
      if (day) await userEvent.click(day)

      expect(handleChange).toHaveBeenCalled()
    })

    it('should close on selection (without time)', async () => {
      renderWithTheme(<DatePicker />)
      await userEvent.click(screen.getByRole('textbox'))
      const day = screen.getAllByText('15').find((el) => el.tagName === 'DIV')
      if (day) await userEvent.click(day)

      await waitFor(() => {
        expect(screen.queryByText(format(new Date(), 'yyyy年 MM月'))).not.toBeInTheDocument()
      })
    })
  })

  describe('State', () => {
    it('should work as uncontrolled component with defaultValue', () => {
      const date = new Date(2023, 0, 1)
      renderWithTheme(<DatePicker defaultValue={date} format="yyyy-MM-dd" />)
      expect(screen.getByRole('textbox')).toHaveValue('2023-01-01')
    })

    it('should work as controlled component with value', () => {
      const date = new Date(2023, 0, 1)
      const { rerender } = renderWithTheme(<DatePicker value={date} format="yyyy-MM-dd" />)
      expect(screen.getByRole('textbox')).toHaveValue('2023-01-01')

      const newDate = new Date(2023, 0, 2)
      rerender(
        <ThemeProvider>
          <DatePicker value={newDate} format="yyyy-MM-dd" />
        </ThemeProvider>,
      )
      expect(screen.getByRole('textbox')).toHaveValue('2023-01-02')
    })
  })

  describe('Accessibility', () => {
    it('should have correct ARIA attributes', () => {
      renderWithTheme(<DatePicker aria-label="Choose date" />)
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-label', 'Choose date')
    })
  })
})

describe('DateRangePicker', () => {
  describe('Rendering', () => {
    it('should render inputs correctly', () => {
      renderWithTheme(<DateRangePicker placeholder={['Start', 'End']} />)
      expect(screen.getByPlaceholderText('Start')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('End')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('should select range in normal order', async () => {
      const handleChange = jest.fn()
      renderWithTheme(<DateRangePicker onChange={handleChange} />)
      const inputs = screen.getAllByRole('textbox')

      await userEvent.click(inputs[0])

      const day15 = screen.getAllByText('15').find((el) => el.tagName === 'DIV')
      if (day15) await userEvent.click(day15)

      const day20 = screen.getAllByText('20').find((el) => el.tagName === 'DIV')
      if (day20) await userEvent.click(day20)

      expect(handleChange).toHaveBeenCalled()
    })
  })

  describe('Boundary', () => {
    it('should handle clearing inputs', async () => {
      const handleChange = jest.fn()
      renderWithTheme(
        <DateRangePicker
          defaultValue={[new Date(), new Date()]}
          clearable
          onChange={handleChange}
        />,
      )

      // Find clear button (might need hover)
      const wrapper = screen.getAllByRole('textbox')[0].closest('.compass-date-range-picker')
      if (wrapper) await userEvent.hover(wrapper)

      const inputs = screen.getAllByRole('textbox')
      await userEvent.hover(inputs[0])

      // The clear button is a <span> with ✕, inside StyledSuffixIcon
      const clearBtn = screen.getByText('✕')
      await userEvent.click(clearBtn)

      expect(handleChange).toHaveBeenCalledWith([null, null])
      expect(inputs[0]).toHaveValue('')
      expect(inputs[1]).toHaveValue('')
    })
  })
})
