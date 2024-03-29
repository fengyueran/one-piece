import { useRef, useEffect } from 'react';
import styled from 'styled-components';

import { AtomosViewer } from '../core';

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

const fetchFile = async (url: string) => {
  const res = await fetch(url);
  const text = await res.text();
  return text;
};

export const App = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const start = async () => {
      const data = await fetchFile('atom.pdb');
      const container = canvasRef.current!;

      const viewer = new AtomosViewer(container, {});
      viewer.render(data);
    };
    start();
  }, []);

  return (
    <Container>
      <Canvas ref={canvasRef} />;
    </Container>
  );
};
