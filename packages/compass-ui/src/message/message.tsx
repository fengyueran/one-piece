import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { createRoot } from 'react-dom/client'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { MessageProps, MessageType } from './types'
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

interface MessageContainerProps {
  prefixCls?: string
}

interface MessageContainerRef {
  add: (message: MessageProps) => void
  remove: (key: string) => void
}

const MessageContainerWrapper = forwardRef<MessageContainerRef, MessageContainerProps>(
  (props, ref) => {
    const [messages, setMessages] = useState<MessageProps[]>([])
    const nodeRefs = React.useRef(new Map<string, React.RefObject<HTMLDivElement>>())

    useImperativeHandle(ref, () => ({
      add: (message: MessageProps) => {
        if (message.key && !nodeRefs.current.has(message.key)) {
          nodeRefs.current.set(message.key, React.createRef())
        }
        setMessages((prev) => [...prev, message])
      },
      remove: (key: string) => {
        setMessages((prev) => prev.filter((m) => m.key !== key))
        nodeRefs.current.delete(key)
      },
    }))

    return (
      <MessageContainer>
        <TransitionGroup component={null}>
          {messages.map((msg) => {
            const nodeRef = nodeRefs.current.get(msg.key!)
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
      </MessageContainer>
    )
  },
)

let messageContainerRef: MessageContainerRef | null = null
let containerRoot: any = null
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
  info: (content: React.ReactNode, duration?: number, onClose?: () => void) =>
    open({ content, duration, type: 'info', onClose }),
  success: (content: React.ReactNode, duration?: number, onClose?: () => void) =>
    open({ content, duration, type: 'success', onClose }),
  error: (content: React.ReactNode, duration?: number, onClose?: () => void) =>
    open({ content, duration, type: 'error', onClose }),
  warning: (content: React.ReactNode, duration?: number, onClose?: () => void) =>
    open({ content, duration, type: 'warning', onClose }),
  loading: (content: React.ReactNode, duration?: number, onClose?: () => void) =>
    open({ content, duration, type: 'loading', onClose }),
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
