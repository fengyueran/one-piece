import * as three from 'three';
import * as ccloader from '@cc/loader';
import { isEqual, cloneDeep } from 'lodash-es';
import { components, products, engine } from '@cc/viewers-dvtool';

import {
  createDicomImageMaterial,
  createDicomImageTexture,
  DicomImageFormat,
} from '../materiallibrary';

import { DicomImageBase } from './dicomimagebase';
import { Image2DSource, Image2D } from '../image-loader';

export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(`Expected 'val' to be defined, but received ${val}`);
    }
  }
}

export class DicomImagePlane extends DicomImageBase {
  windowData?: components.image.LUTWindowData;

  private lastUsedWindow?: components.image.LUTWindow;

  private clonedMaterials: Array<engine.Material> = [];

  private usedImageFormat = DicomImageFormat.Int16Format;

  private getImageFormat(buffer: ccloader.TypedArray) {
    if (this.useLinear) {
      return DicomImageFormat.FloatFormat;
    }
    const isUint8Buffer = buffer instanceof Uint8Array;
    if (isUint8Buffer) {
      return DicomImageFormat.Uint8Format;
    }
    if (this.scene.getBackingCanvasType() === engine.BackingCanvasType.Webgl1) {
      return DicomImageFormat.FloatFormat;
    }
    return DicomImageFormat.Int16Format;
  }

  protected convertBuffer(buffer: ccloader.TypedArray) {
    const format = this.getImageFormat(buffer);
    if (format === DicomImageFormat.FloatFormat) {
      const ret = new Float32Array(buffer.length);
      for (let i = 0; i < buffer.length; i += 1) {
        ret[i] = buffer[i] / 65536 + 0.5;
      }
      return ret;
    }
    return buffer;
  }

  protected createTexture(image: Image2D<ccloader.TypedArray>) {
    const format = this.getImageFormat(image.pixel);
    this.usedImageFormat = format;
    return createDicomImageTexture(
      image.size[0],
      image.size[1],
      this.convertBuffer(image.pixel),
      format,
      this.useLinear,
      this.scene.getBackingCanvasType() === engine.BackingCanvasType.Webgl1,
    );
  }

  protected createMaterial(image: Image2D<ccloader.TypedArray>) {
    assertIsDefined(this.windowData);
    assertIsDefined(this.imageTexture);
    const format = this.getImageFormat(image.pixel);
    this.lastUsedWindow = cloneDeep(this.windowData.data);
    return engine.three.makeMaterial(
      this.scene,
      createDicomImageMaterial(
        this.windowData.data,
        this.imageTexture,
        new three.Color(255, 255, 255),
        format,
      ),
    );
  }

  setupData(
    windowData: components.image.LUTWindowData,
    source: Image2DSource<ccloader.TypedArray>,
    physicalSize: Array<number>,
    useLinear?: boolean,
    dupCount?: [number, number],
  ): void {
    this.setupBase(source, physicalSize, useLinear, dupCount);
    this.windowData = windowData;
  }

  protected updateMaterial(): void {
    super.updateMaterial();

    assertIsDefined(this.windowData);
    const window = this.windowData.data;
    if (!isEqual(window, this.lastUsedWindow)) {
      assertIsDefined(this.material);
      [this.material].concat(this.clonedMaterials).forEach((m) => {
        m.setUniforms({
          u_windowbegin: { value: window.windowCenter - window.windowWidth / 2 },
          u_windowwidth: { value: window.windowWidth },
        });
      });
      this.lastUsedWindow = window;
    }
  }

  // TODO: Temporary for minimap.
  addCloned(color: three.Color): engine.GameObject | undefined {
    if (!this.imageTexture) {
      return undefined;
    }

    assertIsDefined(this.windowData);
    const material = engine.three.makeMaterial(
      this.gameObject.scene,

      createDicomImageMaterial(
        this.windowData.data,
        this.imageTexture,
        color,
        this.usedImageFormat,
      ),
    );
    const geometry = new three.PlaneBufferGeometry(this.physicalSize![0], this.physicalSize![1]);
    const mesh = engine.three.makeMesh(this.gameObject.scene, geometry);
    const go = engine.three.createRendererGameObject(
      'cloned dicomimage',
      this.gameObject,
      material,
      mesh,
      engine.three.ThreeMeshRenderer,
    );

    this.clonedMaterials.push(material);
    return go;
  }
}
