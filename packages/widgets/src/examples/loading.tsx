import styled from 'styled-components';
import {
  Loading,
  // openLoading,
  // Size,
} from '../components';

const Container = styled.div``;

export const LoadingExample = () => {
  return (
    <Container>
      <Loading tip="加载中..." />
      {/* <button
        onClick={() => {
          openLoading({ tip: '测试loading', spinSize: Size.Small });
        }}
      >
        打开Loading
      </button> */}
    </Container>
  );
};
