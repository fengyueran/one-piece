import { useCallback, useEffect, useState } from 'react'

export function useCountdown(initialCount = 60) {
  const [countdown, setCountdown] = useState(0)

  const startCountdown = useCallback(() => {
    setCountdown(initialCount)
  }, [initialCount])

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [countdown])

  return { countdown, startCountdown }
}
