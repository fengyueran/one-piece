import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { token } from '../theme/token-utils'

const rotate = keyframes`
  100% {
    transform: rotate(360deg);
  }
`

const getSize = (size?: 'small' | 'medium' | 'large' | number) => {
  if (typeof size === 'number') {
    return `${size}px`
  }

  switch (size) {
    case 'small':
      return '16px'
    case 'large':
      return '36px'
    case 'medium':
    default:
      return '24px'
  }
}

export const SpinRoot = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${token('spacing.sm', '8px')};
  color: ${token('colors.primary', '#1677ff')};
`

export const SpinIndicator = styled.span<{
  $size?: 'small' | 'medium' | 'large' | number
}>`
  display: inline-flex;
  width: ${({ $size }) => getSize($size)};
  height: ${({ $size }) => getSize($size)};
  border-radius: 50%;
  background:
    radial-gradient(farthest-side, ${token('colors.primary', '#1677ff')} 94%, #0000) top/4px 4px
      no-repeat,
    conic-gradient(#0000 30%, ${token('colors.primary', '#1677ff')});
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 4px), #000 0);
  animation: ${rotate} 0.9s linear infinite;
`

export const SpinTip = styled.span`
  font-size: ${token('fontSize.sm', '14px')};
  line-height: ${token('lineHeight.normal', '1.5')};
  color: ${token('colors.textSecondary', '#8c8c8c')};
`

export const SpinContainer = styled.div`
  position: relative;
  width: 100%;
`

export const SpinContent = styled.div<{
  $spinning?: boolean
}>`
  ${({ $spinning }) =>
    $spinning
      ? `
    opacity: 0.55;
    filter: blur(0.2px);
    pointer-events: none;
    user-select: none;
  `
      : ''}
`

export const SpinOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(0.5px);
  z-index: 1;
`
