import * as THREE from 'three';

import { getAtomColor } from '../helpers';
import { DynamicObj } from '../../core';
import { vertexShader, fragmentShader } from './shaders/atom';

interface InitInfo {
  type: string;
  position: THREE.Vector3;
  radius: number;
  height: number;
  visibleBondMid: THREE.Vector3;
}

export class Bone extends DynamicObj {
  constructor(boneInfo: InitInfo) {
    const { type, radius, height, position, visibleBondMid } = boneInfo;
    const color = new THREE.Color(getAtomColor(type));

    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uColor: { value: color },
      },
    });

    const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);

    super(geometry, shaderMaterial);
    this.position.copy(position).lerp(visibleBondMid, 0.5);
    this.lookAt(visibleBondMid);
    this.rotateX(Math.PI / 2);
  }

  // eslint-disable-next-line
  update = () => {};
}
