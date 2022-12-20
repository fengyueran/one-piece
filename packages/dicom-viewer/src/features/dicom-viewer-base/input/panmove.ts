import { Vector2 } from 'three';

import { engine } from '@cc/viewers-dvtool';

import { PanOp } from './panop';

export class PanMove extends PanOp {
  camera?: engine.Camera;

  protected doMove(diff: Vector2): void {
    const camera = this.camera || this.gameObject.scene.mainCamera;
    const origin = camera.viewToWorld(0, 0);
    const v = camera.viewToWorld(diff.x, diff.y);
    v.subVectors(origin, v);

    v.add(camera.transform.localPosition);
    camera.transform.localPosition = v;
  }
}
