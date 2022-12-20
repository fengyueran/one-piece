import { Vector2 } from 'three';
import { logger } from '@cc/logger';

import { InputBase } from './inputbase';
import { engine } from '@cc/viewers-dvtool';

export abstract class PanOp extends InputBase {
  lastDelta?: Vector2;

  startPoint?: Vector2;

  protected abstract doMove(diff: Vector2, center?: Vector2): void;

  onPanStart(e: engine.InputEvent): void {
    this.startPoint = new Vector2(e.offsetX, e.offsetY);
    this.lastDelta = new Vector2(e.deltaX!, e.deltaY!);
  }

  onPanMove(e: engine.InputEvent): void {
    if (!this.enabled) {
      return;
    }
    // onPanMove enter but not enter onPanStart. It shouldn't happen I think.
    logger.assert('onPanMove enter without entering onPanStart. Unknown error!!');
    /* istanbul ignore next */
    if (!this.lastDelta) {
      return;
    }
    const newDelta = new Vector2(e.deltaX!, e.deltaY!);
    const diff = new Vector2();
    diff.subVectors(newDelta, this.lastDelta);
    this.lastDelta = newDelta;
    if (diff.lengthSq() !== 0) {
      this.doMove(diff, new Vector2(e.offsetX, e.offsetY));
    }
  }

  onPanEnd = (): void => {
    this.lastDelta = undefined;
    this.startPoint = undefined;
  };

  onPanCancel = (): void => {
    this.lastDelta = undefined;
    this.startPoint = undefined;
  };
}
