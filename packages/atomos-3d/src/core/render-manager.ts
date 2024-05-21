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

  private calcBoundingBox = () => {
    const boundingBox = new THREE.Box3();

    this.scene.traverse(function (object) {
      if ((object as THREE.Mesh).isMesh) {
        boundingBox.expandByObject(object);
      }
    });
    return boundingBox;
  };

  addBoundingBox = () => {
    const boundingBox = this.calcBoundingBox();
    const boxHelper = new THREE.Box3Helper(boundingBox, 0xffff00);
    this.scene.add(boxHelper);
  };

  private _zoomToFitScenePerspectiveCamera = () => {
    const boundingBox = this.calcBoundingBox();
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
    const boundingBox = this.calcBoundingBox();
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
