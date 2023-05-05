import { components, engine } from '@cc/viewers-dvtool';

export class BillBoard extends engine.TSBehaviour {
  lateUpdate(): void {
    this.gameObject.transform.rotation = this.gameObject.scene.mainCamera.transform.rotation;
  }
}
