import { Vector2 } from 'three';
import { InputBase } from './inputbase';

import { engine } from '@cc/viewers-dvtool';

export abstract class WheelOp extends InputBase {
  protected abstract doWheel(wheelDelta: number, screenCenter: Vector2): void;

  onWheel(e: engine.InputEvent): void {
    if (e.deltaY === 0) {
      return;
    }
    this.doWheel(e.deltaY > 0 ? -1 : 1, new Vector2(e.offsetX, e.offsetY));
  }
}
