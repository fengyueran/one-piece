import React from 'react'
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { message } from './index'

describe('Message', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    jest.useFakeTimers()
  })

  afterEach(() => {
    message.destroy()
    jest.useRealTimers()
  })

  test('renders message correctly', async () => {
    act(() => {
      message.info('Test Message')
      jest.advanceTimersByTime(20) // Advance time to flush queue
    })

    await waitFor(() => {
      expect(screen.getByText('Test Message')).toBeInTheDocument()
    })
  })

  test('renders success message', async () => {
    act(() => {
      message.success('Success Message')
      jest.advanceTimersByTime(20)
    })

    await waitFor(() => {
      expect(screen.getByText('Success Message')).toBeInTheDocument()
    })
  })

  test('renders error message', async () => {
    act(() => {
      message.error('Error Message')
      jest.advanceTimersByTime(20)
    })

    await waitFor(() => {
      expect(screen.getByText('Error Message')).toBeInTheDocument()
    })
  })

  test('renders warning message', async () => {
    act(() => {
      message.warning('Warning Message')
      jest.advanceTimersByTime(20)
    })

    await waitFor(() => {
      expect(screen.getByText('Warning Message')).toBeInTheDocument()
    })
  })

  test('renders loading message', async () => {
    act(() => {
      message.loading('Loading Message')
      jest.advanceTimersByTime(20)
    })

    await waitFor(() => {
      expect(screen.getByText('Loading Message')).toBeInTheDocument()
    })
  })

  test('auto closes after duration', async () => {
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

  test('calls onClose callback', async () => {
    const onClose = jest.fn()
    act(() => {
      message.info('Callback Message', 1, onClose)
      jest.advanceTimersByTime(20)
    })

    const msgElement = await screen.findByText('Callback Message')
    expect(msgElement).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(1500)
    })

    await waitFor(() => {
      expect(screen.queryByText('Callback Message')).not.toBeInTheDocument()
    })

    expect(onClose).toHaveBeenCalled()
  })
  test('pauses auto close on hover', async () => {
    act(() => {
      message.info('Hover Message', 1)
      jest.advanceTimersByTime(20)
    })

    const msgElement = await screen.findByText('Hover Message')
    expect(msgElement).toBeInTheDocument()

    // Hover over the message
    fireEvent.mouseEnter(msgElement.closest('div')!)

    // Advance time past the duration
    act(() => {
      jest.advanceTimersByTime(1500)
    })

    // Should still be visible
    expect(screen.getByText('Hover Message')).toBeInTheDocument()

    // Mouse leave
    fireEvent.mouseLeave(msgElement.closest('div')!)

    // Advance time again
    act(() => {
      jest.advanceTimersByTime(1500)
    })

    // Should be gone now
    await waitFor(() => {
      expect(screen.queryByText('Hover Message')).not.toBeInTheDocument()
    })
  })
})
