import EventEmitter from 'eventemitter3';
import { isEqual } from 'lodash-es';
import isPromise from 'is-promise';

import {
  activeChangedEvent,
  requestedEvent,
  loadingStartedEvent,
  loadingCompletedEvent,
  loadingFailedEvent,
  idleEvent,
} from './image2dsource';

enum IndexType {
  Active,
  Loading,
  Pending,
}

type EventEmitterType = InstanceType<typeof EventEmitter>;

export class LoadLastOne<TIndex, T> {
  private mActive?: T;

  private indices: Array<TIndex | undefined> = [];

  private mLastRequested?: TIndex;

  private mActiveIndex?: TIndex;

  getActive(): T | undefined {
    return this.mActive;
  }

  getLastRequestedIndex(): TIndex | undefined {
    return this.mLastRequested;
  }

  getExpectedIndex(): TIndex | undefined {
    if (this.getIndex(IndexType.Pending) !== undefined) {
      return this.getIndex(IndexType.Pending);
    }
    if (this.getIndex(IndexType.Loading) !== undefined) {
      return this.getIndex(IndexType.Loading);
    }
    return this.getIndex(IndexType.Active);
  }

  getActiveIndex(): TIndex | undefined {
    return this.mActiveIndex;
  }

  constructor(
    private emitter: EventEmitterType,
    private loader: ((index: TIndex) => Promise<T>) | ((index: TIndex) => T),
  ) {}

  isLoading(): boolean {
    return this.getIndex(IndexType.Loading) !== undefined;
  }

  private getIndex(type: IndexType): TIndex | undefined {
    return this.indices[type];
  }

  private setIndex(type: IndexType, index: TIndex | undefined): void {
    this.indices[type] = index;
  }

  private clearIndex(type: IndexType): void {
    this.setIndex(type, undefined);
  }

  forceLoad(): void {
    if (this.isLoading()) {
      return;
    }
    if (!this.getActive()) {
      return;
    }
    this.load(this.getActiveIndex()!);
  }

  request(index: TIndex): void {
    if (isEqual(this.mLastRequested, index)) {
      return;
    }

    this.mLastRequested = index;
    this.emitter.emit(requestedEvent, index);
    if (this.isLoading()) {
      if (index === this.getIndex(IndexType.Loading)) {
        this.clearIndex(IndexType.Pending);
      } else if (index === this.getIndex(IndexType.Active)) {
        this.clearIndex(IndexType.Pending);
        this.clearIndex(IndexType.Loading);
      } else {
        this.setIndex(IndexType.Pending, index);
      }
    } else {
      this.load(index);
    }
  }

  private async load(index: TIndex): Promise<void> {
    this.setIndex(IndexType.Loading, index);
    this.emitter.emit(loadingStartedEvent, index);
    try {
      const loaderRet = this.loader(index);
      const d: T = isPromise(loaderRet) ? await loaderRet : loaderRet;
      if (this.getIndex(IndexType.Loading) !== index) {
        this.emitter.emit(loadingFailedEvent, index);
        if (!this.isLoading()) {
          const pending = this.getIndex(IndexType.Pending);
          if (pending === undefined) {
            this.emitter.emit(idleEvent);
          }
        }
        return;
      }
      this.clearIndex(IndexType.Loading);
      this.emitter.emit(loadingCompletedEvent, index);
      this.setIndex(IndexType.Active, index);
      this.mActive = d;
      this.mActiveIndex = index;
      this.emitter.emit(activeChangedEvent);
    } catch (e) {
      if (this.getIndex(IndexType.Loading) === index) {
        this.clearIndex(IndexType.Loading);
      }
      this.emitter.emit(loadingFailedEvent, index);
    }
    if (!this.isLoading()) {
      const pending = this.getIndex(IndexType.Pending);
      if (pending !== undefined) {
        this.clearIndex(IndexType.Pending);
        this.setIndex(IndexType.Loading, pending);
        this.load(pending);
      } else {
        this.emitter.emit(idleEvent);
      }
    }
  }
}
