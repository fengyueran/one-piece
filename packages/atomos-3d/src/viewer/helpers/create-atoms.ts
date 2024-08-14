import * as THREE from 'three';

import { RadiusKey, getAtomRadius } from './get-atom-radius';
import { Atom, Bone } from '../meshes';
import { PDBLoader } from '../../loaders';

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

interface Point {
  atomType: string;
  position: THREE.Vector3;
}

const createBondSegments = (startPoint: Point, endPoint: Point) => {
  const radius = 0.15;
  const visibleBondMid = new THREE.Vector3();
  const startAtomRadius = getAtomRadius(startPoint.atomType);
  const endAtomRadius = getAtomRadius(endPoint.atomType);

  const distance = startPoint.position.distanceTo(endPoint.position);
  const visibleBondLength = (distance - startAtomRadius - endAtomRadius) / 2;
  const startPercent = (visibleBondLength + startAtomRadius) / distance;
  visibleBondMid
    .copy(startPoint.position)
    .lerp(endPoint.position, startPercent);

  const height1 = startPoint.position.distanceTo(visibleBondMid);
  const cylinder1 = new Bone({
    height: height1,
    type: startPoint.atomType,
    position: startPoint.position,
    visibleBondMid,
    radius,
  });

  const height2 = visibleBondMid.distanceTo(endPoint.position);
  const cylinder2 = new Bone({
    height: height2,
    type: endPoint.atomType,
    position: endPoint.position,
    visibleBondMid,
    radius,
  });

  return [cylinder1, cylinder2];
};

const createLines = (geometryBonds: THREE.BufferGeometry, atoms: string[]) => {
  const lines: THREE.Mesh[] = [];
  const positions = geometryBonds.getAttribute('position');
  const start = new THREE.Vector3();
  const end = new THREE.Vector3();

  for (let i = 0; i < positions.count; i += 2) {
    start.fromBufferAttribute(positions, i);
    end.fromBufferAttribute(positions, i + 1);
    const segments = createBondSegments(
      { position: start, atomType: atoms[i] },
      { position: end, atomType: atoms[i + 1] }
    );

    segments.forEach((seg) => {
      lines.push(seg);
    });
  }

  return lines;
};

const createLinesByAtomDistance = (
  atoms: [number, number, number, string][]
) => {
  const lines: THREE.Mesh[] = [];
  const BondThreshold = 1.8;

  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const atom1 = atoms[i];
      const atom2 = atoms[j];
      const distance = Math.sqrt(
        Math.pow(atom1[0] - atom2[0], 2) +
          Math.pow(atom1[1] - atom2[1], 2) +
          Math.pow(atom1[2] - atom2[2], 2)
      );
      if (distance < BondThreshold) {
        const start = new THREE.Vector3(atom1[0], atom1[1], atom1[2]);
        const end = new THREE.Vector3(atom2[0], atom2[1], atom2[2]);
        const segments = createBondSegments(
          { position: start, atomType: atom1[3] },
          { position: end, atomType: atom2[3] }
        );

        segments.forEach((seg) => {
          lines.push(seg);
        });
      }
    }
  }

  return lines;
};

export const createAtomsFromPdb = (pdbText: string) => {
  const _loader = new PDBLoader();
  const pdb = _loader.parse(pdbText);
  const offset = new THREE.Vector3();

  const atoms = [] as Atom[];

  const geometryAtoms = pdb.geometryAtoms;
  const geometryBonds = pdb.geometryBonds;

  geometryAtoms.computeBoundingBox();
  geometryAtoms.boundingBox?.getCenter(offset).negate();

  //将原子的几何结构沿着计算出的偏移量平移，使得模型的几何中心与坐标系的原点对齐
  // geometryAtoms.translate(offset.x, offset.y, offset.z);
  // geometryBonds.translate(offset.x, offset.y, offset.z);

  const positions = geometryAtoms.getAttribute('position');

  const position = new THREE.Vector3();

  for (let i = 0; i < pdb.json.atoms.length; i += 1) {
    position.x = positions.getX(i);
    position.y = positions.getY(i);
    position.z = positions.getZ(i);

    const atomInfo = pdb.json.atoms[i];
    const type = atomInfo[atomInfo.length - 1] as string;
    const radius = getAtomRadius(type as RadiusKey);

    const atom = new Atom(type, position, radius);

    atoms.push(atom);
  }

  const lines = pdb.json.bondAtomTypes.length
    ? createLines(geometryBonds, pdb.json.bondAtomTypes)
    : createLinesByAtomDistance(pdb.json.atoms);

  return { atoms, lines };
};

export const parseLammpsTrajectoryFrame = (frameStr: string) => {
  const parts = frameStr.split('TEM: ATOMS id element x y z');

  const lines = parts[1].split('\n').slice(1, -1);
  const atoms = lines.map((line) => {
    const lineParts = line.split(' ');
    return {
      id: parseInt(lineParts[0]),
      element: lineParts[1],
      x: parseFloat(lineParts[2]),
      y: parseFloat(lineParts[3]),
      z: parseFloat(lineParts[4]),
    };
  });

  return atoms;
};

export const createAtomsFromLammpsTrjFrame = (frameStr: string) => {
  const atomInfos = parseLammpsTrajectoryFrame(frameStr);
  const atoms = atomInfos.map((atomInfo) => {
    const position = new THREE.Vector3(atomInfo.x, atomInfo.y, atomInfo.z);

    const type = atomInfo.element as RadiusKey;
    const radius = getAtomRadius(type);

    const atom = new Atom(type, position, radius);
    return atom;
  });

  return atoms;
};
