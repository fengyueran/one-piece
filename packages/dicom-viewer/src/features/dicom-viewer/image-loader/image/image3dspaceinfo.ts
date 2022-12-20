import {
  Image2DSpaceInfo,
  SliceIndexAndCoords2D,
  Coords2DTo3D,
  Coords3DTo2D,
  AnatomicalDirection,
} from './image2dspaceinfo';

type VType = [number, number, number];

export class Image3DSpaceInfo {
  private axialInfo: Image2DSpaceInfo;

  private sagittalInfo: Image2DSpaceInfo;

  private coronalInfo: Image2DSpaceInfo;

  physicalSize: VType;

  getAxialInfo(): Image2DSpaceInfo {
    return this.axialInfo;
  }

  getSagittalInfo(): Image2DSpaceInfo {
    return this.sagittalInfo;
  }

  getCoronalInfo(): Image2DSpaceInfo {
    return this.coronalInfo;
  }

  constructor(public size: VType, public spacing: VType, public origin: VType) {
    this.physicalSize = [0, 1, 2].map((i) => size[i] * spacing[i]) as VType;
    this.axialInfo = this.createInfo(
      0,
      1,
      size[2],
      [
        AnatomicalDirection.Right,
        AnatomicalDirection.Left,
        AnatomicalDirection.Anterior,
        AnatomicalDirection.Posterior,
      ],
      ({ sliceIndex, indexCoords }) => [indexCoords[0], indexCoords[1], sliceIndex],
      (indexCoords) => ({
        sliceIndex: indexCoords[2],
        indexCoords: [indexCoords[0], indexCoords[1]],
      }),
    );

    this.sagittalInfo = this.createInfo(
      1,
      2,
      size[0],
      [
        AnatomicalDirection.Anterior,
        AnatomicalDirection.Posterior,
        AnatomicalDirection.Superior,
        AnatomicalDirection.Inferior,
      ],
      ({ sliceIndex, indexCoords }) => [sliceIndex, indexCoords[0], size[2] - indexCoords[1] - 1],
      (indexCoords) => ({
        sliceIndex: indexCoords[0],
        indexCoords: [indexCoords[1], size[2] - indexCoords[2] - 1],
      }),
    );
    this.coronalInfo = this.createInfo(
      0,
      2,
      size[1],
      [
        AnatomicalDirection.Right,
        AnatomicalDirection.Left,
        AnatomicalDirection.Superior,
        AnatomicalDirection.Inferior,
      ],
      ({ sliceIndex, indexCoords }) => [indexCoords[0], sliceIndex, size[2] - indexCoords[1] - 1],
      (indexCoords) => ({
        sliceIndex: indexCoords[1],
        indexCoords: [indexCoords[0], size[2] - indexCoords[2] - 1],
      }),
    );
  }

  private createInfo(
    xAxis: number,
    yAxis: number,
    count: number,
    anatomicalSystem: [
      AnatomicalDirection,
      AnatomicalDirection,
      AnatomicalDirection,
      AnatomicalDirection,
    ],
    coords2DTo3D: Coords2DTo3D,
    coords3DTo2D: Coords3DTo2D,
  ): Image2DSpaceInfo {
    return new Image2DSpaceInfo(
      [this.size[xAxis], this.size[yAxis]],
      [this.spacing[xAxis], this.spacing[yAxis]],
      [this.origin[xAxis], this.origin[yAxis]],
      count,
      anatomicalSystem,
      (sliceIndexAndCoords: SliceIndexAndCoords2D): [number, number, number] =>
        this.indexToPhysical(coords2DTo3D(sliceIndexAndCoords)),
      (physical: [number, number, number]): SliceIndexAndCoords2D => {
        const indexCoords = this.physicalToIndex(physical);
        return coords3DTo2D(indexCoords);
      },
      coords2DTo3D,
      coords3DTo2D,
      this,
    );
  }

  indexToPhysical(indexCoords: VType): VType {
    const scale = [-1, -1, 1];
    return [0, 1, 2].map(
      (i) => this.origin[i] + scale[i] * indexCoords[i] * this.spacing[i],
    ) as VType;
  }

  physicalToIndex(physical: VType): VType {
    const scale = [-1, -1, 1];
    return [0, 1, 2].map(
      (i) => (physical[i] - this.origin[i]) / this.spacing[i] / scale[i],
    ) as VType;
  }

  isInside(index: Array<number>): boolean {
    if (index[0] < 0 || index[0] >= this.size[0]) {
      return false;
    }
    if (index[1] < 0 || index[1] >= this.size[1]) {
      return false;
    }
    if (index[2] < 0 || index[2] >= this.size[2]) {
      return false;
    }
    return true;
  }
}
