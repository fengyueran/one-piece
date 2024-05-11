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

const Tool = styled.div`
  position: absolute;
  top: 0;
  right: 0px;
`;

const Buttonn = styled.button`
  width: 60px;
  height: 40px;
`;

export const App = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const viewerRef = useRef<AtomosViewer>();

  useEffect(() => {
    const start = async () => {
      const container = canvasRef.current!;

      viewerRef.current = new AtomosViewer(container, {});
      viewerRef.current.addTrajectory('dump.lammpstrj', Trajectory.Lammps);
      viewerRef.current.play();
      // viewer.render();
      // viewer.zoomToFitScene();
    };
    start();
  }, []);

  return (
    <Container>
      <Content>
        <Canvas ref={canvasRef} />
        <Tool>
          <Buttonn
            onClick={() => {
              viewerRef.current?.pause();
            }}
          >
            暂停
          </Buttonn>
          <Buttonn
            onClick={() => {
              viewerRef.current?.resume();
            }}
          >
            播放
          </Buttonn>

          <Buttonn
            onClick={() => {
              viewerRef.current?.dispose();
              viewerRef.current = undefined;
            }}
          >
            卸载
          </Buttonn>
          <Buttonn
            onClick={() => {
              viewerRef.current?.play();
            }}
          >
            重播
          </Buttonn>
        </Tool>
      </Content>
    </Container>
  );
};
