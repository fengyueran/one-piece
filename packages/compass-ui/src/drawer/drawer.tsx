import React from 'react'
import ReactDOM from 'react-dom'

import { CloseIcon } from '../icons'
import {
  Body,
  CloseBtn,
  DrawerContent,
  Footer,
  Header,
  Mask,
  RootContainer,
  Title,
} from './drawer.styles'
import { DrawerProps } from './types'

const canUseDom = () => typeof document !== 'undefined' && !!document.body

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  children,
  maskVisible = true,
  title,
  header,
  footer,
  closable = true,
  placement = 'right',
  width = 420,
  onCancel,
  afterClose,
  className,
  style,
  classNames,
  styles,
}) => {
  const contentRef = React.useRef<HTMLDivElement | null>(null)
  const previousFocusRef = React.useRef<HTMLElement | null>(null)
  const wasOpenRef = React.useRef(false)
  const focusFrameRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    if (!canUseDom()) {
      return
    }

    if (isOpen && !wasOpenRef.current) {
      previousFocusRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null

      focusFrameRef.current = window.requestAnimationFrame(() => {
        contentRef.current?.focus()
      })
    }

    if (!isOpen && wasOpenRef.current) {
      if (previousFocusRef.current && document.contains(previousFocusRef.current)) {
        previousFocusRef.current.focus()
      }
    }

    wasOpenRef.current = isOpen

    return () => {
      if (focusFrameRef.current !== null) {
        window.cancelAnimationFrame(focusFrameRef.current)
        focusFrameRef.current = null
      }
    }
  }, [isOpen])

  const handleClose = (event?: React.MouseEvent<HTMLElement>) => {
    onCancel?.(event)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Escape') {
      return
    }

    event.stopPropagation()
    onCancel?.()
  }

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (!isOpen && event.target === event.currentTarget) {
      afterClose?.()
    }
  }

  if (!canUseDom()) {
    return null
  }

  return ReactDOM.createPortal(
    <RootContainer
      className={`compass-drawer ${className || ''} ${classNames?.root || ''}`}
      $visible={isOpen}
      style={styles?.root}
      role="dialog"
      aria-modal="true"
    >
      {maskVisible ? (
        <Mask
          className={`compass-drawer-mask ${classNames?.mask || ''}`}
          $visible={isOpen}
          style={styles?.mask}
          onClick={handleClose}
          aria-hidden="true"
        />
      ) : null}
      <DrawerContent
        ref={contentRef}
        className={`compass-drawer-content ${classNames?.content || ''}`}
        $visible={isOpen}
        $placement={placement}
        $width={width}
        style={{ ...style, ...styles?.content }}
        onTransitionEnd={handleTransitionEnd}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        {header === undefined ? (
          title || closable ? (
            <Header
              className={`compass-drawer-header ${classNames?.header || ''}`}
              style={styles?.header}
            >
              <Title
                className={`compass-drawer-title ${classNames?.title || ''}`}
                style={styles?.title}
              >
                {title}
              </Title>
              {closable ? (
                <CloseBtn
                  className="compass-drawer-close"
                  onClick={handleClose}
                  aria-label="Close"
                  variant="text"
                  shape="circle"
                  icon={<CloseIcon />}
                />
              ) : null}
            </Header>
          ) : null
        ) : (
          header
        )}
        <Body className={`compass-drawer-body ${classNames?.body || ''}`} style={styles?.body}>
          {children}
        </Body>
        {footer ? (
          <Footer
            className={`compass-drawer-footer ${classNames?.footer || ''}`}
            style={styles?.footer}
          >
            {footer}
          </Footer>
        ) : null}
      </DrawerContent>
    </RootContainer>,
    document.body,
  )
}

Drawer.displayName = 'Drawer'

export default Drawer
