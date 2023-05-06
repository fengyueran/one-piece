import { useState } from 'react';

import { getDicom } from './get-resource';
import { DicomViewerContainer } from '../dicom-viewer-container';

export const App = () => {
  const [visible, setVisible] = useState(true);
  return (
    <div>
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
      <div style={{ width: '500px', height: '500px', margin: 50 }}>
        {visible && <DicomViewerContainer getDicom={getDicom} />}
      </div>
    </div>
  );
};
