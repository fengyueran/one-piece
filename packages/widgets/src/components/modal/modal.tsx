import ReactDOM from 'react-dom';

import { BaseModal, ModalBaseProps } from './base-modal';

export const Modal = (props: ModalBaseProps) => {
  const { children, ...res } = props;

  return ReactDOM.createPortal(
    <BaseModal {...res}>{children}</BaseModal>,
    document.body
  );
};
