import React from 'react'

import { StyledButton, IconWrapper, TextWrapper, Spinner } from './button.styles'
import { ButtonProps } from './types'

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  size = 'default',
  shape = 'default',
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
      $shape={shape}
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
