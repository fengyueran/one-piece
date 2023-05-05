import { MeshLambertMaterial, UniformsUtils, UniformsLib, Color, ShaderMaterial } from 'three';

import * as colorGeometryShader from './shaders/colorgeometry';

export const createPlyLambert = (): MeshLambertMaterial => {
  return new MeshLambertMaterial();
};

export const createFFRPlyLambert = (): MeshLambertMaterial => {
  return new MeshLambertMaterial({ vertexColors: true });
};

export const createLabelLambert = (color: string): ShaderMaterial => {
  const uniforms = UniformsUtils.merge([
    UniformsLib.lights,
    {
      u_color: { value: new Color(color) },
    },
  ]);
  return new ShaderMaterial({
    uniforms,
    vertexShader: colorGeometryShader.vert,
    fragmentShader: colorGeometryShader.frag,
    lights: true,
  });
};
