import { renderHook, waitFor } from '@testing-library/react'
import { useAsync } from './use-async'

describe('useAsync', () => {
  it('should start loading immediately', async () => {
    const fn = jest.fn().mockResolvedValue('success')
    const { result } = renderHook(() => useAsync(fn))

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.value).toBe('success')
  })

  it('should handle error', async () => {
    const error = new Error('failed')
    const fn = jest.fn().mockRejectedValue(error)
    const { result } = renderHook(() => useAsync(fn))

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe(error)
  })

  it('should re-execute when dependencies change', async () => {
    let counter = 0
    const fn = jest.fn().mockImplementation(async () => {
      counter++
      return counter
    })

    const { result, rerender } = renderHook(({ dep }) => useAsync(fn, [dep]), {
      initialProps: { dep: 1 },
    })

    await waitFor(() => {
      expect(result.current.value).toBe(1)
    })

    // Update dependency
    rerender({ dep: 2 })

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.value).toBe(2)
    })
  })
})
