import React from 'react'
import { ProgressProps } from './types'
import { LinearProgress } from './linear-progress'
import { CircleProgress } from './circle-progress'

/**
 * Progress component for showing task completion status.
 * Supports both linear and circular progress indicators.
 */
export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ type = 'line', ...props }, ref) => {
    if (type === 'circle') {
      return <CircleProgress ref={ref} {...props} />
    }

    return <LinearProgress ref={ref} {...props} />
  },
)

Progress.displayName = 'Progress'
