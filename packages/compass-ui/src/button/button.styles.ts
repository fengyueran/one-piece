import styled from '@emotion/styled'
import { ButtonBase } from '../button-base'

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
  font-weight: ${({ theme }) => theme?.fontWeight?.normal || '400'};
  transition: ${({ theme }) => theme?.transitions?.normal || 'all 0.3s'};

  &:focus {
    outline: 2px solid ${({ theme }) => theme?.colors?.primary || '#007bff'};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${({ $size, $shape, theme }) => {
    const isCircle = $shape === 'circle'
    switch ($size) {
      case 'small':
        return `
          height: 24px;
          padding: ${isCircle ? '0' : theme?.components?.button?.padding?.sm || `0 ${theme?.spacing?.sm || 8}px`};
          font-size: ${theme?.components?.button?.fontSize?.sm || `${theme?.fontSize?.xs || 12}px`};
          border-radius: ${
            $shape === 'round'
              ? '999px' // 自动适应任何高度的胶囊形
              : isCircle
                ? '50%'
                : theme?.components?.button?.borderRadius?.sm || `${theme?.borderRadius?.sm || 4}px`
          };
          ${isCircle ? 'width: 24px; min-width: 24px;' : ''}
        `
      case 'large':
        return `
          height: 40px;
          padding: ${isCircle ? '0' : theme?.components?.button?.padding?.md || `0 ${theme?.spacing?.md || 16}px`};
          font-size: ${theme?.components?.button?.fontSize?.lg || `${theme?.fontSize?.md || 16}px`};
          border-radius: ${
            $shape === 'round'
              ? '999px'
              : isCircle
                ? '50%'
                : theme?.components?.button?.borderRadius?.lg || `${theme?.borderRadius?.lg || 8}px`
          };
          ${isCircle ? 'width: 40px; min-width: 40px;' : ''}
        `
      default:
        return `
          height: 32px;
          padding: ${isCircle ? '0' : theme?.components?.button?.padding?.md || `0 ${theme?.spacing?.md || 16}px`};
          font-size: ${theme?.components?.button?.fontSize?.md || `${theme?.fontSize?.sm || 14}px`};
          border-radius: ${
            $shape === 'round'
              ? '999px'
              : isCircle
                ? '50%'
                : theme?.components?.button?.borderRadius?.md || `${theme?.borderRadius?.md || 6}px`
          };
          ${isCircle ? 'width: 32px; min-width: 32px;' : ''}
        `
    }
  }}

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return `
          background-color: ${theme?.colors?.primary || '#007bff'};
          border-color: ${theme?.colors?.primary || '#007bff'};
          color: #fff;
          
          &:hover:not(:disabled) {
            background-color: ${theme?.colors?.primaryHover || '#0056b3'};
            border-color: ${theme?.colors?.primaryHover || '#0056b3'};
          }
          
          &:active:not(:disabled) {
            background-color: ${theme?.colors?.primaryActive || '#004085'};
            border-color: ${theme?.colors?.primaryActive || '#004085'};
          }
        `
      case 'dashed':
        return `
          background-color: ${theme?.colors?.background || '#fff'};
          border-color: ${theme?.colors?.border || '#d9d9d9'};
          border-style: dashed;
          color: ${theme?.colors?.text || '#000'};
          
          &:hover:not(:disabled) {
            border-color: ${theme?.colors?.borderHover || '#40a9ff'};
            color: ${theme?.colors?.borderHover || '#40a9ff'};
          }
        `
      case 'text':
        return `
          background-color: transparent;
          border-color: transparent;
          color: ${theme?.colors?.text || '#000'};
          
          &:hover:not(:disabled) {
            background-color: ${theme?.colors?.backgroundTertiary || 'rgba(0, 0, 0, 0.018)'};
          }
        `
      case 'link':
        return `
          background-color: transparent;
          border-color: transparent;
          color: ${theme?.colors?.primary || '#007bff'};
          
          &:hover:not(:disabled) {
            color: ${theme?.colors?.primaryHover || '#0056b3'};
          }
        `
      default:
        return `
          background-color: ${theme?.colors?.background || '#fff'};
          border-color: ${theme?.colors?.border || '#d9d9d9'};
          color: ${theme?.colors?.text || '#000'};
          
          &:hover:not(:disabled) {
            border-color: ${theme?.colors?.borderHover || '#40a9ff'};
            color: ${theme?.colors?.borderHover || '#40a9ff'};
          }
        `
    }
  }}


  ${({ $danger, $variant, theme }) =>
    $danger &&
    `
      ${
        $variant === 'primary'
          ? `
        background-color: ${theme?.colors?.error || '#ff4d4f'};
        border-color: ${theme?.colors?.error || '#ff4d4f'};
        
        &:hover:not(:disabled) {
          background-color: #ff7875;
          border-color: #ff7875;
        }
      `
          : `
        border-color: ${theme?.colors?.error || '#ff4d4f'};
        color: ${theme?.colors?.error || '#ff4d4f'};
        
        &:hover:not(:disabled) {
          ${
            $variant === 'text'
              ? `
            background-color: #fff2f0;
          `
              : `
            background-color: #fff2f0;
            border-color: #ff7875;
          `
          }
          color: #ff7875;
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
