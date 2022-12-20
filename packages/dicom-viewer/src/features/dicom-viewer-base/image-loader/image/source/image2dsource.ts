import { EventEmitter } from 'eventemitter3';

import { Image2D } from '../image2';
import type { TypedArray } from '../../core';

// activeChangedEvent: emit when activeImage changed.
// requestedEvent: emit when receive right request. the folling request is invalid:
// 1. out of index. 2. duplicate with the last request.
// loadingstarted: loading start
// loadingcompleted: loading finished
// loadingfailed: loading failed

export const activeChangedEvent = 'activechanged';
export const requestedEvent = 'requested';
export const loadingStartedEvent = 'loadingstarted';
export const loadingCompletedEvent = 'loadingcompleted';
export const loadingFailedEvent = 'loadingfailed';
export const idleEvent = 'idle';

type EventList =
  | 'activechanged'
  | 'requested'
  | 'loadingstarted'
  | 'loadingcompleted'
  | 'loadingfailed'
  | 'idle';

// provide active image2d. the imageIndex requested must be in range [0, count - 1]
// Image2DSource have following function
// 1. contain count image2d. range in [0, count - 1]
// 2. provide one active image2D.
// 3. can request new image.
// 4. can listen the image loading process.

export abstract class Image2DSource<T extends TypedArray> extends EventEmitter<EventList> {
  abstract getActiveDisplayed(): Image2D<T> | undefined;

  abstract request(index: number): void;

  abstract getCount(): number;

  abstract getExpectedIndex(): number;

  abstract getActiveIndex(): number;

  abstract isLoading(): boolean;

  abstract getSize(): Array<number>;

  abstract getSpacing(): Array<number>;

  abstract forceLoad(): void;
}
