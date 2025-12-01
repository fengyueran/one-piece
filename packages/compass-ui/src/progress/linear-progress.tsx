import React from 'react'
import {
  StyledProgressContainer,
  StyledLinearProgress,
  StyledProgressBar,
  StyledProgressText,
} from './progress.styles'

import { LinearProgressProps } from './types'
import { normalizePercent, useFinalStatus, usePercentText } from './progress-utils'

/**
 * Linear progress component for showing task completion status.
 */
export const LinearProgress = React.forwardRef<HTMLDivElement, LinearProgressProps>(
  (
    {
      percent = 0,
      size = 'medium',
      status = 'normal',
      showInfo = true,
      format,
      strokeColor,
      trailColor,
      success,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const normalizedPercent = normalizePercent(percent)

    const finalStatus = useFinalStatus(status, normalizedPercent)

    const percentText = usePercentText(normalizedPercent, finalStatus, format, success)

    return (
      <StyledProgressContainer
        ref={ref}
        className={`compass-progress compass-progress--line ${className || ''}`}
        style={style}
        size={size}
        status={finalStatus}
        role="progressbar"
        aria-valuenow={normalizedPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress ${normalizedPercent}%`}
        {...props}
      >
        <StyledLinearProgress
          size={size}
          status={finalStatus}
          style={{
            ...(trailColor ? { backgroundColor: trailColor } : {}),
          }}
        >
          <StyledProgressBar
            percent={normalizedPercent}
            size={size}
            status={finalStatus}
            strokeColor={typeof strokeColor === 'string' ? strokeColor : undefined}
            style={{
              background:
                typeof strokeColor === 'object'
                  ? `linear-gradient(${strokeColor.direction || 'to right'}, ${strokeColor.from}, ${strokeColor.to})`
                  : undefined,
            }}
          />
        </StyledLinearProgress>
        {showInfo && (
          <StyledProgressText size={size} status={finalStatus}>
            {percentText}
          </StyledProgressText>
        )}
      </StyledProgressContainer>
    )
  },
)

LinearProgress.displayName = 'LinearProgress'
