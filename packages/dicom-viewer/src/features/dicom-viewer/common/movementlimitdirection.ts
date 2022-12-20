import { components, engine } from '@cc/viewers-dvtool';

// 对于x, y进行约束， 约束到某个位置.

export class MovementLimitDirection extends engine.TSBehaviour {
  private directionLimit = [false, false];

  private values = [0, 0];

  setup(directionLimit: [boolean, boolean], values?: [number, number]): void {
    this.directionLimit = directionLimit;
    if (values) {
      this.values = values;
    }
  }

  lateUpdate(): void {
    if (this.directionLimit[0] || this.directionLimit[1]) {
      const { position } = this.scene.mainCamera.transform;
      if (this.directionLimit[0]) {
        position.setX(this.values[0]);
      }
      if (this.directionLimit[1]) {
        position.setY(this.values[1]);
      }
      this.scene.mainCamera.transform.position = position;
    }
  }
}
