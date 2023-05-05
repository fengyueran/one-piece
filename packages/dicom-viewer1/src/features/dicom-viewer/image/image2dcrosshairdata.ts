import * as ccloader from '@cc/loader';

import { CrosshairData } from './crosshairdata';

import { CoordinateSystem, CSType } from './coordinatesystem';
import { image } from '../image-loader';

export class Image2DCrosshairData extends CrosshairData {
  cs?: CoordinateSystem;

  private sources: Array<image.Image2DSource<ccloader.TypedArray>> = [];

  private lastRequested = -1;

  addSource(source: image.Image2DSource<ccloader.TypedArray>): void {
    if (this.sources.indexOf(source) !== -1) {
      return;
    }
    this.sources.push(source);
    this.lastRequested = -1;
  }

  awake(): void {
    this.scriptOrder = 200; // set to > 100 for requestImage at last one of update.
  }

  private requestImage(): void {
    if (this.cs) {
      const index2 = this.cs.convert(this.mCrosshair, CSType.Index3C, CSType.Index2C);
      const needed = Math.round(index2[2]);
      if (needed !== this.lastRequested) {
        this.lastRequested = needed;
        this.sources.forEach((s) => s.request(Math.round(index2[2])));
      }
    }
  }

  onEnable(): void {
    this.requestImage();
  }

  update(): void {
    if (!this.gameObject.scene.backgroundMode) {
      this.requestImage();
    }
  }
}
