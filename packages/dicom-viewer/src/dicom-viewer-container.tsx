import { useEffect, useState } from 'react';
import { DicomViewer } from './dicom-viewer';

import { dicomManager, GetDicom, State } from './dicom-manager';

interface Props {
  getDicom: GetDicom;
}
export const DicomViewerContainer: React.FC<Props> = (props) => {
  const [viewerReady, setViewerReady] = useState(false);
  const { getDicom } = props;

  useEffect(() => {
    const start = async () => {
      dicomManager.render(getDicom, (data) => {
        if (data.state === State.Ready) {
          setViewerReady(true);
        }
      });
    };
    start();
  }, [getDicom]);

  const renderBackgroud = () => {
    return (
      <div
        style={{ backgroundColor: 'black', width: '100%', height: '100%' }}
      />
    );
  };

  if (!viewerReady) {
    return renderBackgroud();
  }

  const scaleStyle = {};

  return (
    <DicomViewer
      attachParent={dicomManager.attachParent}
      attachInput={dicomManager.attachInput}
      detachParent={dicomManager.detachParent}
      detachInput={dicomManager.detachInput}
      scaleStyle={scaleStyle}
      // overlayData={overlayVisible ? overlayData : undefined}
      // physicalPerPixel={overlayVisible ? physicalPerPixel : undefined}
      scrollBarProps={{
        crosshair: { sliceIndex: 10, indexCoords: [10, 10] },
        count: 100,
      }}
      setCrosshair={() => {
        console.log('99');
      }}
    />
  );
};
