import * as THREE from 'three';
import { PDBLoader } from 'three/examples/jsm/loaders/PDBLoader';

import { RenderManager } from './render-manager';
import { Atom } from './atom';
import { vdwRadiiMap } from './vdw-radii-map';

export interface AtomosViewerConfig {}

// const parsePdbText = (pdbText: string) => {
//   const loader = new PDBLoader();
//   const pdb = loader.parse(pdbText);
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
  const loader = new PDBLoader();
  const pdb = loader.parse(pdbText);
  const offset = new THREE.Vector3();

  const atoms = [] as Atom[];

  const geometryAtoms = pdb.geometryAtoms;

  geometryAtoms.computeBoundingBox();
  geometryAtoms.boundingBox.getCenter(offset).negate();

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

    const atom = new Atom(type, position, color, radius);

    // object.position.copy(position);
    // object.position.multiplyScalar(75);
    // object.scale.multiplyScalar(25);

    atoms.push(atom);
  }

  return atoms;
};

export class AtomosViewer {
  private renderManager: RenderManager;
  constructor(element: HTMLElement, private config: AtomosViewerConfig) {
    this.renderManager = new RenderManager(element);
  }

  render = (data: string) => {
    const atoms = createPdbAtomMeshes(data);

    // // 原子数据，通常这将通过解析PDB文件来获得
    // const atoms = [
    //   new Atom('S', new THREE.Vector3(-1.889, 1.63, -0.268), 0xffff00, 1.8),
    //   new Atom('O', new THREE.Vector3(-0.564, 1.966, 0.871), 0xff0000, 1.52),
    //   new Atom('O', new THREE.Vector3(-3.574, 1.62, 0.306), 0xff0000, 1.52),
    // ];

    // 创建并添加原子到场景
    atoms.forEach((atom) => {
      this.renderManager.add(atom);
    });

    this.renderManager.render();
  };
}
