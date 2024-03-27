import React from 'react';
import { createRoot } from 'react-dom/client';

import { AnimatedModal } from './animated-modal';
import { ModalBaseProps } from './base-modal';

interface ModalFuncProps extends ModalBaseProps {
  title?: React.ReactNode;
  content?: React.ReactNode;
}

export const renderModal = (props: ModalFuncProps) => {
  const mountNode = document.createElement('div');
  document.body.appendChild(mountNode);

  const destroy = () => {
    if (mountNode.parentNode) {
      mountNode.parentNode.removeChild(mountNode);
    }
  };
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

  root.render(<AnimatedModal {...config} />);
};

export const renderToaster = (props: ModalFuncProps) => {
  renderModal(props);
};

export enum ModalType {
  Message,
}

class ModalFactory {
  static createModal(type: ModalType) {
    if (type === ModalType.Message) {
      return (props: ModalFuncProps) => {
        renderModal({ ...props, footer: null });
      };
    } else {
      throw new Error(`Modal type '${type}' is not supported by the factory.`);
    }
  }
}
