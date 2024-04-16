import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Heatmap from 'heatmap.js';

import { Event } from '../src';

const RootContainer = styled.div`
  width: 800px;
  height: 600px;
  position: relative;
`;

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const CanvasWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: auto;
`;

const Canvas = styled.div``;

interface ClickEvent extends Event {
  metaData: { selectorPath: string; offsetXPercent: number; offsetYPercent: number };
}
export const Hotmap = () => {
  const canvas = useRef(null);
  const location = useLocation();

  const points = location.state.points as ClickEvent[];
  const [dimensions, setDimensions] = useState([]);

  useEffect(() => {
    if (dimensions.length) {
      const map = Heatmap.create({
        container: canvas.current!,
        radius: 20,
        maxOpacity: 0.9,
        minOpacity: 0,
        blur: 1,
        // gradient: {
        //   '.1': '#32A933',
        //   '.2': '#3ACB49',
        //   '.4': '#94E149',
        //   '.82': '#CDDE40',
        //   '1': '#ED6B44',
        // },
      });

      const data: { x: number; y: number; value: number }[] = [];
      points.map((event) => {
        const { selectorPath, offsetXPercent, offsetYPercent } = event.metaData;
        const iframe = document.getElementById('__hotmap_base__') as HTMLIFrameElement;
        const targetElement = iframe.contentDocument.querySelector(selectorPath);

        if (targetElement) {
          const box = targetElement.getBoundingClientRect();
          const { left, top, width, height } = box;
          const x = left + width * offsetXPercent;
          const y = top + height * offsetYPercent;

          data.push({ x: +x.toFixed(0), y: +y.toFixed(0), value: 1 });
        }
      });

      map.setData({
        min: 1,
        max: 1,
        data,
      });
    }
  }, [dimensions]);

  useLayoutEffect(() => {
    window.addEventListener('message', function (event) {
      if (event.data.type === 'iframeDimensions') {
        const { width, height } = event.data;
        setDimensions([width, height]);
      }
    });
  }, []);

  return (
    <RootContainer>
      <Iframe id="__hotmap_base__" src="http://localhost:7122" />
      <CanvasWrapper>
        <Canvas ref={canvas} style={{ width: dimensions[0], height: dimensions[1] }} />
      </CanvasWrapper>
    </RootContainer>
  );
};
