import * as THREE from 'three';
import { PDBLoader } from 'three/examples/jsm/loaders/PDBLoader';

import { AtomType } from 'src/helpers';
import { RenderManager } from './render-manager';
import { Atom } from './atom';
import { vdwRadiiMap } from './vdw-radii-map';
import { LammpsTrjLoader } from '../loaders';

export interface AtomosViewerConfig {}

export enum ModelType {
  Pdb,
  LammpsTrajectory,
}

// const parsePdbText = (pdbText: string) => {
//   const _loader = new PDBLoader();
//   const pdb = _loader.parse(pdbText);
//   const offset = new THREE.Vector3();
//   const lines = [] as THREE.Mesh[];
//   const atoms = [] as THREE.Mesh[];

//   const geometryAtoms = pdb.geometryAtoms;
//   const geometryBonds = pdb.geometryBonds;
//   // const json = pdb.json;

//   const sphereGeometry = new THREE.SphereGeometry(2);

//   geometryAtoms.computeBoundingBox();
//   geometryAtoms.boundingBox.getCenter(offset).negate();

//   geometryAtoms.translate(offset.x, offset.y, offset.z);
//   geometryBonds.translate(offset.x, offset.y, offset.z);

//   let positions = geometryAtoms.getAttribute('position');
//   const colors = geometryAtoms.getAttribute('color');

//   const position = new THREE.Vector3();
//   const color = new THREE.Color();

//   for (let i = 0; i < positions.count; i++) {
//     position.x = positions.getX(i);
//     position.y = positions.getY(i);
//     position.z = positions.getZ(i);

//     color.r = colors.getX(i);
//     color.g = colors.getY(i);
//     color.b = colors.getZ(i);

//     const material = new THREE.MeshPhongMaterial({ color: color });

//     const object = new THREE.Mesh(sphereGeometry, material);
//     object.position.copy(position);
//     // object.position.multiplyScalar(75);
//     // object.scale.multiplyScalar(25);

//     atoms.push(object);

//     // const atom = json.atoms[i];

//     // const text = document.createElement('div');
//     // text.className = 'label';
//     // text.style.color =
//     //   'rgb(' + atom[3][0] + ',' + atom[3][1] + ',' + atom[3][2] + ')';
//     // text.textContent = atom[4];

//     // const label = new CSS2DObject(text);
//     // label.position.copy(object.position);
//     // root.add(label);
//   }
//   // root.add(atoms);

//   //   positions = geometryBonds.getAttribute('position');

//   //   const start = new THREE.Vector3();
//   //   const end = new THREE.Vector3();

//   //   const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
//   //   for (let i = 0; i < positions.count; i += 2) {
//   //     start.x = positions.getX(i);
//   //     start.y = positions.getY(i);
//   //     start.z = positions.getZ(i);

//   //     end.x = positions.getX(i + 1);
//   //     end.y = positions.getY(i + 1);
//   //     end.z = positions.getZ(i + 1);

//   //     start.multiplyScalar(75);
//   //     end.multiplyScalar(75);

//   //     const object = new THREE.Mesh(
//   //       boxGeometry,
//   //       new THREE.MeshPhongMaterial({
//   //         color: 0xffffff,
//   //         transparent: true,
//   //         opacity: 0,
//   //       })
//   //     );
//   //     object.position.copy(start);
//   //     object.position.lerp(end, 0.5);
//   //     object.scale.set(5, 5, start.distanceTo(end));
//   //     object.lookAt(end);
//   //     lines.push(object);
//   //   }

//   return atoms;
// };

const createPdbAtomMeshes = (pdbText: string) => {
  const _loader = new PDBLoader();
  const pdb = _loader.parse(pdbText);
  const offset = new THREE.Vector3();

  const atoms = [] as Atom[];

  const geometryAtoms = pdb.geometryAtoms;

  geometryAtoms.computeBoundingBox();
  geometryAtoms.boundingBox.getCenter(offset).negate();

  //将原子的几何结构沿着计算出的偏移量平移，使得模型的几何中心与坐标系的原点对齐
  geometryAtoms.translate(offset.x, offset.y, offset.z);

  const positions = geometryAtoms.getAttribute('position');
  const colors = geometryAtoms.getAttribute('color');

  const position = new THREE.Vector3();
  const color = new THREE.Color();

  for (let i = 0; i < pdb.json.atoms.length; i += 1) {
    position.x = positions.getX(i);
    position.y = positions.getY(i);
    position.z = positions.getZ(i);

    color.r = colors.getX(i);
    color.g = colors.getY(i);
    color.b = colors.getZ(i);

    const atomInfo = pdb.json.atoms[i];
    const type = atomInfo[atomInfo.length - 1];
    const radius = vdwRadiiMap[type as keyof typeof vdwRadiiMap];

    const atom = new Atom(type, position, radius);

    atoms.push(atom);
  }

  return atoms;
};

interface AtomInfo {
  id: number;
  element: string;
  x: number;
  y: number;
  z: number;
}

const createAtoms = (atomInfos: AtomInfo[], scale = 1) => {
  const geometryAtoms = new THREE.BufferGeometry();

  const count = atomInfos.length;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    const atomInfo = atomInfos[i];
    const current = i * 3;

    positions[current] = atomInfo.x;
    positions[current + 1] = atomInfo.y;
    positions[current + 2] = atomInfo.z;
  }

  geometryAtoms.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  );

  const atoms = [] as Atom[];

  const offset = new THREE.Vector3();

  geometryAtoms.computeBoundingBox();
  geometryAtoms.boundingBox.getCenter(offset).negate();

  //将原子的几何结构沿着计算出的偏移量平移，使得模型的几何中心与坐标系的原点对齐
  geometryAtoms.translate(offset.x, offset.y, offset.z);

  for (let i = 0; i < atomInfos.length; i += 1) {
    const atomInfo = atomInfos[i];
    const position = new THREE.Vector3(atomInfo.x, atomInfo.y, atomInfo.z);

    const type = atomInfo.element as AtomType;
    const radius = vdwRadiiMap[type as keyof typeof vdwRadiiMap] * scale;

    const atom = new Atom(type, position, radius);

    atoms.push(atom);
  }

  return atoms;
};

export class AtomosViewer {
  private _paused = false;
  private _loader?: LammpsTrjLoader;
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
      const atoms = createAtoms(data, 0.3);
      atoms.forEach((atom) => {
        this._renderManager.add(atom);
      });
    } else if (type === ModelType.Pdb) {
      const atoms = createPdbAtomMeshes(data);
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
      this._loader = new LammpsTrjLoader({
        url,
        requestConfig,
        onModel: (model: AtomInfo[]) => {
          if (this._firstFrameRendered) {
            this._models.push(model);
          } else {
            this._firstFrameRendered = true;
            if (!this._renderManager.dynamicObjs.length) {
              this.addModel(model, type);
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
