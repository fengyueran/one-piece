import { useRef, useEffect } from 'react';
import styled from 'styled-components';

import { AtomosViewer } from '../core';
import { Reader } from './reader';

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

type AtomData = {
  id: number;
  element: string;
  x: number;
  y: number;
  z: number;
};

function convertToPDBFormat(atoms: AtomData[]): string[] {
  return atoms.map((atom) => {
    return (
      `ATOM  ${atom.id.toString().padStart(5)}  ${atom.element.padEnd(
        3
      )} UNK A   1   ` +
      `${atom.x.toFixed(3).padStart(8)}${atom.y.toFixed(3).padStart(8)}${atom.z
        .toFixed(3)
        .padStart(8)}  1.00  0.00`
    );
  });
}

const read = (url: string) =>
  new Promise((reslove) => {
    const reader = new Reader((frames) => {
      reslove(frames);
    });
    reader.fetchAndStream(url);
  });

export const App = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const start = async () => {
      const container = canvasRef.current!;

      const viewer = new AtomosViewer(container, {});

      const frames = await read('dump.lammpstrj');
      let frameIndex = 0;

      const run = () => {
        const newAtoms = frames[frameIndex];
        viewer.atoms.forEach((atom, index) => {
          const mesh = atom.getMesh();
          const newAtom = newAtoms[index];
          mesh.position.set(newAtom.x, newAtom.y, newAtom.z);
        });
        frameIndex++;
      };

      setInterval(() => {
        run();
      }, 200);

      viewer.addTrajectory(frames[0]);

      viewer.render();
      viewer.zoomToFitScene();
    };
    start();
  }, []);

  return (
    <Container>
      <Canvas ref={canvasRef} />;
    </Container>
  );
};
