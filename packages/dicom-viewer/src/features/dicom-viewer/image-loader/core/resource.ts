import type { TypedArray } from './types';

import { Data } from './data';

export abstract class Resource {
  constructor(public type: string) {}

  // eslint-disable-next-line class-methods-use-this
  getJson(): any {
    throw new Error('Resource: getJson not implemented');
  }

  // eslint-disable-next-line class-methods-use-this
  getArrayBuffer(): ArrayBuffer {
    throw new Error('Resource: getArrayBuffer not implemented');
  }

  // eslint-disable-next-line class-methods-use-this
  getString(): string {
    throw new Error('Resource: getString not implemented');
  }

  // eslint-disable-next-line class-methods-use-this
  getData(): Data {
    throw new Error('Resource: getData not implemented');
  }

  // eslint-disable-next-line class-methods-use-this
  getTypedArray<T extends TypedArray>(): T {
    throw new Error('Resource: getTypedArray not implemented');
  }
}
