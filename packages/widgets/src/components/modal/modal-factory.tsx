import React from 'react';
import { createRoot } from 'react-dom/client';

import { ModalWithTransition } from './modal-with-transition';

interface ModalFuncProps {
  title?: React.ReactNode;
  content?: React.ReactNode;
}

export const modalInfo = (props: ModalFuncProps) => {
  const mountNode = document.createElement('div');
  document.body.appendChild(mountNode);

  const config = {
    ...props,
    isOpen: true,
    onOk: () => {
      destroy();
    },
    onClose: () => {
      destroy();
    },
  };

  const root = createRoot(mountNode);

  const destroy = () => {
    if (mountNode.parentNode) {
      mountNode.parentNode.removeChild(mountNode);
    }
  };
  root.render(<ModalWithTransition {...config} />);
};
