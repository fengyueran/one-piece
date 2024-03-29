import * as THREE from 'three';

import { ObjectWithUpdate } from './render-manager';

export class Atom implements ObjectWithUpdate {
  private mesh: THREE.Mesh;
  constructor(type, position, color = 0xffffff, radius = 0.5) {
    this.type = type; // 原子类型（例如：'H', 'O'）
    this.position = position; // 原子位置，THREE.Vector3对象
    this.color = color; // 原子颜色，默认为白色
    this.radius = radius; // 原子的半径，默认为0.5
    this.mesh = this.createMesh();
  }

  // 创建一个表示这个原子的Three.js的球体几何体
  createMesh() {
    // 创建球体几何体，半径根据原子类型可能会有所不同
    const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
    // 创建材料，颜色根据原子类型可能会有所不同
    const material = new THREE.MeshPhongMaterial({ color: this.color });
    // 创建网格（Mesh）
    this.mesh = new THREE.Mesh(geometry, material);
    // 设置网格位置
    this.mesh.position.copy(this.position);
    return this.mesh;
  }

  update = () => {};
}
