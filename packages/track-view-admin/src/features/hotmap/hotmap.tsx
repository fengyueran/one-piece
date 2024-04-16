import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Heatmap from 'heatmap.js';

const RootContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;

const Iframe = styled.iframe`
  width: 100vw;
  height: 100vh;
  position: relative;
`;

const Canvas = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

interface Props {
  data?: { x: number; y: number; value: number }[];
}

export const Hotmap = (props: Props) => {
  const { data } = props;
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
        min: 0,
        max: 50,
        data,
      });
    }
  }, [data]);

  return (
    <RootContainer ref={canvas}>
      热力图区域
      <Iframe
        src="http://localhost:7917"
        id="12123"
        onLoad={(e) => {
          console.log('11111', e.target.contentDocument);
        }}
      >
        <Canvas />
      </Iframe>
    </RootContainer>
  );
};
