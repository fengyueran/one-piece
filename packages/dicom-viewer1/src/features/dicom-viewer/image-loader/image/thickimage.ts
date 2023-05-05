import { range } from 'lodash-es';

import { Image3D } from './image3';
import { Image3DSpaceInfo } from './image3dspaceinfo';
import { Priority, TypedArray } from '../core';
import { ImageCache } from './imagecache/types';
import { NotImplemented } from '../core/errors';

function makeLayer<T extends TypedArray>(pxiels: Array<T>, o: T): T {
  for (let i = 0; i < o.length; i++) {
    let total = 0;
    for (let j = 0; j < pxiels.length; j++) {
      total += pxiels[j][i] as number;
    }
    // eslint-disable-next-line no-param-reassign
    o[i] = Math.floor(total / pxiels.length);
  }
  return o;
}

class ThickImageCache<T extends TypedArray> implements ImageCache<T> {
  private layerCache: Array<T> = [];

  private layerPromiseCache: Array<Promise<T>> = [];

  constructor(
    private proxyCache: ImageCache<T>,
    private multiplier: number,
    private creator: new (n: number) => T,
  ) {
    if (multiplier <= 1) {
      throw new Error('ThickImageCache, multiplier must > 1 and be integer');
    }
  }

  async force(priority: Priority): Promise<void> {
    return this.proxyCache.force(priority);
  }

  getSync(layer: number): T {
    if (this.layerCache[layer]) {
      return this.layerCache[layer];
    }
    const pixels = range(this.multiplier).map((i) =>
      this.proxyCache.getSync(layer * this.multiplier + i),
    );
    // eslint-disable-next-line new-cap
    const o = new this.creator(pixels[0].length);
    this.layerCache[layer] = o;
    return makeLayer(pixels, o);
  }

  private async getAsyncImpl(layer: number, priority: Priority): Promise<T> {
    const pixels = await Promise.all(
      range(this.multiplier).map((i) =>
        this.proxyCache.getAsync(layer * this.multiplier + i, priority),
      ),
    );
    // eslint-disable-next-line new-cap
    const o = new this.creator(pixels[0].length);
    this.layerCache[layer] = o;
    return makeLayer(pixels, o);
  }

  async getAsync(layer: number, priority: Priority): Promise<T> {
    if (this.layerCache[layer]) {
      return this.layerCache[layer];
    }
    //@ts-ignore
    if (this.layerPromiseCache[layer]) {
      return this.layerPromiseCache[layer];
    }
    this.layerPromiseCache[layer] = this.getAsyncImpl(layer, priority);
    return this.layerPromiseCache[layer];
  }

  isReady(): boolean {
    return this.proxyCache.isReady();
  }

  cancelLoading(): void {
    return this.proxyCache.cancelLoading();
  }

  getTag(layer: number, tagName: string | Array<string>): any {
    return this.proxyCache.getTag(layer * this.multiplier, tagName);
  }

  getRawPixel(): T {
    throw new NotImplemented();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  writeDiff(indexArray: Array<number>, diffArray: Array<number>): void {
    throw new NotImplemented();
  }
}

export function createThickImage<T extends TypedArray>(
  source: Image3D<T>,
  thickMultiplier = 4,
): Image3D<T> {
  const info = {
    size: [
      source.info.size[0],
      source.info.size[1],
      Math.floor(source.info.size[2] / thickMultiplier),
    ],
    spacing: [
      source.info.spacing[0],
      source.info.spacing[1],
      source.info.spacing[2] * thickMultiplier,
    ],
    origin: source.info.origin,
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { cache, creator } = source as any;
  const thick = new Image3D<T>(
    new Image3DSpaceInfo(
      info.size as [number, number, number],
      info.spacing as [number, number, number],
      info.origin as [number, number, number],
    ),
    new ThickImageCache(cache, thickMultiplier, creator),
    creator,
  );

  return thick;
}
