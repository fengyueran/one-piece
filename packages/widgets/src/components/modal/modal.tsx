import React from 'react';
import ReactDOM from 'react-dom';
import styled, { css } from 'styled-components';

const fadeIn = css`
  opacity: 1;
  visibility: visible;
`;

const fadeOut = css`
  opacity: 0;
  visibility: hidden;
  transition: visibility 0s linear 500ms, opacity 500ms;
`;

const RootContainer = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 500ms, visibility 500ms;
  ${(props) => (props.$visible ? fadeIn : fadeOut)}
`;

const ModalContent = styled.div<{ $visible: boolean }>`
  background: white;
  padding: 20px;
  border-radius: 4px;
  max-width: 500px;
  width: 100%;
  transition: transform 500ms;
  ${(props) =>
    props.$visible
      ? `  transform: translateY(0)`
      : `  transform: translateY(-20px)`}
`;

interface Props {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
}

export const Modal = (props: Props) => {
  const { isOpen, onClose, children } = props;

  return ReactDOM.createPortal(
    <RootContainer
      $visible={isOpen}
      className="modal-overlay"
      onClick={onClose}
    >
      <ModalContent className="modal-content" $visible={isOpen}>
        {children}
        <button onClick={onClose}>Close</button>
      </ModalContent>
    </RootContainer>,
    document.body
  );
};
