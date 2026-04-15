import React from 'react'

import { EmptyProps } from './types'
import { EmptyAction, EmptyDescription, EmptyImage, EmptyRoot, EmptyTitle } from './empty.styles'

/**
 * Empty placeholder used for no-result or no-content states.
 */
const Empty = React.forwardRef<HTMLDivElement, EmptyProps>((props, ref) => {
  const {
    image,
    title,
    description,
    action,
    size = 'medium',
    className,
    style,
    classNames,
    styles,
    ...rest
  } = props

  const resolvedTitle = title ?? (!description ? '暂无内容' : null)

  return (
    <EmptyRoot
      {...rest}
      ref={ref}
      $size={size}
      className={`compass-empty compass-empty--${size} ${className || ''} ${classNames?.root || ''}`}
      style={{ ...style, ...styles?.root }}
    >
      <EmptyImage
        $size={size}
        aria-hidden="true"
        className={`compass-empty-image ${classNames?.image || ''}`}
        style={styles?.image}
      >
        {image}
      </EmptyImage>
      {resolvedTitle && (
        <EmptyTitle
          className={`compass-empty-title ${classNames?.title || ''}`}
          style={styles?.title}
        >
          {resolvedTitle}
        </EmptyTitle>
      )}
      {description && (
        <EmptyDescription
          className={`compass-empty-description ${classNames?.description || ''}`}
          style={styles?.description}
        >
          {description}
        </EmptyDescription>
      )}
      {action && (
        <EmptyAction
          className={`compass-empty-action ${classNames?.action || ''}`}
          style={styles?.action}
        >
          {action}
        </EmptyAction>
      )}
    </EmptyRoot>
  )
})

Empty.displayName = 'Empty'

export default Empty
