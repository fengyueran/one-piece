import type { Image3DSpaceInfo } from './image3dspaceinfo';

export interface SliceIndexAndCoords2D {
  sliceIndex: number;
  indexCoords: [number, number];
}

export enum AnatomicalDirection {
  Left,
  Right,
  Posterior,
  Anterior,
  Inferior,
  Superior,
}

export type Coords2DTo3D = (sliceIndexAndCoords: SliceIndexAndCoords2D) => [number, number, number];
export type Coords3DTo2D = (indexCoords: [number, number, number]) => SliceIndexAndCoords2D;

export class Image2DSpaceInfo {
  constructor(
    public readonly size: [number, number],
    public readonly spacing: [number, number],
    public readonly origin: [number, number],
    public readonly count: number,
    public readonly anatomicalSystem: [
      AnatomicalDirection,
      AnatomicalDirection,
      AnatomicalDirection,
      AnatomicalDirection,
    ],
    public readonly indexToPhysical: (
      sliceIndexAndCoords: SliceIndexAndCoords2D,
    ) => [number, number, number],
    public readonly physicalToIndex: (physical: [number, number, number]) => SliceIndexAndCoords2D,
    public readonly coords2DTo3D: Coords2DTo3D,
    public readonly coords3DTo2D: Coords3DTo2D,

    public readonly refImage3DSpaceInfo: Image3DSpaceInfo,
  ) {}
}
