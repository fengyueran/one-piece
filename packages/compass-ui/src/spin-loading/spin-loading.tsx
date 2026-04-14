import React from 'react'

import { SpinLoadingProps } from './types'
import {
  SpinContainer,
  SpinContent,
  SpinIndicator,
  SpinOverlay,
  SpinRoot,
  SpinTip,
} from './spin-loading.styles'

/**
 * Loading state component that supports both inline and overlay rendering.
 */
const SpinLoading = React.forwardRef<HTMLDivElement, SpinLoadingProps>((props, ref) => {
  const {
    spinning = true,
    indicator,
    tip,
    size = 'medium',
    children,
    className,
    style,
    classNames,
    styles,
    ...rest
  } = props

  if (!spinning) {
    return <>{children}</>
  }

  const spinner = (
    <SpinRoot
      ref={ref}
      role="status"
      aria-live="polite"
      aria-label={typeof tip === 'string' ? tip : '加载中'}
      className={`compass-spin-loading ${className || ''} ${classNames?.root || ''}`}
      style={{ ...style, ...styles?.root }}
      {...rest}
    >
      <span
        className={`compass-spin-loading-indicator ${classNames?.indicator || ''}`}
        style={styles?.indicator}
      >
        {indicator || <SpinIndicator $size={size} aria-hidden="true" />}
      </span>
      {tip && (
        <SpinTip
          className={`compass-spin-loading-tip ${classNames?.tip || ''}`}
          style={styles?.tip}
        >
          {tip}
        </SpinTip>
      )}
    </SpinRoot>
  )

  if (!children) {
    return spinner
  }

  return (
    <SpinContainer>
      <SpinContent
        $spinning={spinning}
        aria-busy="true"
        className={`compass-spin-loading-content ${classNames?.content || ''}`}
        style={styles?.content}
      >
        {children}
      </SpinContent>
      <SpinOverlay
        className={`compass-spin-loading-overlay ${classNames?.overlay || ''}`}
        style={styles?.overlay}
      >
        {spinner}
      </SpinOverlay>
    </SpinContainer>
  )
})

SpinLoading.displayName = 'SpinLoading'

export default SpinLoading
