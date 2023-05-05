import type { TypedArray } from './types';

import { Resource } from './resource';
import { Data } from './data';

export class DataResource extends Resource {
  constructor(public data: Data) {
    super('data');
  }

  getArrayBuffer(): ArrayBuffer {
    return this.data.getArrayBuffer();
  }

  getString(): string {
    return this.data.getString();
  }

  getData(): Data {
    return this.data;
  }

  getJson(): any {
    return this.data.getJson();
  }

  getTypedArray<T extends TypedArray>(): T {
    return this.data.getTypedArray<T>();
  }
}
