import styled from '@emotion/styled'
import { token } from '../theme/token-utils'
import { ProgressSize, ProgressStatus } from './types'

interface StyledProgressProps {
  size?: ProgressSize
  status?: ProgressStatus
}

export const StyledProgressContainer = styled.div<StyledProgressProps>`
  display: flex;
  align-items: center;
  gap: ${token('spacing.sm', '8px')};
  ${({ size }) => {
    if (typeof size === 'object' && 'width' in size) {
      return `width: ${size.width}px;`
    }
    return ''
  }}
`

export const StyledLinearProgress = styled.div<StyledProgressProps>`
  flex: 1;
  background-color: ${token(
    'components.progress.trackColor',
    token('colors.backgroundSecondary', '#fafafa'),
  )};
  border-radius: ${token('borderRadius.xl', '12px')};
  overflow: hidden;
  height: ${({ size }) => {
    if (typeof size === 'number') {
      return `${size}px`
    }
    if (typeof size === 'object' && 'height' in size) {
      return `${size.height}px`
    }
    switch (size) {
      case 'small':
        return '4px'
      case 'large':
        return '12px'
      case 'medium':
      default:
        return '8px'
    }
  }};
  ${({ size }) => {
    if (typeof size === 'object' && 'width' in size) {
      return `width: ${size.width}px; flex: none;`
    }
    return ''
  }}
`

interface StyledProgressBarProps extends StyledProgressProps {
  percent: number
  strokeColor?: string
}

export const StyledProgressBar = styled.div<StyledProgressBarProps>`
  height: 100%;
  border-radius: inherit;
  transition: ${token('transitions.normal', 'all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)')};
  width: ${({ percent }) => Math.min(Math.max(percent, 0), 100)}%;
  background: ${({ strokeColor, status }) => {
    if (strokeColor) return strokeColor
    switch (status) {
      case 'success':
        return token('components.progress.successColor', token('colors.success', '#52c41a'))
      case 'error':
        return token('components.progress.errorColor', token('colors.error', '#ff4d4f'))
      case 'warning':
        return token('components.progress.warningColor', token('colors.warning', '#faad14'))
      default:
        return token('components.progress.infoColor', token('colors.primary', '#1890ff'))
    }
  }};
`

export const StyledProgressText = styled.span<StyledProgressProps>`
  font-size: ${({ size }) => {
    switch (size) {
      case 'small':
        return token('fontSize.xs', '12px')
      case 'large':
        return token('fontSize.md', '16px')
      case 'medium':
      default:
        return token('fontSize.sm', '14px')
    }
  }};
  color: ${token('colors.text', 'rgba(0, 0, 0, 0.88)')};
  white-space: nowrap;
  min-width: ${({ size }) => {
    switch (size) {
      case 'small':
        return '28px'
      case 'large':
        return '36px'
      case 'medium':
      default:
        return '32px'
    }
  }};
  text-align: right;
`

export const StyledCircleProgress = styled.div<{ width: number }>`
  display: inline-block;
  width: ${({ width }) => width}px;
  height: ${({ width }) => width}px;
`

export const StyledCircleSvg = styled.svg`
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
`

interface StyledCirclePathProps {
  strokeColor?: string
  status?: ProgressStatus
}

export const StyledCircleTrail = styled.circle`
  fill: none;
  stroke: ${token(
    'components.progress.trackColor',
    token('colors.backgroundSecondary', '#fafafa'),
  )};
`

export const StyledCirclePath = styled.circle<StyledCirclePathProps>`
  fill: none;
  transition: ${token('transitions.normal', 'all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)')};
  stroke: ${({ strokeColor, status }) => {
    if (strokeColor) return strokeColor
    switch (status) {
      case 'success':
        return token('components.progress.successColor', token('colors.success', '#52c41a'))
      case 'error':
        return token('components.progress.errorColor', token('colors.error', '#ff4d4f'))
      case 'warning':
        return token('components.progress.warningColor', token('colors.warning', '#faad14'))
      default:
        return token('components.progress.infoColor', token('colors.primary', '#1890ff'))
    }
  }};
  stroke-linecap: round;
`

export const StyledCircleText = styled.div<{ width: number; size?: ProgressSize }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: ${({ size, width }) => {
    if (size === 'small' || width < 60) return token('fontSize.xs', '12px')
    if (size === 'large' || width > 120) return token('fontSize.md', '16px')
    return token('fontSize.sm', '14px')
  }};
  color: ${token('colors.text', 'rgba(0, 0, 0, 0.88)')};
  white-space: nowrap;
`

export const StyledCircleContainer = styled.div`
  position: relative;
  display: inline-block;
`
