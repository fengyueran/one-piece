import styled from 'styled-components';
import { Loading } from '../components';

const Container = styled.div``;

export const LoadingExample = () => {
  return (
    <Container>
      <Loading tip="加载中..." />
    </Container>
  );
};
