// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LoadFnType<T> = (index: number, ...args: any[]) => Promise<T>;

export interface CachePolicy<T> {
  get: LoadFnType<T>;
}

export class FullCache<T> implements CachePolicy<T> {
  private cache: Array<T> = [];

  constructor(private loader: LoadFnType<T>) {}

  get: LoadFnType<T> = async (index, ...args) => {
    if (!this.cache[index]) {
      this.cache[index] = await this.loader(index, ...args);
    }
    return this.cache[index];
  };
}
