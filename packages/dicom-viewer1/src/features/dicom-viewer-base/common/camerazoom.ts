import { clamp } from 'lodash-es';
import { Vector2 } from 'three';
import { Zoomer } from './types';
import { components, engine } from '@cc/viewers-dvtool';

export class CameraZoom extends engine.TSBehaviour implements Zoomer {
  zoomMin = 0.25;

  zoomMax = 8;

  private zoomBasedOnPoint = false;

  setPointMode(basedOnPoint?: boolean): void {
    this.zoomBasedOnPoint = !!basedOnPoint;
  }

  updateZoomDelta(delta: number, screenCenter?: Vector2): void {
    this.doZoomEffect(
      clamp(this.gameObject.scene.mainCamera.zoom * delta, this.zoomMin, this.zoomMax),
      this.zoomBasedOnPoint ? screenCenter : undefined,
    );
  }

  private doZoomEffect(zoom: number, screenCenter?: Vector2): void {
    if (this.scene.mainCamera.zoom === zoom) {
      return;
    }
    if (screenCenter) {
      const before = this.scene.mainCamera.viewToWorld(screenCenter.x, screenCenter.y);
      this.scene.mainCamera.zoom = zoom;
      const after = this.scene.mainCamera.viewToWorld(screenCenter.x, screenCenter.y);
      this.scene.mainCamera.transform.position = this.scene.mainCamera.transform.position
        .clone()
        .add(before.sub(after));
    } else {
      this.scene.mainCamera.zoom = zoom;
    }

    this.scene.nc.emit('zoomChanged', zoom);
  }

  setZoom(zoom: number): void {
    this.doZoomEffect(zoom);
  }
}
