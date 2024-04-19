import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Heatmap from 'heatmap.js';

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

interface ClickEvent {
  metaData: {
    selectorPath: string;
    offsetXPercent: number;
    offsetYPercent: number;
  };
}

interface Props {
  dimensions: number[];
  data?: { x: number; y: number; value: number }[];
}

export const Hotmap = (props: Props) => {
  const { data, dimensions } = props;
  const canvas = useRef(null);

  useEffect(() => {
    if (data) {
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

      map.setData({
        min: 1,
        max: 1,
        data,
      });
    }
  }, [data]);

  return (
    <RootContainer>
      <Iframe id="__HotmapBase__" src="http://localhost:7917" />
      <CanvasWrapper>
        <Canvas
          ref={canvas}
          style={{ width: dimensions[0], height: dimensions[1] }}
        />
      </CanvasWrapper>
    </RootContainer>
  );
};
