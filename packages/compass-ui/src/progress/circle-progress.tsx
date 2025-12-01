import React, { useMemo, useId } from 'react'
import {
  StyledCircleContainer,
  StyledCircleProgress,
  StyledCircleSvg,
  StyledCircleTrail,
  StyledCirclePath,
  StyledCircleText,
} from './progress.styles'

import { CircleProgressProps } from './types'
import { normalizePercent, useFinalStatus, usePercentText } from './progress-utils'

/**
 * Circle progress component for showing task completion status.
 */
export const CircleProgress = React.forwardRef<HTMLDivElement, CircleProgressProps>(
  (
    {
      percent = 0,
      size = 'medium',
      status = 'normal',
      showInfo = true,
      format,
      strokeWidth,
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

    const circleDiameter = useMemo(() => {
      if (typeof size === 'number') {
        return size
      }
      switch (size) {
        case 'small':
          return 80
        case 'medium':
          return 120
        case 'large':
          return 160
        default:
          return 120
      }
    }, [size])

    const circleStrokeWidth = strokeWidth ?? (size === 'small' ? 4 : size === 'large' ? 8 : 6)
    const radius = (circleDiameter - circleStrokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (normalizedPercent / 100) * circumference

    const gradientId = useId()

    return (
      <StyledCircleContainer
        ref={ref}
        className={`compass-progress compass-progress--circle ${className || ''}`}
        style={style}
        role="progressbar"
        aria-valuenow={normalizedPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress ${normalizedPercent}%`}
        {...props}
      >
        <StyledCircleProgress width={circleDiameter}>
          <StyledCircleSvg>
            {/* Background circle */}
            <StyledCircleTrail
              cx={circleDiameter / 2}
              cy={circleDiameter / 2}
              r={radius}
              strokeWidth={circleStrokeWidth}
              style={{ stroke: trailColor }}
            />
            {/* Progress circle */}
            <StyledCirclePath
              cx={circleDiameter / 2}
              cy={circleDiameter / 2}
              r={radius}
              strokeWidth={circleStrokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              status={finalStatus}
              strokeColor={typeof strokeColor === 'string' ? strokeColor : undefined}
              style={{
                stroke: typeof strokeColor === 'object' ? `url(#${gradientId})` : undefined,
              }}
            />
            {/* Gradient definition for object strokeColor */}
            {typeof strokeColor === 'object' && (
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={strokeColor.from} />
                  <stop offset="100%" stopColor={strokeColor.to} />
                </linearGradient>
              </defs>
            )}
          </StyledCircleSvg>
        </StyledCircleProgress>
        {showInfo && (
          <StyledCircleText width={circleDiameter} size={size}>
            {percentText}
          </StyledCircleText>
        )}
      </StyledCircleContainer>
    )
  },
)

CircleProgress.displayName = 'CircleProgress'
