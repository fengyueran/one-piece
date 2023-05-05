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
  scaleStyle?: object;
  overlayData?: uicomponents.OverlayData;
  scrollBarProps: {
    count: number;
    crosshair: ccloader.image.SliceIndexAndCoords2D;
  };
}

export const DicomViewer: React.FC<DicomViewerProps> = ({
  overlayVisible,
  setCrosshair,
  overlayData,
  scrollBarProps,
  physicalPerPixel,
  ...res
}) => {
  return (
    <uicomponents.StandardSceneView
      {...res}
      integrationConnected={0}
      overlayData={overlayVisible ? overlayData : undefined}
      physicalPerPixel={overlayVisible ? physicalPerPixel : undefined}
      sliceIndex={scrollBarProps.crosshair.sliceIndex}
      sliceCount={scrollBarProps.count}
      onSliceIndexChange={(v: number) =>
        setCrosshair({
          sliceIndex: v,
          indexCoords: scrollBarProps.crosshair.indexCoords,
        })
      }
    />
  );
};
