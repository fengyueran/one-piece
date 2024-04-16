import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Heatmap from 'heatmap.js';

import TrackSpear, { EventType } from '../src';

const RootContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;

const Toolbar = styled.div`
  position: fixed;
`;

const Content = styled.div`
  width: 200vw;
  height: 300px;
  border: 1px solid;
  overflow: auto;
`;

export const Home = () => {
  const canvas = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    const data = [] as any;
    const map = Heatmap.create({
      container: canvas.current,
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

    new TrackSpear({ userId: '1', userName: 'test' }, (event) => {
      console.log('event', event);
      if (event.type === EventType.Click) {
        const { selectorPath, offsetX, offsetY } = event.data as any;
        const targetElement = document.querySelector(selectorPath);
        if (targetElement) {
          const box = targetElement.getBoundingClientRect();
          const { left, top } = box;
          const x = left + offsetX;
          const y = top + offsetY;
          data.push({ x, y, value: 40 });
        }

        // map.addData({ x, y, value: 40 });
        map.setData({
          min: 0,
          max: 50,
          data,
        });
      }
    });
  }, []);

  return (
    <RootContainer className="home-container">
      <Toolbar>
        <button
          onClick={() => {
            navigate('page1');
          }}
        >
          跳转到page1
        </button>
        <button
          onClick={() => {
            navigate('page2');
          }}
        >
          跳转到page2
        </button>
        <button>click me</button>
      </Toolbar>

      <Content>点击测试区域</Content>
      <Content ref={canvas} />
    </RootContainer>
  );
};
