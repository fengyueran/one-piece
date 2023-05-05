import { Vector2 } from 'three';

export interface Zoomer {
  updateZoomDelta: (delta: number, center?: Vector2) => void;
}

export interface ColorTable {
  getHEXByLabel: (label: number) => string;
  getRGBByLabel: (label: number) => [number, number, number, number];
}
