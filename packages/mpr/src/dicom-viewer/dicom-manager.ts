import { components, events } from '@cc/viewers-dvtool';
import * as ccloader from '@cc/loader';

import {
  Plane,
  getBasicInfo,
  DicomSceneModel,
  createDicomSceneModel,
} from '../helpers';

export enum DicomEvent {
  Ready,
  PhysicalPerPixel,
  Crosshair,
}

export interface DicomState {
  event: DicomEvent;
  value: any;
}

type OnStateChange = (s: DicomState) => void;

export type DicomInfo = ReturnType<typeof getBasicInfo>;

export class DicomManager {
  private ready = false;
  private basicInfo: object = {};
  private dicomSceneModel?: DicomSceneModel;
  private listeners: OnStateChange[] = [];

  onStateChange?: OnStateChange;

  crosshair: [number, number, number] = [0, 0, 0];
  window = {
    windowWidth: 300,
    windowCenter: 1000,
  };

  constructor(
    private plane: Plane,
    image: ccloader.dicom.Image3DFromDicom<Int16Array>
  ) {
    this.dicomSceneModel = createDicomSceneModel(plane, image, undefined, {
      startRenderLoopWhenSenceCreate: true,
    });
    this.basicInfo = getBasicInfo(image, this.dicomSceneModel);
    this.subscribeEvents();
  }

  getReady = () => this.ready;
  getPlane = () => this.plane;
  getCrosshair = () => this.crosshair;
  get2DCrosshair = () =>
    this.dicomSceneModel?.info.coords3DTo2D(this.crosshair) || {
      sliceIndex: 0,
      indexCoords: [0, 0],
    };
  getBasicInfo = () => this.basicInfo as DicomInfo;
  getDicomSceneModel = () => this.dicomSceneModel;

  attachParent = (dom: HTMLElement) => {
    this.dicomSceneModel?.attachParentDom(dom);
  };

  attachInput = (dom: HTMLElement) => {
    this.dicomSceneModel?.attachInputDom(dom);
  };

  detachParent = () => {
    this.dicomSceneModel?.detachParentDom();
  };

  detachInput = () => {
    this.dicomSceneModel?.detachInputDom();
  };

  subscribeEvents = () => {
    if (!this.dicomSceneModel) return;

    const handlerMap = {
      [events.afterUpdateEvent]: () => {
        if (this.ready) {
          this.dicomSceneModel?.off(
            events.afterUpdateEvent,
            handlerMap[events.afterUpdateEvent]
          );
        } else {
          this.ready = true;
          this.notify({ event: DicomEvent.Ready, value: true });
        }
      },
      [events.cameraChangedEvent]: () => {
        this.notify({
          event: DicomEvent.PhysicalPerPixel,
          value: this.dicomSceneModel?.getPhysicalPerPixel(),
        });
      },
      [events.crosshairChangedEvent]: (e: [number, number, number]) => {
        if (
          e[0] !== this.crosshair[0] ||
          e[1] !== this.crosshair[1] ||
          e[2] !== this.crosshair[2]
        ) {
          this.crosshair = e;
          const coords2D = this.dicomSceneModel?.info.coords3DTo2D(e);
          this.notify({
            event: DicomEvent.Crosshair,
            value: { coords2D, coords3D: e },
          });
        }
      },
      [events.windowChangedEvent]: (e: components.LUTWindow) => {
        this.window = e;
      },
    };

    Object.keys(handlerMap).forEach((event) => {
      const handler = handlerMap[event as keyof typeof handlerMap];
      this.dicomSceneModel?.nc.on(event, handler);
    });
  };

  subcribeStateChange = (onStateChange: OnStateChange) => {
    this.listeners.push(onStateChange);
  };

  notify = (data: DicomState) => {
    this.listeners.forEach((onStateChange) => {
      onStateChange(data);
    });
  };

  setCrosshair = (crosshair: ccloader.image.SliceIndexAndCoords2D) => {
    const coords3D = this.dicomSceneModel?.info.coords2DTo3D(crosshair);
    this.dicomSceneModel?.setCrosshair(coords3D as [number, number, number]);
  };

  destroy = () => {
    this.dicomSceneModel?.detachParentDom();
    this.dicomSceneModel?.detachInputDom();
    this.dicomSceneModel?.destroy();
    this.dicomSceneModel = undefined;
    this.basicInfo = {};
    this.listeners = [];
    this.ready = false;
  };
}
