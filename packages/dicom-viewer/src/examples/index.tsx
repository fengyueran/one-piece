import ReactDOM from 'react-dom/client';

import { getDicom } from './get-resource';
import { DicomViewerContainer } from '../dicom-viewer-container';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <div style={{ width: '500px', height: '500px', margin: 50 }}>
    <DicomViewerContainer getDicom={getDicom} />
  </div>
);
