import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Object3D,
  Color,
  Vector3,
} from 'three';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export interface ObjectWithUpdate {
  getMesh: () => Object3D;
  update: () => void;
}

export class RenderManager {
  public scene: Scene;
  public renderer: WebGLRenderer;
  public camera: PerspectiveCamera;
  public behaviourList: ObjectWithUpdate[] = [];

  constructor(dom: HTMLElement) {
    this.scene = new Scene();
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    const width = dom.clientWidth;
    const height = dom.clientHeight;
    this.camera = new PerspectiveCamera(45, width / height, 1, 1000);

    const ambiLight = new THREE.AmbientLight(0x141414);
    this.scene.add(ambiLight);

    const light = new THREE.DirectionalLight('#Fff');
    light.position.set(10, 300, 2000);
    this.scene.add(light);

    this.camera.position.set(0, 0, 2);
    // this.camera.lookAt(new Vector3(0, 0, 0));
    this.camera.position.z = 10;
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(new Color(0x000));

    dom.appendChild(this.renderer.domElement);
    const orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
  }

  add = (object3D: ObjectWithUpdate) => {
    this.scene.add(object3D.getMesh());
    this.behaviourList.push(object3D);
  };

  render = () => {
    this.behaviourList.forEach((b) => {
      b.update();
    });
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render);
  };
}
