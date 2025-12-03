import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ThemeProvider, { useTheme } from './theme-provider'
import { darkTheme } from './dark-theme'
import { defaultTheme } from './default-theme'

const ThemeSwitcher: React.FC = () => {
  const { mode, toggleTheme, setMode, theme } = useTheme()
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="primary-color">{theme.colors.primary}</span>
      <button data-testid="toggle" onClick={toggleTheme}>
        Toggle
      </button>
      <button data-testid="set-light" onClick={() => setMode('light')}>
        Set Light
      </button>
      <button data-testid="set-dark" onClick={() => setMode('dark')}>
        Set Dark
      </button>
    </div>
  )
}

describe('Theme Switching', () => {
  it('should use default mode (light)', () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('mode')).toHaveTextContent('light')
    expect(screen.getByTestId('primary-color')).toHaveTextContent(defaultTheme.colors.primary)
  })

  it('should accept defaultMode prop', () => {
    render(
      <ThemeProvider defaultMode="dark">
        <ThemeSwitcher />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('mode')).toHaveTextContent('dark')
    expect(screen.getByTestId('primary-color')).toHaveTextContent(darkTheme.colors.primary)
  })

  it('should toggle theme', () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>,
    )

    const toggleBtn = screen.getByTestId('toggle')

    // Initial: Light
    expect(screen.getByTestId('mode')).toHaveTextContent('light')

    // Toggle -> Dark
    fireEvent.click(toggleBtn)
    expect(screen.getByTestId('mode')).toHaveTextContent('dark')
    expect(screen.getByTestId('primary-color')).toHaveTextContent(darkTheme.colors.primary)

    // Toggle -> Light
    fireEvent.click(toggleBtn)
    expect(screen.getByTestId('mode')).toHaveTextContent('light')
    expect(screen.getByTestId('primary-color')).toHaveTextContent(defaultTheme.colors.primary)
  })

  it('should set mode explicitly', () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>,
    )

    fireEvent.click(screen.getByTestId('set-dark'))
    expect(screen.getByTestId('mode')).toHaveTextContent('dark')

    fireEvent.click(screen.getByTestId('set-light'))
    expect(screen.getByTestId('mode')).toHaveTextContent('light')
  })
})
