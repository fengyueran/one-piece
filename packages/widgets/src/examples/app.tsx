import styled from 'styled-components';
import { DropdownExample } from './dropdown';
// import { LoadingExample } from './loading';
// import { UseAsyncExample } from './use-async';
// import { UseAsyncFnExample } from './use-async-fn';
import { TabsExample } from './tabs';
import { ButtonExample } from './button';
import { CircularSpinExample } from './circular-spin';
import { ModalExample } from './modal';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 10vw 0 0 10vw;
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
`;

export const App = () => {
  return (
    <Container>
      <TabsExample />
      {/* <LoadingExample /> */}
      <DropdownExample />
      {/* <UseAsyncFnExample />
      <UseAsyncExample /> */}
      <ButtonExample />
      <CircularSpinExample />
      <ModalExample />
    </Container>
  );
};
