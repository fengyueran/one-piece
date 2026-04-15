import React, { useId, useState } from 'react'
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useClick,
  useHover,
  useFocus,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
  useMergeRefs,
  safePolygon,
} from '@floating-ui/react'

import { getOverlaySurfaceProps, getOverlayTriggerA11yProps } from '../internal/overlay-utils'
import { PopoverProps } from './types'
import {
  PopoverBody,
  PopoverCard,
  PopoverHeader,
  PopoverOverlay,
  PopoverTitle,
} from './popover.styles'

const hasPopoverContent = (title?: React.ReactNode, content?: React.ReactNode) => {
  return (
    (title !== null && title !== undefined && title !== false) ||
    (content !== null && content !== undefined && content !== false)
  )
}

const Popover: React.FC<PopoverProps> = ({
  title,
  content,
  children,
  trigger = 'click',
  placement = 'top',
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  className,
  style,
  classNames,
  styles,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen
  const overlayId = useId().replace(/:/g, '')

  const handleOpenChange = (nextOpen: boolean) => {
    if (disabled) {
      return
    }

    if (!isControlled) {
      setUncontrolledOpen(nextOpen)
    }

    onOpenChange?.(nextOpen)
  }

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: handleOpenChange,
    placement,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  })

  const hover = useHover(context, {
    enabled: trigger === 'hover',
    handleClose: safePolygon(),
  })
  const focus = useFocus(context, {
    enabled: trigger === 'hover',
  })
  const click = useClick(context, {
    enabled: trigger === 'click',
  })
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'dialog' })

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    click,
    dismiss,
    role,
  ])

  const child = React.Children.only(children)
  // @ts-expect-error read child ref for merge
  const childRef = child.ref
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const mergedRef = useMergeRefs([refs.setReference, childRef])

  const triggerElement = React.cloneElement(child, {
    ...getReferenceProps(child.props),
    ...getOverlayTriggerA11yProps({
      open,
      controlsId: `compass-popover-${overlayId}`,
      popupRole: 'dialog',
      disabled,
    }),
    ref: mergedRef,
    className: [className, classNames?.root, child.props.className].filter(Boolean).join(' '),
    style: { ...child.props.style, ...style, ...styles?.root },
  })

  if (!hasPopoverContent(title, content) || disabled) {
    return triggerElement
  }

  return (
    <>
      {triggerElement}
      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
            <PopoverOverlay
              ref={refs.setFloating}
              className={`compass-popover ${classNames?.overlay || ''}`}
              style={{ ...floatingStyles, ...styles?.overlay }}
              {...getFloatingProps(getOverlaySurfaceProps())}
              id={`compass-popover-${overlayId}`}
            >
              <PopoverCard>
                {title !== undefined && title !== null ? (
                  <PopoverHeader
                    className={`compass-popover-header ${classNames?.header || ''}`}
                    style={styles?.header}
                  >
                    <PopoverTitle
                      className={`compass-popover-title ${classNames?.title || ''}`}
                      style={styles?.title}
                    >
                      {title}
                    </PopoverTitle>
                  </PopoverHeader>
                ) : null}
                {content !== undefined && content !== null ? (
                  <PopoverBody
                    className={`compass-popover-body ${classNames?.body || ''}`}
                    style={styles?.body}
                  >
                    {content}
                  </PopoverBody>
                ) : null}
              </PopoverCard>
            </PopoverOverlay>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  )
}

Popover.displayName = 'Popover'

export default Popover
