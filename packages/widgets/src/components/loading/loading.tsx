import ReactDOM from 'react-dom';
import ReactDOMClient from 'react-dom/client';
import styled from 'styled-components';

import { Spin } from './spin';
import { Col } from '../flex-box';

const RootContainer = styled(Col)`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.1);
`;

const Tip = styled.span`
  color: #3e7fee;
`;

interface Props {
  tip?: string;
}

export const Loading = (props: Props) => {
  const { tip } = props;
  return (
    <RootContainer>
      <Spin />
      {tip && <Tip>{tip}</Tip>}
    </RootContainer>
  );
};

export const openLoading = () => {
  const container = document.createElement('div');
  container.id = '__loading-container__';
  document.body.appendChild(container);
  const Node = ReactDOM.createPortal(<Loading />, container);
  ReactDOMClient.createRoot(container).render(Node);
};

export const closeLoading = () => {
  const container = document.getElementById('__loading-container__');
  if (container) {
    document.body.removeChild(container);
  }
};
