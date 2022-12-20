import { Vector3, Vector2 } from 'three';
import { CrosshairData, CoordinateSystem, CSType } from '../image';

import { RotateTrackball } from './rotatetrackball';

export class CenterCrosshairRotateTrackball extends RotateTrackball {
  crosshairData?: CrosshairData;

  cs?: CoordinateSystem;

  private lastCrosshair = [-1, -1, -1];

  update(): void {
    super.update();
    if (!this.crosshairData || !this.cs) {
      return;
    }

    if (
      this.lastCrosshair[0] === this.crosshairData.crosshair[0] &&
      this.lastCrosshair[1] === this.crosshairData.crosshair[1] &&
      this.lastCrosshair[2] === this.crosshairData.crosshair[2]
    ) {
      return;
    }
    const crosshairWorld = new Vector3(
      ...this.cs.convert(this.crosshairData.crosshair, CSType.Index3C, CSType.WorldC),
    );

    this.transform.localPosition = this.transform.localPosition
      .clone()
      .add(crosshairWorld)
      .sub(this.target);
    this.lastCrosshair = [...this.crosshairData.crosshair];
    this.target = crosshairWorld;
  }

  protected doMove(diff: Vector2): void {
    if (this.currentMouseButton === 2) {
      return;
    }
    if (this.currentMouseButton === 0) {
      super.doMove(diff);
      return;
    }
    const camera = this.gameObject.scene.mainCamera;
    const origin = camera.viewToWorld(0, 0);
    const v = camera.viewToWorld(diff.x, diff.y);
    v.subVectors(origin, v);
    const offset = v.clone();

    v.add(camera.transform.localPosition);
    camera.transform.localPosition = v;
    this.target = this.target.add(offset);
  }
}
