import { Vector2 } from 'three';
import { WheelOp } from './wheelop';
import { Zoomer } from '../common';

export class WheelZoom extends WheelOp {
  factor = 0.01;

  zoomer?: Zoomer;

  protected doWheel(wheelDelta: number, screenCenter: Vector2): void {
    this.zoomer?.updateZoomDelta(Math.exp(wheelDelta * this.factor), screenCenter);
  }
}
