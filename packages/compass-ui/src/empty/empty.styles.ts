import styled from '@emotion/styled'
import { token } from '../theme/token-utils'

const getGap = (size?: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return '8px'
    case 'large':
      return '16px'
    case 'medium':
    default:
      return '12px'
  }
}

export const EmptyRoot = styled.div<{
  $size?: 'small' | 'medium' | 'large'
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ $size }) => getGap($size)};
  width: 100%;
  padding: ${({ $size }) => {
    switch ($size) {
      case 'small':
        return '20px 16px'
      case 'large':
        return '40px 24px'
      case 'medium':
      default:
        return '32px 20px'
    }
  }};
  text-align: center;
  box-sizing: border-box;
`

export const EmptyImage = styled.div<{
  $size?: 'small' | 'medium' | 'large'
}>`
  width: ${({ $size }) => {
    switch ($size) {
      case 'small':
        return '64px'
      case 'large':
        return '112px'
      case 'medium':
      default:
        return '88px'
    }
  }};
  height: ${({ $size }) => {
    switch ($size) {
      case 'small':
        return '48px'
      case 'large':
        return '72px'
      case 'medium':
      default:
        return '60px'
    }
  }};
  border-radius: ${token('borderRadius.lg', '16px')};
  background:
    linear-gradient(135deg, rgba(22, 119, 255, 0.12), rgba(82, 196, 26, 0.08)),
    ${token('colors.backgroundSecondary', '#fafafa')};
  border: 1px dashed ${token('colors.border', '#d9d9d9')};
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 999px;
    background: ${token('colors.border', '#d9d9d9')};
  }

  &::before {
    top: 12px;
    width: 44%;
    height: 8px;
  }

  &::after {
    bottom: 14px;
    width: 62%;
    height: 8px;
    opacity: 0.8;
  }
`

export const EmptyTitle = styled.div`
  color: ${token('colors.text', '#1f1f1f')};
  font-size: ${token('fontSize.md', '16px')};
  font-weight: 600;
  line-height: ${token('lineHeight.normal', '1.5')};
`

export const EmptyDescription = styled.div`
  max-width: 420px;
  color: ${token('colors.textSecondary', '#8c8c8c')};
  font-size: ${token('fontSize.sm', '14px')};
  line-height: ${token('lineHeight.normal', '1.5')};
`

export const EmptyAction = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${token('spacing.sm', '8px')};
`
