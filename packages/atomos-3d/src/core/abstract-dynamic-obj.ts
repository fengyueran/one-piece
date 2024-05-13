import * as THREE from 'three';

export abstract class DynamicObj extends THREE.Mesh {
  abstract update(): void;
}
