import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  OrthographicCamera,
  Object3D,
  Color,
} from 'three';
import * as THREE from 'three';
//@ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DynamicObj } from './abstract-dynamic-obj';

export enum CameraType {
  Orthographic,
  Perspective,
}

export interface RenderManagerConfig {
  camera?: CameraType;
}

export class RenderManager {
  private _animationFrameId?: number | null;
  public scene: Scene;
  public renderer: WebGLRenderer;
  public camera: PerspectiveCamera | OrthographicCamera;
  public orbitControls: OrbitControls;
  public dynamicObjs: DynamicObj[] = [];

  constructor(dom: HTMLElement, config?: RenderManagerConfig) {
    this.scene = new Scene();
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    const width = dom.clientWidth;
    const height = dom.clientHeight;
    this.camera =
      config?.camera === CameraType.Perspective
        ? this._createPerspectiveCamera(width, height)
        : this._createOrthographicCamera(width, height);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    this.scene.add(directionalLight);

    this.camera.position.z = 40;
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(new Color(0x000));

    dom.appendChild(this.renderer.domElement);
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
  }

  _createOrthographicCamera = (width: number, height: number) => {
    const near = 1;
    const far = 1000;
    const camera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      near,
      far
    );
    return camera;
  };

  _createPerspectiveCamera = (width: number, height: number) => {
    const near = 1;
    const far = 1000;
    const camera = new PerspectiveCamera(45, width / height, near, far);
    return camera;
  };

  add = (obj: Object3D | DynamicObj) => {
    this.scene.add(obj);
    if (obj instanceof DynamicObj) {
      this.dynamicObjs.push(obj);
    }
  };

  zoomToFitScene = () => {
    const boundingBox = new THREE.Box3();

    this.scene.traverse(function (object) {
      if ((object as THREE.Mesh).isMesh) {
        boundingBox.expandByObject(object);
      }
    });

    const boxHelper = new THREE.Box3Helper(boundingBox, 0xffff00);

    this.scene.add(boxHelper);

    const center = new THREE.Vector3();
    boundingBox.getCenter(center);

    const boundingSphere = new THREE.Sphere();
    boundingBox.getBoundingSphere(boundingSphere);
    const radius = boundingSphere.radius;

    // 计算相机位置，使包围盒充满视图
    const distance =
      radius / Math.sin((Math.PI / 180.0) * this.camera.fov * 0.5);
    const direction = this.camera.position.clone().sub(center).normalize();
    const newPosition = center.clone().add(direction.multiplyScalar(distance));

    this.camera.position.copy(newPosition);
    this.orbitControls.target.copy(center);
    this.camera.lookAt(center);

    this.orbitControls.update();
    this.render();
  };

  startRendering = () => {
    this.dynamicObjs.forEach((b) => {
      if (b.update) {
        b.update();
      }
    });
    this.renderer.render(this.scene, this.camera);
    if (this._animationFrameId) {
      this._animationFrameId = requestAnimationFrame(this.startRendering);
    }
  };

  render = () => {
    if (this._animationFrameId) return;
    this._animationFrameId = requestAnimationFrame(this.startRendering);
  };

  dispose = () => {
    this.renderer?.domElement?.parentNode?.removeChild(
      this.renderer?.domElement
    );
    if (this._animationFrameId) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }
    this.renderer?.dispose();
  };
}
