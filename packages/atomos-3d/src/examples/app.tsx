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
        camera: CameraType.Perspective,
      });
      viewerRef.current.addTrajectory(
        'dump.lammpstrj',
        ModelType.LammpsTrajectory
      );
      // viewerRef.current.addTrajectory(
      //   'https://ksefile.hpccube.com:65241/efile/openapi/v2/file/download?path=/public/home/acavq4nvvq/download-test/dump.lammpstrj',
      //   ModelType.LammpsTrajectory,
      //   {
      //     method: 'GET',
      //     headers: {
      //       token:
      //         'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wdXRlVXNlciI6ImFjYXZxNG52dnEiLCJhY2NvdW50U3RhdHVzIjoiVHJpYWwiLCJjcmVhdG9yIjoiYWMiLCJyb2xlIjoiMSIsImV4cGlyZVRpbWUiOiIxNzE1Nzg0Nzk3NzU3IiwiY2x1c3RlcklkIjoiMTEyNTAiLCJpbnZva2VyIjoiMGQ1ZDEyNDFjOGVmMWE3NWVmMTBiNWY1MmM5OGEwNGMiLCJ1c2VyIjoieGluZ2h1bm0iLCJ1c2VySWQiOiIxMjYzMTI5MzI0MSJ9.EFAilSsUWSewW3grJX4WilGvgpDYxknUS05RYB0ISwg',
      //     },
      //   }
      // );
      viewerRef.current.play();
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
        </Tool>
      </Content>
    </Container>
  );
};
