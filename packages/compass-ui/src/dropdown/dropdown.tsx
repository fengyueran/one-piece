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
import { MenuContext } from '../menu/context'

const Dropdown: React.FC<DropdownProps> = ({
  children,
  overlay,
  menu,
  trigger = 'hover',
  placement = 'bottom-start',
  visible: controlledVisible,
  onVisibleChange,
  disabled,
  closeOnSelect = true,
  className,
  style,
  overlayClassName,
  overlayStyle,
  classNames,
  styles,
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

  const handleOverlayClick = () => {
    // Menu component will handle the menu.onClick via props
    if (closeOnSelect) {
      handleVisibleChange(false)
    }
  }

  const dropdownContent = overlay || (menu ? <Menu {...menu} /> : null)

  const triggerCls = [
    'compass-dropdown-trigger',
    className,
    classNames?.trigger,
    child.props.className, // Merge child's own className
  ]
    .filter(Boolean)
    .join(' ')

  const overlayCls = ['compass-dropdown', overlayClassName, classNames?.overlay]
    .filter(Boolean)
    .join(' ')

  const triggerElement = React.cloneElement(child, {
    ...getReferenceProps(child.props),
    className: triggerCls,
    style: { ...child.props.style, ...style, ...styles?.trigger },
    ref,
  })

  if (!dropdownContent) {
    return triggerElement
  }

  return (
    <>
      {triggerElement}
      {visible && (
        <FloatingPortal>
          {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
          <OverlayContainer
            ref={refs.setFloating}
            style={{ ...floatingStyles, ...overlayStyle, ...styles?.overlay }}
            className={overlayCls}
            {...getFloatingProps()}
          >
            <MenuContext.Provider value={{ onItemClick: handleOverlayClick }}>
              <div
                className={`compass-dropdown-content ${classNames?.content || ''}`}
                style={styles?.content}
              >
                {dropdownContent}
              </div>
            </MenuContext.Provider>
          </OverlayContainer>
        </FloatingPortal>
      )}
    </>
  )
}

Dropdown.displayName = 'Dropdown'

export default Dropdown
