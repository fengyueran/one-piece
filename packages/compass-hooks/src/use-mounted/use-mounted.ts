import { useCallback, useEffect, useRef } from 'react'

/**
 * Returns a function that returns true if the component is mounted, false otherwise.
 * Useful for avoiding state updates on unmounted components.
 */
export function useMounted() {
  const mountedRef = useRef(false)
  const getMounted = useCallback(() => mountedRef.current, [])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  return getMounted
}
