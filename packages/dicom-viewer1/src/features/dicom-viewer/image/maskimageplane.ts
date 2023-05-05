import * as three from 'three';
import * as ccloader from '@cc/loader';
import { components, engine } from '@cc/viewers-dvtool';
import {
  createMaskImageMaterial,
  createMaskImageTexture,
  createColorLabelTexture,
  DicomMaskFormat,
} from '../materiallibrary';
import { image } from '../image-loader';
import { ColorTable } from '../common';
import { DicomImageBase } from './dicomimagebase';

function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(`Expected 'val' to be defined, but received ${val}`);
    }
  }
}

export class MaskImagePlane extends DicomImageBase {
  opacity = 0.5;

  private lastUsedOpacity?: number;

  private colorTable?: ColorTable;

  colorlabelTexture?: three.Texture;

  protected getFormat() {
    if (this.useLinear) {
      return DicomMaskFormat.RGBA;
    }
    return DicomMaskFormat.RED;
  }

  protected convertBuffer(pixel: ccloader.TypedArray) {
    if (this.getFormat() === DicomMaskFormat.RGBA) {
      return this.convertBufferToRGBA(pixel as Uint8Array);
    }
    return pixel;
  }

  protected createMaterial() {
    assertIsDefined(this.imageTexture);
    this.lastUsedOpacity = this.opacity;
    return engine.three.makeMaterial(
      this.scene,
      createMaskImageMaterial(
        this.imageTexture,
        this.opacity,
        this.getFormat() === DicomMaskFormat.RED ? this.colorlabelTexture : undefined,
      ),
    );
  }

  protected createTexture(image: image.Image2D<Uint8Array>) {
    return createMaskImageTexture(
      image.size[0],
      image.size[1],
      this.convertBuffer(image.pixel) as Uint8Array,
      this.getFormat(),
      this.useLinear,
    );
  }

  setupData(
    source: image.Image2DSource<Uint8Array>,
    physicalSize: Array<number>,
    opacity: number,
    colorTable: ColorTable,
    useLinear?: boolean,
    dupCount?: [number, number],
  ): void {
    this.colorTable = colorTable;
    this.opacity = opacity;
    super.setupBase(source, physicalSize, useLinear, dupCount);
  }

  setOpacity(opacity: number): void {
    if (this.opacity === opacity) {
      return;
    }
    this.opacity = opacity;
    this.gameObject.scene.nc.emit('maskOpacityEventChanged', opacity);
  }

  protected updateMaterial(): void {
    super.updateMaterial();
    if (this.opacity !== this.lastUsedOpacity) {
      assertIsDefined(this.material);
      this.material.setUniforms({
        u_opacity: { value: this.opacity },
      });
      this.lastUsedOpacity = this.opacity;
    }
  }

  protected createMesh(): void {
    assertIsDefined(this.colorTable);
    this.colorlabelTexture = createColorLabelTexture(this.colorTable.getRGBByLabel);
    super.createMesh();
  }

  private convertBufferToRGBA(ab: Uint8Array) {
    assertIsDefined(this.colorTable);
    const ret = new Uint8Array(ab.length * 4);
    for (let i = 0; i < ab.length; i += 1) {
      if (ab[i] !== 0) {
        [ret[i * 4], ret[i * 4 + 1], ret[i * 4 + 2], ret[i * 4 + 3]] =
          this.colorTable.getRGBByLabel(ab[i]);
      }
    }
    return ret;
  }
}
