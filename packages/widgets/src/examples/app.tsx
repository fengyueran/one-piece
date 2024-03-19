import styled from 'styled-components';
// import { DropdownExample } from './dropdown';
// import { LoadingExample } from './loading';
// import { UseAsyncExample } from './use-async';
// import { UseAsyncFnExample } from './use-async-fn';
// import { TabsExample } from './tabs';
import { RippleExample } from './ripple';
import { CircularSpinExample } from './circular-spin';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  margin: 10vw 0 0 10vw;
`;

export const App = () => {
  return (
    <Container>
      {/* <TabsExample /> */}
      {/* <LoadingExample /> */}
      {/* <DropdownExample />
      <UseAsyncFnExample />
      <UseAsyncExample /> */}
      <RippleExample />
      <CircularSpinExample />
    </Container>
  );
};
