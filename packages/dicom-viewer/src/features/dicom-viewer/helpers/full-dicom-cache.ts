import ccloader from '@cc/loader';
import { isString } from 'lodash-es';

// can replace ccloader nifti cache later
export class FullDicomCache<TArray extends ccloader.TypedArray>
  implements ccloader.image.ImageCache<TArray> {
  cache: Array<TArray | undefined>;

  constructor(
    private buffer: TArray,
    private info: ccloader.image.ImageInfo,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getTagImpl: (layer: number, tagName: string) => any,
  ) {
    if (buffer.length !== info.size[0] * info.size[1] * info.size[2]) {
      throw new Error('NiftiCache, data size is not match with data info');
    }
    this.cache = new Array(info.size[2]);
  }

  // eslint-disable-next-line class-methods-use-this
  async force(_priority: number): Promise<void> {
    // do nothing
  }

  private getBuffer(layer: number): TArray {
    if (layer < 0 || layer >= this.info.size[2]) {
      throw new Error(`NiftiCache: layer ${layer} is out of index`);
    }
    if (!this.cache[layer]) {
      const start = this.info.size[0] * this.info.size[1] * layer;
      const end = this.info.size[0] * this.info.size[1] * (layer + 1);
      this.cache[layer] = this.buffer.subarray(start, end) as TArray;
    }

    return this.cache[layer] as TArray;
  }

  getSync(layer: number): TArray {
    return this.getBuffer(layer);
  }

  async getAsync(layer: number, _priority: number): Promise<TArray> {
    return this.getSync(layer);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTag(layer: number, tagName: string | Array<string>): any {
    if (isString(tagName)) {
      return this.getTagImpl(layer, tagName);
    }
    return tagName.map((name: string) => this.getTagImpl(layer, name));
  }

  // eslint-disable-next-line class-methods-use-this
  isReady(): boolean {
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  cancelLoading(): void {
    throw new Error('not implemented');
  }

  getRawPixel(): TArray {
    return this.buffer;
  }

  // TODO: handle the case of out of index.
  writeDiff(indexArray: Array<number>, diffArray: Array<number>): void {
    for (let i = 0; i < indexArray.length; i++) {
      this.buffer[indexArray[i]] += diffArray[i];
    }

    this.cache = new Array(this.info.size[2]);
  }
}
