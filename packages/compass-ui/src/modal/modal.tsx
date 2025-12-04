import React from 'react'
import ReactDOM from 'react-dom'

import {
  RootContainer,
  Mask,
  ModalContent,
  Footer,
  StyledButton,
  Header,
  Title,
  CloseBtn,
} from './modal.styles'
import { ModalBaseProps } from './types'
import { CloseIcon } from '../icons'

export const BaseModal = (props: ModalBaseProps) => {
  const {
    isOpen,
    maskVisible = true,
    footer,
    onCancel,
    children,
    className,
    style,
    title,
    closable = true,
    onOk,
    okText = '确定',
    cancelText = '取消',
    confirmLoading,
    afterClose,
    ...res
  } = props

  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (!isOpen) {
      setLoading(false)
    }
  }, [isOpen])

  const handleOk = async (e: React.MouseEvent<HTMLElement>) => {
    if (!onOk) {
      return
    }

    let returnValue: void | Promise<void>
    returnValue = onOk(e)

    if (returnValue && typeof returnValue.then === 'function') {
      setLoading(true)
      try {
        await returnValue
        setLoading(false)
        if (onCancel) {
          onCancel(e)
        }
      } catch (e) {
        setLoading(false)
        console.error(e)
        throw e
      }
    } else if (onCancel) {
      onCancel(e)
    }
  }

  const onTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (!isOpen && e.target === e.currentTarget) {
      afterClose?.()
    }
  }

  return (
    <RootContainer
      className={`compass-modal ${className || ''}`}
      $visible={isOpen}
      style={style}
      role="dialog"
      aria-modal="true"
      {...res}
    >
      {maskVisible && (
        <Mask
          className="compass-modal-mask"
          onClick={onCancel}
          aria-hidden="true"
          $visible={isOpen}
        />
      )}
      <ModalContent
        className="compass-modal-content"
        $visible={isOpen}
        $width={props.width}
        onTransitionEnd={onTransitionEnd}
      >
        {(title || closable) && (
          <Header className="compass-modal-header">
            <Title className="compass-modal-title">{title}</Title>
            {closable && (
              <CloseBtn
                className="compass-modal-close"
                onClick={onCancel}
                aria-label="Close"
                variant="text"
                shape="circle"
                icon={<CloseIcon />}
              />
            )}
          </Header>
        )}
        <div className="compass-modal-body">{children}</div>
        {footer === undefined ? (
          <Footer className="compass-modal-footer">
            <StyledButton onClick={onCancel} aria-label="Close modal">
              {cancelText}
            </StyledButton>
            <StyledButton
              onClick={handleOk}
              style={{ marginLeft: 12 }}
              variant="primary"
              loading={confirmLoading || loading}
            >
              {okText}
            </StyledButton>
          </Footer>
        ) : (
          footer
        )}
      </ModalContent>
    </RootContainer>
  )
}

const Modal = (props: ModalBaseProps) => {
  const { children, ...res } = props

  return ReactDOM.createPortal(<BaseModal {...res}>{children}</BaseModal>, document.body)
}

export default Modal
