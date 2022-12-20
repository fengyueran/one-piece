import { Vector2 } from 'three';

import { PanOp } from './panop';

import { CSType, CrosshairData, CoordinateSystem } from '../image';

export class PanCrosshair extends PanOp {
  crosshair?: CrosshairData;

  cs?: CoordinateSystem;

  protected doMove(_diff: Vector2, center: Vector2): void {
    if (this.crosshair && this.cs) {
      const worldPoint = this.gameObject.scene.mainCamera.viewToWorld(center.x, center.y);
      const index3 = this.cs.convert([worldPoint.x, worldPoint.y], CSType.WorldC, CSType.Index3C);
      this.crosshair.setCrosshair(index3);
    }
  }
}
