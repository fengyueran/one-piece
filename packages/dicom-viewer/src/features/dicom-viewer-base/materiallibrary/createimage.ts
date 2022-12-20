import { ShaderMaterial, DoubleSide, Color, UniformsUtils, UniformsLib, Texture } from 'three';

import { components } from '@cc/viewers-dvtool';

import * as dicomimageShader from './shaders/dicomimage';
import * as dicomimage8Shader from './shaders/dicomimage8';
import * as maskimageShader from './shaders/maskimage';
import * as dicomimageLinear from './shaders/dicomimagelinear';
import * as maskimageLinear from './shaders/maskimagelinear';
import * as ffrShader from './shaders/ffr';
import * as ffrColorShader from './shaders/ffrcolor';
import { DicomImageFormat } from './createtexture';

export const createDicomImageMaterial = (
  window: components.image.LUTWindow,
  texture: Texture,
  color: Color,
  format: DicomImageFormat,
): ShaderMaterial => {
  let shader: {
    vert: string;
    frag: string;
  } = dicomimageShader;
  if (format === DicomImageFormat.Uint8Format) {
    shader = dicomimage8Shader;
  }
  if (format === DicomImageFormat.FloatFormat) {
    shader = dicomimageLinear;
  }

  const uniforms = {
    u_texture: { value: texture },
    u_windowbegin: { value: window.windowCenter - window.windowWidth / 2 },
    u_windowwidth: { value: window.windowWidth },
    u_color: { value: color },
  };

  return new ShaderMaterial({
    uniforms,
    vertexShader: shader.vert,
    fragmentShader: shader.frag,
    side: DoubleSide,
  });
};

export const createMaskImageMaterial = (
  texture: Texture,
  opacity: number,
  colortableTexture?: Texture,
): ShaderMaterial => {
  const uniforms = {
    u_texture: { value: texture },
    u_labelcolor: { value: colortableTexture },
    u_opacity: { value: opacity },
  };
  if (colortableTexture) {
    uniforms.u_labelcolor = { value: colortableTexture };
  }
  const shader = colortableTexture ? maskimageShader : maskimageLinear;
  return new ShaderMaterial({
    uniforms,
    transparent: true,
    vertexShader: shader.vert,
    fragmentShader: shader.frag,
    side: DoubleSide,
  });
};

export const createFFRMaterial = (colorstopTexture: Texture, alpha = 1.0): ShaderMaterial => {
  const uniforms = UniformsUtils.merge([
    UniformsLib.lights,
    {
      u_texture: { value: colorstopTexture },
      u_alpha: { value: alpha },
    },
  ]);
  const material = new ShaderMaterial({
    uniforms,
    vertexShader: ffrShader.vert,
    fragmentShader: ffrShader.frag,
    lights: true,
    transparent: alpha !== 1.0,
  });
  if (alpha !== 1.0) {
    material.depthWrite = false;
  }
  return material;
};

export const createFFRColorMaterial = (alpha = 1.0): ShaderMaterial => {
  const uniforms = UniformsUtils.merge([
    UniformsLib.lights,
    {
      u_alpha: { value: alpha },
    },
  ]);
  const material = new ShaderMaterial({
    uniforms,
    vertexShader: ffrColorShader.vert,
    fragmentShader: ffrColorShader.frag,
    lights: true,
    transparent: alpha !== 1.0,
  });
  if (alpha !== 1.0) {
    material.depthWrite = false;
  }
  return material;
};
