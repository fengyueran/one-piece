import { Resource } from './resource';

export class AnyResource<T> extends Resource {
  private mData: T;

  get data(): T {
    return this.mData;
  }

  constructor(data: T) {
    super('any');
    this.mData = data;
  }
}
