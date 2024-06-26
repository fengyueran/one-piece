import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import TrackSpear, { EventType, Event } from '../src';

const RootContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;

const Toolbar = styled.div`
  padding: 100px;
`;

const Content = styled.div``;

export const Home = () => {
  const navigate = useNavigate();

  const pointsRef = useRef<Event[]>([]);
  useEffect(() => {
    new TrackSpear({ userId: '1', userName: 'test' }, (event) => {
      console.log('event', event);
      if (event.type === EventType.Click) {
        pointsRef.current.push(event);
      }
    });
  }, []);

  return (
    <RootContainer className="home-container">
      <Toolbar>
        <button style={{ padding: 20 }}>click me</button>
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

        <button
          onClick={() => {
            navigate('hotmap', { state: { points: pointsRef.current } });
          }}
        >
          跳转到hotmap
        </button>
      </Toolbar>
      <Content>
        <button>click me1</button>
        <button>click me2</button>
      </Content>
    </RootContainer>
  );
};
