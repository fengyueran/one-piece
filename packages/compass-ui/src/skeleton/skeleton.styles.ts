import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { token } from '../theme/token-utils'

const shimmer = keyframes`
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
`

const skeletonBackground = `
  linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.06) 25%,
    rgba(0, 0, 0, 0.12) 37%,
    rgba(0, 0, 0, 0.06) 63%
  )
`

export const SkeletonRoot = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${token('spacing.md', '12px')};
  width: 100%;
`

export const SkeletonAvatar = styled.div<{
  $active?: boolean
}>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-image: ${skeletonBackground};
  background-size: 400% 100%;
  animation: ${({ $active }) => ($active ? `${shimmer} 1.4s ease infinite` : 'none')};
  flex-shrink: 0;
`

export const SkeletonContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${token('spacing.sm', '8px')};
`

export const SkeletonBlock = styled.span<{
  $active?: boolean
  $round?: boolean
  $width?: string
}>`
  display: block;
  width: ${({ $width }) => $width || '100%'};
  height: 14px;
  border-radius: ${({ $round }) =>
    $round ? '999px' : token('borderRadius.sm', '4px')};
  background-image: ${skeletonBackground};
  background-size: 400% 100%;
  animation: ${({ $active }) => ($active ? `${shimmer} 1.4s ease infinite` : 'none')};
`
