import { useRef, useEffect } from 'react';
import styled from 'styled-components';

import { AtomosViewer, Trajectory } from '../core';

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

export const App = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const start = async () => {
      const container = canvasRef.current!;

      const viewer = new AtomosViewer(container, {});

      viewer.addTrajectory('dump.lammpstrj', Trajectory.Lammps);
      viewer.play();
      // viewer.render();
      // viewer.zoomToFitScene();
    };
    start();
  }, []);

  return (
    <Container>
      <Canvas ref={canvasRef} />;
    </Container>
  );
};
