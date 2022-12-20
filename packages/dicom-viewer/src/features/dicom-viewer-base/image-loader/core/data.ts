import { isArray, isString, isArrayBuffer, isTypedArray, isObjectLike, isNumber } from 'lodash-es';

import type { TypedArray } from './types';

import { ab2str } from './string';
import { BaseError } from './errors';

export class DataPayloadInvalid extends BaseError {
  constructor(public data: Data) {
    super('DataInvalid', `payload invalid. payload is not ${data.type}`);
  }
}

export class DataGetInvalid extends BaseError {
  constructor(message: string) {
    super('DataGetInvalid', message);
  }
}

export enum PayLoadType {
  NO_CONTENT, // for 204. (No Content)
  PAGED_CONTENT, // for pagination(with more)
  STRING,
  JSON,
  ARRAY_BUFFER,
  TYPED_ARRAY,
  OTHERS, // custom
}

export class Data {
  private mType: PayLoadType;

  get type(): PayLoadType {
    return this.mType;
  }

  constructor(type: PayLoadType, private payload: any) {
    this.mType = type;

    this.checkData();
  }

  checkData(): void {
    switch (this.type) {
      case PayLoadType.STRING:
        if (!isString(this.payload)) {
          throw new DataPayloadInvalid(this);
        }
        break;
      case PayLoadType.ARRAY_BUFFER:
        if (!isArrayBuffer(this.payload)) {
          throw new DataPayloadInvalid(this);
        }
        break;
      case PayLoadType.TYPED_ARRAY:
        if (!isTypedArray(this.payload)) {
          throw new DataPayloadInvalid(this);
        }
        break;
      case PayLoadType.JSON:
        if (
          !this.payload ||
          isString(this.payload) ||
          isArrayBuffer(this.payload) ||
          isTypedArray(this.payload)
        ) {
          throw new DataPayloadInvalid(this);
        }
        break;
      case PayLoadType.NO_CONTENT:
        if (this.payload !== undefined) {
          throw new DataPayloadInvalid(this);
        }
        break;
      case PayLoadType.PAGED_CONTENT:
        if (
          !isObjectLike(this.payload) ||
          !(this.payload.data instanceof Data) ||
          !isNumber(this.payload.more)
        ) {
          throw new DataPayloadInvalid(this);
        }
        break;
      default:
        break;
    }
  }

  getTypedArray<T extends TypedArray>(): T {
    if (this.type !== PayLoadType.TYPED_ARRAY) {
      throw new DataGetInvalid('data: checkTypedArray, type must be TYPED_ARRAY');
    }
    return this.payload as T;
  }

  getArrayBuffer(): ArrayBuffer {
    switch (this.type) {
      case PayLoadType.ARRAY_BUFFER:
        return this.payload;
      default:
        throw new DataGetInvalid('Data: getArrayBuffer, type must be ARRAY_BUFFER');
    }
  }

  getString(): string {
    if (this.type === PayLoadType.STRING) {
      return this.payload;
    }
    try {
      const arrayBuffer: Uint8Array = new Uint8Array(this.getArrayBuffer());
      const isPadded = arrayBuffer[arrayBuffer.length - 1] === 0;
      return ab2str(isPadded ? arrayBuffer.slice(0, -1).buffer : arrayBuffer.buffer);
    } catch (e) {
      throw new DataGetInvalid('Data: getString, failed. ');
    }
  }

  getJson(): any {
    if (this.type === PayLoadType.JSON) {
      return this.payload;
    }
    return JSON.parse(this.getString());
  }

  getAny<T>(): T {
    return this.payload;
  }

  getArray<T>(): T[] {
    let l = this.payload;
    if (!isArray(l)) {
      l = this.getJson();
    }
    if (!isArray(l)) throw new DataGetInvalid('Data::GetArray. payload is not array.');
    return l as T[];
  }
}
