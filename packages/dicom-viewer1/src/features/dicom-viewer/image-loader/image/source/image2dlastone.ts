import { Image2DSource } from './image2dsource';
import { Image2D } from '../image2';
import { Image3D } from '../image3';
import type { TypedArray } from '../../core';

import { LoadLastOne } from './loadlastone';

export class Image2DLastOne<T extends TypedArray> extends Image2DSource<T> {
  private mCount: number;

  private mSize: Array<number>;

  private mSpacing: Array<number>;

  private loadLastOne: LoadLastOne<number, Image2D<T>>;

  getCount(): number {
    return this.mCount;
  }

  getSize(): Array<number> {
    return this.mSize;
  }

  getSpacing(): Array<number> {
    return this.mSpacing;
  }

  getActiveDisplayed(): Image2D<T> | undefined {
    return this.loadLastOne.getActive();
  }

  getLastRequestedIndex(): number {
    const v = this.loadLastOne.getLastRequestedIndex();
    return v !== undefined ? v : -1;
  }

  getExpectedIndex(): number {
    const v = this.loadLastOne.getExpectedIndex();
    return v !== undefined ? v : -1;
  }

  getActiveIndex(): number {
    const v = this.loadLastOne.getActiveIndex();
    return v !== undefined ? v : -1;
  }

  constructor(
    count: number,
    size: Array<number>,
    spacing: Array<number>,
    loadImage: ((index: number) => Promise<Image2D<T>>) | ((index: number) => Image2D<T>),
  ) {
    super();
    this.mCount = count;
    this.mSize = size;
    this.mSpacing = spacing;

    this.loadLastOne = new LoadLastOne<number, Image2D<T>>(this, loadImage);
  }

  isLoading(): boolean {
    return this.loadLastOne.isLoading();
  }

  request(index: number): void {
    if (index < 0 || index >= this.getCount()) {
      throw new Error('Image2DLastOne: request out of index');
    }

    this.loadLastOne.request(index);
  }

  forceLoad(): void {
    this.loadLastOne.forceLoad();
  }
}

export function makeAxialLoader<T extends TypedArray>(
  image: Image3D<T>,
  isSync = false,
): Image2DLastOne<T> {
  return new Image2DLastOne<T>(
    image.size[2],
    [image.size[0], image.size[1]],
    [image.spacing[0], image.spacing[1]],
    isSync || image.isAllDataReady ? image.getAxialSync : image.getAxial,
  );
}

export function makeSagittalLoader<T extends TypedArray>(
  image: Image3D<T>,
  isSync = false,
): Image2DLastOne<T> {
  return new Image2DLastOne<T>(
    image.size[0],
    [image.size[1], image.size[2]],
    [image.spacing[1], image.spacing[2]],
    isSync || image.isAllDataReady ? image.getSagittalSync : image.getSagittal,
  );
}

export function makeCoronalLoader<T extends TypedArray>(
  image: Image3D<T>,
  isSync = false,
): Image2DLastOne<T> {
  return new Image2DLastOne<T>(
    image.size[1],
    [image.size[0], image.size[2]],
    [image.spacing[0], image.spacing[2]],
    isSync || image.isAllDataReady ? image.getCoronalSync : image.getCoronal,
  );
}
