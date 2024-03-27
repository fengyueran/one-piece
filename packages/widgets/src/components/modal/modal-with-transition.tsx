import React, { useState, useEffect } from 'react';
import { Transition } from 'react-transition-group';

import { BaseModal, ModalBaseProps, AnimationDruation } from './base-modal';

interface ModalFuncProps extends ModalBaseProps {
  title?: React.ReactNode;
  content?: React.ReactNode;
}

export const ModalWithTransition = (props: ModalFuncProps) => {
  const { content, onClose: destroyModal, ...res } = props;
  const [visible, setVisible] = useState(false);

  const closeModal = () => {
    setVisible(false);
  };

  const onExited = () => {
    destroyModal();
  };

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <Transition in={visible} onExited={onExited} timeout={AnimationDruation}>
      <BaseModal {...res} isOpen={visible} onClose={closeModal}>
        {content}
      </BaseModal>
    </Transition>
  );
};
