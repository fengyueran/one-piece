import * as THREE from 'three';

export abstract class DynamicObj extends THREE.Mesh {
  abstract update(): void;
}

export abstract class DynamicGroup extends THREE.Group {
  abstract update(): void;
}
