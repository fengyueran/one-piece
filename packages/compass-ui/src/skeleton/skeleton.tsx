import React from 'react'

import { SkeletonProps } from './types'
import {
  SkeletonAvatar,
  SkeletonBlock,
  SkeletonContent,
  SkeletonRoot,
} from './skeleton.styles'

/**
 * Content skeleton placeholder.
 */
const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>((props, ref) => {
  const {
    loading = true,
    active = true,
    avatar = false,
    title = true,
    rows = 3,
    round = false,
    className,
    style,
    classNames,
    styles,
    children,
    ...rest
  } = props

  if (!loading) {
    return <>{children}</>
  }

  return (
    <SkeletonRoot
      {...rest}
      ref={ref}
      className={`compass-skeleton ${className || ''} ${classNames?.root || ''}`}
      style={{ ...style, ...styles?.root }}
    >
      {avatar && (
        <SkeletonAvatar
          $active={active}
          aria-hidden="true"
          className={`compass-skeleton-avatar ${classNames?.avatar || ''}`}
          style={styles?.avatar}
        />
      )}
      <SkeletonContent>
        {title && (
          <SkeletonBlock
            $active={active}
            $round={round}
            $width="38%"
            aria-hidden="true"
            className={`compass-skeleton-title ${classNames?.title || ''}`}
            style={styles?.title}
          />
        )}
        {Array.from({ length: rows }).map((_, index) => (
          <SkeletonBlock
            key={`row-${index}`}
            $active={active}
            $round={round}
            $width={index === rows - 1 ? '72%' : '100%'}
            aria-hidden="true"
            className={`compass-skeleton-row ${classNames?.row || ''}`}
            style={styles?.row}
          />
        ))}
      </SkeletonContent>
    </SkeletonRoot>
  )
})

Skeleton.displayName = 'Skeleton'

export default Skeleton
