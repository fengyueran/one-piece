import { act, renderHook } from '@testing-library/react'
import { useAsyncFn } from './use-async-fn'

describe('useAsyncFn', () => {
  it('should initialize with default state', () => {
    const fn = jest.fn()
    const { result } = renderHook(() => useAsyncFn(fn))

    expect(result.current[0]).toEqual({ loading: false })
  })

  it('should handle successful async call', async () => {
    const fn = jest.fn().mockResolvedValue('success')
    const { result } = renderHook(() => useAsyncFn(fn))
    const [, fetch] = result.current

    await act(async () => {
      fetch()
    })

    expect(result.current[0]).toEqual({ loading: false, value: 'success', error: undefined })
  })

  it('should handle failed async call', async () => {
    const error = new Error('failed')
    const fn = jest.fn().mockRejectedValue(error)
    const { result } = renderHook(() => useAsyncFn(fn))
    const [, fetch] = result.current

    // Error should not be thrown, but returned
    await act(async () => {
      await fetch()
    })

    expect(result.current[0]).toEqual({ loading: false, error })
  })

  it('should set loading state while pending', async () => {
    let resolvePromise: (value: string) => void
    const fn = jest.fn().mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve
      }),
    )
    const { result } = renderHook(() => useAsyncFn(fn))
    const [, fetch] = result.current

    let promise: Promise<string | undefined>
    act(() => {
      promise = fetch()
    })

    expect(result.current[0].loading).toBe(true)

    await act(async () => {
      resolvePromise!('success')
      await promise
    })

    expect(result.current[0].loading).toBe(false)
    expect(result.current[0].value).toBe('success')
  })

  it('should handle race conditions (latest call wins)', async () => {
    const resolvers: Array<(val: any) => void> = []
    const fn = jest.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        resolvers.push(resolve)
      })
    })

    const { result } = renderHook(() => useAsyncFn(fn))
    const [, fetch] = result.current

    let promise1: Promise<any>
    let promise2: Promise<any>

    act(() => {
      promise1 = fetch()
    })
    act(() => {
      promise2 = fetch()
    })

    // Resolve second call first
    await act(async () => {
      resolvers[1]('response 2')
      await promise2
    })

    expect(result.current[0].value).toBe('response 2')

    // Resolve first call later
    await act(async () => {
      resolvers[0]('response 1')
      await promise1
    })

    // Should still be response 2
    expect(result.current[0].value).toBe('response 2')
  })

  it('should prevent double submit when enabled', async () => {
    let resolvePromise: (value: string) => void
    const fn = jest.fn().mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve
      }),
    )

    const { result } = renderHook(() =>
      useAsyncFn(fn, [], { loading: false }, { preventDoubleSubmit: true }),
    )

    let promise1: Promise<string | undefined>
    let promise2: Promise<string | undefined>

    act(() => {
      promise1 = result.current[1]() as Promise<string | undefined>
    })

    // First call sets loading to true
    expect(result.current[0].loading).toBe(true)
    expect(fn).toHaveBeenCalledTimes(1)

    act(() => {
      // Second call should be ignored because loading is true
      promise2 = result.current[1]() as Promise<string | undefined>
    })

    expect(fn).toHaveBeenCalledTimes(1) // Still 1

    await act(async () => {
      resolvePromise!('success')
      await promise1
      await promise2
    })
  })
})
