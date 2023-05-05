import { BufferGeometry, Vector3 } from 'three';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { components, engine } from '@cc/viewers-dvtool';

const createIndicatorLine = (width: number): BufferGeometry => {
  const arr = [0, 0, 0, 0, 0, 0];
  arr[0] = -width / 2;
  arr[3] = width / 2;
  const g = new LineGeometry();
  g.setPositions([arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]]);
  return g;
};

export const createWidthLine = (linewidth: number, aspect: number, color: number): LineMaterial => {
  const material = new LineMaterial({
    color,
    linewidth,
    transparent: true,
  });
  material.resolution.set(aspect, 1);

  return material;
};

export class ClipIndicator extends engine.TSBehaviour {
  private cs?: components.image.CoordinateSystem;

  private subTransforms?: Array<engine.Transform>;

  private physicalSize?: Array<number>;

  private center?: Array<number>;

  clipRange?: number[];

  setCS(
    cs: components.image.CoordinateSystem,
    physicalSize: Array<number>,
    center: Array<number>,
  ): void {
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
    const lineMaterial = engine.three.makeMaterial(scene, createWidthLine(3, 1, 0xfdd157));

    const geometrie = createIndicatorLine(this.physicalSize[0]);

    const meshes = [0, 1].map(() => engine.three.makeMesh(scene, geometrie));

    const subTransforms = meshes.map((mesh) => {
      const go = engine.three.createRendererGameObject(
        'ClipIndicator',
        this.gameObject,
        lineMaterial,
        mesh,
        engine.three.ThreeWidthLineRenderer,
      );

      return go.transform;
    });

    subTransforms.forEach((tr) => tr.setParent(this.transform));
    this.subTransforms = subTransforms;
  }

  changeClipRange(clipRange: number[]): void {
    this.clipRange = clipRange;
  }

  lateUpdate(): void {
    if (!this.clipRange) {
      return;
    }
    this.tryCreateLines();
    this.clipRange.forEach((axialIndex, index) => {
      if (!this.cs || !this.subTransforms) {
        return;
      }
      const offset = [0.5, 0.5, -0.5];
      const originCenter = [0, 1, 2].map((i) => this.center![i] + offset[i]);
      const crosshair = [0, 0, axialIndex];
      const originCrosshair = [0, 1, 2].map((i) => crosshair[i] + offset[i]);
      const center = this.cs.convert(
        originCenter,
        components.image.CSType.Index3C,
        components.image.CSType.WorldC,
      );
      const worldPosition = this.cs.convert(
        originCrosshair,
        components.image.CSType.Index3C,
        components.image.CSType.WorldC,
      );
      if (this.subTransforms.length > 0) {
        const tr = this.subTransforms[index];
        tr.localPosition = new Vector3(center[0], worldPosition[1], worldPosition[2]);
      }
    });
  }
}
