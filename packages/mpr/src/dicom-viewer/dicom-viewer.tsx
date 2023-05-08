import React from 'react';
import * as ccloader from '@cc/loader';
import { uicomponents } from '@cc/viewers-dvtool';

export interface DicomViewerProps {
  viewSize?: [number, number];
  physicalPerPixel?: number;
  scaleStyle?: object;
  overlayData?: uicomponents.OverlayData;
  attachParent: (parent: HTMLElement) => void;
  attachInput: (input: HTMLElement) => void;
  detachParent: () => void;
  detachInput: () => void;
  setCrosshair: (index: ccloader.image.SliceIndexAndCoords2D) => void;
  scrollBarProps: {
    count: number;
    crosshair: ccloader.image.SliceIndexAndCoords2D;
  };
}

export const DicomViewer: React.FC<DicomViewerProps> = ({
  setCrosshair,
  scrollBarProps,
  physicalPerPixel,
  ...res
}) => {
  return (
    <uicomponents.StandardSceneView
      {...res}
      integrationConnected={0}
      physicalPerPixel={physicalPerPixel}
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
