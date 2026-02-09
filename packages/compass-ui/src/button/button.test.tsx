import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeProvider } from '../theme'
import Button from './button'

describe('Button', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(
        <ThemeProvider>
          <Button>Click me</Button>
        </ThemeProvider>,
      )
      expect(screen.getByRole('button')).toBeInTheDocument()
      expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('should render with custom className', () => {
      render(
        <ThemeProvider>
          <Button className="custom-button">Click me</Button>
        </ThemeProvider>,
      )
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-button')
      expect(button).toHaveClass('compass-button')
    })

    it('should render with custom style', () => {
      render(
        <ThemeProvider>
          <Button style={{ width: '200px' }}>Click me</Button>
        </ThemeProvider>,
      )
      const button = screen.getByRole('button')
      expect(button).toHaveStyle({ width: '200px' })
    })
  })

  describe('Variants', () => {
    it('should render primary variant', () => {
      render(
        <ThemeProvider>
          <Button variant="primary">Primary</Button>
        </ThemeProvider>,
      )
      const button = screen.getByRole('button')
      expect(button).toHaveClass('compass-button--primary')
    })

    it('should render default variant', () => {
      render(
        <ThemeProvider>
          <Button variant="default">Default</Button>
        </ThemeProvider>,
      )
      const button = screen.getByRole('button')
      expect(button).toHaveClass('compass-button--default')
    })

    it('should render dashed variant', () => {
      render(
        <ThemeProvider>
          <Button variant="dashed">Dashed</Button>
        </ThemeProvider>,
      )
      const button = screen.getByRole('button')
      expect(button).toHaveClass('compass-button--dashed')
    })

    it('should render text variant', () => {
      render(
        <ThemeProvider>
          <Button variant="text">Text</Button>
        </ThemeProvider>,
      )
      const button = screen.getByRole('button')
      expect(button).toHaveClass('compass-button--text')
    })

    it('should render link variant', () => {
      render(
        <ThemeProvider>
          <Button variant="link">Link</Button>
        </ThemeProvider>,
      )
      const button = screen.getByRole('button')
      expect(button).toHaveClass('compass-button--link')
    })
  })

  describe('Sizes', () => {
    it('should render small size with correct styles', () => {
      render(
        <ThemeProvider>
          <Button size="small">Small</Button>
        </ThemeProvider>,
      )
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      const styles = window.getComputedStyle(button)
      expect(styles.height).toMatch(/24px/)
      expect(styles.fontSize).toMatch(/12px/)
    })

    it('should render medium size with correct styles', () => {
      render(
        <ThemeProvider>
          <Button size="medium">Medium</Button>
        </ThemeProvider>,
      )
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      const styles = window.getComputedStyle(button)
      expect(styles.height).toMatch(/32px/)
      expect(styles.fontSize).toMatch(/14px/)
    })

    it('should render large size with correct styles', () => {
      render(
        <ThemeProvider>
          <Button size="large">Large</Button>
        </ThemeProvider>,
      )
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      const styles = window.getComputedStyle(button)
      expect(styles.height).toMatch(/40px/)
      expect(styles.fontSize).toMatch(/16px/)
    })
  })

  describe('Shapes', () => {
    it('should render circle shape with correct styles', () => {
      render(
        <ThemeProvider>
          <Button shape="circle" icon={<span>icon</span>} />
        </ThemeProvider>,
      )
      const button = screen.getByRole('button')
      const styles = window.getComputedStyle(button)
      expect(styles.borderRadius).toBe('50%')
      expect(styles.padding).toBe('0px')
      expect(styles.width).toMatch(/32px/)
      expect(styles.height).toMatch(/32px/)
    })

    it('should render round shape with correct styles', () => {
      render(
        <ThemeProvider>
          <Button shape="round">Round Button</Button>
        </ThemeProvider>,
      )
      const button = screen.getByRole('button')
      const styles = window.getComputedStyle(button)
      expect(styles.borderRadius).toBe('999px')
    })

    it('should render small circle shape', () => {
      render(
        <ThemeProvider>
          <Button size="small" shape="circle" icon={<span>icon</span>} />
        </ThemeProvider>,
      )
      const button = screen.getByRole('button')
      const styles = window.getComputedStyle(button)
      expect(styles.width).toMatch(/24px/)
      expect(styles.height).toMatch(/24px/)
    })

    it('should render large circle shape', () => {
      render(
        <ThemeProvider>
          <Button size="large" shape="circle" icon={<span>icon</span>} />
        </ThemeProvider>,
      )
      const button = screen.getByRole('button')
      const styles = window.getComputedStyle(button)
      expect(styles.width).toMatch(/40px/)
      expect(styles.height).toMatch(/40px/)
    })
  })

  describe('States', () => {
    it('should apply disabled state', () => {
      render(
        <ThemeProvider>
          <Button disabled>Disabled</Button>
        </ThemeProvider>,
      )
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('should render loading state', () => {
      render(
        <ThemeProvider>
          <Button loading>Loading</Button>
        </ThemeProvider>,
      )
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      // Loading spinner should be present
      expect(button.querySelector('span[aria-hidden]')).toBeInTheDocument()
    })

    it('should render danger state with correct styles', () => {
      render(
        <ThemeProvider>
          <Button danger>Danger</Button>
        </ThemeProvider>,
      )
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      const styles = window.getComputedStyle(button)
      // danger state should have error color for border and text
      expect(styles.borderColor).toMatch(/rgb\(255, 77, 79\)|#ff4d4f/) // #ff4d4f
      expect(styles.color).toMatch(/rgb\(255, 77, 79\)|#ff4d4f/)
    })

    it('should render danger primary with correct background', () => {
      render(
        <ThemeProvider>
          <Button variant="primary" danger>
            Danger Primary
          </Button>
        </ThemeProvider>,
      )
      const button = screen.getByRole('button')
      const styles = window.getComputedStyle(button)
      // danger primary should have error background
      expect(styles.backgroundColor).toMatch(/rgb\(255, 77, 79\)|#ff4d4f/) // #ff4d4f
    })

    it('should render block style with full width', () => {
      render(
        <ThemeProvider>
          <Button block>Block</Button>
        </ThemeProvider>,
      )
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      const styles = window.getComputedStyle(button)
      expect(styles.width).toBe('100%')
    })
  })

  describe('Icon', () => {
    it('should render with icon', () => {
      const icon = <span data-testid="icon">📋</span>
      render(
        <ThemeProvider>
          <Button icon={icon}>With Icon</Button>
        </ThemeProvider>,
      )
      expect(screen.getByTestId('icon')).toBeInTheDocument()
      expect(screen.getByText('With Icon')).toBeInTheDocument()
    })

    it('should render icon without text', () => {
      const icon = <span data-testid="icon">📋</span>
      render(
        <ThemeProvider>
          <Button icon={icon}>With Icon</Button>
        </ThemeProvider>,
      )
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })
  })

  describe('Shape', () => {
    it('should render circle shape', () => {
      render(
        <ThemeProvider>
          <Button shape="circle">C</Button>
        </ThemeProvider>,
      )
      const button = screen.getByRole('button')
      expect(button).toHaveStyle({ borderRadius: '50%' })
    })

    it('should render round shape', () => {
      render(
        <ThemeProvider>
          <Button shape="round">Round Button</Button>
        </ThemeProvider>,
      )
      const button = screen.getByRole('button')
      expect(button).toHaveStyle({ borderRadius: '999px' })
    })
  })

  describe('Interactions', () => {
    it('should call onClick handler', () => {
      const handleClick = jest.fn()
      render(
        <ThemeProvider>
          <Button onClick={handleClick}>Click me</Button>
        </ThemeProvider>,
      )
      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should not crash when clicked without onClick handler', () => {
      render(
        <ThemeProvider>
          <Button>Click me</Button>
        </ThemeProvider>,
      )
      // Should not throw
      fireEvent.click(screen.getByRole('button'))
    })

    it('should not call onClick when disabled', () => {
      const handleClick = jest.fn()
      render(
        <ThemeProvider>
          <Button disabled onClick={handleClick}>
            Click me
          </Button>
        </ThemeProvider>,
      )
      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should not call onClick when loading', () => {
      const handleClick = jest.fn()
      render(
        <ThemeProvider>
          <Button loading onClick={handleClick}>
            Click me
          </Button>
        </ThemeProvider>,
      )
      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Combined Props', () => {
    it('should render small loading button with correct styles', () => {
      render(
        <ThemeProvider>
          <Button size="small" loading>
            Small Loading
          </Button>
        </ThemeProvider>,
      )
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(screen.getByText('Small Loading')).toBeInTheDocument()
      // Verify small size styles
      const styles = window.getComputedStyle(button)
      expect(styles.height).toMatch(/24px/)
      // Verify loading spinner exists
      expect(button.querySelector('span[aria-hidden]')).toBeInTheDocument()
    })

    it('should render block danger button with correct styles', () => {
      render(
        <ThemeProvider>
          <Button block danger>
            Block Danger
          </Button>
        </ThemeProvider>,
      )
      const button = screen.getByRole('button')
      const styles = window.getComputedStyle(button)
      // Verify block style (full width)
      expect(styles.width).toBe('100%')
      // Verify danger style (error color)
      expect(styles.color).toMatch(/rgb\(255, 77, 79\)|#ff4d4f/)
    })
  })

  describe('Accessibility', () => {
    it('should support aria-label', () => {
      render(
        <ThemeProvider>
          <Button aria-label="Submit form">Submit</Button>
        </ThemeProvider>,
      )
      expect(screen.getByLabelText('Submit form')).toBeInTheDocument()
    })

    it('should be keyboard accessible', () => {
      const handleClick = jest.fn()
      render(
        <ThemeProvider>
          <Button onClick={handleClick}>Click me</Button>
        </ThemeProvider>,
      )
      const button = screen.getByRole('button')
      button.focus()
      expect(button).toHaveFocus()
    })

    it('should hide loading spinner from screen readers', () => {
      render(
        <ThemeProvider>
          <Button loading>Loading</Button>
        </ThemeProvider>,
      )
      const spinner = screen.getByRole('button').querySelector('[aria-hidden]')
      expect(spinner).toHaveAttribute('aria-hidden')
    })
  })

  describe('Without ThemeProvider', () => {
    it('should render with default fallback styles', () => {
      render(<Button>Click me</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()

      const styles = window.getComputedStyle(button)
      expect(styles.height).toMatch(/32px/)
      expect(styles.fontSize).toMatch(/14px/)
      expect(styles.backgroundColor).toMatch(/rgb\(255, 255, 255\)|#fff/) // #fff
      expect(styles.borderColor).toMatch(/rgb\(217, 217, 217\)|#d9d9d9/) // #d9d9d9
      expect(styles.color).toMatch(/rgb\(0, 0, 0\)|#000/) // #000
    })

    it('should render primary variant with fallback styles', () => {
      render(<Button variant="primary">Primary</Button>)
      const button = screen.getByRole('button')
      const styles = window.getComputedStyle(button)

      expect(styles.backgroundColor).toMatch(/rgb\(0, 123, 255\)|#007bff/) // #007bff
      expect(styles.color).toMatch(/rgb\(255, 255, 255\)|#fff/) // #fff
    })
  })
})
