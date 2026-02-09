import styled from '@emotion/styled'
import { ButtonBase } from '../button-base'
import { ButtonProps } from './types'
import { token } from '../theme'

export const StyledButton = styled(ButtonBase)<{
  $variant: ButtonProps['variant']
  $size: ButtonProps['size']
  $shape: ButtonProps['shape']
  $danger?: boolean
  $loading?: boolean
  $block?: boolean
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  cursor: pointer;
  user-select: none;
  outline: none;
  font-family: inherit;
  text-decoration: none;
  box-sizing: border-box;
  position: relative;
  white-space: nowrap;
  white-space: nowrap;
  font-weight: ${token('fontWeight.normal', '400')};
  transition: ${token('transitions.normal', 'all 0.3s')};

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${({ $size, $shape }) => {
    const isCircle = $shape === 'circle'
    switch ($size) {
      case 'small':
        return `
          height: ${token('components.button.height.sm', '24px')};
          padding: ${isCircle ? '0' : token('components.button.padding.sm', token('spacing.sm', '0 8px'))};
          font-size: ${token('components.button.fontSize.sm', token('fontSize.xs', '12px'))};
          border-radius: ${
            $shape === 'round'
              ? '999px' // Capsule shape that automatically adapts to any height
              : isCircle
                ? '50%'
                : token('components.button.borderRadius.sm', token('borderRadius.sm', '4px'))
          };
          ${isCircle ? `width: ${token('components.button.height.sm', '24px')}; min-width: ${token('components.button.height.sm', '24px')};` : ''}
        `
      case 'large':
        return `
          height: ${token('components.button.height.lg', '40px')};
          padding: ${isCircle ? '0' : token('components.button.padding.lg', token('spacing.lg', '0 16px'))};
          font-size: ${token('components.button.fontSize.lg', token('fontSize.md', '16px'))};
          border-radius: ${
            $shape === 'round'
              ? '999px'
              : isCircle
                ? '50%'
                : token('components.button.borderRadius.lg', token('borderRadius.lg', '8px'))
          };
          ${isCircle ? `width: ${token('components.button.height.lg', '40px')}; min-width: ${token('components.button.height.lg', '40px')};` : ''}
        `
      case 'medium':
      default:
        return `
          height: ${token('components.button.height.md', '32px')};
          padding: ${isCircle ? '0' : token('components.button.padding.md', token('spacing.md', '0 16px'))};
          font-size: ${token('components.button.fontSize.md', token('fontSize.sm', '14px'))};
          border-radius: ${
            $shape === 'round'
              ? '999px'
              : isCircle
                ? '50%'
                : token('components.button.borderRadius.md', token('borderRadius.md', '6px'))
          };
          ${isCircle ? `width: ${token('components.button.height.md', '32px')}; min-width: ${token('components.button.height.md', '32px')};` : ''}
        `
    }
  }}

  ${({ $variant }) => {
    switch ($variant) {
      case 'primary':
        return `
          background-color: ${token('colors.primary', '#007bff')};
          border-color: ${token('colors.primary', '#007bff')};
          color: ${token('colors.white', '#fff')};
          
          &:hover:not(:disabled) {
            background-color: ${token(
              'colors.primaryHover',
              `color-mix(in srgb, ${token('colors.primary', '#007bff')}, white 20%)`,
            )};
            border-color: ${token(
              'colors.primaryHover',
              `color-mix(in srgb, ${token('colors.primary', '#007bff')}, white 20%)`,
            )};
          }
          
          &:active:not(:disabled) {
            background-color: ${token(
              'colors.primaryActive',
              `color-mix(in srgb, ${token('colors.primary', '#007bff')}, black 20%)`,
            )};
            border-color: ${token(
              'colors.primaryActive',
              `color-mix(in srgb, ${token('colors.primary', '#007bff')}, black 20%)`,
            )};
          }
        `
      case 'dashed':
        return `
          background-color: ${token('colors.background', '#fff')};
          border-color: ${token('colors.border', '#d9d9d9')};
          border-style: dashed;
          color: ${token('colors.text', '#000')};
          
          &:hover:not(:disabled) {
            border-color: ${token('colors.borderHover', '#40a9ff')};
            color: ${token('colors.borderHover', '#40a9ff')};
            background-color: ${token(
              'colors.primaryHoverBg',
              `color-mix(in srgb, ${token('colors.primary', '#007bff')}, ${token('colors.background', '#fff')} 99%)`,
            )};
          }
        `
      case 'text':
        return `
          background-color: transparent;
          border-color: transparent;
          color: ${token('colors.text', '#000')};
          
          &:hover:not(:disabled) {
            background-color: ${token('colors.backgroundTertiary', 'rgba(0, 0, 0, 0.018)')};
          }
        `
      case 'link':
        return `
          background-color: transparent;
          border-color: transparent;
          color: ${token('colors.primary', '#007bff')};
          
          &:hover:not(:disabled) {
            color: ${token('colors.primaryHover', '#0056b3')};
          }
        `
      default:
        return `
          background-color: ${token('colors.background', '#fff')};
          border-color: ${token('colors.border', '#d9d9d9')};
          color: ${token('colors.text', '#000')};
          
          &:hover:not(:disabled) {
            border-color: ${token('colors.borderHover', '#40a9ff')};
            color: ${token('colors.borderHover', '#40a9ff')};
            background-color: ${token(
              'colors.primaryHoverBg',
              `color-mix(in srgb, ${token('colors.primary', '#007bff')}, ${token('colors.background', '#fff')} 99%)`,
            )};
          }
        `
    }
  }}


  ${({ $danger, $variant }) =>
    $danger &&
    `
      ${
        $variant === 'primary'
          ? `
        background-color: ${token('colors.error', '#ff4d4f')};
        border-color: ${token('colors.error', '#ff4d4f')};
        
        &:hover:not(:disabled) {
          background-color: ${token('colors.errorHover', '#ff7875')};
          border-color: ${token('colors.errorHover', '#ff7875')};
        }
      `
          : $variant === 'link'
            ? `
        color: ${token('colors.error', '#ff4d4f')};
        border-color: transparent;
        background-color: transparent;
        
        &:hover:not(:disabled) {
            color: ${token('colors.errorHover', '#ff7875')};
            border-color: transparent;
            background-color: transparent;
        }
      `
            : `
        border-color: ${token('colors.error', '#ff4d4f')};
        color: ${token('colors.error', '#ff4d4f')};
        
        &:hover:not(:disabled) {
          ${
            $variant === 'text'
              ? `
            background-color: ${token('colors.errorBg', '#fff2f0')};
          `
              : `
            background-color: ${token('colors.errorBg', '#fff2f0')};
            border-color: ${token('colors.errorHover', '#ff7875')};
          `
          }
          color: ${token('colors.errorHover', '#ff7875')};
        }
      `
      }
    `}


  ${({ $loading }) =>
    $loading &&
    `
      pointer-events: none;
    `}

  ${({ $block }) => $block && 'width: 100%;'}
`

export const IconWrapper = styled.span<{ $hasText: boolean }>`
  display: inline-flex;
  align-items: center;

  ${({ $hasText }) => $hasText && 'margin-right: 4px;'}
`

export const TextWrapper = styled.span<{ $loading?: boolean }>`
  display: inline-flex;
  align-items: center;
  line-height: 1;
`

export const Spinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`
