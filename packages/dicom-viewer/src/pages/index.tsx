import React from 'react';
import styled from 'styled-components';

import { LocaleSwitch } from 'src/features';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
`;

export const IndexPage = () => {
  return (
    <Container>
      <LocaleSwitch />
    </Container>
  );
};
