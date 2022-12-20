import { isEqual, clamp } from 'lodash-es';
import { components, engine } from '@cc/viewers-dvtool';

export class CrosshairData extends engine.TSBehaviour {
  protected mCrosshair: Array<number> = [0, 0, 0];

  private size?: Array<number>;

  setupData(size: Array<number>): void {
    this.size = size;
  }

  get crosshair(): Array<number> {
    return this.mCrosshair;
  }

  setCrosshair(v: Array<number>): void {
    const crosshair = [Math.floor(v[0]), Math.floor(v[1]), Math.ceil(v[2])];
    if (this.size) {
      [0, 1, 2].forEach((i) => {
        crosshair[i] = clamp(crosshair[i], 0, this.size![i] - 1);
      });
    }
    if (isEqual(this.mCrosshair, crosshair)) {
      return;
    }
    this.mCrosshair = crosshair;
    this.gameObject.scene.nc.emit('crosshairChanged', this.mCrosshair);
  }
}
