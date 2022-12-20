import { MeshBasicMaterial, Texture } from 'three';

export const createBasicMaterial = (color: number): MeshBasicMaterial =>
  new MeshBasicMaterial({ color });

export const createBasicTextureMaterial = (texture: Texture): MeshBasicMaterial =>
  new MeshBasicMaterial({ map: texture });
