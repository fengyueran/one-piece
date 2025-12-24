import { DependencyList, useEffect } from 'react'
import { useAsyncFn } from '../use-async-fn'

export function useAsync<TReturn>(fn: () => Promise<TReturn>, deps: DependencyList = []) {
  const [state, callback] = useAsyncFn(fn, deps, {
    loading: true,
  })

  useEffect(() => {
    callback()
  }, [callback])

  return state
}
