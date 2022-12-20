import { delay } from 'lodash-es';
import { Resource } from './resource';
import {
  IResourceMgr,
  IFetcherMgr,
  LoadParams,
  IResourceRep,
  AnyOption,
  Locator,
  Priority,
} from './types';
import { ResourceRep } from './resourcerep';
import { Data } from './data';
import { Scheduler } from './scheduler';
import logger from './logger';
import { parseData } from './parsedata';

interface LocatorCacheItem {
  locator: Locator;
  promise: Promise<Data>;
}

export class ResourceMgr implements IResourceMgr {
  private waited: Map<string, LoadParams> = new Map<string, LoadParams>();

  private locatorCache: Array<LocatorCacheItem> = [];

  private loadCache: Map<IResourceRep, Promise<Resource>> = new Map<
    IResourceRep,
    Promise<Resource>
  >();

  private scheduler: Scheduler<IResourceRep> = new Scheduler(6);

  constructor(public fetcherMgr: IFetcherMgr) {}

  addResource(loadParams: LoadParams): ResourceRep {
    const rep: ResourceRep = new ResourceRep(this);
    this.waited.set(rep.uid, loadParams);
    return rep;
  }

  // Do a hack fetch optimization here.
  private async fetchInner(fetchType: string, locator: Locator, option: AnyOption): Promise<Data> {
    const cacheItem = this.locatorCache.find((l: LocatorCacheItem) => l.locator === locator);
    if (cacheItem) {
      return cacheItem.promise;
    }
    const promise = this.fetcherMgr.fetch(fetchType, locator, option);
    this.locatorCache.push({
      locator,
      promise,
    });
    if (this.locatorCache.length > 10) {
      this.locatorCache.shift();
    }
    await promise;
    return promise;
  }

  private async doLoad(resourceRep: IResourceRep): Promise<Resource> {
    const loadParams = await this.waited.get(resourceRep.uid);
    if (loadParams == null) {
      throw new Error('ResourceMgr load unknown error. loadParams not found');
    }
    const { fetchType, locator, parse, option } = loadParams;

    const data = await this.fetchInner(fetchType, locator, option || {});

    if (!data) throw new Error('No data');
    if (!parse) {
      return parseData(data);
    }
    return parse({
      data,
      mgr: this,
      option: option || {},
    });
  }

  async load(resourceRep: IResourceRep, priority: Priority): Promise<Resource> {
    logger.assert(!resourceRep.isReady());
    if (resourceRep.isReady()) {
      throw new Error('resourceRep ready should not be called here');
    }
    try {
      await this.scheduler.get(resourceRep, priority);
    } catch (e) {
      this.scheduler.free(resourceRep);
      throw e;
    }

    try {
      const cached = this.loadCache.get(resourceRep);
      if (cached) {
        this.scheduler.free(resourceRep);
        return cached;
      }
      const promise = this.doLoad(resourceRep);
      this.loadCache.set(resourceRep, promise);
      const resource = await promise;
      this.loadCache.delete(resourceRep);
      delay(() => this.scheduler.free(resourceRep), 0);
      return resource;
    } catch (e) {
      this.scheduler.free(resourceRep);
      throw e;
    }
  }

  cancel(resourceRep: IResourceRep): void {
    logger.assert(!resourceRep.isReady());
    if (resourceRep.isReady()) {
      throw new Error('resourceRep ready should not be called here');
    }
    this.scheduler.cancel(resourceRep);
  }
}
