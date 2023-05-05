import { IResourceMgr, IResourceRep, Priority } from './types';
import { Resource } from './resource';

let counter = 0;

export class ResourceRep implements IResourceRep {
  private muid: string;

  resource?: Resource;

  get uid(): string {
    return this.muid;
  }

  constructor(private mgr: IResourceMgr) {
    this.muid = `${counter}`;
    counter += 1;
  }

  isReady(): boolean {
    return this.resource != null;
  }

  async load(priority: Priority = Priority.Medium): Promise<Resource> {
    if (this.resource) {
      return this.resource;
    }
    this.resource = await this.mgr.load(this, priority);
    return this.resource;
  }

  cancel(): void {
    if (this.resource) {
      return;
    }
    this.mgr.cancel(this);
  }

  get<T extends Resource = Resource>(): T {
    if (this.resource == null) {
      throw new Error('resource is not loaded');
    }
    return this.resource as T;
  }
}
