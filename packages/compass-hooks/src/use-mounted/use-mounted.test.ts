import { renderHook } from '@testing-library/react'
import { useMounted } from './use-mounted'

describe('useMounted', () => {
  it('should return true when component is mounted', () => {
    const { result } = renderHook(() => useMounted())
    const isMounted = result.current
    expect(isMounted()).toBe(true)
  })

  it('should return false when component is unmounted', () => {
    const { result, unmount } = renderHook(() => useMounted())
    const isMounted = result.current

    // Initially mounted
    expect(isMounted()).toBe(true)

    // After unmount
    unmount()
    expect(isMounted()).toBe(false)
  })
})
