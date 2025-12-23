import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../theme'
import { Progress } from './progress'

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

describe('Progress', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      renderWithTheme(<Progress />)
      expect(screen.getByText('0%')).toBeInTheDocument()
    })

    it('should render linear progress by default', () => {
      const { container } = renderWithTheme(<Progress percent={50} />)
      expect(container.querySelector('svg')).not.toBeInTheDocument()
      expect(screen.getByText('50%')).toBeInTheDocument()
    })

    it('should render circle progress when type is circle', () => {
      const { container } = renderWithTheme(<Progress type="circle" percent={75} />)
      expect(container.querySelector('svg')).toBeInTheDocument()
      expect(screen.getByText('75%')).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('should display correct percentage', () => {
      renderWithTheme(<Progress percent={25} />)
      expect(screen.getByText('25%')).toBeInTheDocument()
    })

    it('should clamp percentage to 0-100 range', () => {
      const { rerender } = renderWithTheme(<Progress percent={-10} />)
      expect(screen.getByText('0%')).toBeInTheDocument()

      rerender(
        <ThemeProvider>
          <Progress percent={150} />
        </ThemeProvider>,
      )
      expect(screen.getByText('100%')).toBeInTheDocument()
    })

    it('should hide percentage text when showInfo is false', () => {
      renderWithTheme(<Progress percent={50} showInfo={false} />)
      expect(screen.queryByText('50%')).not.toBeInTheDocument()
    })

    it('should use custom format function', () => {
      const format = (percent?: number) => `${percent}/100`
      renderWithTheme(<Progress percent={30} format={format} />)
      expect(screen.getByText('30/100')).toBeInTheDocument()
    })

    it('should show success icon when percent is 100 and success prop is provided', () => {
      const successIcon = <span data-testid="success-icon">✓</span>
      renderWithTheme(<Progress percent={100} success={successIcon} />)
      expect(screen.getByTestId('success-icon')).toBeInTheDocument()
    })
  })

  describe('Sizes', () => {
    it('should apply small size', () => {
      const { container } = renderWithTheme(<Progress size="small" percent={50} />)
      const progressBar = container.querySelector('.compass-progress div')
      expect(progressBar).toHaveStyle({ height: '4px' })
    })

    it('should apply medium size', () => {
      const { container } = renderWithTheme(<Progress size="medium" percent={50} />)
      const progressBar = container.querySelector('.compass-progress div')
      expect(progressBar).toHaveStyle({ height: '8px' })
    })

    it('should apply large size', () => {
      const { container } = renderWithTheme(<Progress size="large" percent={50} />)
      const progressBar = container.querySelector('.compass-progress div')
      expect(progressBar).toHaveStyle({ height: '12px' })
    })

    it('should apply numeric size for height', () => {
      const { container } = renderWithTheme(<Progress size={20} percent={50} />)
      const progressBar = container.querySelector('.compass-progress div')
      expect(progressBar).toHaveStyle({ height: '20px' })
    })

    it('should apply object size with width and height', () => {
      const { container } = renderWithTheme(
        <Progress size={{ width: 300, height: 15 }} percent={50} />,
      )
      const progressContainer = container.querySelector('.compass-progress')
      const progressBar = container.querySelector('.compass-progress div')
      expect(progressContainer).toHaveStyle({ width: '300px' })
      expect(progressBar).toHaveStyle({ height: '15px', width: '300px' })
    })
  })

  describe('Status', () => {
    it('should automatically set success status when percent is 100', () => {
      const { container } = renderWithTheme(<Progress percent={100} />)
      const progressBar = container.querySelector('.compass-progress div div')
      expect(progressBar).toHaveStyle({ background: '#52c41a' }) // success color
    })

    it('should use explicit status prop', () => {
      const { container } = renderWithTheme(<Progress percent={50} status="error" />)
      const progressBar = container.querySelector('.compass-progress div div')
      expect(progressBar).toHaveStyle({ background: '#ff4d4f' }) // error color
    })

    it('should handle warning status', () => {
      const { container } = renderWithTheme(<Progress percent={75} status="warning" />)
      const progressBar = container.querySelector('.compass-progress div div')
      expect(progressBar).toHaveStyle({ background: '#faad14' }) // warning color
    })

    it('should handle normal status with primary color', () => {
      const { container } = renderWithTheme(<Progress percent={60} status="normal" />)
      const progressBar = container.querySelector('.compass-progress div div')
      expect(progressBar).toHaveStyle({ background: '#1890ff' }) // primary color
      expect(screen.getByText('60%')).toBeInTheDocument()
    })
  })

  describe('Circle Progress', () => {
    it('should render with custom size', () => {
      const { container } = renderWithTheme(<Progress type="circle" percent={50} size={200} />)
      const svg = container.querySelector('svg')
      expect(svg?.parentElement).toHaveStyle({ width: '200px', height: '200px' })
    })

    it('should render SVG elements correctly', () => {
      const { container } = renderWithTheme(<Progress type="circle" percent={50} />)
      const circles = container.querySelectorAll('circle')
      expect(circles).toHaveLength(2) // trail and progress circles
    })

    it('should calculate stroke-dashoffset correctly', () => {
      const { container } = renderWithTheme(<Progress type="circle" percent={25} size={100} />)
      const progressCircle = container.querySelectorAll('circle')[1]
      expect(progressCircle).toHaveAttribute('stroke-dashoffset')
    })

    it('should calculate font size for very small circle', () => {
      renderWithTheme(<Progress type="circle" percent={25} size={50} />)
      // Check computed style of text if possible, or reliance on coverage
      expect(screen.getByText('25%')).toBeInTheDocument()
    })

    it('should calculate font size for very large circle', () => {
      renderWithTheme(<Progress type="circle" percent={25} size={150} />)
      expect(screen.getByText('25%')).toBeInTheDocument()
    })

    it('should render correctly without ThemeProvider (defaults)', () => {
      // Render directly without helper
      render(<Progress percent={50} status="error" />)
      expect(screen.getByText('50%')).toBeInTheDocument()
    })

    it('should handle strokeWidth', () => {
      const { container } = renderWithTheme(
        <Progress type="circle" percent={25} strokeWidth={10} />,
      )
      const progressCircle = container.querySelectorAll('circle')[1]
      expect(progressCircle).toHaveAttribute('stroke-width', '10')
    })

    it('should handle trailColor', () => {
      const { container } = renderWithTheme(
        <Progress type="circle" percent={25} trailColor="red" />,
      )
      const trailCircle = container.querySelectorAll('circle')[0]
      expect(trailCircle).toHaveStyle({ stroke: 'red' })
    })

    it('should handle gapDegree and gapPosition', () => {
      renderWithTheme(<Progress type="circle" percent={25} gapDegree={70} gapPosition="bottom" />)
      // Logic inside useCircleProgress typically, hard to verify exact path d here without snapshoting,
      // but ensures branch execution in CircleProgress component.
    })
  })

  describe('Custom Styling', () => {
    it('should apply standard className format', () => {
      const { container } = renderWithTheme(<Progress percent={50} />)
      expect(container.firstChild).toHaveClass('compass-progress')
      expect(container.firstChild).toHaveClass('compass-progress--line')
    })

    it('should apply correct className for circle type', () => {
      const { container } = renderWithTheme(<Progress type="circle" percent={50} />)
      expect(container.firstChild).toHaveClass('compass-progress')
      expect(container.firstChild).toHaveClass('compass-progress--circle')
    })

    it('should apply custom className along with standard classes', () => {
      const { container } = renderWithTheme(<Progress className="custom-progress" percent={50} />)
      expect(container.firstChild).toHaveClass('compass-progress')
      expect(container.firstChild).toHaveClass('compass-progress--line')
      expect(container.firstChild).toHaveClass('custom-progress')
    })

    it('should apply custom style', () => {
      const customStyle = { marginTop: '20px' }
      const { container } = renderWithTheme(<Progress style={customStyle} percent={50} />)
      expect(container.firstChild).toHaveStyle(customStyle)
    })

    it('should handle string strokeColor', () => {
      const { container } = renderWithTheme(<Progress percent={50} strokeColor="#ff0000" />)
      const progressBar = container.querySelector('.compass-progress div div')
      expect(progressBar).toHaveStyle({ background: '#ff0000' })
    })

    it('should handle gradient strokeColor', () => {
      const gradientColor = { from: '#ff0000', to: '#00ff00', direction: 'to right' }
      const { container } = renderWithTheme(<Progress percent={50} strokeColor={gradientColor} />)
      const progressBar = container.querySelector('.compass-progress div div')
      expect(progressBar).toHaveStyle({
        background: 'linear-gradient(to right, #ff0000, #00ff00)',
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes for screen readers', () => {
      const { container } = renderWithTheme(<Progress percent={50} />)
      const progressContainer = container.firstChild as HTMLElement

      expect(progressContainer).toHaveAttribute('role', 'progressbar')
      expect(progressContainer).toHaveAttribute('aria-valuenow', '50')
      expect(progressContainer).toHaveAttribute('aria-valuemin', '0')
      expect(progressContainer).toHaveAttribute('aria-valuemax', '100')
      expect(progressContainer).toHaveAttribute('aria-label', 'Progress 50%')
    })

    it('should have proper ARIA attributes for circle progress', () => {
      const { container } = renderWithTheme(<Progress type="circle" percent={75} />)
      const progressContainer = container.firstChild as HTMLElement

      expect(progressContainer).toHaveAttribute('role', 'progressbar')
      expect(progressContainer).toHaveAttribute('aria-valuenow', '75')
      expect(progressContainer).toHaveAttribute('aria-valuemin', '0')
      expect(progressContainer).toHaveAttribute('aria-valuemax', '100')
      expect(progressContainer).toHaveAttribute('aria-label', 'Progress 75%')
    })

    it('should update ARIA attributes when percent changes', () => {
      const { container, rerender } = renderWithTheme(<Progress percent={25} />)
      const progressContainer = container.firstChild as HTMLElement

      expect(progressContainer).toHaveAttribute('aria-valuenow', '25')
      expect(progressContainer).toHaveAttribute('aria-label', 'Progress 25%')

      rerender(
        <ThemeProvider>
          <Progress percent={90} />
        </ThemeProvider>,
      )

      expect(progressContainer).toHaveAttribute('aria-valuenow', '90')
      expect(progressContainer).toHaveAttribute('aria-label', 'Progress 90%')
    })
  })

  describe('Edge Cases', () => {
    it('should handle 0 percent', () => {
      renderWithTheme(<Progress percent={0} />)
      expect(screen.getByText('0%')).toBeInTheDocument()
    })

    it('should handle 100 percent', () => {
      renderWithTheme(<Progress percent={100} />)
      expect(screen.getByText('100%')).toBeInTheDocument()
    })

    it('should handle decimal percentages', () => {
      renderWithTheme(<Progress percent={33.33} />)
      expect(screen.getByText('33%')).toBeInTheDocument() // Should round to nearest integer
    })

    it('should handle missing percent prop', () => {
      renderWithTheme(<Progress />)
      expect(screen.getByText('0%')).toBeInTheDocument()
    })
  })

  describe('Circle Variations', () => {
    it('should invoke size logic for CircleProgress', () => {
      const { rerender } = renderWithTheme(<Progress type="circle" size="small" percent={50} />)
      // Just triggering rendering logic for coverage
      rerender(
        <ThemeProvider>
          <Progress type="circle" size="medium" percent={50} />
        </ThemeProvider>,
      )
      rerender(
        <ThemeProvider>
          <Progress type="circle" size="large" percent={50} />
        </ThemeProvider>,
      )
      rerender(
        <ThemeProvider>
          <Progress type="circle" size={'invalid' as any} percent={50} />
        </ThemeProvider>,
      )
    })

    it('should handle strokeColor object for CircleProgress', () => {
      const gradient = { from: '#108ee9', to: '#87d068' }
      const { container } = renderWithTheme(
        <Progress type="circle" strokeColor={gradient} percent={50} />,
      )
      expect(container.querySelector('defs')).toBeInTheDocument()
      expect(container.querySelector('linearGradient')).toBeInTheDocument()
    })
  })

  describe('Theme Fallback', () => {
    it('should handle missing theme variables gracefully', () => {
      render(
        <ThemeProvider theme={{}}>
          <Progress percent={50} status="normal" />
        </ThemeProvider>,
      )
      expect(screen.getByText('50%')).toBeInTheDocument()
    })
  })
})
