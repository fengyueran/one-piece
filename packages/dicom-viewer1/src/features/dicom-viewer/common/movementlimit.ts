import { Box2, Box3, Vector2, Vector3 } from 'three';
import { components, engine } from '@cc/viewers-dvtool';


// 这个功能是将一个Rect保证约束于Camera之内， 其将会约束Camera的行为.
// 将会在LateUpdate内进行操作

export class MovementLimit extends engine.TSBehaviour {
  private boxLimit?: Box2;

  setup(boxLimit: Box2): void {
    this.boxLimit = boxLimit;
  }

  lateUpdate(): void {
    if (!this.boxLimit) {
      return;
    }
    const camera = this.scene.mainCamera;
    const min = camera.worldToView(new Vector3(this.boxLimit.min.x, this.boxLimit.min.y, 0));
    const max = camera.worldToView(new Vector3(this.boxLimit.max.x, this.boxLimit.max.y, 0));

    const cameraCenter = new Vector3(camera.pixelWidth / 2, camera.pixelHeight / 2, 0);

    const box3 = new Box3();
    box3.setFromPoints([min, max]);

    const offset = new Vector2(0, 0);
    if (box3.min.x > cameraCenter.x) {
      offset.x = box3.min.x - cameraCenter.x;
    }
    if (box3.max.x < cameraCenter.x) {
      offset.x = box3.max.x - cameraCenter.x;
    }

    if (box3.min.y > cameraCenter.y) {
      offset.y = box3.min.y - cameraCenter.y;
    }
    if (box3.max.y < cameraCenter.y) {
      offset.y = box3.max.y - cameraCenter.y;
    }

    if (offset.x === 0 && offset.y === 0) {
      return;
    }
    const diff = camera.viewToWorld(offset.x, offset.y).sub(camera.viewToWorld(0, 0));
    camera.transform.position = camera.transform.position.clone().add(diff);
  }
}
