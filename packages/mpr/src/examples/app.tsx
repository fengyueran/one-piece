import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { getSeriesDicom } from './get-resource';
import { showLoading, destroyLoading } from './loading';
import {
  MPR,
  //  Plane,
  MprEvent,
  MprState,
  OpType,
} from '../';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

const Toolbar = styled.div`
  width: 100%;
  height: 40px;
`;

const MPRWrapper = styled.div`
  width: 100%;
  height: calc(100% - 40px);
`;

const wwAndwc = { windowWidth: 1500, windowCenter: 500 };

export const App = () => {
  const [visible, setVisible] = useState(true);
  const [reset, setReset] = useState<boolean>();
  const [opType, setOpType] = useState<OpType>();
  const [window, setWindow] = useState<any>();

  const onStateChange = useCallback((state: MprState) => {
    if (state.event === MprEvent.Ready) {
      destroyLoading();
    } else if (state.event === MprEvent.Error) {
      console.error(state.value);
    }
  }, []);

  useEffect(() => {
    showLoading();
  }, []);

  return (
    <Container>
      <Toolbar>
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
        <button
          onClick={() => {
            setOpType(OpType.Slice);
          }}
        >
          crosshair
        </button>
        <button
          onClick={() => {
            setOpType(OpType.Move);
          }}
        >
          move
        </button>
        <button
          onClick={() => {
            setReset(!reset);
          }}
        >
          reset
        </button>
        <button
          onClick={() => {
            setWindow(wwAndwc);
          }}
        >
          window
        </button>
      </Toolbar>
      <MPRWrapper>
        {visible && (
          <MPR
            reset={reset}
            opType={opType}
            window={window}
            // planes={[Plane.Axial]}
            getSeriesDicom={getSeriesDicom}
            onStateChange={onStateChange}
          />
        )}
      </MPRWrapper>
    </Container>
  );
};
