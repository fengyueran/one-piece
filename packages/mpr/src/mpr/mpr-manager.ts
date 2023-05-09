import { Plane, makeImg3DByDicomBufferList } from '../helpers';
import { DicomManager, DicomEvent, DicomState } from '../dicom-viewer';

export enum MprEvent {
  Ready,
  Error,
}

export interface MprState {
  event: MprEvent;
  value?: any;
}

export type getSeriesDicom = () => Promise<ArrayBuffer[]>;
export type OnStateChange = (s: MprState) => void;

export class MPRManager {
  private dicomReayCount = 0;
  private dicomManagers: DicomManager[] = [];
  private onStateChange?: OnStateChange;

  createDicomManagers = async (
    planes: Plane[],
    getSeriesDicom: getSeriesDicom,
    onStateChange?: OnStateChange
  ) => {
    try {
      this.onStateChange = onStateChange;
      const bufferList = await getSeriesDicom();
      const image = await makeImg3DByDicomBufferList(bufferList);
      planes.forEach((plane) => {
        this.dicomManagers.push(new DicomManager(plane, image));
      });

      this.subscribeEvents();
    } catch (error) {
      console.error('createDicomManagers error', error);
      if (this.onStateChange) {
        this.onStateChange({
          event: MprEvent.Error,
          value: (error as Error).message,
        });
      }
    }
  };

  subscribeEvents = () => {
    const onStateChange = (state: MprState) => {
      if (this.onStateChange) {
        this.onStateChange(state);
      }
    };

    const handlerMap = {
      [DicomEvent.Crosshair]: (data: {
        value: { coords3D: [number, number, number] };
      }) => {
        this.dicomManagers.forEach((dm) => {
          const crosshair = dm.getCrosshair();
          const value = data.value.coords3D;

          if (
            value[0] !== crosshair[0] ||
            value[1] !== crosshair[1] ||
            value[2] !== crosshair[2]
          ) {
            const model = dm.getDicomSceneModel();
            model?.setCrosshair(value);
          }
        });
      },
      [DicomEvent.Ready]: () => {
        this.dicomReayCount++;
        if (this.dicomReayCount === this.dicomManagers.length) {
          onStateChange({ event: MprEvent.Ready, value: true });
        }
      },
    };
    const handleDicomStateChange = (data: DicomState) => {
      const handler = handlerMap[data.event as keyof typeof handlerMap];
      if (handler) {
        handler(data);
      }
    };

    this.dicomManagers.forEach((dm) => {
      dm.subcribeStateChange(handleDicomStateChange);
    });
  };

  getDicomManager = (plane: Plane) => {
    const dm = this.dicomManagers.find((d) => {
      return d.getPlane() === plane;
    });
    return dm;
  };

  destroy = () => {
    this.dicomManagers.forEach((dm) => {
      dm.destroy();
    });
    this.dicomManagers = [];
    this.onStateChange = undefined;
  };
}
