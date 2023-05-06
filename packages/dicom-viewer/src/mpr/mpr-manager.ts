import { components, events } from '@cc/viewers-dvtool';
import { Plane, makeImg3DByDicomBufferList } from '../helpers';
import { DicomManager } from '../dicom-viewer';

export type getSeriesDicom = () => Promise<ArrayBuffer[]>;
type OnStateChange = (s: { state: State; value?: any }) => void;

export enum State {
  Init,
  Ready,
  PhysicalPerPixel,
  Crosshair,
}

export class MPRManager {
  private ready = false;
  private dicomManagers: DicomManager[] = [];
  private onStateChange?: OnStateChange;

  createDicomManagers = async (
    planes: Plane[],
    getSeriesDicom: getSeriesDicom
  ) => {
    const bufferList = await getSeriesDicom();
    const image = await makeImg3DByDicomBufferList(bufferList);
    planes.forEach((plane) => {
      this.dicomManagers.push(new DicomManager(plane, image));
    });
    this.subscribeEvents();
  };

  subscribeEvents = () => {
    const onStateChange = (state: { state: State; value?: unknown }) => {
      if (this.onStateChange) {
        this.onStateChange(state);
      }
    };

    const handlerMap = {
      [events.crosshairChangedEvent]: (e: [number, number, number]) => {
        this.dicomManagers.forEach((dm) => {
          const crosshair = dm.getCrosshair();
          if (
            e[0] !== crosshair[0] ||
            e[1] !== crosshair[1] ||
            e[2] !== crosshair[2]
          ) {
            const model = dm.getDicomSceneModel();
            model?.setCrosshair(e);
          }
        });
      },
    };

    Object.keys(handlerMap).forEach((event) => {
      const handler = handlerMap[event as keyof typeof handlerMap];
      this.dicomManagers.forEach((dm) => {
        const model = dm.getDicomSceneModel();
        model?.nc.on(event, handler);
      });
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
  };
}
