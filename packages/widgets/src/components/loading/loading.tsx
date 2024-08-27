import ReactDOM from 'react-dom';
import ReactDOMClient from 'react-dom/client';
import styled from 'styled-components';

import { Spin, Size } from './spin';
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
  z-index: 100000;
`;

const Tip = styled.span`
  color: #3e7fee;
`;

interface LoadingProps {
  className?: string;
  tip?: string | React.ReactNode;
  spinSize?: Size;
}

export const Loading = (props: LoadingProps) => {
  const { tip, className, spinSize } = props;
  return (
    <RootContainer className={className}>
      <Spin size={spinSize} />
      {tip && <Tip>{tip}</Tip>}
    </RootContainer>
  );
};

export const openLoading = (props: LoadingProps = {}) => {
  const container = document.createElement('div');
  container.id = '__loading-container__';
  document.body.appendChild(container);
  const Node = ReactDOM.createPortal(<Loading {...props} />, container);
  ReactDOMClient.createRoot(container).render(Node);
};

export const closeLoading = () => {
  const container = document.getElementById('__loading-container__');
  if (container) {
    document.body.removeChild(container);
  }
};
