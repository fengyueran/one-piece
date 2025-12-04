import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import InputField from './input-field'
import ThemeProvider from '../theme/theme-provider'

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

describe('InputField', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      renderWithTheme(<InputField />)
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'text')
    })
  })

  describe('Props', () => {
    it('should render label', () => {
      renderWithTheme(<InputField label="Username" />)
      expect(screen.getByText('Username')).toBeInTheDocument()
    })

    it('should render helper text', () => {
      renderWithTheme(<InputField helperText="Enter your username" />)
      expect(screen.getByText('Enter your username')).toBeInTheDocument()
    })

    it('should render error message', () => {
      renderWithTheme(<InputField error="Invalid input" />)
      expect(screen.getByText('Invalid input')).toBeInTheDocument()
    })

    it('should render helper text with error style when error is boolean true', () => {
      renderWithTheme(<InputField error={true} helperText="Error Text" />)
      expect(screen.getByText('Error Text')).toBeInTheDocument()
    })

    it('should render full width', () => {
      const { container } = renderWithTheme(<InputField fullWidth />)
      expect(container.firstChild).toHaveStyle('width: 100%')
    })

    it('should render with different sizes', () => {
      const { container } = renderWithTheme(
        <>
          <InputField size="small" />
          <InputField size="medium" />
          <InputField size="large" />
        </>,
      )
      expect(container.querySelector('.compass-input-field--small')).toBeInTheDocument()
      expect(container.querySelector('.compass-input-field--medium')).toBeInTheDocument()
      expect(container.querySelector('.compass-input-field--large')).toBeInTheDocument()
    })

    it('should render start adornment', () => {
      renderWithTheme(<InputField prefix={<span>$</span>} />)
      expect(screen.getByText('$')).toBeInTheDocument()
    })

    it('should render end adornment', () => {
      renderWithTheme(<InputField suffix={<span>kg</span>} />)
      expect(screen.getByText('kg')).toBeInTheDocument()
    })

    it('should apply disabled state', () => {
      renderWithTheme(<InputField disabled />)
      expect(screen.getByRole('textbox')).toBeDisabled()
    })

    it('should render password input', () => {
      renderWithTheme(<InputField type="password" placeholder="Password" />)
      const input = screen.getByPlaceholderText('Password')
      expect(input).toHaveAttribute('type', 'password')
    })

    it('should render search input', () => {
      const { container } = renderWithTheme(<InputField type="search" />)
      expect(container.querySelector('.anticon-search')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('should handle change events', () => {
      const handleChange = jest.fn()
      renderWithTheme(<InputField onChange={handleChange} />)
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'test' } })
      expect(handleChange).toHaveBeenCalled()
      expect(input).toHaveValue('test')
    })

    it('should handle focus and blur events', () => {
      const handleFocus = jest.fn()
      const handleBlur = jest.fn()
      renderWithTheme(<InputField onFocus={handleFocus} onBlur={handleBlur} />)
      const input = screen.getByRole('textbox')

      fireEvent.focus(input)
      expect(handleFocus).toHaveBeenCalled()

      fireEvent.blur(input)
      expect(handleBlur).toHaveBeenCalled()
    })

    it('should handle clear button click', () => {
      const handleChange = jest.fn()
      renderWithTheme(<InputField allowClear defaultValue="test" onChange={handleChange} />)
      const input = screen.getByRole('textbox')

      const clearButton = screen.getByRole('button')
      fireEvent.click(clearButton)

      expect(handleChange).toHaveBeenCalled()
      expect(input).toHaveValue('')
      expect(input).toHaveFocus()
    })

    it('should toggle password visibility', () => {
      renderWithTheme(<InputField type="password" placeholder="Password" />)
      const input = screen.getByPlaceholderText('Password')
      const toggleBtn = screen.getByRole('button')

      // Default password
      expect(input).toHaveAttribute('type', 'password')

      // Click to show
      fireEvent.click(toggleBtn)
      expect(input).toHaveAttribute('type', 'text')

      // Click to hide
      fireEvent.click(toggleBtn)
      expect(input).toHaveAttribute('type', 'password')
    })

    it('should call onPressEnter when Enter key is pressed', () => {
      const handlePressEnter = jest.fn()
      renderWithTheme(<InputField onPressEnter={handlePressEnter} />)
      const input = screen.getByRole('textbox')

      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 })
      expect(handlePressEnter).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('should have correct ARIA attributes', () => {
      renderWithTheme(<InputField aria-label="Username" />)
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-label', 'Username')
    })

    it('should support keyboard navigation', async () => {
      renderWithTheme(<InputField />)
      const input = screen.getByRole('textbox')
      // Ensure element is not focused initially
      expect(document.body).toHaveFocus()

      // Tab to focus
      await userEvent.tab()
      expect(input).toHaveFocus()
    })
  })

  describe('Boundary', () => {
    it('should forward ref', () => {
      const ref = React.createRef<HTMLInputElement>()
      renderWithTheme(<InputField ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })
  })
})
