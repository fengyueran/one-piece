import { Priority, TypedArray } from '../../core';

export interface ImageCache<T extends TypedArray> {
  force: (priority: Priority) => Promise<void>;
  getSync: (layer: number) => T;
  getAsync: (layer: number, priority: Priority) => Promise<T>;
  isReady: () => boolean;
  cancelLoading: () => void;
  getTag: (layer: number, tagName: string | Array<string>) => any;
  getRawPixel: () => T;
  writeDiff: (indexArray: Array<number>, diffArray: Array<number>) => void;
}
