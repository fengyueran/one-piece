import { useState } from 'react';
// import styled from 'styled-components';

import { Modal, toaster } from '../components';
// import { modalInfo } from '../components/modal/modal-factory';

export const ModalExample = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button
        onClick={() => {
          toaster.info({
            title: 'Info',
            content: 'This is an info modal',
            style: { color: 'red' },
          });
        }}
      >
        toaster.info
      </button>
      <button onClick={openModal}>Open Modal</button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2>Modal Title</h2>
        <p>This is a modal window. You can do anything here, like:</p>
        <ul>
          <li>Display a message</li>
          <li>Show a form</li>
          <li>Or anything else.</li>
        </ul>
      </Modal>
    </div>
  );
};
