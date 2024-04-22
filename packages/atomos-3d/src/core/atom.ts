import * as THREE from 'three';

import { ObjectWithUpdate } from './render-manager';

export class Atom implements ObjectWithUpdate {
  private mesh: THREE.Mesh;
  type?: string;

  constructor(
    type: string,
    private position: THREE.Vector3,
    private color: THREE.ColorRepresentation,
    private radius = 0.5
  ) {
    this.type = type;
    this.mesh = this.createMesh();
  }

  createMesh() {
    const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color: this.color });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);
    return this.mesh;
  }

  getMesh = () => this.mesh;

  update = () => {};
}
