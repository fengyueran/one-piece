import * as THREE from 'three';

import { AtomType, getAtomColor } from 'src/helpers';
import { DynamicObj } from './render-manager';

export class Atom implements DynamicObj {
  private mesh: THREE.Mesh;

  constructor(type: AtomType, position: THREE.Vector3, radius = 0.5) {
    this.mesh = this.createMesh({ type, position, radius });
  }

  createMesh(atomInfo: {
    type: AtomType;
    position: THREE.Vector3;
    radius: number;
  }) {
    const { type, radius, position } = atomInfo;
    const color = new THREE.Color(getAtomColor(type));
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(position);
    return this.mesh;
  }

  getMesh = () => this.mesh;
}
