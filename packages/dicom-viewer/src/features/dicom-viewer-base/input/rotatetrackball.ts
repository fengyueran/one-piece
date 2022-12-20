import { Vector2, Quaternion, Vector3 } from 'three';

import { PanOp } from './panop';

export class RotateTrackball extends PanOp {
  protected target = new Vector3(0, 0, 0);

  distance = 1000;

  initialRotation: Quaternion = new Quaternion(0, 0, 0, 1);

  setTarget(target: Vector3): void {
    this.target = target;
    this.gameObject.scene.mainCamera.transform.lookAt(this.target);
    this.reset();
  }

  reset(): void {
    const camera = this.gameObject.scene.mainCamera;
    camera.transform.localRotation = this.initialRotation;
    camera.transform.localPosition = this.target
      .clone()
      .add(camera.transform.forward.clone().multiplyScalar(this.distance));
  }

  private rotateByAngles(byRight: number, byUp: number) {
    const camera = this.gameObject.scene.mainCamera;
    const { right, up, position } = camera.transform;
    const qright = new Quaternion().setFromAxisAngle(right, byRight); // rotate by right
    const qup = new Quaternion().setFromAxisAngle(up, byUp); // rotate by up
    const q = qup.multiply(qright); // order: right => up

    const v = position.clone().sub(this.target);
    const newV = v.clone().applyQuaternion(q);
    const newPosition = position.clone().add(newV).sub(v);

    camera.transform.localPosition = newPosition;
    camera.transform.localRotation = q.multiply(camera.transform.localRotation);
  }

  protected doMove(diff: Vector2): void {
    const ratio = 0.005;
    this.rotateByAngles(-diff.y * ratio, -diff.x * ratio);
  }
}
