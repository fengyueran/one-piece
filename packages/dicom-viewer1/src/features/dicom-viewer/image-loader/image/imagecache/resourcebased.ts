import { isString } from 'lodash-es';

import { IResourceRep, Resource, Priority, TypedArray } from '../../core';
import { ImageCache } from './types';
import { NotImplemented } from '../../core/errors';

export interface ResourceGetter<TArray extends TypedArray> {
  getBuffer: (r: Resource) => TArray;
  getTagByResource?: (r: Resource, tagName: string) => any;
  getTagByNumber?: (index: number, tagName: string) => any;
}

export class ResourceBasedImageCache<TResource extends Resource, TArray extends TypedArray>
  implements ImageCache<TArray> {
  constructor(private resources: Array<IResourceRep>, private rg: ResourceGetter<TArray>) {}

  async force(priority: Priority): Promise<void> {
    await Promise.all(this.resources.map((r) => r.load(priority)));
  }

  // must be loaded.
  getSync(layer: number): TArray {
    if (!this.resources[layer].isReady()) {
      throw new Error('ResourceBasedImageCache, getSync but resource is not loaded');
    }
    return this.rg.getBuffer(this.resources[layer].get<TResource>());
  }

  async getResource(layer: number, priority: Priority): Promise<TResource> {
    if (this.resources[layer].isReady()) {
      return this.resources[layer].get<TResource>();
    }
    const r = await this.resources[layer].load(priority);
    return r as TResource;
  }

  getResourceSync(layer: number): TResource {
    if (!this.resources[layer].isReady()) {
      throw new Error('ResourceBasedImageCache, getResourceSync but resource is not loaded');
    }
    return this.resources[layer].get<TResource>();
  }

  async getAsync(layer: number, priority: Priority): Promise<TArray> {
    const r = await this.getResource(layer, priority);
    return this.rg.getBuffer(r);
  }

  private getTagImpl(layer: number, tagName: string) {
    if (this.rg.getTagByNumber) {
      return this.rg.getTagByNumber(layer, tagName);
    }
    if (this.rg.getTagByResource) {
      const r = this.getResourceSync(layer);
      return this.rg.getTagByResource(r, tagName);
    }
    throw new Error('ResourceBasedImageCache: ResourceGetter interface didnt implement getTag');
  }

  getTag(layer: number, tagName: string | Array<string>): any {
    if (isString(tagName)) {
      return this.getTagImpl(layer, tagName);
    }
    return tagName.map((name: string) => this.getTagImpl(layer, name));
  }

  isReady(): boolean {
    for (let i = 0; i < this.resources.length; i += 1) {
      if (!this.resources[i].isReady()) {
        return false;
      }
    }
    return true;
  }

  cancelLoading(): void {
    if (this.isReady()) {
      return;
    }
    this.resources.forEach((r) => r.cancel());
  }

  getRawPixel(): TArray {
    throw new NotImplemented();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  writeDiff(indexArray: Array<number>, diffArray: Array<number>): void {
    throw new NotImplemented();
  }
}
