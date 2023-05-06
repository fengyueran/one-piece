import { components, events } from '@cc/viewers-dvtool';
import * as ccloader from '@cc/loader';

import {
  Plane,
  DicomSceneModel,
  createDicomSceneModel,
  makeImg3DByDicomBufferList,
} from './helpers';

export type GetDicom = () => Promise<ArrayBuffer[]>;
type OnStateChange = (s: { state: State; value?: any }) => void;

export enum State {
  Init,
  Ready,
  PhysicalPerPixel,
  Crosshair,
}

const getTags = (image: ccloader.dicom.Image3DFromDicom<Int16Array>) => {
  const tags =
    image.getSliceInfo &&
    image.getSliceInfo(0, [
      'StudyInstanceUID',
      'InstitutionName',
      'PatientName',
      'PatientSex',
      'PatientAge',
      'PatientID',
      'Manufacturer',
      'StudyDate',
      'KVP',
      'PixelSpacing',
      'Modality',
      'Rows',
      'HeartRate',
      'ImageComments',
      'PersonName',
      'Columns',
      'ImageType',
    ]);
  return tags || {};
};

export const getBasicInfo = (
  image:
    | ccloader.image.Image3D<Int16Array>
    | ccloader.dicom.Image3DFromDicom<Int16Array>,
  dicomSceneModel: DicomSceneModel
) => {
  const physicalSizeY =
    dicomSceneModel.info.size[1] * dicomSceneModel.info.spacing[1];

  const getInstanceNumbers = () => {
    const instanceNumbers = [];
    for (let i = 0; i < dicomSceneModel.info.count; i += 1) {
      try {
        if (image instanceof ccloader.dicom.Image3DFromDicom<Int16Array>) {
          const tagMap = image.getSliceInfo(i, ['InstanceNumber']);
          instanceNumbers.push(tagMap.InstanceNumber);
        } else {
          instanceNumbers.push('');
        }
      } catch (error) {
        instanceNumbers.push('');
      }
    }
    return instanceNumbers;
  };

  const instanceNumbers = getInstanceNumbers();
  const tags =
    image instanceof ccloader.dicom.Image3DFromDicom<Int16Array>
      ? getTags(image)
      : {};
  const coords3D = [
    Math.floor(image.size[0] / 2),
    Math.floor(image.size[1] / 2),
    Math.floor(image.size[2] / 2),
  ];
  const coords2D = dicomSceneModel.info.coords3DTo2D(
    coords3D as [number, number, number]
  );

  const basicInfo = {
    physicalSizeY,
    zoom: dicomSceneModel.defaultProperties.zoom,
    imgSize: image.size,
    tags,
    crosshair: coords2D,
    position: coords3D,
    spaceInfo: {
      count: dicomSceneModel.info.count,
      size: dicomSceneModel.info.size,
      spacing: dicomSceneModel.info.refImage3DSpaceInfo.spacing,
      anatomicalSystem: dicomSceneModel.info.anatomicalSystem,
    },
    physicalPerPixel: dicomSceneModel.getPhysicalPerPixel(),
    instanceNumbers,
  };

  return basicInfo;
};

export type DicomInfo = ReturnType<typeof getBasicInfo>;

export class DicomManager {
  private ready = false;
  private basicInfo: object = {};
  private dicomSceneModel?: DicomSceneModel;
  private onStateChange?: OnStateChange;

  crosshair = [0, 0, 0];
  window = {
    windowWidth: 300,
    windowCenter: 1000,
  };

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
    onStateChange({ state: State.Init, value: this.basicInfo });
    const handlerMap = {
      [events.afterUpdateEvent]: () => {
        if (this.ready) {
          this.dicomSceneModel?.off(
            events.afterUpdateEvent,
            handlerMap[events.afterUpdateEvent]
          );
        } else {
          this.ready = true;
          onStateChange({ state: State.Ready });
        }
      },
      [events.cameraChangedEvent]: () => {
        onStateChange({
          state: State.PhysicalPerPixel,
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
          onStateChange({
            state: State.Crosshair,
            value: coords2D,
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

  setCrosshair = (crosshair: ccloader.image.SliceIndexAndCoords2D) => {
    const coords3D = this.dicomSceneModel?.info.coords2DTo3D(crosshair);
    this.dicomSceneModel?.setCrosshair(coords3D as [number, number, number]);
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
    this.basicInfo = getBasicInfo(image, this.dicomSceneModel);
    this.onStateChange = onStateChange;
    this.subscribeEvents();
  };
}

export const dicomManager = DicomManager.getInstance();
