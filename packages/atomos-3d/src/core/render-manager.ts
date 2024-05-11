import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Object3D,
  Color,
} from 'three';
import * as THREE from 'three';
//@ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export interface DynamicObj {
  getMesh: () => Object3D;
  update?: () => void;
}

export class RenderManager {
  private _animationFrameId?: number;
  public scene: Scene;
  public renderer: WebGLRenderer;
  public camera: PerspectiveCamera;
  public orbitControls: OrbitControls;
  public dynamicObjs: DynamicObj[] = [];

  constructor(dom: HTMLElement) {
    this.scene = new Scene();
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    const width = dom.clientWidth;
    const height = dom.clientHeight;
    this.camera = new PerspectiveCamera(45, width / height, 1, 1000);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    this.scene.add(directionalLight);

    this.camera.position.z = 120;
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(new Color(0x000));

    dom.appendChild(this.renderer.domElement);
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
  }

  add = (object3D: DynamicObj) => {
    this.scene.add(object3D.getMesh());
    this.dynamicObjs.push(object3D);
  };

  zoomToFitScene = () => {
    const boundingBox = new THREE.Box3();

    this.scene.traverse(function (object) {
      if (object.isMesh) {
        // 确保只计算网格对象
        boundingBox.expandByObject(object);
      }
    });

    const boxHelper = new THREE.Box3Helper(boundingBox, 0xffff00); // 使用黄色标识边界盒

    // 将边界盒helper添加到场景中
    this.scene.add(boxHelper);

    // 计算包围盒中心
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);

    const boundingSphere = new THREE.Sphere();
    boundingBox.getBoundingSphere(boundingSphere); // 传递Sphere对象给getBoundingSphere
    const radius = boundingSphere.radius;

    // 计算相机位置，使包围盒充满视图
    const distance =
      radius / Math.sin((Math.PI / 180.0) * this.camera.fov * 0.5);
    const direction = this.camera.position.clone().sub(center).normalize();
    const newPosition = center.clone().add(direction.multiplyScalar(distance));

    // 设置相机位置和视角
    this.camera.position.copy(newPosition);
    this.orbitControls.target.copy(center);
    this.camera.lookAt(center);

    // 更新视图
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
    }
    this.renderer?.dispose();
  };
}
