import { Vector2 } from 'three';
import { Zoomer } from '../common';
import { InputBase } from './inputbase';

import { engine } from '@cc/viewers-dvtool';

export class PinchZoom extends InputBase {
  zoomer?: Zoomer;

  private pinchStarted = false;

  private lastScale = 1;

  private pinchStartCenter?: Vector2;

  onPinchStart(e: engine.InputEvent): void {
    this.pinchStarted = true;
    this.pinchStartCenter = new Vector2(e.offsetX, e.offsetY);
    this.lastScale = 1;
  }

  onPinchEnd(): void {
    this.pinchStarted = false;
    this.lastScale = 1;
  }

  onPinchCancel(): void {
    this.pinchStarted = false;
    this.lastScale = 1;
  }

  onPinchZoom(e: engine.InputEvent): void {
    if (!this.pinchStarted) {
      return;
    }
    if (this.zoomer && e.scale) {
      this.zoomer.updateZoomDelta(e.scale / this.lastScale, this.pinchStartCenter);
      this.lastScale = e.scale;
    }
  }
}
