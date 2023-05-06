import { Plane, makeImg3DByDicomBufferList } from '../helpers';
import { DicomManager, State } from '../dicom-viewer';

export enum MprState {
  Ready,
}
export type getSeriesDicom = () => Promise<ArrayBuffer[]>;
export type OnStateChange = (s: { state: MprState; value?: any }) => void;

export class MPRManager {
  private dicomReayCount = 0;
  private dicomManagers: DicomManager[] = [];
  private onStateChange?: OnStateChange;

  createDicomManagers = async (
    planes: Plane[],
    getSeriesDicom: getSeriesDicom,
    onStateChange?: OnStateChange
  ) => {
    const bufferList = await getSeriesDicom();
    const image = await makeImg3DByDicomBufferList(bufferList);
    planes.forEach((plane) => {
      this.dicomManagers.push(new DicomManager(plane, image));
    });
    this.onStateChange = onStateChange;
    this.subscribeEvents();
  };

  subscribeEvents = () => {
    const onStateChange = (state: { state: MprState; value?: unknown }) => {
      if (this.onStateChange) {
        this.onStateChange(state);
      }
    };

    const handlerMap = {
      [State.Crosshair]: (data: {
        state: State;
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
      [State.Ready]: () => {
        this.dicomReayCount++;
        if (this.dicomReayCount === this.dicomManagers.length) {
          onStateChange({ state: MprState.Ready, value: true });
        }
      },
    };
    const handleStateChange = (data: { state: State; value: any }) => {
      const handler = handlerMap[data.state as keyof typeof handlerMap];
      if (handler) {
        handler(data);
      }
    };

    this.dicomManagers.forEach((dm) => {
      dm.subcribeStateChange(handleStateChange);
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
