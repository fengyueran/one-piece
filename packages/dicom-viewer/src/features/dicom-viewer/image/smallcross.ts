import { BufferGeometry, LineDashedMaterial, Vector3, AlwaysDepth } from 'three';

import { engine } from '@cc/viewers-dvtool';
import { CoordinateSystem, CSType } from './coordinatesystem';
import { CrosshairData } from './crosshairdata';

function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(`Expected 'val' to be defined, but received ${val}`);
    }
  }
}

const createCrosshairs = (): Array<BufferGeometry> =>
  [0, 1].map((i) => {
    const arr = [0, 0, 0, 0, 0, 0];
    arr[i] = -1 / 2;
    arr[i + 3] = 1 / 2;
    const g = new BufferGeometry().setFromPoints([
      new Vector3(arr[0], arr[1], arr[2]),
      new Vector3(arr[3], arr[4], arr[5]),
    ]);
    return g;
  });

export class SmallCross extends engine.TSBehaviour {
  private cs?: CoordinateSystem;

  private crosshairData?: CrosshairData;

  private groupGo?: engine.GameObject;

  setup(cs: CoordinateSystem, crosshairData: CrosshairData): void {
    this.cs = cs;
    this.crosshairData = crosshairData;
  }

  start(): void {
    this.createLines();
  }

  private createLines(): void {
    const { scene } = this.gameObject;

    const groupGo = this.groupGo || scene.createGameObject('crosshairGroup', this.gameObject);
    this.groupGo = groupGo;
    const material = new LineDashedMaterial({
      color: 0xfdd157,
      linewidth: 1,
      transparent: true,
      depthFunc: AlwaysDepth,
      dashSize: 12 / 32,
      gapSize: 8 / 32,
    });
    const lineMaterial = engine.three.makeMaterial(scene, material);

    const geometries = createCrosshairs();
    const meshes = geometries.map((g) => engine.three.makeMesh(scene, g));

    meshes.map((mesh) => {
      const go = engine.three.createRendererGameObject(
        'crosshairline',
        groupGo,
        lineMaterial,
        mesh,
        engine.three.ThreeLineRenderer,
      );
      const lineRenderer = go.getComponent(engine.three.ThreeLineRenderer);
      assertIsDefined(lineRenderer);

      return go.transform;
    });
  }

  lateUpdate(): void {
    if (!this.cs) {
      return;
    }
    assertIsDefined(this.crosshairData);
    assertIsDefined(this.groupGo);
    const originCrosshair = this.crosshairData.crosshair;
    const worldPosition = this.cs.convert(originCrosshair, CSType.Index3C, CSType.WorldC);
    this.groupGo.transform.localPosition = new Vector3(worldPosition[0], worldPosition[1], 0);
    const scale =
      ((this.scene.mainCamera.orthographicSize * 2) / this.scene.mainCamera.pixelHeight) *
      (12 + 12 + 8);
    this.groupGo.transform.localScale = new Vector3(scale, scale, scale);
  }
}
