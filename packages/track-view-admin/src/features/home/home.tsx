import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const RootContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;

const Toolbar = styled.div``;

const Card = styled.div`
  width: 280px;
  height: 200px;
  border: 1px solid;
`;

interface Props {
  pv?: number;
  uv?: number;
}

export const Home = (props: Props) => {
  const { pv, uv } = props;
  const navigate = useNavigate();
  return (
    <RootContainer className="home-container">
      <Toolbar>
        <button
          onClick={() => {
            navigate('hotmap');
          }}
        >
          跳转到hotmap
        </button>
      </Toolbar>
      <Card>
        <div> pv: {pv}</div>
        <div> uv: {uv}</div>
      </Card>
    </RootContainer>
  );
};
