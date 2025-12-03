import React, { useRef } from 'react'
import { MessageContainerWrapper, MessageContainerRef } from './message'
import { MessageProps, MessageInstance } from './types'

let seed = 0
const now = Date.now()
const getUuid = () => `compass-message-hook-${now}-${seed++}`

export default function useMessage(): [MessageInstance, React.ReactElement] {
  const holderRef = useRef<MessageContainerRef>(null)

  const open = (config: MessageProps) => {
    if (!holderRef.current) return

    const { content, duration = 3, type = 'info', onClose, key = getUuid(), ...rest } = config

    const close = () => {
      holderRef.current?.remove(key)
      onClose?.()
    }

    holderRef.current.add({
      ...rest,
      key,
      content,
      duration,
      type,
      onClose: close,
    })
  }

  const destroy = (key?: string) => {
    if (key) {
      holderRef.current?.remove(key)
    }
    // TODO: Implement clear all if key is undefined
  }

  const fns: MessageInstance = {
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
    destroy,
  }

  return [fns, <MessageContainerWrapper key="message-holder" ref={holderRef} />]
}
