import { useCallback, useRef, useState, DependencyList } from 'react'
import { useMounted } from '../use-mounted'

export type AsyncState<T> = {
  loading: boolean
  error?: Error | undefined
  value?: T
}

export type AsyncFn<TArgs extends unknown[], TReturn> = (...args: TArgs) => Promise<TReturn>
export type FnReturnPromise<T = unknown> = (...args: unknown[]) => Promise<T>

export function useAsyncFn<TArgs extends unknown[], TReturn>(
  fn: AsyncFn<TArgs, TReturn>,
  deps: DependencyList = [],
  initialState: AsyncState<TReturn> = { loading: false },
  options: { preventDoubleSubmit?: boolean } = { preventDoubleSubmit: false },
): [AsyncState<TReturn>, AsyncFn<TArgs, TReturn | undefined>] {
  const lastCallId = useRef(0)
  const isMounted = useMounted()
  const isRunning = useRef(false)
  const [state, setState] = useState<AsyncState<TReturn>>(initialState)

  const callback = useCallback(
    (...args: TArgs): Promise<TReturn | undefined> => {
      // Prevent double submit if loading and option is enabled
      if (options.preventDoubleSubmit && isRunning.current) {
        return Promise.resolve(undefined)
      }

      const callId = ++lastCallId.current
      isRunning.current = true

      setState((prevState) => ({ ...prevState, loading: true }))

      return fn(...args).then(
        (value) => {
          isRunning.current = false
          if (isMounted() && callId === lastCallId.current) {
            setState({ value, loading: false })
          }
          return value
        },
        (error) => {
          isRunning.current = false
          if (isMounted() && callId === lastCallId.current) {
            setState({ error, loading: false })
          }
          return undefined
        },
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...deps, options.preventDoubleSubmit],
  )

  return [state, callback]
}
