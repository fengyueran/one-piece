import styled from '@emotion/styled'
import { ProgressSize, ProgressStatus } from './types'

interface StyledProgressProps {
  size?: ProgressSize
  status?: ProgressStatus
}

export const StyledProgressContainer = styled.div<StyledProgressProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.sm || 8}px;
  ${({ size }) => {
    if (typeof size === 'object' && 'width' in size) {
      return `width: ${size.width}px;`
    }
    return ''
  }}
`

export const StyledLinearProgress = styled.div<StyledProgressProps>`
  flex: 1;
  background-color: ${({ theme }) =>
    theme?.components?.progress?.trackColor || theme?.colors?.backgroundSecondary || '#fafafa'};
  border-radius: ${({ theme }) => theme?.borderRadius?.xl || 12}px;
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
  transition: ${({ theme }) =>
    theme?.transitions?.normal || 'all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)'};
  width: ${({ percent }) => Math.min(Math.max(percent, 0), 100)}%;
  background: ${({ strokeColor, status, theme }) => {
    if (strokeColor) return strokeColor
    switch (status) {
      case 'success':
        return theme?.components?.progress?.successColor || theme?.colors?.success || '#52c41a'
      case 'error':
        return theme?.components?.progress?.errorColor || theme?.colors?.error || '#ff4d4f'
      case 'warning':
        return theme?.components?.progress?.warningColor || theme?.colors?.warning || '#faad14'
      default:
        return theme?.components?.progress?.infoColor || theme?.colors?.primary || '#1890ff'
    }
  }};
`

export const StyledProgressText = styled.span<StyledProgressProps>`
  font-size: ${({ size, theme }) => {
    switch (size) {
      case 'small':
        return theme?.fontSize?.xs || 12
      case 'large':
        return theme?.fontSize?.md || 16
      case 'medium':
      default:
        return theme?.fontSize?.sm || 14
    }
  }}px;
  color: ${({ theme }) => theme?.colors?.text || 'rgba(0, 0, 0, 0.88)'};
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
  stroke: ${({ theme }) =>
    theme?.components?.progress?.trackColor || theme?.colors?.backgroundSecondary || '#fafafa'};
`

export const StyledCirclePath = styled.circle<StyledCirclePathProps>`
  fill: none;
  transition: ${({ theme }) =>
    theme?.transitions?.normal || 'all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)'};
  stroke: ${({ strokeColor, status, theme }) => {
    if (strokeColor) return strokeColor
    switch (status) {
      case 'success':
        return theme?.components?.progress?.successColor || theme?.colors?.success || '#52c41a'
      case 'error':
        return theme?.components?.progress?.errorColor || theme?.colors?.error || '#ff4d4f'
      case 'warning':
        return theme?.components?.progress?.warningColor || theme?.colors?.warning || '#faad14'
      default:
        return theme?.components?.progress?.infoColor || theme?.colors?.primary || '#1890ff'
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
  font-size: ${({ size, theme, width }) => {
    if (size === 'small' || width < 60) return theme?.fontSize?.xs || 12
    if (size === 'large' || width > 120) return theme?.fontSize?.md || 16
    return theme?.fontSize?.sm || 14
  }}px;
  color: ${({ theme }) => theme?.colors?.text || 'rgba(0, 0, 0, 0.88)'};
  white-space: nowrap;
`

export const StyledCircleContainer = styled.div`
  position: relative;
  display: inline-block;
`
