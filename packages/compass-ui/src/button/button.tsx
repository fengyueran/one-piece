import React from 'react'

import { StyledButton, IconWrapper, TextWrapper, Spinner } from './button.styles'
import { ButtonProps } from './types'

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'default',
      size = 'medium',
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
      classNames,
      styles,
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
        className={`compass-button compass-button--${variant} ${className || ''} ${classNames?.root || ''}`}
        style={{ ...style, ...styles?.root }}
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
        <TextWrapper
          $loading={loading}
          className={`compass-button-content ${classNames?.text || ''}`}
          style={styles?.text}
        >
          {(loading || icon) && (
            <IconWrapper
              $hasText={!!children}
              className={`compass-button-icon ${classNames?.icon || ''}`}
              style={styles?.icon}
            >
              {loading ? (
                <Spinner
                  aria-hidden
                  className={`compass-button-loading ${classNames?.loading || ''}`}
                  style={styles?.loading}
                />
              ) : (
                icon
              )}
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
