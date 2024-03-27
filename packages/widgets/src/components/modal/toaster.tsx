import styled from 'styled-components';

import { AnimatedModal, ModalBaseProps } from '../modal';

const Space = styled.div``;

interface Props {
  size: number;
}

export const Toaster = (props: ModalBaseProps) => {
  return <AnimatedModal {...props} />;
};
