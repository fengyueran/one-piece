import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  OrthographicCamera,
  Object3D,
} from 'three';
import * as THREE from 'three';
//@ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DynamicObj, DynamicGroup } from './abstract-dynamic-obj';
import { AxesHelper } from './axes-helper';

export enum CameraType {
  Orthographic,
  Perspective,
}

export interface RenderManagerConfig {
  clearColor?: string;
  camera?: CameraType;
  axesHelper?: boolean;
  boundingBox?: boolean;
  boundingBoxColor?: string;
}

export class RenderManager {
  private _animationFrameId?: number | null;

  private _canvasWidth: number;
  private _canvasHeight: number;
  private _axesScene?: Scene;
  private _axesHelper?: DynamicGroup;
  private _boxHelper?: THREE.Box3Helper;
  private _axesCamera?: OrthographicCamera;

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

    this._canvasWidth = dom.clientWidth;
    this._canvasHeight = dom.clientHeight;
    this.camera =
      config?.camera === CameraType.Perspective
        ? this._createPerspectiveCamera(this._canvasWidth, this._canvasHeight)
        : this._createOrthographicCamera(this._canvasWidth, this._canvasHeight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    this.scene.add(directionalLight);

    this.camera.position.z = 40;
    this.renderer.setSize(this._canvasWidth, this._canvasHeight);
    const clearColor = config?.clearColor || '#000';
    this.renderer.setClearColor(clearColor);

    if (config?.axesHelper) {
      this._addAxesHelper();
    }

    if (config?.boundingBox) {
      const color = config?.boundingBoxColor || 'blue';
      this._addBoxHelper(color);
    }

    dom.appendChild(this.renderer.domElement);
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    // this.orbitControls.minDistance = 2;
    // this.orbitControls.maxDistance = 40;
    this.orbitControls.minZoom = 0.2;
    this.orbitControls.maxZoom = 10;
  }

  private _addAxesHelper = () => {
    this._axesHelper = new AxesHelper(0.6);
    this._axesScene = new THREE.Scene();
    this._axesScene.add(this._axesHelper);

    this._axesCamera = new THREE.OrthographicCamera(
      -1,
      1,
      1,
      -1,
      this.camera.near,
      this.camera.far
    );
  };

  _createOrthographicCamera = (width: number, height: number) => {
    const near = 1;
    const far = 1000;
    const camera = new THREE.OrthographicCamera(
      -width,
      width,
      height,
      -height,
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

  private _calcBoundingBox = () => {
    const boundingBox = new THREE.Box3();

    this.scene.traverse(function (object) {
      if ((object as THREE.Mesh).isMesh) {
        boundingBox.expandByObject(object);
      }
    });
    return boundingBox;
  };

  updateBoundingBox = () => {
    const boundingBox = this._calcBoundingBox();

    if (this._boxHelper) {
      this._boxHelper.box.copy(boundingBox);
    }
  };

  private _addBoxHelper = (color: string) => {
    const boundingBox = this._calcBoundingBox();
    this._boxHelper = new THREE.Box3Helper(boundingBox, color);
    this.scene.add(this._boxHelper);
  };

  private _zoomToFitScenePerspectiveCamera = () => {
    const boundingBox = this._calcBoundingBox();
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);

    const boundingSphere = new THREE.Sphere();
    boundingBox.getBoundingSphere(boundingSphere);
    const radius = boundingSphere.radius;

    const camera = this.camera as THREE.PerspectiveCamera;
    // 计算相机位置，使包围盒充满视图
    const distance = radius / Math.sin((Math.PI / 180.0) * camera.fov * 0.5);
    const direction = camera.position.clone().sub(center).normalize();
    const newPosition = center.clone().add(direction.multiplyScalar(distance));

    camera.lookAt(center);
    camera.position.copy(newPosition);
    this.orbitControls.target.copy(center);
    this.orbitControls.update();
  };

  private _zoomToFitSceneOrthographicCamera = () => {
    const boundingBox = this._calcBoundingBox();
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);

    const size = new THREE.Vector3();
    boundingBox.getSize(size);

    const camera = this.camera as THREE.OrthographicCamera;
    const aspect = camera.right / camera.top;

    //设置相机宽高是boundingBox的一倍
    if (size.x / size.y > aspect) {
      // Wider than tall
      camera.right = size.x;
      camera.left = -size.x;
      camera.top = size.x / aspect;
      camera.bottom = -size.x / aspect;
    } else {
      camera.top = size.y;
      camera.bottom = -size.y;
      camera.right = size.y * aspect;
      camera.left = -size.y * aspect;
    }

    const maxDim = Math.max(size.x, size.y, size.z);
    const offset = maxDim * 1.5; // Ensure the camera is far enough to view the whole bounding box
    const direction = camera.position.clone().sub(center).normalize();
    const newPosition = center.clone().add(direction.multiplyScalar(offset));

    camera.position.copy(newPosition);

    camera.updateProjectionMatrix();
    camera.lookAt(center);
    this.orbitControls.target.copy(center);
    this.orbitControls.update();
  };

  zoomToFitScene = () => {
    if (this.camera instanceof THREE.PerspectiveCamera) {
      this._zoomToFitScenePerspectiveCamera();
    } else {
      this._zoomToFitSceneOrthographicCamera();
    }
  };

  private renderAxesHelper = () => {
    if (!this._axesScene || !this._axesCamera) return;

    const axesViewportWidth = 120;
    const axesViewportHeight = 120;

    this.renderer.setViewport(0, 0, axesViewportWidth, axesViewportHeight);
    this.renderer.setScissor(0, 0, axesViewportWidth, axesViewportHeight);
    this.renderer.setScissorTest(true);
    this._axesCamera.position.copy(this.camera.position);
    this._axesCamera.quaternion.copy(this.camera.quaternion);

    this.renderer.render(this._axesScene, this._axesCamera);
    this.renderer.setScissorTest(false);
  };

  startRendering = () => {
    this.dynamicObjs.forEach((b) => {
      if (b.update) {
        b.update();
      }
    });
    this.renderer.setViewport(0, 0, this._canvasWidth, this._canvasHeight);
    this.renderer.setScissor(0, 0, this._canvasWidth, this._canvasHeight);
    this.renderer.setScissorTest(true);
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);

    this.renderAxesHelper();

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
