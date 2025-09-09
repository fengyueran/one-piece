import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react'
import styled from '@emotion/styled'
import { TransitionGroup } from 'react-transition-group'

import { Ripple, RippleType } from './ripple'

const RootContainer = styled.div`
  display: block;
  position: absolute;
  overflow: hidden;
  border-radius: inherit;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  pointer-events: none;
  z-index: 0;
`

const Duration = 500

export type Handlers = {
  start: (e: React.MouseEvent) => void
  stop: (e: React.MouseEvent) => void
}

export const TouchRipple = forwardRef((props: { bgColor?: string; opacity?: number }, ref) => {
  const numRef = useRef(0)
  const [ripples, setRipples] = useState<(RippleType & { num: number })[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const startCommit = (params: { rippleX: number; rippleY: number; rippleSize: number }) => {
    const { rippleX, rippleY, rippleSize } = params
    setRipples([
      ...ripples,
      {
        num: ++numRef.current,
        timeout: {
          exit: Duration,
          enter: Duration,
        },
        rippleX,
        rippleY,
        rippleSize,
      },
    ])
  }

  const start = (event: React.MouseEvent) => {
    const element = containerRef.current
    if (!element) return

    const rect = element
      ? element.getBoundingClientRect()
      : {
          width: 0,
          height: 0,
          left: 0,
          top: 0,
        }

    // Get the size of the ripple
    const clientX = event.clientX
    const clientY = event.clientY
    const rippleX = Math.round(clientX - rect.left)
    const rippleY = Math.round(clientY - rect.top)

    const sizeX = Math.max(Math.abs((element ? element.clientWidth : 0) - rippleX), rippleX) * 2 + 2
    const sizeY =
      Math.max(Math.abs((element ? element.clientHeight : 0) - rippleY), rippleY) * 2 + 2
    const rippleSize = Math.sqrt(sizeX ** 2 + sizeY ** 2)

    startCommit({ rippleX, rippleY, rippleSize })
  }

  const stop = () => {
    if (ripples && ripples.length) {
      setRipples(ripples.slice(1))
    }
  }

  useImperativeHandle(ref, () => ({
    start,
    stop,
  }))

  return (
    <RootContainer ref={containerRef}>
      <TransitionGroup component="span">
        {ripples.map(({ num, ...res }) => {
          return <Ripple key={num} {...res} {...props} />
        })}
      </TransitionGroup>
    </RootContainer>
  )
})
