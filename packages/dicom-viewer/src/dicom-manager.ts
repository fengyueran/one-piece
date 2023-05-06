import { events } from '@cc/viewers-dvtool';

import {
  Plane,
  DicomSceneModel,
  createDicomSceneModel,
  makeImg3DByDicomBufferList,
} from './helpers';

export type GetDicom = () => Promise<ArrayBuffer[]>;
type OnStateChange = (s: { state: State; value?: any }) => void;

export enum State {
  Ready,
  PhysicalPerPixel,
}

export class DicomManager {
  private ready = false;
  private dicomSceneModel?: DicomSceneModel;
  private onStateChange?: OnStateChange;

  private static singleton: DicomManager;

  static getInstance() {
    if (!DicomManager.singleton) {
      DicomManager.singleton = new DicomManager();
    }
    return DicomManager.singleton;
  }

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

    const onStateChange = (state: { state: State; value?: unknown }) => {
      if (this.onStateChange) {
        this.onStateChange(state);
      }
    };
    const sendReadyEvent = () => {
      if (this.ready) {
        this.dicomSceneModel?.off(events.afterUpdateEvent, sendReadyEvent);
      } else {
        this.ready = true;
        onStateChange({ state: State.Ready });
      }
    };

    this.dicomSceneModel.nc.on(events.afterUpdateEvent, sendReadyEvent);
    this.dicomSceneModel.nc.on(events.cameraChangedEvent, () => {
      onStateChange({
        state: State.PhysicalPerPixel,
        value: this.dicomSceneModel?.getPhysicalPerPixel(),
      });
    });
  };

  render = async (getDicom: GetDicom, onStateChange?: OnStateChange) => {
    const bufferList = await getDicom();
    const image = await makeImg3DByDicomBufferList(bufferList);
    this.dicomSceneModel = createDicomSceneModel(
      Plane.Axial,
      image,
      undefined,
      {
        startRenderLoopWhenSenceCreate: true,
      }
    );
    this.onStateChange = onStateChange;
    this.subscribeEvents();
  };
}

export const dicomManager = DicomManager.getInstance();
