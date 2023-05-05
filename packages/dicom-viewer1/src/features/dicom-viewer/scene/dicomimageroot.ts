import { Vector3, Box2, Vector2 } from 'three';
import * as ccloader from '@cc/loader';
import { components, products, engine } from '@cc/viewers-dvtool';
import { image } from '../image-loader';
// import * as defaultColorTable from '../../../components/materiallibrary/colortable';

// import { DicomViewControllers } from '../../../components/input';
// import { MiniMap } from '../../../components/minimap';

import {
  DicomImagePlane,
  Image2DCS,
  Image2DCrosshairData,
  UpdateIntensity,
  ImageCrosshair,
  SmallCross,
} from '../image';

export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(`Expected 'val' to be defined, but received ${val}`);
    }
  }
}

export interface DicomImageCreationOption {
  maskSource?: image.Image2DSource<Uint8Array>;
  colorTable?: components.ColorTable;
  orthographicSize?: number;
  crosshairType?: components.image.Crosshair2DType;
  window?: components.image.LUTWindow;
  maskVisible?: boolean;
  zoom?: number;
  zoomRange?: [number, number];
  opacity?: number;
  zoomBasedOnPoint?: boolean;
  movementLimit?: boolean; // movement limit. similar with dof
  baseUseLinear?: boolean;
  maskUseLinear?: boolean;
  infinite?: [boolean, boolean]; // infinite display. for x, y direction.
  dof?: [boolean, boolean]; // degree of freedom. For x, y movement.
  enableMinimap?: boolean;
}

export class DicomImageRoot extends engine.TSBehaviour {
  protected imageRoot?: engine.GameObject;

  protected maskGo?: engine.GameObject;

  protected baseGo?: engine.GameObject;

  protected crosshairData?: Image2DCrosshairData;

  protected physicalSize?: Array<number>;

  cs?: Image2DCS;

  protected windowData?: components.image.LUTWindowData;

  protected inputGo?: engine.GameObject;

  protected imageCrosshair?: ImageCrosshair;

  protected minimapGo?: engine.GameObject;

  baseSource?: image.Image2DSource<ccloader.TypedArray>;

  maskSource?: image.Image2DSource<Uint8Array>;

  info?: image.Image2DSpaceInfo;

  // controller?: DicomViewControllers;

  // maskImagePlane?: MaskImagePlane;

  cameraZoom?: components.CameraZoom;

  protected dupCount: [number, number] = [1, 1];

  create(
    name: string,
    info: image.Image2DSpaceInfo,
    baseSource: image.Image2DSource<ccloader.TypedArray>,
    option: DicomImageCreationOption,
  ): void {
    this.gameObject.name = name;
    if (option.infinite) {
      this.dupCount = option.infinite.map((infinite) => (infinite ? 9999 : 1)) as [number, number];
    }
    this.createBase(info, baseSource, option);

    const {
      maskSource,
      colorTable,
      maskVisible,
      zoom,
      zoomRange,
      opacity,
      zoomBasedOnPoint,
      movementLimit,
      maskUseLinear,
      enableMinimap,
      dof,
    } = option;
    if (maskSource) {
      this.setMask(maskSource, maskVisible, opacity, colorTable, maskUseLinear);
    }

    const crosshairType = option.crosshairType
      ? option.crosshairType
      : components.image.Crosshair2DType.DotFullLine;

    this.createCrosshair(crosshairType);

    this.createController(zoom, zoomRange, zoomBasedOnPoint, movementLimit, dof);
    if (enableMinimap) {
      this.addMinimap();
    }
  }

  update(): void {}

  createBase(
    info: image.Image2DSpaceInfo,
    baseSource: image.Image2DSource<ccloader.TypedArray>,
    option: DicomImageCreationOption,
  ): void {
    const { name } = this.gameObject;
    this.destroyEverything();
    const { orthographicSize, window } = option;
    this.gameObject.name = name;
    this.info = info;
    this.baseSource = baseSource;
    const { scene } = this.gameObject;
    this.imageRoot = scene.createGameObject(`${name}/root`, this.gameObject);
    const camera = scene.mainCamera;
    if (orthographicSize) {
      camera.orthographicSize = orthographicSize; // TODO: the size stuff need to be handle in someplace. it is not simple.
    } else {
      camera.orthographicSize = (info.size[1] * info.spacing[1]) / 2;
    }
    this.windowData = this.imageRoot.addComponent(components.image.LUTWindowData);
    if (window) {
      this.windowData.setData(window);
    }
    const cs = this.imageRoot.addComponent(Image2DCS);
    cs.spaceInfo = info;
    const images = scene.createGameObject(`${name}/images`, this.imageRoot);
    const baseGo = scene.createGameObject(`${name}/base`, images);
    this.cs = cs;

    this.physicalSize = [info.size[0] * info.spacing[0], info.size[1] * info.spacing[1]];
    baseGo
      .addComponent(DicomImagePlane)
      .setupData(
        this.windowData,
        baseSource,
        this.physicalSize,
        option.baseUseLinear,
        this.dupCount,
      );

    const crosshairGo = scene.createGameObject(`${name}/crosshair`, this.imageRoot);
    const crosshairData = crosshairGo.addComponent(Image2DCrosshairData);
    crosshairData.setupData(info.refImage3DSpaceInfo.size);
    crosshairData.cs = cs;
    cs.crosshairData = crosshairData;
    crosshairData.addSource(baseSource);

    const other = scene.createGameObject(`${name}/other`, this.imageRoot);
    other.addComponent(UpdateIntensity).setupData(crosshairData, baseSource!, cs);

    crosshairGo.transform.localPosition = new Vector3(0, 0, 2);

    this.baseGo = baseGo;
    this.crosshairData = crosshairData;
  }

  createController(
    zoom?: number,
    zoomRange?: [number, number],
    zoomBasedOnPoint?: boolean,
    movementLimit?: boolean,
    dof?: [boolean, boolean],
  ): void {
    if (!this.imageRoot) {
      return;
    }
    if (this.inputGo) {
      this.scene.destroyObject(this.inputGo);
    }
    assertIsDefined(this.crosshairData);
    assertIsDefined(this.windowData);
    assertIsDefined(this.cs);

    this.inputGo = this.scene.createGameObject(`${this.gameObject.name}/input`, this.imageRoot);
    const cameraZoom = this.inputGo.addComponent(components.CameraZoom);
    if (zoomRange) {
      [cameraZoom.zoomMin, cameraZoom.zoomMax] = zoomRange;
    }
    if (zoom) {
      cameraZoom.setZoom(zoom);
    }
    this.cameraZoom = cameraZoom;
    this.cameraZoom.setPointMode(zoomBasedOnPoint);

    // Default controllers.
    // This should be added by custom requirement. we provide default one.
    // const controller = this.inputGo.addComponent(DicomViewControllers);
    // controller.setupData(this.crosshairData, this.windowData, cameraZoom, this.cs);
    // this.controller = controller;
    if (movementLimit) {
      const ml = this.inputGo.addComponent(components.MovementLimit);
      assertIsDefined(this.info);
      const { info } = this;
      const size = [0, 1].map((i) => info.size[i] * info.spacing[i] * this.dupCount[i]);
      ml.setup(
        new Box2(new Vector2(-size[0] / 2, -size[1] / 2), new Vector2(size[0] / 2, size[1] / 2)),
      );
    }
    if (dof) {
      const mld = this.inputGo.addComponent(components.MovementLimitDirection);
      mld.setup([!dof[0], !dof[1]]);
    }
  }

  setMask(
    maskSource: image.Image2DSource<Uint8Array>,
    maskVisible?: boolean,
    opacity?: number,
    colorTable?: components.ColorTable,
    useLinear?: boolean,
  ): void {
    if (!this.imageRoot) {
      return;
    }
    if (this.maskGo) {
      this.scene.destroyObject(this.maskGo);
    }
    this.maskSource = maskSource;
    assertIsDefined(this.crosshairData);
    // this.crosshairData.addSource(maskSource);
    this.maskGo = this.scene.createGameObject(
      `${this.gameObject.name}/mask`,
      this.baseGo?.getParentGameObject(),
    );
    // const maskImagePlane = this.maskGo.addComponent(MaskImagePlane);
    assertIsDefined(this.physicalSize);
    // maskImagePlane.setupData(
    //   maskSource,
    //   this.physicalSize,
    //   opacity === undefined ? 0.5 : opacity,
    //   colorTable || defaultColorTable,
    //   useLinear,
    //   this.dupCount,
    // );
    // this.maskImagePlane = maskImagePlane;
    this.maskGo.transform.localPosition = new Vector3(0, 0, 1);
    this.setMaskVisible(maskVisible === undefined || maskVisible);
  }

  createCrosshair(crosshairType: components.image.Crosshair2DType): void {
    if (!this.imageRoot) {
      return;
    }
    assertIsDefined(this.crosshairData);
    assertIsDefined(this.cs);
    assertIsDefined(this.info);
    assertIsDefined(this.physicalSize);
    const crosshairImageGo = this.scene.createGameObject(
      `${this.gameObject.name}/crosshairimage`,
      this.imageRoot,
    );
    crosshairImageGo.transform.localPosition = new Vector3(0, 0, 10);
    const crosshairCenter = this.cs.convert(
      [
        Math.floor(this.info.size[0] / 2),
        Math.floor(this.info.size[1] / 2),
        Math.floor(this.info.count / 2),
      ],
      components.image.CSType.Index2C,
      components.image.CSType.Index3C,
    );
    if (crosshairType === components.image.Crosshair2DType.DotFullLine) {
      const imageCrosshair = crosshairImageGo.addComponent(ImageCrosshair);
      imageCrosshair.setCS(this.cs, this.physicalSize, crosshairCenter);
      imageCrosshair.crosshairData = this.crosshairData;
      this.imageCrosshair = imageCrosshair;
    } else if (crosshairType === components.image.Crosshair2DType.SmallCross) {
      crosshairImageGo.addComponent(SmallCross).setup(this.cs, this.crosshairData);
    }
  }

  addMinimap(): void {
    if (!this.imageRoot) {
      return;
    }
    if (this.minimapGo) {
      return;
    }
    assertIsDefined(this.baseGo);
    assertIsDefined(this.info);
    const basePlane = this.baseGo.getComponent(components.image.DicomImagePlane);
    if (!basePlane) {
      return;
    }
    // const minimap = this.scene.createGameObject('minimap').addComponent(MiniMap);
    // minimap.setup(basePlane, this.info, this.imageCrosshair);
  }

  isDataReady(): boolean {
    if (!this.baseSource) {
      return false;
    }
    if (!this.baseSource.getActiveDisplayed()) {
      return false;
    }
    if (!this.maskGo) {
      return true;
    }
    if (!this.maskSource) {
      return false;
    }
    if (!this.maskSource.getActiveDisplayed()) {
      return false;
    }
    return true;
  }

  destroyEverything(): void {
    if (this.imageRoot) {
      this.scene.destroyObject(this.imageRoot);
    }
    this.imageRoot = undefined;
    this.maskGo = undefined;
    this.baseGo = undefined;
    this.crosshairData = undefined;
    this.physicalSize = undefined;
    this.info = undefined;
    this.cs = undefined;
    this.windowData = undefined;
    this.inputGo = undefined;
    this.imageCrosshair = undefined;
    this.minimapGo = undefined;
    // this.controller = undefined;
    // this.maskImagePlane = undefined;
    this.cameraZoom = undefined;
  }

  centerCrosshair(): void {
    if (!this.crosshairData || !this.cs) {
      return;
    }
    const camera = this.gameObject.scene.mainCamera;
    const origin = camera.viewToWorld(camera.pixelWidth / 2, camera.pixelHeight / 2);
    const crosshairWorld = this.cs.convert(
      this.crosshairData.crosshair,
      components.image.CSType.Index3C,
      components.image.CSType.WorldC,
    );
    const v = new Vector3(crosshairWorld[0] - origin.x, crosshairWorld[1] - origin.y, 0);

    v.add(camera.transform.localPosition);
    camera.transform.localPosition = v;
  }

  get crosshair(): Array<number> | undefined {
    return this.crosshairData?.crosshair;
  }

  setCrosshair(v: Array<number>): void {
    this.crosshairData?.setCrosshair(v);
  }

  get window(): components.image.LUTWindow | undefined {
    return this.windowData?.data;
  }

  setWindow(window: components.image.LUTWindow): void {
    this.windowData?.setData(window);
  }

  setZoom(zoom: number): void {
    this.cameraZoom?.setZoom(zoom);
  }

  setMaskOpacity(opacity: number): void {
    // this.maskImagePlane?.setOpacity(opacity);
  }

  setMaskVisible(visible: boolean): void {
    this.maskGo?.setActive(visible);
  }

  setImageCrosshairVisible(visible: boolean): void {
    this.imageCrosshair?.gameObject.setActive(visible);
  }
}
