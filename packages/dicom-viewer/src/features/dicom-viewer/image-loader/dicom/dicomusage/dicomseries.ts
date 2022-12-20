import { ImageCache } from '../../image';
import { Resource, Priority, TypedArray } from '../../core';

export class DicomSeries extends Resource {
  constructor(public count: number, protected cache: ImageCache<TypedArray>) {
    super('dicomseries');
  }

  async force(priority: number): Promise<void> {
    return this.cache.force(priority);
  }

  get isAllDataReady(): boolean {
    return this.cache.isReady();
  }

  cancelLoading(): void {
    this.cache.cancelLoading();
  }

  async getImage(
    index: number,
    priority: Priority,
  ): Promise<{
    index: number;
    pixel: TypedArray;
    size: any[];
  }> {
    const pixel = await this.cache.getAsync(index, priority);
    const [rows, cols] = this.getTag(index, ['Rows', 'Columns']);
    return {
      index,
      pixel,
      size: [cols, rows],
    };
  }

  getTag(index: number, tagName: string | string[]): any {
    return this.cache.getTag(index, tagName);
  }
}
