import styled from 'styled-components';

import { Button } from '../components';

const RootContainer = styled.div``;

const ButtonContainer = styled(Button)`
  width: 200px;
  height: 50px;
`;

export const ButtonExample = () => {
  return (
    <RootContainer>
      <ButtonContainer
        disabled
        onClick={() => {
          console.log('Disabled btn click');
        }}
      >
        Disabled btn
      </ButtonContainer>
      <ButtonContainer
        loading
        onClick={() => {
          console.log('Ripple btn click');
        }}
      >
        Ripple btn
      </ButtonContainer>
    </RootContainer>
  );
};
