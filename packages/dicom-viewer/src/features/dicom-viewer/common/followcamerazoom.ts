import { Vector3 } from 'three';
import { components, engine } from '@cc/viewers-dvtool';

export class FollowCameraZoom extends engine.TSBehaviour {
  baseLocalScale = new Vector3(1, 1, 1);

  lateUpdate(): void {
    const diff = this.gameObject.scene.mainCamera.viewDiffToWorldDiff(1, 0);

    this.gameObject.transform.localScale = this.baseLocalScale
      .clone()
      .multiplyScalar(diff.length());
  }
}
