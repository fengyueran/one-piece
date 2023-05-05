import { ImageInfo } from './types';

import type { TypedArray } from '../core';

export class Image2D<T extends TypedArray> {
  private mPixel: T;

  get pixel(): T {
    return this.mPixel;
  }

  constructor(private info: ImageInfo, pixel: T) {
    this.mPixel = pixel;
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
}
