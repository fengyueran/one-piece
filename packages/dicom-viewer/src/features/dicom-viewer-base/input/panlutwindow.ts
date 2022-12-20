import { Vector2 } from 'three';

import { PanOp } from './panop';
import { LUTWindowData } from '../image';

export class PanLUTWindow extends PanOp {
  windowData?: LUTWindowData;

  public scale = 5;

  protected doMove(diff: Vector2): void {
    if (this.windowData) {
      this.windowData.addDiff(diff.x * this.scale, diff.y * this.scale);
    }
  }
}
