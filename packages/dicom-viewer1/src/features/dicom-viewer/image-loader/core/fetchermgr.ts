import { Locator, AnyOption, IFetcherMgr, FetchFn } from './types';
import { Data } from './data';

export class FetcherMgr implements IFetcherMgr {
  fetchers: Map<string, FetchFn> = new Map<string, FetchFn>();

  register(type: string, fetch: FetchFn): void {
    if (this.fetchers.has(type)) {
      throw new Error(`FetcherMgr, ${type} is existed, registered failed`);
    }
    this.fetchers.set(type, fetch);
  }

  // eslint-disable-next-line
  async fetch(fetchType: string, locator: Locator, option: AnyOption): Promise<Data> {
    const registered = this.fetchers.get(fetchType);
    if (!registered) {
      throw new Error(`FetcherMgr: ${fetchType} is not registered.`);
    }
    return registered(locator, option);
  }
}
