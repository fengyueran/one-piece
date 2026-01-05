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
      // Clear button is now CloseCircleIcon which has aria-label="close-circle"
      const clearBtn = screen.getByLabelText('close-circle')
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
      expect(screen.getByText(format(new Date(), 'yyyy年 M月'))).toBeInTheDocument()
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
        expect(screen.queryByText(format(new Date(), 'yyyy年 M月'))).not.toBeInTheDocument()
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
  describe('Date Picker Branches', () => {
    it('should handle week picker mode', async () => {
      renderWithTheme(<DatePicker picker="week" />)
      const input = screen.getByRole('textbox')
      await userEvent.click(input)

      const day = screen.getAllByText('15')[0]
      // Simulating hover
      fireEvent.mouseEnter(day)
      fireEvent.mouseLeave(day)

      // Click to select
      await userEvent.click(day)

      // Should show week format
      expect((input as HTMLInputElement).value).toMatch(/第\d+周/)
    })

    it('should handle month picker mode', async () => {
      renderWithTheme(<DatePicker picker="month" />)
      await userEvent.click(screen.getByRole('textbox'))

      // Should show months panel directly (MonthPanel currently uses English format MMM by default)
      expect(screen.getByText('Jan')).toBeInTheDocument()
      await userEvent.click(screen.getByText('Mar'))

      expect(screen.queryByText('Jan')).not.toBeInTheDocument() // Should close
      expect((screen.getByRole('textbox') as HTMLInputElement).value).toMatch(/20\d\d-\d\d/)
    })

    it('should handle year picker mode', async () => {
      renderWithTheme(<DatePicker picker="year" />)
      await userEvent.click(screen.getByRole('textbox'))

      // Year panel
      const year = new Date().getFullYear()
      fireEvent.click(screen.getByText(String(year)))

      // Just check that onChange could be triggered or value format is reasonably correct (e.g. includes year)
      await waitFor(() => {
        expect((screen.getByRole('textbox') as HTMLInputElement).value).toMatch(
          new RegExp(String(year)),
        )
      })
    })

    it('should handle quarter picker mode', async () => {
      renderWithTheme(<DatePicker picker="quarter" />)
      await userEvent.click(screen.getByRole('textbox'))

      await userEvent.click(screen.getByText('Q1'))
      // Matches "2025年第1季度" (zh-CN) or "2025-Q1" (fallback)
      expect((screen.getByRole('textbox') as HTMLInputElement).value).toMatch(/(第\d+季度|Q\d)/)
    })

    it('should handle time selection', async () => {
      const onChange = jest.fn()
      renderWithTheme(<DatePicker showTime onChange={onChange} />)
      await userEvent.click(screen.getByRole('textbox'))

      const day = screen.getAllByText('15')[0]
      await userEvent.click(day)

      // Should not close yet (selecting date)
      expect(screen.getByText('确定')).toBeInTheDocument()

      // Click OK to confirm
      await userEvent.click(screen.getByText('确定'))

      expect(onChange).toHaveBeenCalled()
      // Wait for floating element to disappear or check visibility
      // userEvent.click is async but floating-ui state update might be async too
      await waitFor(() => {
        expect(screen.queryByText('确定')).not.toBeInTheDocument()
      })
    }, 10000)

    it('should switch panels', async () => {
      renderWithTheme(<DatePicker />)
      const input = screen.getByRole('textbox')
      await userEvent.click(input)

      // Go to month panel
      const headerTitle = screen.getByText(/\d{4}年 \d{1,2}月/)
      await userEvent.click(headerTitle)
      expect(screen.getByText('Jan')).toBeInTheDocument()

      // Go to year panel
      const yearHeader = screen.getByText(/\d{4}年/)
      await userEvent.click(yearHeader)
      expect(screen.getByText(/\d{4}-\d{4}/)).toBeInTheDocument() // Decade range

      // Select year -> Back to month
      const year = new Date().getFullYear()
      await userEvent.click(screen.getByText(String(year)))
      expect(screen.getByText('Jan')).toBeInTheDocument()

      // Select month -> Back to date
      await userEvent.click(screen.getByText('Jan'))
      // Header title comes back
      expect(screen.getByText(/\d{4}年 \d{1,2}月/)).toBeInTheDocument()
    }, 10000)

    it('should handle input change clearing', async () => {
      const onChange = jest.fn()
      renderWithTheme(<DatePicker value={new Date()} onChange={onChange} />)
      const input = screen.getByRole('textbox')

      // Use fireEvent.change for readOnly inputs to simulate programmatic change or clear behavior
      fireEvent.change(input, { target: { value: '' } })
      expect(onChange).toHaveBeenCalledWith(null)
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

      // Use a more specific query or assertion
      const day20 = screen.getAllByText('20').find((el) => el.tagName === 'DIV')
      expect(day20).toBeInTheDocument()

      // Trigger hover effect for range selection if needed
      await userEvent.hover(day20!)
      await userEvent.click(day20!)

      expect(handleChange).toHaveBeenCalled()
    }, 10000)
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

      // The clear button is CloseCircleIcon with aria-label="close-circle", inside StyledSuffixIcon
      const clearBtn = screen.getByLabelText('close-circle')
      await userEvent.click(clearBtn)

      expect(handleChange).toHaveBeenCalledWith([null, null])
      expect(inputs[0]).toHaveValue('')
      expect(inputs[1]).toHaveValue('')
    })
  })
})
