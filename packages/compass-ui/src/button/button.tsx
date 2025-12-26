import React from 'react'

import { StyledButton, IconWrapper, TextWrapper, Spinner } from './button.styles'
import { ButtonProps } from './types'

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'default',
      size = 'default',
      shape = 'default',
      disabled = false,
      loading = false,
      danger = false,
      block = false,
      icon,
      type = 'button',
      onClick,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      if (loading || disabled) return
      onClick?.(e)
    }

    return (
      <StyledButton
        ref={ref}
        type={type}
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
  },
)

Button.displayName = 'Button'

export default Button
