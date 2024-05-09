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

const Content = styled.div`
  width: 800px;
  height: 800px;
  margin: auto;
  background: #6395c4;
  position: relative;
`;

const Canvas = styled.div`
  width: 800px;
  height: 800px;
`;

const StopBtn = styled.button`
  width: 100px;
  height: 40px;
  position: absolute;
  top: 0;
  right: -100px;
`;

const ResumeBtn = styled(StopBtn)`
  right: -210px;
`;

export const App = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const viewerRef = useRef<AtomosViewer>();

  useEffect(() => {
    const start = async () => {
      const container = canvasRef.current!;

      const viewer = new AtomosViewer(container, {});
      viewerRef.current = viewer;
      viewer.addTrajectory('dump.lammpstrj', Trajectory.Lammps);
      viewer.play();
      // viewer.render();
      // viewer.zoomToFitScene();
    };
    start();
  }, []);

  return (
    <Container>
      <Content>
        <Canvas ref={canvasRef} />
        <StopBtn
          onClick={() => {
            viewerRef.current?.pause();
          }}
        >
          暂停
        </StopBtn>
        <ResumeBtn
          onClick={() => {
            viewerRef.current?.resume();
          }}
        >
          播放
        </ResumeBtn>
      </Content>
    </Container>
  );
};
