import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { token } from '../theme/token-utils'

const shimmer = keyframes`
  0% {
    transform: translateX(-140%);
  }
  100% {
    transform: translateX(140%);
  }
`

const skeletonBaseColor = token('components.skeleton.shimmerBaseColor', 'rgba(0, 0, 0, 0.12)')
const skeletonHighlightColor = token(
  'components.skeleton.shimmerHighlightColor',
  'rgba(255, 255, 255, 0.92)',
)

const skeletonHighlight = `
  linear-gradient(
    90deg,
    transparent 0%,
    transparent 42%,
    ${skeletonHighlightColor} 50%,
    transparent 58%,
    transparent 100%
  )
`

const skeletonShimmerStyles = `
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: -1px;
    background-image: ${skeletonHighlight};
    transform: translateX(-140%);
    animation: ${shimmer} 0.9s ease-in-out infinite;
    will-change: transform;
    pointer-events: none;
  }
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
  flex-shrink: 0;
  ${({ $active }) =>
    $active
      ? skeletonShimmerStyles
      : `
        position: relative;
        overflow: hidden;
      `}
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
  ${({ $active }) =>
    $active
      ? skeletonShimmerStyles
      : `
        position: relative;
        overflow: hidden;
      `}
`
