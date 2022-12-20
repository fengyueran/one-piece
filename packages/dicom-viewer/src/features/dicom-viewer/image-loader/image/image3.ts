import { ImageInfo } from './types';
import { Image2D } from './image2';
import { ImageCache } from './imagecache/types';
import { Resource, Priority, TypedArray } from '../core';

import { Image2DSpaceInfo } from './image2dspaceinfo';
import { Image3DSpaceInfo } from './image3dspaceinfo';
import { NotImplemented } from '../core/errors';

// Image is intensity based.
export class Image3D<T extends TypedArray = Int16Array> extends Resource {
  private bytesPerElement = 0;

  info: Image3DSpaceInfo;

  constructor(
    info: ImageInfo,
    protected cache: ImageCache<T>,
    protected creator: new (n: number) => T,
  ) {
    super('image3');

    this.info = new Image3DSpaceInfo(
      info.size as [number, number, number],
      info.spacing as [number, number, number],
      info.origin as [number, number, number],
    );

    // eslint-disable-next-line new-cap
    const tmp = new creator(1);
    this.bytesPerElement = tmp.byteLength / tmp.length;
  }

  // eslint-disable-next-line class-methods-use-this
  protected createImage2(imageInfo: ImageInfo, pixel: T): Image2D<T> {
    return new Image2D<T>(imageInfo, pixel);
  }

  getAxialInfo(): Image2DSpaceInfo {
    return this.info.getAxialInfo();
  }

  getSagittalInfo(): Image2DSpaceInfo {
    return this.info.getSagittalInfo();
  }

  getCoronalInfo(): Image2DSpaceInfo {
    return this.info.getCoronalInfo();
  }

  // the T of array is not reliable.
  // TODO: 暂不考虑unsigned and signed区别
  private convertBuffer(array: T, width: number, height: number): T {
    const isSameSize = array.byteLength / array.length === this.bytesPerElement;
    if (isSameSize) {
      return array;
    }
    // eslint-disable-next-line new-cap
    const r = new this.creator(width * height);
    for (let i = 0; i < width * height; i += 1) {
      r[i] = array[i];
    }

    return r;
  }

  getSagittalSync = (index: number): Image2D<T> => {
    if (!this.isAllDataReady) {
      throw new Error('getSagittalSync, the cache is not ready.');
    }
    const width = this.size[1];
    const height = this.size[2];

    // eslint-disable-next-line new-cap
    const pixelData = new this.creator(width * height);

    for (let i = 0; i < height; i += 1) {
      const pixels = this.cache.getSync(height - i - 1);

      for (let j = 0; j < width; j += 1) {
        const pixel = pixels[this.size[0] * j + index];
        pixelData[width * i + j] = pixel;
      }
    }

    return this.createImage2(
      {
        spacing: [this.spacing[1], this.spacing[2]],
        size: [this.size[1], this.size[2]],
        origin: [this.origin[1], this.origin[2]],
      },
      pixelData,
    );
  };

  getCoronalSync = (index: number): Image2D<T> => {
    if (!this.isAllDataReady) {
      throw new Error('getCoronalSync, the cache is not ready.');
    }
    const width = this.size[0];
    const height = this.size[2];

    // eslint-disable-next-line new-cap
    const pixelData = new this.creator(width * height);

    for (let i = 0; i < height; i += 1) {
      const pixels = this.cache.getSync(height - i - 1);
      const begin = width * i;

      for (let j = 0; j < width; j += 1) {
        const pixel = pixels[index * width + j];
        pixelData[begin + j] = pixel;
      }
    }

    return this.createImage2(
      {
        spacing: [this.spacing[0], this.spacing[2]],
        size: [this.size[0], this.size[2]],
        origin: [this.origin[0], this.origin[2]],
      },
      pixelData,
    );
  };

  getAxialSync = (index: number): Image2D<T> => {
    const result = this.cache.getSync(index);
    return this.createImage2(
      {
        spacing: [this.spacing[0], this.spacing[1]],
        size: [this.size[0], this.size[1]],
        origin: [this.origin[0], this.origin[1]],
      },
      this.convertBuffer(result, this.size[0], this.size[1]),
    );
  };

  getAxial = async (index: number, priority: Priority = Priority.Medium): Promise<Image2D<T>> => {
    await this.cache.getAsync(index, priority);
    return this.getAxialSync(index);
  };

  getSagittal = async (index: number): Promise<Image2D<T>> => {
    if (!this.isAllDataReady) {
      await this.force(Priority.Medium);
    }
    return this.getSagittalSync(index);
  };

  getCoronal = async (index: number): Promise<Image2D<T>> => {
    if (!this.isAllDataReady) {
      await this.force(Priority.Medium);
    }
    return this.getCoronalSync(index);
  };

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

  async getIntensity(index: [number, number, number]): Promise<number> {
    const layer = await this.cache.getAsync(index[2], Priority.Medium);
    return layer[index[0] + index[1] * this.info.size[0]] as number;
  }

  async force(priority: number): Promise<void> {
    return this.cache.force(priority);
  }

  get isAllDataReady(): boolean {
    return this.cache.isReady();
  }

  get size(): Array<number> {
    return this.info.size;
  }

  get origin(): Array<number> {
    return this.info.origin;
  }

  get spacing(): Array<number> {
    return this.info.spacing;
  }

  cancelLoading(): void {
    this.cache.cancelLoading();
  }

  // write related.
  getRawPixel(): T {
    return this.cache.getRawPixel();
  }

  // eslint-disable-next-line
  writeBuffer(start: Array<number>, size: Array<number>, buffer: T): void {
    throw new NotImplemented();
  }

  writeDiff(indexArray: Array<number>, diffArray: Array<number>): void {
    this.cache.writeDiff(indexArray, diffArray);
  }
}
