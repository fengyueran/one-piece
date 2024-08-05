import { useRef, useEffect } from 'react';
import styled from 'styled-components';

import { AtomosViewer, ModelType, CameraType } from '../viewer';

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
  padding: 12px 16px;
  margin: 0 2px;
`;

export const App = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const viewerRef = useRef<AtomosViewer>();

  useEffect(() => {
    const start = async () => {
      const container = canvasRef.current!;

      viewerRef.current = new AtomosViewer(container, {
        // camera: CameraType.Perspective,
        axesHelper: true,
        boundingBox: true,
        // clearColor: '#fff',
      });
      const data = await (await fetch('atom.pdb')).text();
      viewerRef.current?.addModel(data, ModelType.Pdb);
      viewerRef.current?.render();
      viewerRef.current?.zoomToFitScene();
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
          <Buttonn
            onClick={async () => {
              viewerRef.current?.dispose();
              const container = canvasRef.current!;
              viewerRef.current = new AtomosViewer(container, {
                camera: CameraType.Perspective,
              });
              const data = await (await fetch('atom.pdb')).text();
              viewerRef.current?.addModel(data, ModelType.Pdb);
              viewerRef.current?.render();
              viewerRef.current?.zoomToFitScene();
            }}
          >
            渲染PLB文件
          </Buttonn>
          <Buttonn
            onClick={async () => {
              viewerRef.current?.dispose();
              const container = canvasRef.current!;
              viewerRef.current = new AtomosViewer(container, {
                camera: CameraType.Perspective,
              });
              viewerRef.current.addTrajectory(
                'dump.lammpstrj',
                ModelType.LammpsTrajectory
              );
              viewerRef.current.play();
            }}
          >
            播放轨迹文件
          </Buttonn>
        </Tool>
      </Content>
    </Container>
  );
};
