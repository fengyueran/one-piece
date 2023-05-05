import { AlwaysDepth, LessEqualDepth, LineDashedMaterial, LineBasicMaterial } from 'three';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';

export const createCrosshairLine = (
  linewidth: number,
  ignoreDepth = true,
  color = 0x006fff,
): LineDashedMaterial => {
  return new LineDashedMaterial({
    color,
    linewidth,
    transparent: true,
    depthFunc: ignoreDepth ? AlwaysDepth : LessEqualDepth,
    dashSize: 2,
    gapSize: 1,
  });
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

export const createBasicLine = (color: number): LineBasicMaterial => {
  return new LineBasicMaterial({
    color,
  });
};
