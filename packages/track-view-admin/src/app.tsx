import { useRef, useEffect } from 'react';
import styled from 'styled-components';

import * as apis from './apis';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  * {
    box-sizing: border-box;
  }
`;

const Canvas = styled.div`
  width: 500px;
  height: 300px;
  margin: auto;
  background: #6395c4;
`;

const fetchEvents = async () => {
  const text = await apis.fetchEvents();
  return text;
};

export const App = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchEvents();
  }, []);
  return (
    <Container>
      <Canvas ref={canvasRef} />;
    </Container>
  );
};
