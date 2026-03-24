import React, { useRef, useState } from 'react'
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
  useDismiss,
  useRole,
  useClick,
  useHover,
  useFocus,
  useInteractions,
  FloatingPortal,
  useMergeRefs,
  safePolygon,
} from '@floating-ui/react'

import { TooltipProps } from './types'
import { TooltipArrow, TooltipOverlay, TooltipTrigger } from './tooltip.styles'

const hasTooltipContent = (value: React.ReactNode): boolean => {
  if (value === null || value === undefined || value === '' || typeof value === 'boolean') {
    return false
  }

  if (Array.isArray(value)) {
    return value.some((item) => hasTooltipContent(item))
  }

  return true
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  trigger = 'hover',
  placement = 'top',
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  disabled,
  mouseEnterDelay = 0,
  mouseLeaveDelay = 100,
  className,
  style,
  classNames,
  styles,
}) => {
  const arrowRef = useRef<HTMLDivElement | null>(null)
  const arrowSize = 8
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const handleOpenChange = (nextOpen: boolean) => {
    if (disabled) return
    if (!isControlled) {
      setUncontrolledOpen(nextOpen)
    }
    onOpenChange?.(nextOpen)
  }

  const {
    refs,
    floatingStyles,
    context,
    middlewareData,
    placement: resolvedPlacement,
  } = useFloating({
    open,
    onOpenChange: handleOpenChange,
    placement,
    middleware: [offset(8), flip(), shift({ padding: 8 }), arrow({ element: arrowRef })],
    whileElementsMounted: autoUpdate,
  })

  const hover = useHover(context, {
    enabled: trigger === 'hover',
    delay: { open: mouseEnterDelay, close: mouseLeaveDelay },
    handleClose: safePolygon(),
  })
  const focus = useFocus(context, {
    enabled: trigger === 'hover',
  })
  const click = useClick(context, {
    enabled: trigger === 'click',
  })
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'tooltip' })

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    click,
    dismiss,
    role,
  ])

  const shouldWrapTrigger = !React.isValidElement(children) || children.type === React.Fragment
  const child = shouldWrapTrigger ? <span>{children}</span> : children

  // @ts-expect-error reading child ref for merge
  const childRef = child.ref
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const mergedRef = useMergeRefs([refs.setReference, childRef])

  const triggerElement = React.cloneElement(child, {
    ...getReferenceProps(child.props),
    ref: mergedRef,
    className: [className, classNames?.root, child.props.className].filter(Boolean).join(' '),
    style: { ...child.props.style, ...style, ...styles?.root },
  })

  const hasContent = hasTooltipContent(content)

  if (!hasContent || disabled) {
    return triggerElement
  }

  const side = resolvedPlacement.split('-')[0]
  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[side] as 'top' | 'right' | 'bottom' | 'left'

  const arrowStyle = {
    left: middlewareData.arrow?.x != null ? `${middlewareData.arrow.x}px` : '',
    top: middlewareData.arrow?.y != null ? `${middlewareData.arrow.y}px` : '',
    right: '',
    bottom: '',
    [staticSide]: `${-arrowSize / 2}px`,
  }

  const customContentBackground =
    styles?.content?.background ?? styles?.content?.backgroundColor ?? undefined

  return (
    <>
      {triggerElement}
      {open && (
        <FloatingPortal>
          {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
          <TooltipTrigger
            ref={refs.setFloating}
            className={`compass-tooltip ${classNames?.overlay || ''}`}
            style={{ ...floatingStyles, ...styles?.overlay }}
            data-placement={resolvedPlacement}
            {...getFloatingProps({
              onClick: (e) => e.stopPropagation(),
              onMouseDown: (e) => e.stopPropagation(),
              onPointerDown: (e) => e.stopPropagation(),
            })}
          >
            <TooltipOverlay
              className={`compass-tooltip-content ${classNames?.content || ''}`}
              style={styles?.content}
            >
              {content}
            </TooltipOverlay>
            <TooltipArrow
              ref={arrowRef}
              className={`compass-tooltip-arrow ${classNames?.arrow || ''}`}
              aria-hidden="true"
              style={{
                ...arrowStyle,
                ...(customContentBackground ? { background: customContentBackground } : null),
                ...styles?.arrow,
              }}
            />
          </TooltipTrigger>
        </FloatingPortal>
      )}
    </>
  )
}

Tooltip.displayName = 'Tooltip'

export default Tooltip
