import * as ccloader from '@cc/loader';
import { Vector3 } from 'three';
import { components, events, engine, products } from '@cc/viewers-dvtool';
import { OpType } from './dicom-view-controllers';
import { DicomImageRoot } from './image-root';
import { image } from '../image-loader';
import { DicomImageCreationOption } from '../scene';
import { DicomImagePlane, Image2DCS } from '../image';

export type Option = {
  startRenderLoopWhenSenceCreate: boolean;
};
export class DicomSceneModel extends engine.SceneModel {
  maskSource?: image.Image2DSource<Uint8Array>;

  mRenderReady = false;

  defaultProperties = {
    zoom: 1,
    cameraPosition: new Vector3(0, 0, 1000),
    window: {
      windowCenter: 300,
      windowWidth: 1000,
    },
    maskVisible: true,
    opacity: 0.2,
    zoomRange: [0.25, 16],
  };

  protected mImageRoot?: DicomImageRoot;

  protected get imageRoot(): DicomImageRoot {
    if (this.mImageRoot === undefined) {
      this.mImageRoot = this.scene.createGameObject('root').addComponent(DicomImageRoot);
    }
    return this.mImageRoot;
  }

  constructor(
    name: string,
    public info: image.Image2DSpaceInfo,
    public baseSource: image.Image2DSource<Int16Array>,
    maskSource?: image.Image2DSource<Uint8Array>,
    colorTable?: components.ColorTable,
    public orthographicSize?: number,
    option?: Option,
    defaultProperties?: {
      window?: components.LUTWindow;
      zoom?: number;
      cameraPosition?: Vector3;
      maskVisible?: boolean;
    },
  ) {
    super(name);

    this.maskSource = maskSource;

    if (defaultProperties) {
      this.defaultProperties = { ...this.defaultProperties, ...defaultProperties };
    }
    this.createDicomImage(info, baseSource, {
      maskSource,
      colorTable,
      orthographicSize,
      window: this.defaultProperties.window,
      maskVisible: this.defaultProperties.maskVisible,
      zoom: this.defaultProperties.zoom,
      zoomRange: this.defaultProperties.zoomRange as [number, number],
    });

    this.setMaskOpacity(this.defaultProperties.opacity);

    this.registerEvent(events.crosshairChangedEvent);
    this.registerEvent(events.windowChangedEvent);
    this.registerEvent(events.zoomChangedEvent);
    this.registerEvent(events.intensityChangedEvent);
    this.registerEvent(events.cameraChangedEvent);

    // default values
    this.setCrosshair([
      Math.floor(info.refImage3DSpaceInfo.size[0] / 2),
      Math.floor(info.refImage3DSpaceInfo.size[1] / 2),
      Math.floor(info.refImage3DSpaceInfo.size[2] / 2),
    ]);
    this.nc.emit(events.dicomSceneImageUpdatedEvent);

    if (option?.startRenderLoopWhenSenceCreate) {
      this.scene.start();
    }
  }

  getCS(): Image2DCS | undefined {
    return this.imageRoot.cs;
  }

  protected createDicomImage(
    info: image.Image2DSpaceInfo,
    baseSource: image.Image2DSource<ccloader.TypedArray>,
    option: DicomImageCreationOption,
  ): void {
    this.imageRoot.create(this.scene.name, info, baseSource, {
      ...option,
    });
  }

  addMinimap(): void {
    this.imageRoot.addMinimap();
  }

  protected subOnAfterUpdate(): void {
    if (this.mRenderReady) {
      return;
    }

    if (this.maskSource && !this.maskSource.getActiveDisplayed()) {
      return;
    }
    this.mRenderReady = !!this.baseSource.getActiveDisplayed();
  }

  isRenderReady(): boolean {
    return this.mRenderReady;
  }

  setCrosshair(crosshair: Array<number>): void {
    this.runAction(() => this.imageRoot.setCrosshair(crosshair));
  }

  centerCrosshair(): void {
    this.runAction(() => {
      this.imageRoot.centerCrosshair();
    });
  }

  toggleMask(visible: boolean): void {
    this.runAction(() => this.imageRoot.setMaskVisible(visible));
  }

  setImageCrosshairVisible(visible: boolean): void {
    this.runAction(() => this.imageRoot.setImageCrosshairVisible(visible));
  }

  setMaskOpacity(opacity: number): void {
    this.runAction(() => this.imageRoot.setMaskOpacity(opacity));
  }

  getPhysicalPerPixel(): number {
    const camera = this.scene.mainCamera;
    return (camera.orthographicSize * 2) / camera.pixelHeight / camera.zoom;
  }

  setLUTWindow(window: components.LUTWindow): void {
    this.runAction(() => this.imageRoot.setWindow(window));
  }

  setMaskVisible(visible: boolean): void {
    this.runAction(() => this.imageRoot.setMaskVisible(visible));
  }

  setOpType(type: OpType): void {
    this.runAction(() => this.imageRoot.dicomController?.setOpType(type));
  }

  setZoom(zoom: number): void {
    this.runAction(() => this.imageRoot.setZoom(zoom));
  }

  setOpacity(opacity: number): void {
    this.runAction(() => this.imageRoot.setMaskOpacity(opacity));
  }

  reset(): void {
    this.runAction(() => {
      const { zoom, cameraPosition } = this.defaultProperties;
      this.imageRoot.setZoom(zoom);
      this.scene.mainCamera.transform.localPosition = cameraPosition;
    });
  }
}
