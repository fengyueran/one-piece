import * as three from 'three';
import * as ccloader from '@cc/loader';
import { engine } from '@cc/viewers-dvtool';

import { image } from '../image-loader';
export class BaseError extends Error {
  constructor(public type: string, public message: string) {
    super(`${type}: ${message}`);
  }
}

export class NotImplemented extends BaseError {
  constructor(reason = 'NotImplemented') {
    super('NotImplemented', reason);
  }
}

export class FetalError extends BaseError {
  constructor(message: string) {
    super('FetalError', message);
  }
}

export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(`Expected 'val' to be defined, but received ${val}`);
    }
  }
}

export class DicomImageBase extends engine.TSBehaviour {
  protected imageTexture?: three.Texture;

  protected material?: engine.Material;

  protected physicalSize?: Array<number>;

  protected lastUsedImage?: image.Image2D<ccloader.TypedArray>;

  protected source?: image.Image2DSource<ccloader.TypedArray>;

  protected useLinear = false;

  protected dupCount?: Array<number>;

  protected setupBase(
    source: image.Image2DSource<ccloader.TypedArray>,
    physicalSize: Array<number>,
    useLinear?: boolean,
    dupCount?: [number, number],
  ): void {
    this.source = source;
    this.physicalSize = physicalSize;
    this.useLinear = !!useLinear;
    this.dupCount = dupCount;
  }

  protected createMesh(): void {
    assertIsDefined(this.source);
    const image = this.source.getActiveDisplayed();
    assertIsDefined(image);

    const texture = this.createTexture(image);
    if (this.dupCount) {
      if (this.dupCount[0] > 1) {
        texture.wrapS = three.RepeatWrapping;
      }
      if (this.dupCount[1] > 1) {
        texture.wrapT = three.RepeatWrapping;
      }
    }

    const { scene } = this.gameObject;
    this.imageTexture = texture;

    this.material = this.createMaterial(image);

    assertIsDefined(this.physicalSize);
    const dupCount = this.dupCount || [1, 1];
    const geometry = new three.PlaneBufferGeometry(
      this.physicalSize[0] * dupCount[0],
      this.physicalSize[1] * dupCount[1],
    );
    const uv = geometry.getAttribute('uv').array as Float32Array;
    for (let i = 0; i < uv.length; i += 2) {
      if (uv[i] === 1) {
        // eslint-disable-next-line prefer-destructuring
        uv[i] = dupCount[0];
      }
      if (uv[i + 1] === 1) {
        // eslint-disable-next-line prefer-destructuring
        uv[i + 1] = dupCount[1];
      }
    }
    const mesh = engine.three.makeMesh(scene, geometry);
    engine.three.attachRenderer(
      this.gameObject,
      this.material,
      mesh,
      engine.three.ThreeMeshRenderer,
    );
    this.lastUsedImage = image;
  }

  protected updateMaterial(): void {
    if (!this.source) {
      return;
    }
    const image = this.source.getActiveDisplayed();
    if (!image) {
      return;
    }
    if (!this.imageTexture) {
      return;
    }
    if (image !== this.lastUsedImage) {
      const texture = this.imageTexture;
      texture.image = {
        width: image.size[0],
        height: image.size[1],
        data: this.convertBuffer(image.pixel),
      };
      this.lastUsedImage = image;
      texture.needsUpdate = true;
      this.material?.forceDirty();
    }
  }

  lateUpdate(): void {
    if (!this.source) {
      return;
    }
    if (!this.source.getActiveDisplayed()) {
      return;
    }
    if (!this.imageTexture) {
      this.createMesh();
    }
    this.updateMaterial();
  }

  protected createTexture(_image: image.Image2D<ccloader.TypedArray>): three.Texture {
    throw new NotImplemented('DicomImageBase:createTexture');
  }

  protected createMaterial(_image: image.Image2D<ccloader.TypedArray>): engine.Material {
    throw new NotImplemented('DicomImageBase:createMaterial');
  }

  protected convertBuffer(_buffer: ccloader.TypedArray): ccloader.TypedArray {
    throw new NotImplemented('DicomImageBase:convertBuffer');
  }
}
