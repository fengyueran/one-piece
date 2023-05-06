import { useEffect, useState } from 'react';
import { uicomponents } from '@cc/viewers-dvtool';
import { DicomViewer } from './dicom-viewer';

import { dicomManager, GetDicom, State } from './dicom-manager';

interface Props {
  getDicom: GetDicom;
}

const { OverlayDirection } = uicomponents;

const getOverlayData = () => {
  const overlayData: any = { directionData: [] };
  overlayData.directionData[OverlayDirection.RightTop] = [`kVp: ${'-'}`];
  return overlayData;
};

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
      overlayData={getOverlayData()}
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
