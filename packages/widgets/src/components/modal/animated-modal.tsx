import React, { useRef, useState, useEffect } from 'react';
import { Transition } from 'react-transition-group';

import { BaseModal, ModalBaseProps, AnimationDruation } from './base-modal';

export interface AnimatedModalProps extends ModalBaseProps {
  duration?: number; //ms
  title?: React.ReactNode;
  content?: React.ReactNode;
}

export const AnimatedModal = (props: AnimatedModalProps) => {
  const { duration, content, onClose: destroyModal, ...res } = props;
  const [visible, setVisible] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const closeModal = () => {
    setVisible(false);
  };

  const onExited = () => {
    if (destroyModal) {
      destroyModal();
    }
  };

  useEffect(() => {
    setVisible(true);
  }, []);

  useEffect(() => {
    if (duration) {
      timer.current = setTimeout(() => {
        setVisible(false);
      }, duration);
    }

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [duration]);

  return (
    <Transition in={visible} onExited={onExited} timeout={AnimationDruation}>
      <BaseModal {...res} isOpen={visible} onClose={closeModal}>
        {content}
      </BaseModal>
    </Transition>
  );
};
