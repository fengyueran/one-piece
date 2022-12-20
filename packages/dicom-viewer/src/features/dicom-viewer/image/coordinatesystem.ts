export enum CSType {
  ScreenC,
  WorldC,
  Index2C,
  Index3C,
  PhysicalC,
}

// 对于Index2C来说, 三个值分别为[x, y, sliceIndex]

// the coordinate system is only for image space.
export interface CoordinateSystem {
  convert: (coords: Array<number>, from: CSType, to: CSType) => Array<number>;
}
