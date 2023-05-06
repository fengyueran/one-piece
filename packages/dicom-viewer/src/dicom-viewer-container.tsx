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
  const [physicalPerPixel, setPhysicalPerPixel] = useState<number>();

  const { getDicom } = props;

  useEffect(() => {
    const start = async () => {
      const handlerMap = {
        [State.Ready]: () => setViewerReady(true),
        [State.PhysicalPerPixel]: (data: { state: State; value?: number }) =>
          setPhysicalPerPixel(data.value),
      };
      dicomManager.render(getDicom, (data) => {
        const handler = handlerMap[data.state];
        if (handler) {
          handler(data);
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

  const scaleStyle = {
    right: '8px',
    bottom: '4px',
    zIndex: 5,
    position: 'absolute',
  };

  return (
    <DicomViewer
      attachParent={dicomManager.attachParent}
      attachInput={dicomManager.attachInput}
      detachParent={dicomManager.detachParent}
      detachInput={dicomManager.detachInput}
      scaleStyle={scaleStyle}
      overlayData={getOverlayData()}
      physicalPerPixel={physicalPerPixel}
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
