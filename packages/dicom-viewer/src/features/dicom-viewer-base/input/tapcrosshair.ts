import { TapOp } from './tapop';

import { CSType, CrosshairData, CoordinateSystem } from '../image';

export class TapCrosshair extends TapOp {
  crosshair?: CrosshairData;

  cs?: CoordinateSystem;

  protected doClick(x: number, y: number): void {
    if (this.crosshair && this.cs) {
      const worldPoint = this.gameObject.scene.mainCamera.viewToWorld(x, y);
      const index3 = this.cs.convert([worldPoint.x, worldPoint.y], CSType.WorldC, CSType.Index3C);
      this.crosshair.setCrosshair(index3);
    }
  }
}
