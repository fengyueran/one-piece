import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { getSeriesDicom } from './get-resource';
import { showLoading, destroyLoading } from './loading';
import { MPR, Plane, MprState } from '../';

const Container = styled.div`
  width: calc(100vw - 100px);
  height: calc(100vh - 100px);
`;

export const App = () => {
  const [visible, setVisible] = useState(true);

  const onStateChange = useCallback((data: any) => {
    if (data.state === MprState.Ready) {
      destroyLoading();
    }
  }, []);

  useEffect(() => {
    showLoading();
  }, []);

  return (
    <Container>
      <button
        onClick={() => {
          setVisible(true);
        }}
      >
        load
      </button>
      <button
        onClick={() => {
          setVisible(false);
        }}
      >
        unload
      </button>

      {visible && (
        <MPR
          // planes={[Plane.Axial]}
          getSeriesDicom={getSeriesDicom}
          onStateChange={onStateChange}
        />
      )}
    </Container>
  );
};
