import React from 'react'
import styled from '@emotion/styled'

import { ButtonBase, ButtonBaseProps } from '../button-base'

export interface ButtonProps extends ButtonBaseProps {
  variant?: 'primary' | 'default' | 'dashed' | 'text' | 'link'
  size?: 'small' | 'default' | 'large'
  disabled?: boolean
  loading?: boolean
  danger?: boolean
  block?: boolean
  icon?: React.ReactNode
}

const StyledButton = styled(ButtonBase)<{
  $variant: ButtonProps['variant']
  $size: ButtonProps['size']
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
  font-weight: ${({ theme }) => theme.fontWeight.normal};
  transition: ${({ theme }) => theme.transitions.normal};

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary}40;
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${({ $size, theme }) => {
    switch ($size) {
      case 'small':
        return `
          height: 24px;
          padding: 0 ${theme.spacing.sm}px;
          font-size: ${theme.fontSize.xs}px;
          border-radius: ${theme.borderRadius.sm}px;
        `
      case 'large':
        return `
          height: 40px;
          padding: 0 ${theme.spacing.md}px;
          font-size: ${theme.fontSize.md}px;
          border-radius: ${theme.borderRadius.lg}px;
        `
      default:
        return `
          height: 32px;
          padding: 0 ${theme.spacing.md}px;
          font-size: ${theme.fontSize.sm}px;
          border-radius: ${theme.borderRadius.md}px;
        `
    }
  }}

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return `
          background-color: ${theme.colors.primary};
          border-color: ${theme.colors.primary};
          color: #fff;
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primaryHover};
            border-color: ${theme.colors.primaryHover};
          }
          
          &:active:not(:disabled) {
            background-color: ${theme.colors.primaryActive};
            border-color: ${theme.colors.primaryActive};
          }
        `
      case 'dashed':
        return `
          background-color: ${theme.colors.background};
          border-color: ${theme.colors.border};
          border-style: dashed;
          color: ${theme.colors.text};
          
          &:hover:not(:disabled) {
            border-color: ${theme.colors.borderHover};
            color: ${theme.colors.borderHover};
          }
        `
      case 'text':
        return `
          background-color: transparent;
          border-color: transparent;
          color: ${theme.colors.text};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.backgroundTertiary};
          }
        `
      case 'link':
        return `
          background-color: transparent;
          border-color: transparent;
          color: ${theme.colors.primary};
          
          &:hover:not(:disabled) {
            color: ${theme.colors.primaryHover};
          }
        `
      default:
        return `
          background-color: ${theme.colors.background};
          border-color: ${theme.colors.border};
          color: ${theme.colors.text};
          
          &:hover:not(:disabled) {
            border-color: ${theme.colors.borderHover};
            color: ${theme.colors.borderHover};
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
        background-color: ${theme.colors.error};
        border-color: ${theme.colors.error};
        
        &:hover:not(:disabled) {
          background-color: #ff7875;
          border-color: #ff7875;
        }
      `
          : `
        border-color: ${theme.colors.error};
        color: ${theme.colors.error};
        
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

const IconWrapper = styled.span<{ $hasText: boolean }>`
  display: inline-flex;
  align-items: center;

  ${({ $hasText }) => $hasText && 'margin-right: 4px;'}
`

const TextWrapper = styled.span<{ $loading?: boolean }>`
  display: inline-flex;
  align-items: center;
  line-height: 1;
`

const Spinner = styled.span`
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

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  danger = false,
  block = false,
  icon,
  onClick,
  className,
  style,
  ...rest
}) => {
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (loading || disabled) return
    onClick?.(e)
  }

  return (
    <StyledButton
      className={`compass-button compass-button--${variant} ${className || ''}`}
      style={style}
      $variant={variant}
      $size={size}
      $danger={danger}
      $loading={loading}
      $block={block}
      disabled={disabled || loading}
      onClick={handleClick}
      {...rest}
    >
      <TextWrapper $loading={loading}>
        {(loading || icon) && (
          <IconWrapper $hasText={!!children}>
            {loading ? <Spinner aria-hidden /> : icon}
          </IconWrapper>
        )}
        {children}
      </TextWrapper>
    </StyledButton>
  )
}

export default Button
