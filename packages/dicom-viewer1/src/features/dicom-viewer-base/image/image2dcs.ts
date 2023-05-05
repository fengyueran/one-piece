import { Vector2, Vector3 } from 'three';

import * as ccloader from '@cc/loader';

import { CoordinateSystem, CSType } from './coordinatesystem';

import { components, engine } from '@cc/viewers-dvtool';
import { Image2DSource, Image2DSpaceInfo } from '../image-loader';

import { CrosshairData } from './crosshairdata';

// 如果需要从Screen, Index2, WorldC 转到 Physical, Index3, 那么必须要提供sliceIndex, 为coords的第三个数.

class BaseError extends Error {
  constructor(public type: string, public message: string) {
    super(`${type}: ${message}`);
  }
}

class NetWorkError extends BaseError {
  constructor(public code: number, message: string) {
    super('NetWorkError', message);
  }
}

class NotImplemented extends BaseError {
  constructor(v: string) {
    super('NotImplemented', 'NotImplemented');
  }
}

export class Image2DCS extends engine.TSBehaviour implements CoordinateSystem {
  spaceInfo!: Image2DSpaceInfo;

  crosshairData?: CrosshairData;

  convert(coords: Array<number>, from: CSType, to: CSType): Array<number> {
    if (!this.spaceInfo) {
      throw new Error('Image2DCS, need spaceInfo');
    }
    switch (from) {
      case CSType.WorldC:
        return this.convertFromWorld(coords, to);
      case CSType.ScreenC:
        return this.convertFromScreen(coords, to);
      case CSType.Index2C:
        return this.convertFromIndex2(coords, to);
      case CSType.Index3C:
        return this.convertFromIndex3(coords, to);
      default:
        break;
    }
    throw new NotImplemented('Image2DCS:convert');
  }

  private convertFromWorld(coords: Array<number>, to: CSType): Array<number> {
    const indexPoint = new Vector2(coords[0], coords[1]);
    indexPoint.x += (this.spaceInfo.size[0] * this.spaceInfo.spacing[0]) / 2;
    indexPoint.y = (this.spaceInfo.size[1] * this.spaceInfo.spacing[1]) / 2 - indexPoint.y;
    indexPoint.x /= this.spaceInfo.spacing[0];
    indexPoint.y /= this.spaceInfo.spacing[1];
    switch (to) {
      case CSType.Index3C:
        return this.spaceInfo.coords2DTo3D({
          sliceIndex: this.getSliceIndex(coords),
          indexCoords: [indexPoint.x, indexPoint.y],
        });
      case CSType.Index2C:
        return [indexPoint.x, indexPoint.y];
      case CSType.ScreenC:
        // eslint-disable-next-line no-case-declarations
        const screen = this.gameObject.scene.mainCamera.worldToView(new Vector3(...coords));
        return [screen.x, screen.y];
      default:
        break;
    }
    throw new NotImplemented('Image3DCS:convertFromWorld');
  }

  private convertFromIndex3(coords: Array<number>, to: CSType): Array<number> {
    const index2 = this.spaceInfo.coords3DTo2D(coords as [number, number, number]);
    switch (to) {
      case CSType.WorldC:
        return this.convertFromIndex2(
          [index2.indexCoords[0], index2.indexCoords[1], index2.sliceIndex],
          CSType.WorldC,
        );
      case CSType.PhysicalC:
        return this.spaceInfo.indexToPhysical(index2);
      case CSType.Index2C:
        return [index2.indexCoords[0], index2.indexCoords[1], index2.sliceIndex];
      default:
        break;
    }
    throw new NotImplemented('Image3DCS:convertFromScreen');
  }

  private getSliceIndex(coords: Array<number>) {
    if (coords.length === 3) {
      return coords[2];
    }
    if (this.crosshairData) {
      return this.spaceInfo.coords3DTo2D(this.crosshairData.crosshair as [number, number, number])
        .sliceIndex;
    }
    throw new NotImplemented(`Image2DCS: the coords must length 3 for 3d related conversion`);
  }

  private convertFromIndex2(coords: Array<number>, to: CSType): Array<number> {
    const worldPoint = new Vector2(
      coords[0] - this.spaceInfo.size[0] / 2,
      this.spaceInfo.size[1] / 2 - coords[1],
    );
    worldPoint.x *= this.spaceInfo.spacing[0];
    worldPoint.y *= this.spaceInfo.spacing[1];
    switch (to) {
      case CSType.WorldC:
        return [worldPoint.x, worldPoint.y, 0];
      case CSType.Index3C:
        return this.spaceInfo.coords2DTo3D({
          sliceIndex: this.getSliceIndex(coords),
          indexCoords: [coords[0], coords[1]],
        });
      default:
        break;
    }
    throw new NotImplemented('IntensityModelCS:convertFromIndex2');
  }

  private convertFromScreen(coords: Array<number>, to: CSType): Array<number> {
    const worldPoint = this.gameObject.scene.mainCamera.viewToWorld(coords[0], coords[1]);

    const indexPoint = new Vector3();
    indexPoint.copy(worldPoint);
    indexPoint.x += (this.spaceInfo.size[0] * this.spaceInfo.spacing[0]) / 2;
    indexPoint.y = (this.spaceInfo.size[1] * this.spaceInfo.spacing[1]) / 2 - indexPoint.y;
    indexPoint.x /= this.spaceInfo.spacing[0];
    indexPoint.y /= this.spaceInfo.spacing[1];
    switch (to) {
      case CSType.WorldC:
        return [worldPoint.x, worldPoint.y];
      case CSType.Index2C:
        return [indexPoint.x, indexPoint.y];
      case CSType.Index3C:
        return this.spaceInfo.coords2DTo3D({
          sliceIndex: this.getSliceIndex(coords),
          indexCoords: [indexPoint.x, indexPoint.y],
        });
      case CSType.PhysicalC:
        return this.spaceInfo.indexToPhysical({
          sliceIndex: this.getSliceIndex(coords),
          indexCoords: [indexPoint.x, indexPoint.y],
        });
      default:
        break;
    }
    throw new NotImplemented('IntensityModelCS:convertFromScreen');
  }
}
