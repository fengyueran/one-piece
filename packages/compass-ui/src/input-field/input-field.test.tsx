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

    it('should render full width', () => {
      renderWithTheme(<InputField fullWidth />)
      const container = screen.getByRole('textbox').closest('div')
      expect(container).toHaveStyle({ width: '100%' })
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
      expect(container.querySelector('.compass-icon-search')).toBeInTheDocument()
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

  describe('Branches', () => {
    it('should handle change when not controlled', () => {
      renderWithTheme(<InputField defaultValue="init" />)
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'new' } })
      expect(screen.getByRole('textbox')).toHaveValue('new')
    })

    it('should handle clear when controlled', () => {
      const onChange = jest.fn()
      renderWithTheme(<InputField value="controlled" allowClear onChange={onChange} />)
      fireEvent.click(screen.getByRole('button'))

      // Should call onChange with empty string
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange.mock.calls[0][0].target.value).toBe('')
      // Value should NOT change because it is controlled and we didn't update prop
      expect(screen.getByRole('textbox')).toHaveValue('controlled')
    })

    it('should handle key down other than enter', () => {
      const onKeyDown = jest.fn()
      renderWithTheme(<InputField onKeyDown={onKeyDown} />)
      fireEvent.keyDown(screen.getByRole('textbox'), { key: 'a' })
      expect(onKeyDown).toHaveBeenCalled()
    })

    it('should render search with suffix', () => {
      const { container } = renderWithTheme(
        <InputField type="search" suffix={<span>Custom</span>} />,
      )
      expect(screen.getByText('Custom')).toBeInTheDocument()
      // Search icon should NOT be rendered if suffix is provided
      expect(container.querySelector('.compass-icon-search')).not.toBeInTheDocument()
    })
  })

  describe('Boundary', () => {
    it('should forward ref', () => {
      const ref = React.createRef<HTMLInputElement>()
      renderWithTheme(<InputField ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })
  })

  describe('Semantic Customization', () => {
    it('should apply custom classNames and styles', () => {
      const { container } = renderWithTheme(
        <InputField
          classNames={{
            root: 'custom-root',
            input: 'custom-input',
            prefix: 'custom-prefix',
          }}
          styles={{
            root: { color: 'red' },
            input: { color: 'blue' },
          }}
          prefix={<span>Prefix</span>}
        />,
      )

      expect(container.querySelector('.custom-root')).toBeInTheDocument()
      expect(container.querySelector('.custom-input')).toBeInTheDocument()
      expect(container.querySelector('.custom-prefix')).toBeInTheDocument()

      expect(container.querySelector('.custom-root')).toHaveStyle('color: rgb(255, 0, 0)')
      expect(container.querySelector('.custom-input')).toHaveStyle('color: rgb(0, 0, 255)')
    })
  })
})
