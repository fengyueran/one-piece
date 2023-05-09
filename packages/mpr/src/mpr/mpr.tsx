import React from 'react';
import styled from 'styled-components';

const Row = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

const Container = styled(Row)`
  width: 100%;
  height: 100%;
  background: #000;
  display: grid;
  grid-template-columns: 63% 37%;
  grid-template-rows: 100%;
  grid-template-areas:
    'a b'
    '. c';
`;

const AxialWrapper = styled.div`
  height: 100%;
`;

const SagittalAndCoronal = styled(Col)`
  height: 100%;
`;

const SagittalWrapper = styled.div`
  width: 100%;
  height: 50%;
`;
const CoronalWrapper = styled.div`
  width: 100%;
  height: 50%;
`;

interface Props {
  children: (React.ReactElement | undefined)[];
}

export const MPR: React.FC<Props> = (props) => {
  const { children } = props;

  return (
    <Container>
      <AxialWrapper>{children[0]}</AxialWrapper>
      <SagittalAndCoronal>
        <SagittalWrapper>{children[1]}</SagittalWrapper>
        <CoronalWrapper>{children[2]}</CoronalWrapper>
      </SagittalAndCoronal>
    </Container>
  );
};
