import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { token } from '../theme/token-utils'

const shimmer = keyframes`
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: -100% 50%;
  }
`

const skeletonBaseColor = token('components.skeleton.shimmerBaseColor', 'rgba(0, 0, 0, 0.06)')
const skeletonHighlightColor = token(
  'components.skeleton.shimmerHighlightColor',
  'rgba(0, 0, 0, 0.12)',
)

const skeletonBackground = `
  linear-gradient(
    90deg,
    ${skeletonBaseColor} 0%,
    ${skeletonBaseColor} 30%,
    ${skeletonHighlightColor} 50%,
    ${skeletonBaseColor} 70%,
    ${skeletonBaseColor} 100%
  )
`

export const SkeletonRoot = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${token('components.skeleton.gap', token('spacing.md', '12px'))};
  width: 100%;
`

export const SkeletonAvatar = styled.div<{
  $active?: boolean
}>`
  width: ${token('components.skeleton.avatarSize', '40px')};
  height: ${token('components.skeleton.avatarSize', '40px')};
  border-radius: 50%;
  background-color: ${skeletonBaseColor};
  background-image: ${skeletonBackground};
  background-size: 200% 100%;
  background-position: 100% 50%;
  animation: ${({ $active }) => ($active ? `${shimmer} 1.2s linear infinite` : 'none')};
  will-change: background-position;
  flex-shrink: 0;
`

export const SkeletonContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${token('components.skeleton.rowGap', token('spacing.sm', '8px'))};
`

export const SkeletonBlock = styled.span<{
  $active?: boolean
  $round?: boolean
  $width?: string
}>`
  display: block;
  width: ${({ $width }) => $width || '100%'};
  height: ${token('components.skeleton.blockHeight', '14px')};
  border-radius: ${({ $round }) =>
    $round ? '999px' : token('components.skeleton.borderRadius', token('borderRadius.sm', '4px'))};
  background-color: ${skeletonBaseColor};
  background-image: ${skeletonBackground};
  background-size: 200% 100%;
  background-position: 100% 50%;
  animation: ${({ $active }) => ($active ? `${shimmer} 1.2s linear infinite` : 'none')};
  will-change: background-position;
`
