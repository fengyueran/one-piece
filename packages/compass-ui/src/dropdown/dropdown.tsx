import React, { useState } from 'react'
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
  useInteractions,
  FloatingPortal,
  useMergeRefs,
} from '@floating-ui/react'

import { DropdownProps } from './types'
import { OverlayContainer } from './dropdown.styles'
import Menu from '../menu'

const Dropdown: React.FC<DropdownProps> = ({
  children,
  overlay,
  menu,
  trigger = 'hover',
  placement = 'bottom-start',
  visible: controlledVisible,
  onVisibleChange,
  disabled,
  className,
  style,
}) => {
  const [uncontrolledVisible, setUncontrolledVisible] = useState(false)
  const isControlled = controlledVisible !== undefined
  const visible = isControlled ? controlledVisible : uncontrolledVisible

  const handleVisibleChange = (nextVisible: boolean) => {
    if (disabled) return
    if (!isControlled) {
      setUncontrolledVisible(nextVisible)
    }
    onVisibleChange?.(nextVisible)
  }

  const { refs, floatingStyles, context } = useFloating({
    open: visible,
    onOpenChange: handleVisibleChange,
    placement,
    middleware: [offset(4), flip(), shift()],
    whileElementsMounted: autoUpdate,
  })

  const hover = useHover(context, {
    enabled: trigger === 'hover',
    delay: { open: 0, close: 100 },
  })
  const click = useClick(context, {
    enabled: trigger === 'click',
  })
  const dismiss = useDismiss(context)
  const role = useRole(context)

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, click, dismiss, role])

  // Ensure children is a single React element
  const child = React.Children.only(children) as React.ReactElement
  // @ts-expect-error - Accessing ref is necessary for merging refs
  const childRef = child.ref
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const ref = useMergeRefs([refs.setReference, childRef])

  const dropdownContent = overlay || (menu ? <Menu {...menu} /> : null)

  if (!dropdownContent) {
    return <>{children}</>
  }

  return (
    <>
      {React.cloneElement(child, {
        ref,
        ...getReferenceProps({
          className: `compass-dropdown-trigger ${className || ''}`,
          style,
          ...child.props,
        }),
      })}
      {visible && (
        <FloatingPortal>
          {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
          <OverlayContainer
            ref={refs.setFloating}
            style={floatingStyles}
            className={`compass-dropdown ${className || ''}`}
            {...getFloatingProps()}
          >
            {dropdownContent}
          </OverlayContainer>
        </FloatingPortal>
      )}
    </>
  )
}

Dropdown.displayName = 'Dropdown'

export default Dropdown
