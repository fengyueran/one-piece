import { useMemo } from 'react'
import { ReactNode } from 'react'
import { ProgressStatus } from './types'

/**
 * Normalize percent value to be within 0-100 range
 */
export const normalizePercent = (percent: number): number => {
  return Math.min(Math.max(percent, 0), 100)
}

/**
 * Determine final status based on percent and explicit status
 */
export const useFinalStatus = (
  status: ProgressStatus,
  normalizedPercent: number,
): ProgressStatus => {
  return useMemo(() => {
    if (status !== 'normal') return status
    if (normalizedPercent === 100) return 'success'
    return 'normal'
  }, [status, normalizedPercent])
}

/**
 * Format percentage text with custom format function or success message
 */
export const usePercentText = (
  normalizedPercent: number,
  finalStatus: ProgressStatus,
  format?: (percent?: number) => ReactNode,
  success?: ReactNode,
): ReactNode => {
  return useMemo(() => {
    if (format) {
      return format(normalizedPercent)
    }
    if (finalStatus === 'success' && success && normalizedPercent === 100) {
      return success
    }
    return `${Math.round(normalizedPercent)}%`
  }, [format, normalizedPercent, finalStatus, success])
}
