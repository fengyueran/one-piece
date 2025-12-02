import Modal from './modal'
import confirm, { info, success, error, warning } from './confirm'
import useModal from './use-modal'

export type { ModalBaseProps as ModalProps } from './types'

type ModalType = typeof Modal & {
  info: typeof info
  success: typeof success
  error: typeof error
  warning: typeof warning
  confirm: typeof confirm
  useModal: typeof useModal
}

const ModalWithStatics = Modal as ModalType
ModalWithStatics.info = info
ModalWithStatics.success = success
ModalWithStatics.error = error
ModalWithStatics.warning = warning
ModalWithStatics.confirm = confirm
ModalWithStatics.useModal = useModal

export default ModalWithStatics
