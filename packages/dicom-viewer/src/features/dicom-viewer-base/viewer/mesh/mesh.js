import * as THREE from 'three';
import createFFRArrayBuffer from './createColorArrayBuffer';
import { vertexShader, fragmentShader } from './shader';

export const createMesh = (cldata, geometry, textureA) => {
  if (cldata && cldata.length) {
    const positionArrtibute = geometry.getAttribute('position');
    const positionArray = positionArrtibute.array;
    const colors = createFFRArrayBuffer(positionArray, cldata);
    geometry.setAttribute('a_FFR', new THREE.Float32BufferAttribute(colors, 1));
  }
  const offset = new THREE.Vector3();
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.boundingBox.getCenter(offset);
  geometry.OFFSET = offset;
  geometry.center();

  const heartMat = new THREE.ShaderMaterial({
    uniforms: {
      u_Texture: {
        value: textureA,
      },
      u_Aval: {
        value: 0.5,
      },
    },
    vertexShader,
    fragmentShader,
  });
  heartMat.needsUpdate = true;
  const mesh = new THREE.Mesh(geometry, heartMat);

  return mesh;
};
