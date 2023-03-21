import { isEqual } from 'lodash-es';
import * as ccloader from '@cc/loader';

import { CrosshairData } from './crosshairdata';

import { engine } from '@cc/viewers-dvtool';
import { CoordinateSystem, CSType } from './coordinatesystem';
import { image } from '../image-loader';

export class UpdateIntensity extends engine.TSBehaviour {
  lastUsedImage?: image.Image2D<ccloader.TypedArray>;

  lastCrosshair?: Array<number>;

  crosshairData?: CrosshairData;

  source?: image.Image2DSource<ccloader.TypedArray>;

  cs?: CoordinateSystem;

  setupData(
    crosshairData: CrosshairData,
    source: image.Image2DSource<ccloader.TypedArray>,
    cs: CoordinateSystem,
  ): void {
    this.crosshairData = crosshairData;
    this.source = source;
    this.cs = cs;
  }

  update(): void {
    if (!this.source || !this.crosshairData || !this.cs) {
      return;
    }
    if (
      this.lastUsedImage !== this.source.getActiveDisplayed() ||
      !isEqual(this.lastCrosshair, this.crosshairData.crosshair)
    ) {
      this.lastUsedImage = this.source.getActiveDisplayed();
      if (!this.lastUsedImage) {
        return;
      }
      this.lastCrosshair = this.crosshairData.crosshair;
      const { pixel } = this.lastUsedImage!;
      const index2 = this.cs.convert(this.lastCrosshair, CSType.Index3C, CSType.Index2C);
      const intensity = pixel[index2[0] + index2[1] * this.lastUsedImage!.size[0]];
      this.gameObject.scene.nc.emit('intensityChanged', intensity);
    }
  }
}
