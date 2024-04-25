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
  width: 800px;
  height: 800px;
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
      const data = await fetchFile('atoms.pdb');
      const container = canvasRef.current!;

      const viewer = new AtomosViewer(container, {});
      viewer.render(data);
      viewer.zoomToFitScene();
      setInterval(() => {
        viewer.atoms.forEach((atom) => {
          const mesh = atom.getMesh();
          mesh.position.set(
            atom.position.x + Math.random(),
            atom.position.y + Math.random(),
            atom.position.z + Math.random()
          );
        });
      }, 500);
    };
    start();
  }, []);

  return (
    <Container>
      <Canvas ref={canvasRef} />;
    </Container>
  );
};
