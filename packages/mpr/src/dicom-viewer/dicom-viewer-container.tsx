import { useEffect, useMemo, useState } from 'react';
import { uicomponents } from '@cc/viewers-dvtool';
import * as ccloader from '@cc/loader';
import { DicomViewer } from './dicom-viewer';

import { DicomEvent, DicomManager } from './dicom-manager';

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
    useState<ccloader.image.SliceIndexAndCoords2D>(
      dicomManager.get2DCrosshair()
    );
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

    const Thickness = basicInfo.tags.SliceThickness;

    const thickness = `Thickness: ${Thickness ? Thickness?.toFixed(1) : '-'}mm`;

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
      [DicomEvent.Ready]: () => setViewerReady(true),
      [DicomEvent.PhysicalPerPixel]: (data: {
        state: DicomEvent;
        value: number;
      }) => setPhysicalPerPixel(data.value),
      [DicomEvent.Crosshair]: (data: {
        state: DicomEvent;
        value: { coords2D: ccloader.image.SliceIndexAndCoords2D };
      }) => {
        setCrosshair(data.value.coords2D);
      },
    };
    dicomManager.subcribeStateChange((data) => {
      const handler = handlerMap[data.event as keyof typeof handlerMap];
      if (handler) {
        handler(data as any);
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
