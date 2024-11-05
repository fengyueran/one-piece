import {
  createAtomsFromPdb,
  createAtomsFromLammpsTrjFrame,
  parseLammpsTrajectoryFrame,
} from './helpers';
import { RenderManager, RenderManagerConfig } from '../core';
import { FetchStreamLoader, AbstractStreamingDataLoader } from '../loaders';

// eslint-disable-next-line
export interface AtomosViewerConfig extends RenderManagerConfig {}

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
  private _loader?: AbstractStreamingDataLoader;
  private _firstFrameRendered = false;
  private _models: AtomInfo[][] = [];
  private _renderManager: RenderManager;
  constructor(element: HTMLElement, config: AtomosViewerConfig) {
    this._renderManager = new RenderManager(element, config);
  }

  render = () => {
    this._renderManager.render();
  };

  addModel = (data: any, type: ModelType) => {
    if (type === ModelType.LammpsTrajectory) {
      const atoms = createAtomsFromLammpsTrjFrame(data);
      atoms.forEach((atom) => {
        this._renderManager.add(atom);
      });
      this._renderManager.updateBoundingBox();
    } else if (type === ModelType.Pdb) {
      const { atoms, lines } = createAtomsFromPdb(data);
      atoms.forEach((atom) => {
        this._renderManager.add(atom);
      });

      lines.forEach((line) => {
        this._renderManager.add(line);
      });
      this._renderManager.updateBoundingBox();
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
    this._loader = new FetchStreamLoader({
      url,
      frameFlag: 'ITEM: TIMESTEP',
      requestConfig,
      onFrame: (frameStr: string) => {
        this.onFrame(frameStr, type);
      },
    });
    this.animateTrajectory();
  };

  addTrajectoryByCustomLoader = (
    type: ModelType,
    loader: AbstractStreamingDataLoader
  ) => {
    this._loader = loader;
    this._loader.setOnFrame((frameStr: string) => this.onFrame(frameStr, type));
    this.animateTrajectory();
  };

  private parseFrame(frameStr: string, modelType: ModelType): AtomInfo[] {
    if (modelType === ModelType.LammpsTrajectory) {
      return parseLammpsTrajectoryFrame(frameStr);
    }
    throw new Error('Unsupported model type');
  }

  private onFrame = (frameStr: string, modelType: ModelType) => {
    const model = this.parseFrame(frameStr, modelType);
    if (this._firstFrameRendered) {
      this._models.push(model);
    } else {
      this._firstFrameRendered = true;
      if (!this._renderManager.dynamicObjs.length) {
        this.addModel(frameStr, modelType);
        this._renderManager.zoomToFitScene();
      }

      this.render();
    }
  };

  play = () => {
    this._paused = false;
    this._firstFrameRendered = false;
    this._models = [];
    this._loader?.startStreaming();
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
