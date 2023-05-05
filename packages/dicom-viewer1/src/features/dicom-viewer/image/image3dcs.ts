import { clone } from 'lodash-es';
import * as ccloader from '@cc/loader';

import { CoordinateSystem, CSType } from './coordinatesystem';

import { components, engine } from '@cc/viewers-dvtool';

export class BaseError extends Error {
  constructor(public type: string, public message: string) {
    super(`${type}: ${message}`);
  }
}

export class NetWorkError extends BaseError {
  constructor(public code: number, message: string) {
    super('NetWorkError', message);
  }
}

export class NotImplemented extends BaseError {
  constructor(v: string) {
    super('NotImplemented', 'NotImplemented');
  }
}

export class Image3DCS extends engine.TSBehaviour implements CoordinateSystem {
  spaceInfo!: ccloader.image.Image3DSpaceInfo;

  convert(coords: Array<number>, from: CSType, to: CSType): Array<number> {
    if (!this.spaceInfo) {
      throw new Error('Image3DCS, need spaceInfo');
    }
    switch (from) {
      case CSType.Index3C:
        return this.convertFromIndex3(coords, to);
      case CSType.WorldC:
      case CSType.PhysicalC:
        return this.convertFromWorld(coords, to);
      default:
        break;
    }
    throw new NotImplemented('Image3DCS:convert');
  }

  private convertFromIndex3(coords: Array<number>, to: CSType): Array<number> {
    switch (to) {
      case CSType.WorldC:
        return this.spaceInfo.indexToPhysical(coords as [number, number, number]);
      case CSType.PhysicalC:
        return this.spaceInfo.indexToPhysical(coords as [number, number, number]);
      default:
        break;
    }
    throw new NotImplemented('Image3DCS:convertFromScreen');
  }

  private convertFromWorld(coords: Array<number>, to: CSType): Array<number> {
    switch (to) {
      case CSType.PhysicalC:
        return clone(coords);
      case CSType.WorldC:
        return clone(coords);
      case CSType.Index3C:
        return this.spaceInfo.physicalToIndex(coords as [number, number, number]);
      default:
        break;
    }
    throw new NotImplemented('Image3DCS:convertFromWorld');
  }
}
