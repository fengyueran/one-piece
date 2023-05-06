import { useEffect, useMemo, useRef, useState } from 'react';
import { uicomponents } from '@cc/viewers-dvtool';
import * as ccloader from '@cc/loader';
import { DicomViewer } from './dicom-viewer';

import { dicomManager, GetDicom, State, DicomInfo } from './dicom-manager';

interface Props {
  getDicom: GetDicom;
}

const { OverlayDirection } = uicomponents;

const getOverlayData = () => {
  const overlayData: any = { directionData: [] };
  overlayData.directionData[OverlayDirection.RightTop] = [`kVp: ${'-'}`];
  return overlayData;
};

const scaleStyle = {
  right: '8px',
  bottom: '4px',
  zIndex: 5,
  position: 'absolute',
};

export const DicomViewerContainer: React.FC<Props> = (props) => {
  const dicomInfoRef = useRef({});
  const [viewerReady, setViewerReady] = useState(false);
  const [crosshair, setCrosshair] =
    useState<ccloader.image.SliceIndexAndCoords2D>({
      sliceIndex: 0,
      indexCoords: [0, 0],
    });
  const [physicalPerPixel, setPhysicalPerPixel] = useState<number>();

  const { getDicom } = props;

  const scrollBarProps = useMemo(() => {
    const basicInfo = dicomInfoRef.current as DicomInfo;
    return {
      crosshair,
      count: basicInfo.spaceInfo?.count,
    };
  }, [crosshair]);

  useEffect(() => {
    const start = async () => {
      const handlerMap = {
        [State.Init]: (data: { state: State; value?: object }) => {
          dicomInfoRef.current = data.value as DicomInfo;
        },
        [State.Ready]: () => setViewerReady(true),
        [State.PhysicalPerPixel]: (data: { state: State; value?: number }) =>
          setPhysicalPerPixel(data.value),
        [State.Crosshair]: (data: {
          state: State;
          value?: ccloader.image.SliceIndexAndCoords2D;
        }) => {
          setCrosshair(data.value as ccloader.image.SliceIndexAndCoords2D);
        },
      };
      dicomManager.render(getDicom, (data) => {
        const handler = handlerMap[data.state as keyof typeof handlerMap];
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

  return (
    <DicomViewer
      attachParent={dicomManager.attachParent}
      attachInput={dicomManager.attachInput}
      detachParent={dicomManager.detachParent}
      detachInput={dicomManager.detachInput}
      scaleStyle={scaleStyle}
      overlayData={getOverlayData()}
      physicalPerPixel={physicalPerPixel}
      scrollBarProps={scrollBarProps}
      setCrosshair={dicomManager.setCrosshair}
    />
  );
};
