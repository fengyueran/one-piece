import React from 'react'
import { useRef } from 'react'
import styled from '@emotion/styled'

import { useTheme } from '../theme'
import { getComponentTheme } from '../theme/utils'
import { TouchRipple, Handlers } from './touch-ripple'
import { ButtonBaseProps } from './types'

const StyledButtonBase = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  outline: none;
  border: 0;
  margin: 0;
  padding: 0;
  cursor: pointer;
  background: transparent;
`

export const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonBaseProps>((props, ref) => {
  const {
    hasRipple = true,
    className,
    children,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    ...res
  } = props
  const { theme } = useTheme()
  const rippleOpacity = getComponentTheme(theme, 'button').rippleOpacity

  const rippleRef = useRef<Handlers>()

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    onMouseDown?.(e)

    if (e.defaultPrevented) {
      return
    }

    if (hasRipple && rippleRef.current) {
      rippleRef.current.start(e)
    }
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    onMouseUp?.(e)

    if (hasRipple && rippleRef.current) {
      rippleRef.current.stop(e)
    }
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    onMouseLeave?.(e)

    if (hasRipple && rippleRef.current) {
      rippleRef.current.stop(e)
    }
  }

  return (
    <StyledButtonBase
      ref={ref}
      {...res}
      className={className}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
    >
      {children}
      <TouchRipple ref={rippleRef} opacity={rippleOpacity} />
    </StyledButtonBase>
  )
})

ButtonBase.displayName = 'ButtonBase'
