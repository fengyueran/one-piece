import React from 'react'
import { useRef } from 'react'
import styled from '@emotion/styled'

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
  const { hasRipple = true, className, rippleBgColor, rippleOpacity, children, ...res } = props

  const rippleRef = useRef<Handlers>()

  const handleMouseDown = (e: React.MouseEvent) => {
    if (hasRipple && rippleRef.current) {
      rippleRef.current.start(e)
    }
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (hasRipple && rippleRef.current) {
      rippleRef.current.stop(e)
    }
  }
  return (
    <StyledButtonBase
      ref={ref}
      {...res}
      className={className}
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
    >
      {children}
      <TouchRipple ref={rippleRef} bgColor={rippleBgColor} opacity={rippleOpacity} />
    </StyledButtonBase>
  )
})

ButtonBase.displayName = 'ButtonBase'
