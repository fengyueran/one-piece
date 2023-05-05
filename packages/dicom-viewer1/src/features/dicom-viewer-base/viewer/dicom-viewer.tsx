import React from 'react';
import * as ccloader from '@cc/loader';
import { uicomponents } from '@cc/viewers-dvtool';

export interface Actions {
  attachParent: (parent: HTMLElement) => void;
  attachInput: (input: HTMLElement) => void;
  detachParent: () => void;
  detachInput: () => void;
  setCrosshair: (index: ccloader.image.SliceIndexAndCoords2D) => void;
}

export interface DicomViewerProps extends Actions {
  isViewerReady?: boolean;
  overlayVisible?: boolean;
  viewSize?: [number, number];
  physicalPerPixel?: number;
  scaleStyle?: any;
  overlayData?: uicomponents.OverlayData;
  scrollBarProps: {
    count: number;
    crosshair: ccloader.image.SliceIndexAndCoords2D;
  };
}

export const DicomViewer: React.FC<DicomViewerProps> = ({
  isViewerReady,
  overlayVisible,
  attachParent,
  attachInput,
  detachParent,
  detachInput,
  setCrosshair,
  overlayData,
  scrollBarProps,
  scaleStyle,
  physicalPerPixel,
}) => {
  if (!isViewerReady) {
    return <div style={{ backgroundColor: 'black', width: '100%', height: '100%' }} />;
  }

  return (
    <uicomponents.StandardSceneView
      attachParent={attachParent}
      attachInput={attachInput}
      detachParent={detachParent}
      detachInput={detachInput}
      scaleStyle={scaleStyle}
      integrationConnected={0}
      overlayData={overlayVisible ? overlayData : undefined}
      physicalPerPixel={overlayVisible ? physicalPerPixel : undefined}
      sliceIndex={scrollBarProps.crosshair.sliceIndex}
      sliceCount={scrollBarProps.count}
      onSliceIndexChange={(v: number) =>
        setCrosshair({ sliceIndex: v, indexCoords: scrollBarProps.crosshair.indexCoords })
      }
    />
  );
};

export default DicomViewer;
