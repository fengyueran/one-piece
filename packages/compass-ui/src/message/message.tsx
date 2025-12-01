import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { createRoot } from 'react-dom/client'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { MessageProps, MessageType } from './types'
import { MessageContainer, MessageItem, MessageContent, IconWrapper } from './message.styles'

const icons = {
  info: (
    <span role="img" aria-label="info" className="anticon anticon-info-circle">
      <svg
        viewBox="64 64 896 896"
        focusable="false"
        data-icon="info-circle"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"></path>
      </svg>
    </span>
  ),
  success: (
    <span role="img" aria-label="success" className="anticon anticon-check-circle">
      <svg
        viewBox="64 64 896 896"
        focusable="false"
        data-icon="check-circle"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path>
      </svg>
    </span>
  ),
  error: (
    <span role="img" aria-label="error" className="anticon anticon-close-circle">
      <svg
        viewBox="64 64 896 896"
        focusable="false"
        data-icon="close-circle"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path>
      </svg>
    </span>
  ),
  warning: (
    <span role="img" aria-label="warning" className="anticon anticon-exclamation-circle">
      <svg
        viewBox="64 64 896 896"
        focusable="false"
        data-icon="exclamation-circle"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"></path>
      </svg>
    </span>
  ),
  loading: (
    <span role="img" aria-label="loading" className="anticon anticon-loading">
      <svg
        viewBox="0 0 1024 1024"
        focusable="false"
        data-icon="loading"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>
      </svg>
    </span>
  ),
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
