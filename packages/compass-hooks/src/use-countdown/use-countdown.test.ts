import { act, renderHook } from '@testing-library/react'
import { useCountdown } from './use-countdown'

describe('useCountdown', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should initialize with countdown 0', () => {
    const { result } = renderHook(() => useCountdown(10))
    expect(result.current.countdown).toBe(0)
  })

  it('should start countdown when startCountdown is called', () => {
    const { result } = renderHook(() => useCountdown(10))

    act(() => {
      result.current.startCountdown()
    })

    expect(result.current.countdown).toBe(10)
  })

  it('should decrease countdown over time', () => {
    const { result } = renderHook(() => useCountdown(10))

    act(() => {
      result.current.startCountdown()
    })

    expect(result.current.countdown).toBe(10)

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(result.current.countdown).toBe(9)

    act(() => {
      jest.advanceTimersByTime(4000)
    })

    expect(result.current.countdown).toBe(5)
  })

  it('should stop at 0', () => {
    const { result } = renderHook(() => useCountdown(3))

    act(() => {
      result.current.startCountdown()
    })

    act(() => {
      jest.advanceTimersByTime(3000)
    })

    expect(result.current.countdown).toBe(0)

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(result.current.countdown).toBe(0)
  })

  it('should clean up timer on unmount', () => {
    const { result, unmount } = renderHook(() => useCountdown(10))

    act(() => {
      result.current.startCountdown()
    })

    unmount()

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    // Can't check state after unmount, but we can verify no errors/warnings occur
  })
})
