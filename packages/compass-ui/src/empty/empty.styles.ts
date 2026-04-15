import styled from '@emotion/styled'
import { token } from '../theme/token-utils'

const getGap = (size?: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return token('components.empty.gap.sm', '8px')
    case 'large':
      return token('components.empty.gap.lg', '16px')
    case 'medium':
    default:
      return token('components.empty.gap.md', '12px')
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
        return token('components.empty.padding.sm', '20px 16px')
      case 'large':
        return token('components.empty.padding.lg', '40px 24px')
      case 'medium':
      default:
        return token('components.empty.padding.md', '32px 20px')
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
        return token('components.empty.imageWidth.sm', '64px')
      case 'large':
        return token('components.empty.imageWidth.lg', '112px')
      case 'medium':
      default:
        return token('components.empty.imageWidth.md', '88px')
    }
  }};
  height: ${({ $size }) => {
    switch ($size) {
      case 'small':
        return token('components.empty.imageHeight.sm', '48px')
      case 'large':
        return token('components.empty.imageHeight.lg', '72px')
      case 'medium':
      default:
        return token('components.empty.imageHeight.md', '60px')
    }
  }};
  border-radius: ${token('components.empty.imageRadius', token('borderRadius.lg', '16px'))};
  background: ${token(
    'components.empty.imageBackground',
    'linear-gradient(135deg, rgba(22, 119, 255, 0.12), rgba(82, 196, 26, 0.08)), #fafafa',
  )};
  border: 1px dashed
    ${token('components.empty.imageBorderColor', token('colors.border', '#d9d9d9'))};
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 999px;
    background: ${token(
      'components.empty.imagePlaceholderColor',
      token('colors.border', '#d9d9d9'),
    )};
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
  color: ${token('components.empty.titleColor', token('colors.text', '#1f1f1f'))};
  font-size: ${token('fontSize.md', '16px')};
  font-weight: 600;
  line-height: ${token('lineHeight.normal', '1.5')};
`

export const EmptyDescription = styled.div`
  max-width: 420px;
  color: ${token('components.empty.descriptionColor', token('colors.textSecondary', '#8c8c8c'))};
  font-size: ${token('fontSize.sm', '14px')};
  line-height: ${token('lineHeight.normal', '1.5')};
`

export const EmptyAction = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${token('components.empty.actionGap', token('spacing.sm', '8px'))};
`
