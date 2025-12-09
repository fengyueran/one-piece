import React, { useRef, useState, useImperativeHandle, ReactElement } from 'react'

import { ModalFuncProps } from './confirm'
import { InfoIcon, SuccessIcon, ErrorIcon, WarningIcon } from '../icons'
import Modal from './modal'
import Button from '../button'
import { useConfig } from '../config-provider'
import defaultLocale from '../locale/zh_CN'

import {
  ConfirmContent,
  IconWrapper,
  ContentWrapper,
  Title,
  Content,
  ConfirmFooter,
} from './confirm-styles'

interface HookModalProps extends ModalFuncProps {
  afterClose?: () => void
  isOpen: boolean
  closeModal: () => void
}

const HookModal: React.FC<HookModalProps> = ({
  afterClose,
  closeModal,
  onOk,
  onCancel,
  title,
  content,
  icon,
  type = 'info',
  okText = 'OK',
  cancelText = 'Cancel',
  isOpen,
  confirmLoading,
  ...modalProps
}) => {
  const [loading, setLoading] = useState(false)

  const { locale: contextLocale } = useConfig()
  const locale = contextLocale?.Modal || defaultLocale.Modal

  const mergedOkText = okText === 'OK' ? locale.okText : okText
  const mergedCancelText = cancelText === 'Cancel' ? locale.cancelText : cancelText

  const handleOk = async () => {
    if (onOk) {
      const returnValue = onOk()
      if (returnValue && typeof returnValue.then === 'function') {
        setLoading(true)
        try {
          await returnValue
          setLoading(false)
          closeModal()
        } catch (e) {
          setLoading(false)
          console.error(e)
          throw e
        }
      } else {
        closeModal()
      }
    } else {
      closeModal()
    }
  }

  const handleCancel = async () => {
    if (onCancel) {
      await onCancel()
    }
    closeModal()
  }

  const iconMap: Record<string, React.ReactNode> = {
    info: <InfoIcon />,
    success: <SuccessIcon />,
    error: <ErrorIcon />,
    warning: <WarningIcon />,
  }

  const defaultIcon = iconMap[type] || <InfoIcon />

  return (
    <Modal
      {...modalProps}
      afterClose={afterClose}
      closable={modalProps.closable ?? false}
      width={416}
      isOpen={!!isOpen}
      onCancel={handleCancel}
      footer={
        <ConfirmFooter>
          {type === 'confirm' ? <Button onClick={handleCancel}>{mergedCancelText}</Button> : null}
          <Button variant="primary" onClick={handleOk} loading={confirmLoading || loading}>
            {mergedOkText}
          </Button>
        </ConfirmFooter>
      }
    >
      <ConfirmContent>
        <IconWrapper $type={type as any}>{icon || defaultIcon}</IconWrapper>
        <ContentWrapper>
          {title && <Title>{title}</Title>}
          {content && <Content>{content}</Content>}
        </ContentWrapper>
      </ConfirmContent>
    </Modal>
  )
}

interface ElementsHolderRef {
  patchElement: (key: string, element: ReactElement) => void
  removeElement: (key: string) => void
}

const ElementsHolder = React.forwardRef<ElementsHolderRef>((props, ref) => {
  const [elements, setElements] = useState<Map<string, ReactElement>>(new Map())

  useImperativeHandle(ref, () => ({
    patchElement: (key: string, element: ReactElement) => {
      setElements((prev) => {
        const next = new Map(prev)
        next.set(key, element)
        return next
      })
    },
    removeElement: (key: string) => {
      setElements((prev) => {
        const next = new Map(prev)
        next.delete(key)
        return next
      })
    },
  }))

  return <>{Array.from(elements.values())}</>
})

export type ModalFunc = (props: ModalFuncProps) => {
  destroy: () => void
  update: (config: ModalFuncProps) => void
}

interface ModalInstance {
  info: ModalFunc
  success: ModalFunc
  error: ModalFunc
  warning: ModalFunc
  confirm: ModalFunc
}

export default function useModal(): [ModalInstance, ReactElement] {
  const holderRef = useRef<ElementsHolderRef>(null)
  const [element, setElement] = useState<ReactElement | null>(null)

  // Lazy create holder
  if (!element) {
    const holder = <ElementsHolder ref={holderRef} />
    setElement(holder)
  }

  const getConfirmFunc = (withFunc: (config: ModalFuncProps) => ModalFuncProps): ModalFunc => {
    return (config: ModalFuncProps) => {
      const uuid = Math.random().toString(36).substring(2)
      const props = withFunc(config)

      let currentConfig = { ...props, isOpen: false }

      const close = () => {
        currentConfig = { ...currentConfig, isOpen: false }
        render(currentConfig)
      }

      const render = (renderProps: ModalFuncProps & { isOpen?: boolean }) => {
        if (holderRef.current) {
          holderRef.current.patchElement(
            uuid,
            <HookModal
              key={uuid}
              {...renderProps}
              isOpen={!!renderProps.isOpen}
              closeModal={close}
              afterClose={() => {
                if (holderRef.current) {
                  holderRef.current.removeElement(uuid)
                }
              }}
            />,
          )
        }
      }

      render(currentConfig)

      // Trigger animation
      setTimeout(() => {
        currentConfig = { ...currentConfig, isOpen: true }
        render(currentConfig)
      }, 10)

      return {
        destroy: close,
        update: (newConfig: ModalFuncProps) => {
          currentConfig = { ...currentConfig, ...newConfig }
          render(currentConfig)
        },
      }
    }
  }

  const fns: ModalInstance = {
    info: getConfirmFunc((props) => ({ ...props, type: 'info' })),
    success: getConfirmFunc((props) => ({ ...props, type: 'success' })),
    error: getConfirmFunc((props) => ({ ...props, type: 'error' })),
    warning: getConfirmFunc((props) => ({ ...props, type: 'warning' })),
    confirm: getConfirmFunc((props) => ({ ...props, type: 'confirm' })),
  }

  return [fns, element!]
}
