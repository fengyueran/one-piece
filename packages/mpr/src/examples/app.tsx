import { useState } from 'react';
import styled from 'styled-components';

import { getSeriesDicom } from './get-resource';
import { MPR, Plane } from '../';

const Container = styled.div`
  width: calc(100vw - 100px);
  height: calc(100vh - 100px);
`;

export const App = () => {
  const [visible, setVisible] = useState(true);
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
          planes={[Plane.Axial, Plane.Sagittal, Plane.Coronal]}
          getSeriesDicom={getSeriesDicom}
        />
      )}
    </Container>
  );
};
