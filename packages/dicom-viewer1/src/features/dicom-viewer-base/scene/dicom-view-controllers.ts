import { components, engine } from '@cc/viewers-dvtool';
import { CrosshairData } from '../image';
import { PanCrosshair, PanZoom, WheelZoom, WheelSlice, TapCrosshair } from '../input';

enum PanType {
  None,
  Window,
  Move,
  Crosshair,
  Zoom,
  OPCount,
}

enum WheelType {
  None,
  Zoom,
  Slice,
  OPCount,
}

export enum OpType {
  None,
  Slice,
  Move,
  Zoom,
  Mask,
  OPCount,
}

export class DicomViewControllers extends engine.TSBehaviour {
  crosshairData?: CrosshairData;

  windowData?: components.image.LUTWindowData;

  cameraZoom?: components.CameraZoom;

  private panType: PanType = PanType.None;

  private panops: Array<engine.TSBehaviour> = [];

  private wheelType: WheelType = WheelType.None;

  private wheelops: Array<engine.TSBehaviour> = [];

  private tapCrosshair!: engine.TSBehaviour;

  private middleKeyPanMove!: components.PanMove;

  private rightKeyPanZoom!: components.PanZoom;

  private lastOpType = OpType.None;

  private currentOpType = OpType.None;

  setupData(
    crosshairData: CrosshairData,
    windowData: components.image.LUTWindowData,
    cameraZoom: components.CameraZoom,
    cs: components.image.CoordinateSystem,
  ): void {
    this.crosshairData = crosshairData;
    this.windowData = windowData;
    this.cameraZoom = cameraZoom;

    const panMove = this.gameObject.addComponent(components.PanMove);
    panMove.mousebuttonLimit = 0;

    this.panops[PanType.Move] = panMove;

    const panWindow = this.gameObject.addComponent(components.PanLUTWindow);
    panWindow.mousebuttonLimit = 0;
    panWindow.windowData = windowData;
    this.panops[PanType.Window] = panWindow;

    const panCrosshair = this.gameObject.addComponent(PanCrosshair);
    panCrosshair.mousebuttonLimit = 0;
    panCrosshair.crosshair = crosshairData;
    // panCrosshair.source = source;
    panCrosshair.cs = cs;
    this.panops[PanType.Crosshair] = panCrosshair;

    const panZoom = this.gameObject.addComponent(PanZoom);
    panZoom.mousebuttonLimit = 0;
    panZoom.zoomer = cameraZoom;

    this.panops[PanType.Zoom] = panZoom;

    const wheelZoom = this.gameObject.addComponent(WheelZoom);
    wheelZoom.zoomer = cameraZoom;
    this.wheelops[WheelType.Zoom] = wheelZoom;

    const wheelSlice = this.gameObject.addComponent(WheelSlice);
    wheelSlice.crosshairData = crosshairData;
    wheelSlice.cs = cs;
    this.wheelops[WheelType.Slice] = wheelSlice;

    for (let i = 0; i < PanType.OPCount; i++) {
      if (this.panops[i]) {
        this.panops[i].enabled = false;
      }
    }

    for (let i = 0; i < WheelType.OPCount; i++) {
      if (this.wheelops[i]) {
        this.wheelops[i].enabled = false;
      }
    }

    const tapCrosshair = this.gameObject.addComponent(TapCrosshair);
    tapCrosshair.mousebuttonLimit = 0;
    tapCrosshair.crosshair = crosshairData;
    // tapCrosshair.source = source;
    tapCrosshair.cs = cs;
    this.tapCrosshair = tapCrosshair;

    this.tapCrosshair.enabled = false;

    this.middleKeyPanMove = this.gameObject.addComponent(components.PanMove);
    this.middleKeyPanMove.mousebuttonLimit = 1;

    this.rightKeyPanZoom = this.gameObject.addComponent(components.PanZoom);
    this.rightKeyPanZoom.mousebuttonLimit = 2;
    this.rightKeyPanZoom.zoomer = cameraZoom;

    this.setOpType(OpType.Slice);
  }

  recoverOpType(): void {
    this.setOpType(this.lastOpType);
  }

  getOpType(): OpType {
    return this.currentOpType;
  }

  // TODO:
  // 中键拖动 => 移动图像
  // 右键拖动 => 图像缩放
  setOpType(type: OpType): void {
    if (this.currentOpType === type) {
      return;
    }
    this.lastOpType = this.currentOpType;
    this.currentOpType = type;
    switch (type) {
      case OpType.None:
        this.tapCrosshair.enabled = false;
        this.setPanType(PanType.None);
        this.setWheelType(WheelType.None);
        this.rightKeyPanZoom.enabled = false;
        this.middleKeyPanMove.enabled = false;
        break;
      case OpType.Slice:
        this.tapCrosshair.enabled = true;
        this.setPanType(PanType.Crosshair);
        this.setWheelType(WheelType.Slice);
        this.rightKeyPanZoom.enabled = true;
        this.middleKeyPanMove.enabled = true;
        break;
      case OpType.Move:
        this.tapCrosshair.enabled = false;
        this.setPanType(PanType.Move);
        this.setWheelType(WheelType.Slice);
        this.rightKeyPanZoom.enabled = true;
        this.middleKeyPanMove.enabled = true;
        break;
      case OpType.Zoom:
        this.tapCrosshair.enabled = false;
        this.setPanType(PanType.Zoom);
        this.setWheelType(WheelType.Slice);
        this.rightKeyPanZoom.enabled = true;
        this.middleKeyPanMove.enabled = true;
        break;
      case OpType.Mask:
        this.tapCrosshair.enabled = false;
        this.setPanType(PanType.None);
        this.setWheelType(WheelType.Slice);
        this.rightKeyPanZoom.enabled = false;
        this.middleKeyPanMove.enabled = true;
        break;
      default:
        break;
    }
  }

  private setPanType(type: PanType): void {
    if (this.panType === type) {
      return;
    }
    if (this.panops[this.panType]) {
      this.panops[this.panType].enabled = false;
    }
    if (this.panops[type]) {
      this.panops[type].enabled = true;
    }
    this.panType = type;
  }

  private setWheelType(type: WheelType): void {
    if (this.wheelType === type) {
      return;
    }
    if (this.wheelops[this.wheelType]) {
      this.wheelops[this.wheelType].enabled = false;
    }
    if (this.wheelops[type]) {
      this.wheelops[type].enabled = true;
    }
    this.wheelType = type;
  }
}