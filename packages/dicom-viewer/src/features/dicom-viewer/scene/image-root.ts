import { Vector3 } from 'three';
import { components, products } from '@cc/viewers-dvtool';
import { DicomViewControllers } from './dicom-view-controllers';
import { ClipIndicator } from './clip-indicator';
export class DicomImageRoot extends products.common.components.DicomImageRoot {
  dicomController?: DicomViewControllers;

  clipIndicator?: ClipIndicator;

  createController(zoom?: number, zoomRange?: [number, number]): void {
    if (!this.imageRoot || !this.crosshairData || !this.windowData || !this.cs) {
      return;
    }
    if (this.inputGo) {
      this.scene.destroyObject(this.inputGo);
    }

    this.inputGo = this.scene.createGameObject(`${this.gameObject.name}/input`, this.imageRoot);
    const cameraZoom = this.inputGo.addComponent(components.CameraZoom);
    if (zoomRange) {
      [cameraZoom.zoomMin, cameraZoom.zoomMax] = zoomRange;
    }
    if (zoom) {
      cameraZoom.setZoom(zoom);
    }
    this.cameraZoom = cameraZoom;
    const controller = this.inputGo.addComponent(DicomViewControllers);
    controller.setupData(this.crosshairData, this.windowData, cameraZoom, this.cs);
    this.dicomController = controller;
  }

  addMinimap(): void {
    if (!this.imageRoot || !this.baseGo || !this.info || !this.imageCrosshair) {
      return;
    }
    if (this.minimapGo) {
      return;
    }

    const basePlane = this.baseGo.getComponent(components.image.DicomImagePlane);
    if (!basePlane) {
      return;
    }
    const minimap = this.scene.createGameObject('minimap').addComponent(components.minimap.MiniMap);
    minimap.borderOffset = new Vector3(0, 0, 0);
    minimap.setup(basePlane, this.info, this.imageCrosshair);
  }

  createClipIndicator(): void {
    if (!this.imageRoot || !this.physicalSize || !this.info || !this.cs) {
      return;
    }
    const clipIndicatorGo = this.scene.createGameObject(
      `${this.gameObject.name}/clipIndicator`,
      this.imageRoot,
    );
    clipIndicatorGo.transform.localPosition = new Vector3(0, 0, 10);
    const crosshairCenter = this.cs.convert(
      [
        Math.floor(this.info.size[0] / 2),
        Math.floor(this.info.size[1] / 2),
        Math.floor(this.info.count / 2),
      ],
      components.image.CSType.Index2C,
      components.image.CSType.Index3C,
    );

    this.clipIndicator = clipIndicatorGo.addComponent(ClipIndicator);
    this.clipIndicator.setCS(this.cs, this.physicalSize, crosshairCenter);
  }
}
