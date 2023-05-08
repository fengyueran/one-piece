import React from 'react';
import { createPortal } from 'react-dom';
import ReactDOM from 'react-dom/client';
import styled from 'styled-components';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  background: rgba(0, 0, 0, 0.2);
  position: absolute;
  z-index: 99999;
  color: #fff;
`;

interface Props {
  loading: boolean;
}

export const Loading: React.FC<Props> = ({ loading }) => {
  if (!loading) return null;
  return <Container>加载中...</Container>;
};

const CONTAINER_ID = 'react-portal-wrapper';

const createWrapperAndAppendToBody = () => {
  let wrapperElement = document.getElementById(CONTAINER_ID);
  if (!wrapperElement) {
    wrapperElement = document.createElement('div');
    wrapperElement.setAttribute('id', CONTAINER_ID);
    document.body.appendChild(wrapperElement);
  }

  return wrapperElement;
};

export const showLoading = () => {
  const wrapperElement = createWrapperAndAppendToBody();
  const root = ReactDOM.createRoot(wrapperElement);
  root.render(createPortal(<Loading loading />, wrapperElement));
};

export const destroyLoading = () => {
  const wrapperElement = document.getElementById(CONTAINER_ID);

  if (wrapperElement) {
    wrapperElement.parentNode?.removeChild(wrapperElement);
  }
};
