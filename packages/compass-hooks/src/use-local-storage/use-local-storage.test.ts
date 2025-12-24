import { act, renderHook } from '@testing-library/react'
import { useLocalStorage } from './use-local-storage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('should return initial value if no value in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'))
    expect(result.current[0]).toBe('initial')
  })

  it('should return stored value if value exists in localStorage', () => {
    window.localStorage.setItem('key', JSON.stringify('stored'))
    const { result } = renderHook(() => useLocalStorage('key', 'initial'))
    expect(result.current[0]).toBe('stored')
  })

  it('should update localStorage when state changes', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'))

    act(() => {
      result.current[1]('updated')
    })

    expect(result.current[0]).toBe('updated')
    expect(JSON.parse(window.localStorage.getItem('key')!)).toBe('updated')
  })

  it('should support function updates', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0))

    act(() => {
      result.current[1]((prev) => prev + 1)
    })

    expect(result.current[0]).toBe(1)
    expect(JSON.parse(window.localStorage.getItem('count')!)).toBe(1)
  })

  it('should handle errors gracefully (e.g. quota exceeded)', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    const { result } = renderHook(() => useLocalStorage('key', 'initial'))

    act(() => {
      result.current[1]('updated')
    })

    // State should still update in React even if storage failed
    expect(result.current[0]).toBe('updated')
    // Error should have been logged
    expect(consoleSpy).toHaveBeenCalled()

    setItemSpy.mockRestore()
    consoleSpy.mockRestore()
  })
})
