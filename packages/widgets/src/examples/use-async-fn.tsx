import styled from 'styled-components';
import { useAsyncFn } from '../hooks';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  margin: 10vw 0 0 10vw;
`;

const delay = () =>
  new Promise((reslove) => {
    setTimeout(() => {
      reslove(1);
    }, 3000);
  });

export const UseAsyncFnExample = () => {
  const [state, doFetch] = useAsyncFn(async () => {
    await delay();
    // throw new Error('test');
    return 3;
  }, []);

  return (
    <Container>
      <button onClick={doFetch}>useAsyncFn</button>
      {state.loading && <p>Loading...</p>}
      {state.error && <p>Error: {state.error.message}</p>}
      {state.value && <p>Data: {state.value}</p>}
    </Container>
  );
};
