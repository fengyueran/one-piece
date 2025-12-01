import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { createRoot } from 'react-dom/client'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { MessageProps, MessageType } from './types'
import { MessageContainer, MessageItem, MessageContent, IconWrapper } from './message.styles'

const icons = {
  info: (
    <span role="img" aria-label="info">
      ℹ️
    </span>
  ),
  success: (
    <span role="img" aria-label="success">
      ✅
    </span>
  ),
  error: (
    <span role="img" aria-label="error">
      ❌
    </span>
  ),
  warning: (
    <span role="img" aria-label="warning">
      ⚠️
    </span>
  ),
  loading: (
    <span role="img" aria-label="loading">
      ⏳
    </span>
  ),
}

const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ content, type = 'info', icon, className, style, duration = 3, onClose }, ref) => {
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
      // If duration is 0 or less, it never closes automatically
      if (duration <= 0) return

      // If hovered, don't start the timer
      if (isHovered) return

      const timer = setTimeout(() => {
        onClose?.()
      }, duration * 1000)

      return () => clearTimeout(timer)
    }, [duration, isHovered, onClose])

    return (
      <MessageItem
        ref={ref}
        className={className}
        style={style}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <MessageContent>
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

interface MessageState {
  messages: MessageProps[]
}

interface MessageContainerRef {
  add: (message: MessageProps) => void
  remove: (key: string) => void
}

const MessageContainerWrapper = forwardRef<MessageContainerRef, MessageContainerProps>(
  (props, ref) => {
    const [messages, setMessages] = useState<MessageProps[]>([])

    useImperativeHandle(ref, () => ({
      add: (message: MessageProps) => {
        setMessages((prev) => [...prev, message])
      },
      remove: (key: string) => {
        setMessages((prev) => prev.filter((m) => m.key !== key))
      },
    }))

    return (
      <MessageContainer>
        <TransitionGroup component={null}>
          {messages.map((msg) => (
            <CSSTransition key={msg.key} timeout={300} classNames="compass-message">
              <Message {...msg} />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </MessageContainer>
    )
  },
)

let messageContainerRef: MessageContainerRef | null = null
let containerRoot: any = null

const getMessageContainer = () => {
  if (messageContainerRef) return messageContainerRef

  const div = document.createElement('div')
  document.body.appendChild(div)

  // Using createRoot for React 18
  containerRoot = createRoot(div)

  // We need to render the container and get the ref
  // This is tricky with createRoot because it's async-ish and doesn't return the instance like render did.
  // We can wrap it in a promise or use a callback.
  // However, for a simple sync API like message.info(), we need the ref immediately or queue the actions.

  // Simplified approach: Render a component that sets the global ref on mount.

  let tempRef: MessageContainerRef | null = null

  const Wrapper = () => {
    return (
      <MessageContainerWrapper
        ref={(ref) => {
          messageContainerRef = ref
          tempRef = ref
        }}
      />
    )
  }

  containerRoot.render(<Wrapper />)

  // This is a hacky way to wait for ref. In a real world scenario we might queue.
  // But since we can't block, we might need to queue tasks if ref is null.
  return null
}

// Queue for messages before container is ready
const taskQueue: Array<() => void> = []

const flushQueue = () => {
  if (!messageContainerRef) return
  while (taskQueue.length > 0) {
    const task = taskQueue.shift()
    task?.()
  }
}

const ensureContainer = () => {
  if (!messageContainerRef && !containerRoot) {
    getMessageContainer()
  }
}

let seed = 0
const now = Date.now()
const getUuid = () => `compass-message-${now}-${seed++}`

const notice = (
  content: React.ReactNode,
  duration: number = 3,
  type: MessageType = 'info',
  onClose?: () => void,
) => {
  ensureContainer()

  const key = getUuid()

  const close = () => {
    if (messageContainerRef) {
      messageContainerRef.remove(key)
    }
    onClose?.()
  }

  const task = () => {
    if (messageContainerRef) {
      messageContainerRef.add({
        key,
        content,
        duration,
        type,
        onClose: close,
      })
    }
  }

  if (messageContainerRef) {
    task()
  } else {
    taskQueue.push(task)
    // Try to flush periodically until ref is ready
    const timer = setInterval(() => {
      if (messageContainerRef) {
        flushQueue()
        clearInterval(timer)
      }
    }, 10)
  }
}

export default {
  info: (content: React.ReactNode, duration?: number, onClose?: () => void) =>
    notice(content, duration, 'info', onClose),
  success: (content: React.ReactNode, duration?: number, onClose?: () => void) =>
    notice(content, duration, 'success', onClose),
  error: (content: React.ReactNode, duration?: number, onClose?: () => void) =>
    notice(content, duration, 'error', onClose),
  warning: (content: React.ReactNode, duration?: number, onClose?: () => void) =>
    notice(content, duration, 'warning', onClose),
  loading: (content: React.ReactNode, duration?: number, onClose?: () => void) =>
    notice(content, duration, 'loading', onClose),
  destroy: () => {
    if (containerRoot) {
      containerRoot.unmount()
      containerRoot = null
    }
    messageContainerRef = null
    taskQueue.length = 0
  },
}
