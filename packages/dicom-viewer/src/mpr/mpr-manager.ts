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
