import { useEffect, useMemo, useState } from 'react';
import { uicomponents } from '@cc/viewers-dvtool';
import * as ccloader from '@cc/loader';
import { DicomViewer } from './dicom-viewer';

import { State, DicomManager } from './dicom-manager';

interface Props {
  dicomManager: DicomManager;
}

const { OverlayDirection } = uicomponents;

const scaleStyle = {
  right: '8px',
  bottom: '4px',
  zIndex: 5,
  position: 'absolute',
};

export const DicomViewerContainer: React.FC<Props> = (props) => {
  const { dicomManager } = props;
  const [viewerReady, setViewerReady] = useState(dicomManager.getReady());
  const [crosshair, setCrosshair] =
    useState<ccloader.image.SliceIndexAndCoords2D>(dicomManager.getCrosshair());
  const [physicalPerPixel, setPhysicalPerPixel] = useState<number>();

  const getOverlayData = () => {
    const d: uicomponents.OverlayData = {
      directionData: [],
    };
    const basicInfo = dicomManager.getBasicInfo();
    const window = dicomManager.window;

    const WW_WL = `WW/WL: ${window.windowWidth}/${window.windowCenter}`;
    const image = `Image: ${crosshair.sliceIndex + 1}/${
      basicInfo.spaceInfo.count
    }`;
    const { spacing } = basicInfo.spaceInfo;

    const thickness = `Thickness: ${spacing ? spacing[2]?.toFixed(1) : '-'}mm`;

    d.directionData[OverlayDirection.LeftTop] = [WW_WL, image, thickness];

    return d;
  };

  const scrollBarProps = useMemo(() => {
    const basicInfo = dicomManager.getBasicInfo();
    return {
      crosshair,
      count: basicInfo.spaceInfo?.count,
    };
  }, [crosshair, dicomManager]);

  useEffect(() => {
    const handlerMap = {
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
    dicomManager.registerEventHandler((data) => {
      const handler = handlerMap[data.state as keyof typeof handlerMap];
      if (handler) {
        handler(data);
      }
    });

    return () => {
      dicomManager.destroy();
    };
  }, [dicomManager]);

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
