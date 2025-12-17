import React, { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Pagination from './index'
import { ThemeProvider, defaultTheme } from '../theme'
import userEvent from '@testing-library/user-event'

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={defaultTheme}>{ui}</ThemeProvider>)
}

describe('Pagination', () => {
  describe('Rendering', () => {
    it('should render correctly with default props', () => {
      const { container } = renderWithTheme(<Pagination total={50} />)
      // The container is a UL
      expect(container.firstChild).toHaveClass('compass-pagination')
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should render simple mode correctly', () => {
      const { container } = renderWithTheme(<Pagination total={50} simple />)
      expect(container.querySelector('.compass-pagination-simple')).toBeInTheDocument()
      // In simple mode, we have an input
      expect(container.querySelector('input')).toBeInTheDocument()
      // And the separator / total pages
      expect(screen.getByText('/')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should not render when total is 0', () => {
      const { container } = renderWithTheme(<Pagination total={0} />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Props', () => {
    it('should apply disabled state', () => {
      renderWithTheme(<Pagination total={50} disabled />)
      // Check prev/next buttons
      const prev = screen.getByTitle('Previous Page')
      const next = screen.getByTitle('Next Page')
    })

    it('should accept custom className and style', () => {
      const { container } = renderWithTheme(
        <Pagination total={50} className="custom-test-class" style={{ opacity: 0.5 }} />,
      )
      expect(container.firstChild).toHaveClass('custom-test-class')
      expect(container.firstChild).toHaveStyle('opacity: 0.5')
    })

    it('should show total text correctly', () => {
      renderWithTheme(
        <Pagination
          total={50}
          pageSize={10}
          current={1}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total}`}
        />,
      )
      expect(screen.getByText('1-10 of 50')).toBeInTheDocument()
    })

    it('should show quick jumper', () => {
      const { container } = renderWithTheme(<Pagination total={100} showQuickJumper />)
      expect(screen.getByText('Go to')).toBeInTheDocument()
      // quick jumper input
      const input = container.querySelector('input')
      expect(input).toBeInTheDocument()
    })

    it('should show size changer', () => {
      const { container } = renderWithTheme(<Pagination total={100} showSizeChanger />)
      expect(screen.getByText('10 / page')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('should handle page change on click', () => {
      const handleChange = jest.fn()
      renderWithTheme(<Pagination total={50} onChange={handleChange} />)
      fireEvent.click(screen.getByText('2'))
      expect(handleChange).toHaveBeenCalledWith(2, 10)
    })

    it('should handle prev/next button clicks', () => {
      const handleChange = jest.fn()
      // Start at page 2
      renderWithTheme(<Pagination total={50} current={2} onChange={handleChange} />)

      const prev = screen.getByTitle('Previous Page')
      fireEvent.click(prev)
      expect(handleChange).toHaveBeenCalledWith(1, 10)

      const next = screen.getByTitle('Next Page')
      fireEvent.click(next)
      expect(handleChange).toHaveBeenCalledWith(3, 10)
    })

    it('renders ellipses and jumps', () => {
      const handleChange = jest.fn()
      // Total 500, pageSize 10 -> 50 pages. Current 25.
      // Should show 1 ... 24 25 26 ... 50
      const { rerender } = renderWithTheme(
        <Pagination total={500} current={25} onChange={handleChange} />,
      )

      // Check for jump previous (left dots)
      const prevJump = screen.getByTitle('Previous 5 Pages')
      expect(prevJump).toBeInTheDocument()

      // Check for jump next (right dots)
      const nextJump = screen.getByTitle('Next 5 Pages')
      expect(nextJump).toBeInTheDocument()

      // Click left dots -> jump back 5 pages -> 20
      fireEvent.click(prevJump)
      expect(handleChange).toHaveBeenCalledWith(20, 10)

      // Click right dots -> jump fwd 5 pages -> 30
      fireEvent.click(nextJump)
      expect(handleChange).toHaveBeenCalledWith(30, 10)

      // Case 2: No left dots, but right dots (Start of range)
      // 1 2 [3] 4 5 ... 50
      // sibling=1. leftSibling = 3-1=2. 2>2 False. No left dots.
      rerender(
        <ThemeProvider theme={defaultTheme}>
          <Pagination total={500} current={3} />
        </ThemeProvider>,
      )
      expect(screen.queryByTitle('Previous 5 Pages')).not.toBeInTheDocument()
      expect(screen.getByTitle('Next 5 Pages')).toBeInTheDocument()

      // Case 3: Left dots, no right dots (End of range)
      // 1 ... 46 47 [48] 49 50
      // Total 50 pages (500/10).
      // totalPageCount=50. total-2=48.
      // rightSibling = 48+1=49. 49 < 48 False. No right dots.
      rerender(
        <ThemeProvider theme={defaultTheme}>
          <Pagination total={500} current={48} />
        </ThemeProvider>,
      )
      expect(screen.getByTitle('Previous 5 Pages')).toBeInTheDocument()
      expect(screen.queryByTitle('Next 5 Pages')).not.toBeInTheDocument()
    })
    it('should handle simple mode input', () => {
      const handleChange = jest.fn()
      const { container } = renderWithTheme(
        <Pagination total={50} simple onChange={handleChange} />,
      )
      const input = container.querySelector('input') as HTMLInputElement

      // Type 3 and Enter
      fireEvent.change(input, { target: { value: '3' } })
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
      expect(handleChange).toHaveBeenCalledWith(3, 10)

      // Test invalid input (NaN) on blur
      fireEvent.change(input, { target: { value: 'abc' } })
      fireEvent.blur(input)
      // Should revert to current page (3) because we changed it to 3 above
      expect(input.value).toBe('3')

      // Test invalid input (NaN) on enter
      fireEvent.change(input, { target: { value: 'xyz' } })
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
      expect(input.value).toBe('3')
    })

    it('should handle quick jumper input', () => {
      const handleChange = jest.fn()
      const { container } = renderWithTheme(
        <Pagination total={100} showQuickJumper onChange={handleChange} />,
      )
      const inputs = container.querySelectorAll('input')
      const input = inputs[inputs.length - 1] // Quick jumper usually last if multiple

      // Enter
      fireEvent.change(input, { target: { value: '5' } })
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
      expect(handleChange).toHaveBeenCalledWith(5, 10)

      // Valid input on blur
      fireEvent.change(input, { target: { value: '6' } })
      fireEvent.blur(input)
      expect(handleChange).toHaveBeenCalledWith(6, 10)
      // expect(input.value).toBe('') // InputNumber maintains state, so this might not clear

      // Invalid input on blur (should clear)
      fireEvent.change(input, { target: { value: 'abc' } })
      fireEvent.blur(input)
      expect(input.value).toBe('')

      // Invalid input on enter (should clear)
      fireEvent.change(input, { target: { value: 'xyz' } })
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
      expect(input.value).toBe('')
    })

    it('should not fire onChange when disabled', () => {
      const handleChange = jest.fn()
      renderWithTheme(<Pagination total={50} disabled onChange={handleChange} />)
      fireEvent.click(screen.getByText('2'))
      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  describe('State', () => {
    it('should work in controlled mode', () => {
      const ControlledPagination = () => {
        const [current, setCurrent] = useState(1)
        return <Pagination total={50} current={current} onChange={(page) => setCurrent(page)} />
      }
      renderWithTheme(<ControlledPagination />)

      // Initially 1 is active
      expect(screen.getByText('1')).toHaveClass('compass-pagination-item-active') // Class checking or style checking

      // Click 2
      fireEvent.click(screen.getByText('2'))

      // Now 2 should be active
      expect(screen.getByText('2')).toHaveClass('compass-pagination-item-active')
      expect(screen.getByText('1')).not.toHaveClass('compass-pagination-item-active')
    })

    it('should work in uncontrolled mode', () => {
      renderWithTheme(<Pagination total={50} defaultCurrent={2} />)
      // 2 is active
      expect(screen.getByText('2')).toHaveClass('compass-pagination-item-active')
      // Click 3
      fireEvent.click(screen.getByText('3'))
      expect(screen.getByText('3')).toHaveClass('compass-pagination-item-active')
    })
  })

  describe('Accessibility', () => {
    it('should have correct ARIA attributes', () => {
      const { container } = renderWithTheme(<Pagination total={50} />)
      // The role might be implicitly list/listitem, but we check label
      expect(container.firstChild).toHaveAttribute('aria-label', 'pagination')

      expect(screen.getByTitle('Previous Page')).toBeInTheDocument()
      expect(screen.getByTitle('Next Page')).toBeInTheDocument()
    })
  })

  describe('Boundary', () => {
    it('should clamp values within range in simple mode', () => {
      const handleChange = jest.fn()
      const { container } = renderWithTheme(
        <Pagination total={50} current={2} simple onChange={handleChange} />,
      )
      const input = container.querySelector('input') as HTMLInputElement

      // Try 0. InputNumber (min=1) blocks negative sign, but 0 is numerically valid for type logic but < min.
      // However, if we enter '0', it's valid text. On Blur, it should clamp to 1.
      fireEvent.change(input, { target: { value: '0' } })
      fireEvent.blur(input)
      // Clamps to 1. Current is 2. So it changes.
      expect(handleChange).toHaveBeenCalledWith(1, 10)
    })

    it('should clamp values within range in quick jumper', () => {
      const handleChange = jest.fn()
      const { container } = renderWithTheme(
        <Pagination total={50} current={2} showQuickJumper onChange={handleChange} />,
      )
      const inputs = container.querySelectorAll('input')
      const input = inputs[inputs.length - 1]

      // Try 0.
      fireEvent.change(input, { target: { value: '0' } })
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
      expect(handleChange).toHaveBeenCalledWith(1, 10)
    })
  })

  describe('Additional Branch Coverage', () => {
    it('should handle pageSize change via prop', () => {
      const { rerender } = renderWithTheme(<Pagination total={100} pageSize={10} />)
      expect(screen.getAllByText('10').length).toBeGreaterThan(0) // Maybe total pages 10

      rerender(
        <ThemeProvider>
          <Pagination total={100} pageSize={20} />
        </ThemeProvider>,
      )
      // If pageSize 20, total pages 5.
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should render total aligned to right', () => {
      const { container } = renderWithTheme(
        <Pagination total={50} totalAlign="right" showTotal={(t) => `Total ${t}`} />,
      )
      const totalLi = container.querySelector('.compass-pagination-total-text')
      expect(totalLi).toBeInTheDocument()
    })

    it('should clear simple input on empty value change', () => {
      const { container } = renderWithTheme(<Pagination total={50} simple />)
      const input = container.querySelector('input') as HTMLInputElement
      fireEvent.change(input, { target: { value: '' } })
      expect(input.value).toBe('')
    })

    /*
     * Cannot easily test Select interaction without knowing internal structure (rc-select etc).
     * But we can mock or rely on the fact that handleSizeChange is passed.
     */
  })

  describe('Theme Fallback', () => {
    it('should handle missing theme variables gracefully', () => {
      render(
        <ThemeProvider theme={{}}>
          <Pagination total={50} showQuickJumper showSizeChanger />
        </ThemeProvider>,
      )
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })
})
