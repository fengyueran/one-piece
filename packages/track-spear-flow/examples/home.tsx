import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import { init, reportEvent } from '../src';

init({ userId: '1', userName: 'name' });

const RootContainer = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 100px;
`;

const Toolbar = styled.div`
  position: fixed;
`;

const Content = styled.div`
  height: 300px;
  border: 1px solid;
`;

export const Home = () => {
  const navigate = useNavigate();
  return (
    <RootContainer className="home-container">
      <div
        onClick={() => {
          reportEvent({ type: 'Logo_Click', metaData: { count: 1 } });
        }}
      >
        logo
      </div>
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
        <button>click me1</button>
        <button>click me2</button>
        <button>click me3</button>
      </Toolbar>
      <Content>点击测试区域</Content>
    </RootContainer>
  );
};
