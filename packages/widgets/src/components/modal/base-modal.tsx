import React from 'react';
import styled, { css } from 'styled-components';

import { Button } from '../button';
import { Row } from '../flex-box';

export const AnimationDruation = 500; //ms

const fadeIn = css`
  opacity: 1;
  visibility: visible;
`;

const fadeOut = css`
  opacity: 0;
  visibility: hidden;
  transition: visibility 0s linear ${AnimationDruation}ms,
    opacity ${AnimationDruation}ms;
`;

const RootContainer = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  transition: opacity ${AnimationDruation}ms, visibility ${AnimationDruation}ms;
  ${(props) => (props.$visible ? fadeIn : fadeOut)}
`;

const ModalContent = styled.div<{ $visible: boolean }>`
  background: white;
  padding: 20px;
  border-radius: 6px;
  max-width: 500px;
  width: 100%;
  margin: auto;
  position: relative;
  top: 120px;
  transition: transform ${AnimationDruation}ms;
  ${(props) =>
    props.$visible
      ? `transform: translateY(0)`
      : `transform: translateY(-20px)`}
`;

const Footer = styled(Row)`
  width: 100%;
  justify-content: flex-end;
  margin-top: 12px;
`;

const StyledButton = styled(Button)`
  padding: 4px 18px;
  margin: 0;
`;

const CloseButton = styled(StyledButton)`
  background: none;
  color: #186bcc;
`;

export interface ModalBaseProps {
  isOpen: boolean;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  onClose: () => void;
}

export const BaseModal = (props: ModalBaseProps) => {
  const { isOpen, footer, onClose, children } = props;

  return (
    <RootContainer
      $visible={isOpen}
      className="modal-overlay"
      onClick={onClose}
    >
      <ModalContent className="modal-content" $visible={isOpen}>
        {children}
        <Footer>
          <CloseButton onClick={onClose}>Close</CloseButton>
          <StyledButton onClick={onClose} style={{ marginLeft: 12 }}>
            Ok
          </StyledButton>
        </Footer>
      </ModalContent>
    </RootContainer>
  );
};
