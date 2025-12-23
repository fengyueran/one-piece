import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { createPortal } from 'react-dom'
import { createRoot, Root } from 'react-dom/client'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import { MessageProps } from './types'
import { MessageContainer, MessageItem, MessageContent, IconWrapper } from './message.styles'
import { InfoIcon, SuccessIcon, ErrorIcon, WarningIcon, LoadingIcon } from '../icons'

const icons = {
  info: <InfoIcon />,
  success: <SuccessIcon />,
  error: <ErrorIcon />,
  warning: <WarningIcon />,
  loading: <LoadingIcon />,
}

const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ content, type = 'info', icon, className, style, duration = 3, onClose }, ref) => {
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
      if (duration <= 0) return

      if (isHovered) return

      const timer = setTimeout(() => {
        onClose?.()
      }, duration * 1000)

      return () => clearTimeout(timer)
    }, [duration, isHovered, onClose])

    return (
      <MessageItem
        ref={ref}
        className={`compass-message compass-message--${type} ${className || ''}`}
        style={style}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <MessageContent className="compass-message-content">
          <IconWrapper $type={type}>{icon || icons[type]}</IconWrapper>
          {content}
        </MessageContent>
      </MessageItem>
    )
  },
)

Message.displayName = 'Message'

interface MessageContainerProps {
  prefixCls?: string
}

export interface MessageContainerRef {
  add: (message: MessageProps) => void
  remove: (key: string) => void
}

export const MessageContainerWrapper = forwardRef<MessageContainerRef, MessageContainerProps>(
  (props, ref) => {
    const [messages, setMessages] = useState<MessageProps[]>([])
    const [nodeRefs] = useState(() => new Map<string, React.RefObject<HTMLDivElement>>())
    const [container] = useState<HTMLElement | null>(() =>
      typeof window !== 'undefined' ? document.body : null,
    )

    useImperativeHandle(ref, () => ({
      add: (message: MessageProps) => {
        if (message.key && !nodeRefs.has(message.key)) {
          nodeRefs.set(message.key, React.createRef())
        }
        setMessages((prev) => [...prev, message])
      },
      remove: (key: string) => {
        setMessages((prev) => prev.filter((m) => m.key !== key))
        nodeRefs.delete(key)
      },
    }))

    if (!container) return null

    return createPortal(
      <MessageContainer>
        <TransitionGroup component={null}>
          {messages.map((msg) => {
            const nodeRef = nodeRefs.get(msg.key!)
            return (
              <CSSTransition
                key={msg.key}
                timeout={300}
                classNames="compass-message"
                nodeRef={nodeRef}
              >
                <Message ref={nodeRef} {...msg} />
              </CSSTransition>
            )
          })}
        </TransitionGroup>
      </MessageContainer>,
      container,
    )
  },
)

MessageContainerWrapper.displayName = 'MessageContainerWrapper'

let messageContainerRef: MessageContainerRef | null = null
let containerRoot: Root | null = null
let containerPromise: Promise<MessageContainerRef> | null = null

const getMessageContainer = (): Promise<MessageContainerRef> => {
  if (messageContainerRef) return Promise.resolve(messageContainerRef)
  if (containerPromise) return containerPromise

  containerPromise = new Promise<MessageContainerRef>((resolve) => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    containerRoot = createRoot(div)

    const Wrapper = () => {
      return (
        <MessageContainerWrapper
          ref={(ref) => {
            if (ref) {
              messageContainerRef = ref
              resolve(ref)
            }
          }}
        />
      )
    }

    containerRoot.render(<Wrapper />)
  })

  return containerPromise
}

let seed = 0
const now = Date.now()
const getUuid = () => `compass-message-${now}-${seed++}`

const open = (config: MessageProps) => {
  const { content, duration = 3, type = 'info', onClose, key = getUuid(), ...rest } = config

  const close = () => {
    if (messageContainerRef) {
      messageContainerRef.remove(key)
    }
    onClose?.()
  }

  getMessageContainer().then((ref) => {
    ref.add({
      ...rest,
      key,
      content,
      duration,
      type,
      onClose: close,
    })
  })
}

export default {
  info: (content: React.ReactNode | MessageProps, duration?: number, onClose?: () => void) => {
    if (typeof content === 'object' && content !== null && 'content' in content) {
      return open({ ...content, type: 'info' })
    }
    return open({ content, duration, type: 'info', onClose })
  },
  success: (content: React.ReactNode | MessageProps, duration?: number, onClose?: () => void) => {
    if (typeof content === 'object' && content !== null && 'content' in content) {
      return open({ ...content, type: 'success' })
    }
    return open({ content, duration, type: 'success', onClose })
  },
  error: (content: React.ReactNode | MessageProps, duration?: number, onClose?: () => void) => {
    if (typeof content === 'object' && content !== null && 'content' in content) {
      return open({ ...content, type: 'error' })
    }
    return open({ content, duration, type: 'error', onClose })
  },
  warning: (content: React.ReactNode | MessageProps, duration?: number, onClose?: () => void) => {
    if (typeof content === 'object' && content !== null && 'content' in content) {
      return open({ ...content, type: 'warning' })
    }
    return open({ content, duration, type: 'warning', onClose })
  },
  loading: (content: React.ReactNode | MessageProps, duration?: number, onClose?: () => void) => {
    if (typeof content === 'object' && content !== null && 'content' in content) {
      return open({ ...content, type: 'loading' })
    }
    return open({ content, duration, type: 'loading', onClose })
  },
  open,
  destroy: () => {
    if (containerRoot) {
      containerRoot.unmount()
      containerRoot = null
    }
    messageContainerRef = null
    containerPromise = null
  },
}
