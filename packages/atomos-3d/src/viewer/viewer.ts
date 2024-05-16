import {
  createAtomsFromPdb,
  createAtomsFromLammpsTrjFrame,
  parseLammpsTrajectoryFrame,
} from './helpers';
import { RenderManager } from '../core';
import { LargeFileLoader } from '../loaders';

export interface AtomosViewerConfig {}

export enum ModelType {
  Pdb,
  LammpsTrajectory,
}

interface AtomInfo {
  id: number;
  element: string;
  x: number;
  y: number;
  z: number;
}

export class AtomosViewer {
  private _paused = false;
  private _loader?: LargeFileLoader;
  private _firstFrameRendered = false;
  private _models: AtomInfo[][] = [];
  private _renderManager: RenderManager;
  constructor(element: HTMLElement, private config: AtomosViewerConfig) {
    this._renderManager = new RenderManager(element);
  }

  render = () => {
    this._renderManager.render();
  };

  addModel = (data: any, type: ModelType) => {
    if (type === ModelType.LammpsTrajectory) {
      const atoms = createAtomsFromLammpsTrjFrame(data, 0.3);
      atoms.forEach((atom) => {
        this._renderManager.add(atom);
      });
    } else if (type === ModelType.Pdb) {
      const atoms = createAtomsFromPdb(data);
      atoms.forEach((atom) => {
        this._renderManager.add(atom);
      });
    }
  };

  animateTrajectory = () => {
    const nextFrame = () => {
      if (this._paused) return;
      const atoms = this._models.shift();

      if (atoms && atoms.length === this._renderManager.dynamicObjs.length) {
        this._renderManager.dynamicObjs.forEach((atom, index) => {
          const newAtom = atoms[index];
          atom.position.set(newAtom.x, newAtom.y, newAtom.z);
        });
        setTimeout(nextFrame, 0);
      } else {
        setTimeout(nextFrame, 0);
      }

      if (this._models.length < 100) {
        this._loader?.resume();
      }
    };

    nextFrame();
  };

  addTrajectory = (
    url: string,
    type: ModelType,
    requestConfig?: RequestInit
  ) => {
    if (type === ModelType.LammpsTrajectory) {
      this._loader = new LargeFileLoader({
        url,
        frameFlag: 'ITEM: TIMESTEP',
        requestConfig,
        onModel: (frameStr: string) => {
          const model = parseLammpsTrajectoryFrame(frameStr);
          if (this._firstFrameRendered) {
            this._models.push(model);
          } else {
            this._firstFrameRendered = true;
            if (!this._renderManager.dynamicObjs.length) {
              this.addModel(frameStr, type);
              this._renderManager.zoomToFitScene();
            }

            this.render();
          }
        },
      });
      this.animateTrajectory();
    }
  };

  play = () => {
    this._paused = false;
    this._firstFrameRendered = false;
    this._models = [];
    this._loader?.fetchAndStream();
  };

  pause = () => {
    if (!this._paused) {
      this._paused = true;
      this._loader?.pause();
    }
  };

  resume = () => {
    if (this._paused) {
      this._paused = false;
      this.animateTrajectory();
    }
  };

  zoomToFitScene = () => {
    this._renderManager.zoomToFitScene();
  };

  dispose = () => {
    this.pause();
    this._loader = undefined;
    this._models = [];
    this._renderManager.dispose();
  };
}
