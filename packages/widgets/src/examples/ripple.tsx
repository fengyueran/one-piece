import styled from 'styled-components';

import { Button } from '../components';

const ButtonContainer = styled(Button)`
  width: 200px;
  height: 50px;
  background-color: #fff;
`;

export const RippleExample = () => {
  return (
    <ButtonContainer
      loading
      onClick={() => {
        console.log('Ripple btn click');
      }}
    >
      Ripple btn
    </ButtonContainer>
  );
};
