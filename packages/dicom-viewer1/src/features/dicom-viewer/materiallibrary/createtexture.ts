import {
  DataTexture,
  RedIntegerFormat,
  ShortType,
  RGBAFormat,
  TextureLoader,
  NearestFilter,
  Texture,
  LuminanceFormat,
  FloatType,
  LinearFilter,
  RedFormat,
} from 'three';

import * as ccloader from '@cc/loader';

export enum DicomImageFormat {
  Uint8Format,
  Int16Format,
  FloatFormat,
}

export enum DicomMaskFormat {
  RGBA,
  RED,
}

export const createMaskImageTexture = (
  width: number,
  height: number,
  pixel: Uint8Array,
  format: DicomMaskFormat,
  linear: boolean,
): Texture => {
  const texture = new DataTexture(
    pixel,
    width,
    height,
    format === DicomMaskFormat.RGBA ? RGBAFormat : LuminanceFormat,
  );
  texture.flipY = true;
  if (format === DicomMaskFormat.RED) {
    texture.unpackAlignment = 1;
  }
  if (linear) {
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
  }
  return texture;
};

export const createDicomImageTexture = (
  width: number,
  height: number,
  pixel: ccloader.TypedArray,
  format: DicomImageFormat,
  linear: boolean,
  webgl1: boolean,
): Texture => {
  if (format === DicomImageFormat.Uint8Format) {
    return createMaskImageTexture(width, height, pixel as Uint8Array, DicomMaskFormat.RED, linear);
  }

  if (format === DicomImageFormat.Int16Format) {
    const texture = new DataTexture(pixel, width, height, RedIntegerFormat, ShortType);
    texture.internalFormat = 'R16I';
    texture.flipY = true;
    texture.unpackAlignment = 2;
    return texture;
  }

  const texture = new DataTexture(
    pixel,
    width,
    height,
    webgl1 ? LuminanceFormat : RedFormat,
    FloatType,
  );
  texture.flipY = true;
  if (linear) {
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
  }

  return texture;
};

export const createImageTexture = (url: string): Texture => {
  const texture = new TextureLoader().load(url);
  return texture;
};

export const createColorTexture = (clarray: Uint8Array): Texture => {
  const texture = new DataTexture(clarray, clarray.length / 4, 1, RGBAFormat);
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;

  return texture;
};

export const createColorLabelTexture = (
  getRGBByLabel: (label: number) => Array<number>,
): Texture => {
  const clarray = new Uint8Array(256 * 4);
  for (let i = 0; i < 256; i++) {
    [clarray[i * 4], clarray[i * 4 + 1], clarray[i * 4 + 2], clarray[i * 4 + 3]] = getRGBByLabel(i);
  }

  return new DataTexture(clarray, clarray.length / 4, 1, RGBAFormat);
};
