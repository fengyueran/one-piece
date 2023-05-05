import { BufferGeometry, Vector3 } from 'three';

import { components, engine } from '@cc/viewers-dvtool';
import { createCrosshairLine } from '../materiallibrary';

import { CoordinateSystem, CSType } from './coordinatesystem';
import { CrosshairData } from './crosshairdata';

function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(`Expected 'val' to be defined, but received ${val}`);
    }
  }
}

const createCrosshairs = (physicalSize: Array<number>): Array<BufferGeometry> =>
  physicalSize.map((s, i) => {
    const arr = [0, 0, 0, 0, 0, 0];
    arr[i] = -s / 2;
    arr[i + 3] = s / 2;
    const g = new BufferGeometry().setFromPoints([
      new Vector3(arr[0], arr[1], arr[2]),
      new Vector3(arr[3], arr[4], arr[5]),
    ]);
    return g;
  });

export class ImageCrosshair extends engine.TSBehaviour {
  private cs?: CoordinateSystem;

  private subTransforms?: Array<engine.Transform>;

  private physicalSize?: Array<number>;

  private center?: Array<number>;

  crosshairData?: CrosshairData;

  private dashPixelSize = 1;

  private gapPixelSize = 1;

  setDashedSize(dashSize: number, gapSize: number): void {
    this.dashPixelSize = dashSize;
    this.gapPixelSize = gapSize;
    this.subTransforms?.forEach((tr) => {
      const lineRenderer = tr.gameObject.getComponent(engine.three.ThreeLineRenderer);
      if (lineRenderer) {
        lineRenderer.setZoomedDash(this.dashPixelSize, this.gapPixelSize);
      }
    });
  }

  private is3D() {
    return this.physicalSize && this.physicalSize.length === 3;
  }

  setCS(cs: CoordinateSystem, physicalSize: Array<number>, center: Array<number>): void {
    this.cs = cs;
    this.physicalSize = physicalSize;
    this.center = center;
  }

  start(): void {
    this.tryCreateLines();
  }

  private tryCreateLines(): void {
    if (this.subTransforms) {
      return;
    }
    if (!this.physicalSize) {
      return;
    }
    const { scene } = this.gameObject;
    const lineMaterial = engine.three.makeMaterial(scene, createCrosshairLine(1, !this.is3D()));

    const geometries = createCrosshairs(this.physicalSize!);
    const meshes = geometries.map((g) => engine.three.makeMesh(scene, g));

    const subTransforms = meshes.map((mesh) => {
      const go = engine.three.createRendererGameObject(
        'crosshairline',
        this.gameObject,
        lineMaterial,
        mesh,
        engine.three.ThreeLineRenderer,
      );
      go.layer = this.gameObject.layer;
      const lineRenderer = go.getComponent(engine.three.ThreeLineRenderer);
      assertIsDefined(lineRenderer);
      lineRenderer.setZoomedDash(this.dashPixelSize, this.gapPixelSize);

      return go.transform;
    });

    subTransforms.forEach((tr) => tr.setParent(this.transform));
    this.subTransforms = subTransforms;
  }

  lateUpdate(): void {
    if (!this.cs) {
      return;
    }
    this.tryCreateLines();

    if (this.subTransforms && this.crosshairData) {
      const offset = this.is3D() ? [0, 0, 0] : [0.5, 0.5, -0.5];
      const originCenter = [0, 1, 2].map((i) => this.center![i] + offset[i]);
      const originCrosshair = [0, 1, 2].map((i) => this.crosshairData!.crosshair[i] + offset[i]);
      const center = this.cs.convert(originCenter, CSType.Index3C, CSType.WorldC);
      const worldPosition = this.cs.convert(originCrosshair, CSType.Index3C, CSType.WorldC);
      if (this.subTransforms.length > 0) {
        const tr = this.subTransforms[0];
        tr.localPosition = new Vector3(center[0], worldPosition[1], worldPosition[2]);
      }
      if (this.subTransforms.length > 1) {
        const tr = this.subTransforms[1];
        tr.localPosition = new Vector3(worldPosition[0], center[1], worldPosition[2]);
      }
      if (this.subTransforms.length > 2) {
        const tr = this.subTransforms[2];
        tr.localPosition = new Vector3(worldPosition[0], worldPosition[1], center[2]);
      }
    }
  }

  addCloned(): engine.GameObject | undefined {
    if (!this.cs || !this.physicalSize || !this.center) {
      return undefined;
    }
    const go = this.gameObject.scene.createGameObject('cloned crosshair', this.gameObject);
    const cloned = go.addComponent(ImageCrosshair);
    cloned.setCS(this.cs, this.physicalSize, this.center);
    cloned.crosshairData = this.crosshairData;
    return go;
  }
}
