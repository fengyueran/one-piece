import { components, products } from '@cc/viewers-dvtool';
import { DicomViewControllers } from './dicom-view-controllers';

import { DicomImageRoot as Base } from './dicomimageroot';
export class DicomImageRoot extends Base {
  dicomController?: DicomViewControllers;

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
}
