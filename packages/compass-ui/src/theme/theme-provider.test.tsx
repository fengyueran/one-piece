import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useTheme } from '@emotion/react'
import ThemeProvider from './theme-provider'
import { defaultTheme } from './default-theme'
import { Theme } from './types'

// Test component that uses theme
const ThemeConsumer: React.FC = () => {
  const theme = useTheme() as Theme
  return (
    <div>
      <span data-testid="primary-color">{theme.colors.primary}</span>
      <span data-testid="spacing-md">{theme.spacing.md}</span>
      <span data-testid="font-size-sm">{theme.fontSize.sm}</span>
    </div>
  )
}

describe('ThemeProvider', () => {
  describe('Rendering', () => {
    it('should render children', () => {
      const { container } = render(
        <ThemeProvider>
          <div data-testid="child">Child Content</div>
        </ThemeProvider>,
      )
      expect(container.querySelector('[data-testid="child"]')).toBeInTheDocument()
    })

    it('should provide default theme when no theme prop is passed', () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>,
      )
      expect(getByTestId('primary-color')).toHaveTextContent(defaultTheme.colors.primary)
      expect(getByTestId('spacing-md')).toHaveTextContent(String(defaultTheme.spacing.md))
      expect(getByTestId('font-size-sm')).toHaveTextContent(String(defaultTheme.fontSize.sm))
    })
  })

  describe('Custom Theme', () => {
    it('should merge custom colors with default theme', () => {
      const customTheme = {
        colors: {
          primary: '#ff0000',
        },
      }
      const { getByTestId } = render(
        <ThemeProvider theme={customTheme}>
          <ThemeConsumer />
        </ThemeProvider>,
      )
      expect(getByTestId('primary-color')).toHaveTextContent('#ff0000')
      expect(getByTestId('spacing-md')).toHaveTextContent(String(defaultTheme.spacing.md))
    })

    it('should merge custom spacing with default theme', () => {
      const customTheme = {
        spacing: {
          md: 32,
        },
      }
      const { getByTestId } = render(
        <ThemeProvider theme={customTheme}>
          <ThemeConsumer />
        </ThemeProvider>,
      )
      expect(getByTestId('spacing-md')).toHaveTextContent('32')
      expect(getByTestId('primary-color')).toHaveTextContent(defaultTheme.colors.primary)
    })

    it('should merge custom fontSize with default theme', () => {
      const customTheme = {
        fontSize: {
          sm: 16,
        },
      }
      const { getByTestId } = render(
        <ThemeProvider theme={customTheme}>
          <ThemeConsumer />
        </ThemeProvider>,
      )
      expect(getByTestId('font-size-sm')).toHaveTextContent('16')
    })

    it('should merge multiple custom properties', () => {
      const customTheme = {
        colors: {
          primary: '#00ff00',
        },
        spacing: {
          md: 20,
        },
        fontSize: {
          sm: 15,
        },
      }
      const { getByTestId } = render(
        <ThemeProvider theme={customTheme}>
          <ThemeConsumer />
        </ThemeProvider>,
      )
      expect(getByTestId('primary-color')).toHaveTextContent('#00ff00')
      expect(getByTestId('spacing-md')).toHaveTextContent('20')
      expect(getByTestId('font-size-sm')).toHaveTextContent('15')
    })

    it('should preserve non-overridden default values', () => {
      const customTheme = {
        colors: {
          primary: '#123456',
        },
      }

      const AllThemeConsumer: React.FC = () => {
        const theme = useTheme() as Theme
        return (
          <div>
            <span data-testid="primary">{theme.colors.primary}</span>
            <span data-testid="success">{theme.colors.success}</span>
            <span data-testid="error">{theme.colors.error}</span>
          </div>
        )
      }

      const { getByTestId } = render(
        <ThemeProvider theme={customTheme}>
          <AllThemeConsumer />
        </ThemeProvider>,
      )

      expect(getByTestId('primary')).toHaveTextContent('#123456')
      expect(getByTestId('success')).toHaveTextContent(defaultTheme.colors.success)
      expect(getByTestId('error')).toHaveTextContent(defaultTheme.colors.error)
    })
  })

  describe('Theme Memoization', () => {
    it('should memoize merged theme', () => {
      const customTheme = {
        colors: {
          primary: '#ff00ff',
        },
      }

      let renderCount = 0
      const MemoTestComponent: React.FC = () => {
        const theme = useTheme() as Theme
        React.useEffect(() => {
          renderCount++
        }, [theme])
        return <div data-testid="memo-test">{theme.colors.primary}</div>
      }

      const { rerender } = render(
        <ThemeProvider theme={customTheme}>
          <MemoTestComponent />
        </ThemeProvider>,
      )

      const initialRenderCount = renderCount

      // Rerender with same theme
      rerender(
        <ThemeProvider theme={customTheme}>
          <MemoTestComponent />
        </ThemeProvider>,
      )

      // Should not cause additional re-renders due to memoization
      expect(renderCount).toBe(initialRenderCount)
    })

    it('should update when theme prop changes', () => {
      const theme1 = {
        colors: {
          primary: '#111111',
        },
      }
      const theme2 = {
        colors: {
          primary: '#222222',
        },
      }

      const { getByTestId, rerender } = render(
        <ThemeProvider theme={theme1}>
          <ThemeConsumer />
        </ThemeProvider>,
      )

      expect(getByTestId('primary-color')).toHaveTextContent('#111111')

      rerender(
        <ThemeProvider theme={theme2}>
          <ThemeConsumer />
        </ThemeProvider>,
      )

      expect(getByTestId('primary-color')).toHaveTextContent('#222222')
    })
  })

  describe('Nested Providers', () => {
    it('should support nested theme providers', () => {
      const outerTheme = {
        colors: {
          primary: '#aaaaaa',
        },
      }
      const innerTheme = {
        colors: {
          primary: '#bbbbbb',
        },
      }

      const { container } = render(
        <ThemeProvider theme={outerTheme}>
          <div data-testid="outer">
            <ThemeConsumer />
          </div>
          <ThemeProvider theme={innerTheme}>
            <div data-testid="inner">
              <ThemeConsumer />
            </div>
          </ThemeProvider>
        </ThemeProvider>,
      )

      const outerPrimary = container.querySelector(
        '[data-testid="outer"] [data-testid="primary-color"]',
      )
      const innerPrimary = container.querySelector(
        '[data-testid="inner"] [data-testid="primary-color"]',
      )

      expect(outerPrimary).toHaveTextContent('#aaaaaa')
      expect(innerPrimary).toHaveTextContent('#bbbbbb')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty custom theme object', () => {
      const { getByTestId } = render(
        <ThemeProvider theme={{}}>
          <ThemeConsumer />
        </ThemeProvider>,
      )
      expect(getByTestId('primary-color')).toHaveTextContent(defaultTheme.colors.primary)
    })

    it('should handle undefined theme prop', () => {
      const { getByTestId } = render(
        <ThemeProvider theme={undefined}>
          <ThemeConsumer />
        </ThemeProvider>,
      )
      expect(getByTestId('primary-color')).toHaveTextContent(defaultTheme.colors.primary)
    })

    it('should handle partial color override', () => {
      const customTheme = {
        colors: {
          primary: '#custom',
          // Other colors not provided
        },
      }
      const { getByTestId } = render(
        <ThemeProvider theme={customTheme}>
          <ThemeConsumer />
        </ThemeProvider>,
      )
      expect(getByTestId('primary-color')).toHaveTextContent('#custom')
    })
  })

  describe('All Theme Properties', () => {
    it('should support all theme properties', () => {
      const fullCustomTheme: Partial<Theme> = {
        colors: {
          primary: '#custom-primary',
          primaryHover: '#custom-hover',
          primaryActive: '#custom-active',
          success: '#custom-success',
          warning: '#custom-warning',
          error: '#custom-error',
          info: '#custom-info',
          text: '#custom-text',
          textSecondary: '#custom-text-secondary',
          textTertiary: '#custom-text-tertiary',
          textDisabled: '#custom-text-disabled',
          background: '#custom-bg',
          backgroundSecondary: '#custom-bg-secondary',
          backgroundTertiary: '#custom-bg-tertiary',
          border: '#custom-border',
          borderSecondary: '#custom-border-secondary',
          borderHover: '#custom-border-hover',
        },
        spacing: {
          xs: 2,
          sm: 4,
          md: 8,
          lg: 12,
          xl: 16,
          xxl: 24,
        },
        borderRadius: {
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 6,
        },
        fontSize: {
          xs: 10,
          sm: 12,
          md: 14,
          lg: 16,
          xl: 18,
          xxl: 20,
        },
        fontWeight: {
          light: 200,
          normal: 300,
          medium: 400,
          semibold: 500,
          bold: 600,
        },
        lineHeight: {
          tight: 1.1,
          normal: 1.3,
          relaxed: 1.5,
        },
        shadows: {
          sm: 'custom-shadow-sm',
          md: 'custom-shadow-md',
          lg: 'custom-shadow-lg',
          xl: 'custom-shadow-xl',
        },
        transitions: {
          fast: 'custom-fast',
          normal: 'custom-normal',
          slow: 'custom-slow',
        },
        breakpoints: {
          xs: '400px',
          sm: '600px',
          md: '800px',
          lg: '1000px',
          xl: '1400px',
        },
      }

      const FullThemeConsumer: React.FC = () => {
        const theme = useTheme() as Theme
        return (
          <div>
            <span data-testid="custom-primary">{theme.colors.primary}</span>
            <span data-testid="custom-spacing">{theme.spacing.md}</span>
            <span data-testid="custom-font-size">{theme.fontSize.sm}</span>
          </div>
        )
      }

      const { getByTestId } = render(
        <ThemeProvider theme={fullCustomTheme}>
          <FullThemeConsumer />
        </ThemeProvider>,
      )

      expect(getByTestId('custom-primary')).toHaveTextContent('#custom-primary')
      expect(getByTestId('custom-spacing')).toHaveTextContent('8')
      expect(getByTestId('custom-font-size')).toHaveTextContent('12')
    })
  })
})
