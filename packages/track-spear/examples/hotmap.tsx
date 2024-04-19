import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Heatmap from 'heatmap.js';

import { Event, MessageType } from '../src';
import { makeHotmapData } from './helper';

const RootContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
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
    const run = async () => {
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
        const data = await makeHotmapData(points);

        map.setData({
          min: 1,
          max: 1,
          data,
        });
      }
    };
    run();
  }, [dimensions]);

  useLayoutEffect(() => {
    window.addEventListener('message', function (event) {
      if (event.data.type === MessageType.IframeDimensions) {
        const { width, height } = event.data;
        setDimensions([width, height]);
      }
    });
  }, []);

  return (
    <RootContainer>
      <Iframe src="http://localhost:7122" />
      <CanvasWrapper>
        <Canvas ref={canvas} style={{ width: dimensions[0], height: dimensions[1] }} />
      </CanvasWrapper>
    </RootContainer>
  );
};
