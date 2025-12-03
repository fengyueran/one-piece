import React from 'react'
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import message from './index'

describe('Message Component', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    jest.useFakeTimers()
  })

  afterEach(async () => {
    await act(async () => {
      message.destroy()
    })
    jest.useRealTimers()
  })

  describe('Rendering', () => {
    it('should render info message correctly', async () => {
      act(() => {
        message.info('Test Message')
        jest.advanceTimersByTime(20)
      })

      await waitFor(() => {
        expect(screen.getByText('Test Message')).toBeInTheDocument()
        expect(screen.getByRole('img', { name: 'info' })).toBeInTheDocument()
      })
    })

    it('should render success message correctly', async () => {
      act(() => {
        message.success('Success Message')
        jest.advanceTimersByTime(20)
      })

      await waitFor(() => {
        expect(screen.getByText('Success Message')).toBeInTheDocument()
        expect(screen.getByRole('img', { name: 'success' })).toBeInTheDocument()
      })
    })

    it('should render error message correctly', async () => {
      act(() => {
        message.error('Error Message')
        jest.advanceTimersByTime(20)
      })

      await waitFor(() => {
        expect(screen.getByText('Error Message')).toBeInTheDocument()
        expect(screen.getByRole('img', { name: 'error' })).toBeInTheDocument()
      })
    })

    it('should render warning message correctly', async () => {
      act(() => {
        message.warning('Warning Message')
        jest.advanceTimersByTime(20)
      })

      await waitFor(() => {
        expect(screen.getByText('Warning Message')).toBeInTheDocument()
        expect(screen.getByRole('img', { name: 'warning' })).toBeInTheDocument()
      })
    })

    it('should render loading message correctly', async () => {
      act(() => {
        message.loading('Loading Message')
        jest.advanceTimersByTime(20)
      })

      await waitFor(() => {
        expect(screen.getByText('Loading Message')).toBeInTheDocument()
        expect(screen.getByRole('img', { name: 'loading' })).toBeInTheDocument()
      })
    })
  })

  describe('Props', () => {
    it('should support custom duration', async () => {
      act(() => {
        message.info('Auto Close Message', 1)
        jest.advanceTimersByTime(20)
      })

      await waitFor(() => {
        expect(screen.getByText('Auto Close Message')).toBeInTheDocument()
      })

      act(() => {
        jest.advanceTimersByTime(1500)
      })

      await waitFor(() => {
        expect(screen.queryByText('Auto Close Message')).not.toBeInTheDocument()
      })
    })

    it('should support custom className and style', async () => {
      act(() => {
        message.open({
          content: 'Custom Style Message',
          className: 'custom-test-class',
          style: { color: 'red' },
        })
        jest.advanceTimersByTime(20)
      })

      const msgText = await screen.findByText('Custom Style Message')
      // Note: Accessing DOM element to verify className, though we prefer text location
      const msgElement = msgText.closest('.compass-message')

      expect(msgElement).toHaveClass('custom-test-class')
      expect(msgElement).toHaveStyle({ color: 'rgb(255, 0, 0)' })
    })
  })

  describe('Interactions', () => {
    it('should pause auto-close on hover', async () => {
      act(() => {
        message.info('Hover Message', 1)
        jest.advanceTimersByTime(20)
      })

      const msgText = await screen.findByText('Hover Message')
      const msgElement = msgText.closest('.compass-message')
      expect(msgText).toBeInTheDocument()

      // Simulate mouse hover
      if (msgElement) {
        fireEvent.mouseEnter(msgElement)
      }

      // Advance time past duration
      act(() => {
        jest.advanceTimersByTime(1500)
      })

      // Should still be visible
      expect(screen.getByText('Hover Message')).toBeInTheDocument()

      // Simulate mouse leave
      if (msgElement) {
        fireEvent.mouseLeave(msgElement)
      }

      // Advance time again
      act(() => {
        jest.advanceTimersByTime(1500)
      })

      // Should be closed now
      await waitFor(() => {
        expect(screen.queryByText('Hover Message')).not.toBeInTheDocument()
      })
    })

    it('should call onClose callback when closed', async () => {
      const onClose = jest.fn()
      act(() => {
        message.info('Callback Message', 1, onClose)
        jest.advanceTimersByTime(20)
      })

      expect(await screen.findByText('Callback Message')).toBeInTheDocument()

      act(() => {
        jest.advanceTimersByTime(1500)
      })

      await waitFor(() => {
        expect(screen.queryByText('Callback Message')).not.toBeInTheDocument()
      })

      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('icons should have correct aria-label', async () => {
      act(() => {
        message.info('A11y Test')
        jest.advanceTimersByTime(20)
      })

      await waitFor(() => {
        const icon = screen.getByRole('img', { name: 'info' })
        expect(icon).toBeInTheDocument()
        expect(icon).toHaveAttribute('aria-label', 'info')
      })
    })
  })
  describe('Hooks', () => {
    it('should work with useMessage hook', async () => {
      const TestComponent = () => {
        const [messageApi, contextHolder] = message.useMessage()
        return (
          <div>
            {contextHolder}
            <button onClick={() => messageApi.info('Hook Message')}>Show Message</button>
          </div>
        )
      }

      render(<TestComponent />)

      const button = screen.getByText('Show Message')
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText('Hook Message')).toBeInTheDocument()
      })
    })
  })
})
