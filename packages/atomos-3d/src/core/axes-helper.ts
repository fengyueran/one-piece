import * as THREE from 'three';

import { DynamicGroup } from './abstract-dynamic-obj';

const createCustomAxesHelper = (size: number) => {
  const axesGroup = new THREE.Group();

  // X轴（红色）
  const xMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
  const xGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(size, 0, 0),
  ]);
  const xAxis = new THREE.Line(xGeometry, xMaterial);
  axesGroup.add(xAxis);

  // Y轴（绿色）
  const yMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  const yGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, size, 0),
  ]);
  const yAxis = new THREE.Line(yGeometry, yMaterial);
  axesGroup.add(yAxis);

  // Z轴（蓝色）
  const zMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
  const zGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, size),
  ]);
  const zAxis = new THREE.Line(zGeometry, zMaterial);
  axesGroup.add(zAxis);

  const createLabel = (text: string, color: string) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    const fontSize = 24;
    const fontFace = 'Arial';
    context.font = `${fontSize}px ${fontFace}`;
    const textWidth = context.measureText(text).width;

    canvas.width = textWidth;
    canvas.height = fontSize;

    context.font = `${fontSize}px ${fontFace}`;
    context.fillStyle = color;
    context.fillText(text, 0, fontSize);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(0.2, 0.2, 1); // 调整标签的缩放比例

    return sprite;
  };

  const xLabel = createLabel('X', '#ff0000');
  xLabel.position.set(size + 0.2, 0, 0);
  axesGroup.add(xLabel);

  const yLabel = createLabel('Y', '#00ff00');
  yLabel.position.set(0, size + 0.2, 0);
  axesGroup.add(yLabel);

  const zLabel = createLabel('Z', '#0000ff');
  zLabel.position.set(0, 0, size + 0.2);
  axesGroup.add(zLabel);

  return axesGroup;
};

export class AxesHelper extends DynamicGroup {
  constructor(size: number) {
    super();
    const axes = createCustomAxesHelper(size);
    this.add(axes);
  }

  // eslint-disable-next-line
  update = () => {};
}
