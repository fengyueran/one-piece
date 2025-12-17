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
      gapDegree,
      gapPosition = 'top',
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

    const isGradient = typeof strokeColor === 'object'

    // Dashboard logic
    const gapDeg = Math.max(0, Math.min(295, gapDegree || 0))
    const totalLength = circumference * ((360 - gapDeg) / 360)
    const dashArray = `${totalLength} ${circumference}`
    const trailOffset = 0
    const progressOffset = totalLength * (1 - normalizedPercent / 100)

    // Rotation calculation
    // Default SVG start is at 3 o'clock (0deg). StyledCircleSvg has rotate(-90deg) by default (12 o'clock).
    // We override this transform based on gapPosition.
    const getRotation = () => {
      const baseRotation =
        gapPosition === 'bottom'
          ? 90
          : gapPosition === 'left'
            ? 180
            : gapPosition === 'right'
              ? 0
              : -90 // top

      return `rotate(${baseRotation + gapDeg / 2}deg)`
    }

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
          <StyledCircleSvg style={gapDegree ? { transform: getRotation() } : undefined}>
            {/* Background circle */}
            <StyledCircleTrail
              cx={circleDiameter / 2}
              cy={circleDiameter / 2}
              r={radius}
              strokeWidth={circleStrokeWidth}
              strokeDasharray={gapDegree ? dashArray : undefined}
              strokeDashoffset={gapDegree ? trailOffset : undefined}
              style={{ stroke: trailColor }}
            />
            {/* Progress circle */}
            <StyledCirclePath
              cx={circleDiameter / 2}
              cy={circleDiameter / 2}
              r={radius}
              strokeWidth={circleStrokeWidth}
              strokeDasharray={gapDegree ? dashArray : strokeDasharray}
              strokeDashoffset={gapDegree ? progressOffset : strokeDashoffset}
              status={finalStatus}
              strokeColor={typeof strokeColor === 'string' ? strokeColor : undefined}
              style={{
                stroke: isGradient ? `url(#${gradientId})` : undefined,
                transition:
                  'stroke-dashoffset 0.3s ease 0s, stroke-dasharray 0.3s ease 0s, stroke 0.3s',
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
