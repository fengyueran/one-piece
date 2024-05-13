import * as THREE from 'three';

import { AtomType, getAtomColor } from 'src/helpers';
import { DynamicObj } from './abstract-dynamic-obj';

export class Atom extends DynamicObj {
  constructor(type: AtomType, position: THREE.Vector3, radius = 0.5) {
    const color = new THREE.Color(getAtomColor(type));
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color });
    super(geometry, material);
    this.position.copy(position);
  }

  // eslint-disable-next-line
  update = () => {};
}
