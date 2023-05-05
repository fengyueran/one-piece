import { delay } from 'lodash-es';
import { Priority } from './types';
import logger from './logger';

interface Item<T> {
  priority: Priority;
  value: T;
  refcount: number;
  promise?: Promise<T>;
  resolve?: any;
  reject?: any;
  cancelRequested: boolean;
}

const MEDIUM_PRIORITY_MIN_COUNT = 3;

export class Scheduler<T> {
  lists: [Array<T>, Array<T>, Array<T>] = [[], [], []];

  all: Map<T, Item<T>> = new Map<T, Item<T>>();

  freeSlot: number;

  constructor(private limit: number) {
    this.freeSlot = limit;
  }

  async get(v: T, priority: Priority): Promise<T> {
    this.update(v, priority);
    const item = this.all.get(v);
    logger.assert(item);
    if (item == null) {
      throw new Error('Scheduler: item must be existed in get function');
    }
    if (item.promise == null) {
      item.promise = new Promise((resolve, reject) => {
        item.resolve = resolve;
        item.reject = reject;
      });
    }
    this.check();
    const t = await item.promise;
    return t;
  }

  free(v: T): void {
    const item = this.all.get(v);
    logger.assert(item);
    if (item == null) {
      return;
    }
    logger.assert(item.refcount > 0);
    item.refcount -= 1;
    if (item.refcount <= 0) {
      this.freeSlot++;
      this.all.delete(v);
      logger.assert(this.freeSlot <= this.limit);
      if (this.freeSlot >= this.limit) {
        this.freeSlot = this.limit;
      }
      delay(this.check.bind(this), 0);
    }
  }

  cancel(v: T): void {
    const item = this.all.get(v);
    if (item == null) {
      return;
    }
    item.cancelRequested = true;
  }

  private check() {
    logger.assert(this.freeSlot <= this.limit);
    const listLimit = this.freeSlot <= 0 ? this.lists.length - 1 : 0;
    for (let i = this.lists.length - 1; i >= listLimit; i -= 1) {
      const l: Array<T> = this.lists[i];
      if (l.length > 0) {
        if (i === Priority.Low && this.freeSlot <= MEDIUM_PRIORITY_MIN_COUNT) return;
        this.freeSlot--;
        const item = this.all.get(l[0]);
        l.shift();
        if (item == null) {
          throw new Error('check, unknown error');
        }
        if (item.cancelRequested) {
          item.reject(item.value);
        } else {
          item.resolve(item.value);
        }
        delay(this.check.bind(this), 0);
        return;
      }
    }
  }

  private update(v: T, priority: Priority): void {
    const item = this.all.get(v);
    if (item == null) {
      const newItem = { priority, value: v, refcount: 1, cancelRequested: false };
      this.all.set(v, newItem);
      this.lists[priority].push(v);
    } else {
      item.refcount += 1;
      item.cancelRequested = false; // reset cancel if new get request received.
    }
    if (item != null && item.priority < priority) {
      const index = this.lists[item.priority].indexOf(v);

      if (index !== -1) {
        this.lists[item.priority].splice(index, 1);
        this.lists[priority].push(v);
      }
      item.priority = priority;
    }
  }
}
