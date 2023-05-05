import { Vector2 } from 'three';

import { PanOp } from './panop';
import { Zoomer } from '../common';

export class PanZoom extends PanOp {
  zoomer?: Zoomer;

  factor = 0.01;

  protected doMove(diff: Vector2): void {
    this.zoomer?.updateZoomDelta(Math.exp(-diff.y * this.factor), this.startPoint);
  }
}
