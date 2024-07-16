import {
  BufferGeometry,
  FileLoader,
  Float32BufferAttribute,
  Loader,
  Color,
  LoadingManager,
} from 'three';

export class PDBLoader extends Loader {
  constructor(manager?: LoadingManager) {
    super(manager);
  }

  load(
    url: string,
    onLoad: (data: string | ArrayBuffer) => void,
    onProgress: (e?: ProgressEvent<EventTarget>) => void,
    onError: (e: unknown) => void
  ) {
    // eslint-disable-next-line
    const scope = this;

    const loader = new FileLoader(scope.manager);
    loader.setPath(scope.path);
    loader.setRequestHeader(scope.requestHeader);
    loader.setWithCredentials(scope.withCredentials);
    loader.load(
      url,
      function (text: string | ArrayBuffer) {
        try {
          onLoad(scope.parse(text as string) as unknown as any);
        } catch (e) {
          if (onError) {
            onError(e as Error);
          } else {
            console.error(e);
          }

          scope.manager.itemError(url);
        }
      },
      onProgress,
      onError
    );
  }

  // Based on CanvasMol PDB parser

  parse(text: string) {
    function trim(text: string) {
      return text.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }

    function capitalize(text: string) {
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }

    function hash(s: number, e: number) {
      return 's' + Math.min(s, e) + 'e' + Math.max(s, e);
    }

    function parseBond(
      start: number,
      length: number,
      satom: number,
      i: number
    ) {
      const eatom = parseInt(lines[i].slice(start, start + length));

      if (eatom) {
        const h = hash(satom, eatom);

        if (_bhash[h] === undefined) {
          _bonds.push([satom - 1, eatom - 1, 1]);
          _bhash[h] = _bonds.length - 1;
        } else {
          // doesn't really work as almost all PDBs
          // have just normal bonds appearing multiple
          // times instead of being double/triple bonds
          // bonds[bhash[h]][2] += 1;
        }
      }
    }

    function buildGeometry() {
      const build = {
        geometryAtoms: new BufferGeometry(),
        geometryBonds: new BufferGeometry(),
        json: {
          atoms: atoms,
          bondAtomTypes: [],
        },
      };

      const geometryAtoms = build.geometryAtoms;
      const geometryBonds = build.geometryBonds;

      const verticesAtoms = [];
      const verticesBonds = [];
      const bondAtomTypes = build.json.bondAtomTypes;

      // atoms

      for (let i = 0, l = atoms.length; i < l; i++) {
        const atom = atoms[i];

        const x = atom[0];
        const y = atom[1];
        const z = atom[2];

        verticesAtoms.push(x, y, z);
      }

      // bonds

      for (let i = 0, l = _bonds.length; i < l; i++) {
        const bond = _bonds[i];

        const start = bond[0];
        const end = bond[1];

        const startAtom = _atomMap[start];
        const endAtom = _atomMap[end];

        let x = startAtom[0];
        let y = startAtom[1];
        let z = startAtom[2];

        verticesBonds.push(x, y, z);
        bondAtomTypes.push(startAtom[3]);

        x = endAtom[0];
        y = endAtom[1];
        z = endAtom[2];
        verticesBonds.push(x, y, z);
        bondAtomTypes.push(endAtom[3]);
      }

      // build geometry

      geometryAtoms.setAttribute(
        'position',
        new Float32BufferAttribute(verticesAtoms, 3)
      );

      geometryBonds.setAttribute(
        'position',
        new Float32BufferAttribute(verticesBonds, 3)
      );

      return build;
    }

    const atoms: [number, number, number, string][] = [];

    const _bonds: [number, number, number][] = [];
    const _bhash: { [key: string]: number } = {};
    const _atomMap: { [key: string]: any } = {};

    // parse

    const lines = text.split('\n');

    for (let i = 0, l = lines.length; i < l; i++) {
      if (
        lines[i].slice(0, 4) === 'ATOM' ||
        lines[i].slice(0, 6) === 'HETATM'
      ) {
        const x = parseFloat(lines[i].slice(30, 37));
        const y = parseFloat(lines[i].slice(38, 45));
        const z = parseFloat(lines[i].slice(46, 53));
        const index = parseInt(lines[i].slice(6, 11)) - 1;

        let e = trim(lines[i].slice(76, 78)).toLowerCase();

        if (e === '') {
          e = trim(lines[i].slice(12, 14)).toLowerCase();
        }

        const atomData = [x, y, z, capitalize(e)];

        atoms.push(atomData as [number, number, number, string]);
        _atomMap[index] = atomData;
      } else if (lines[i].slice(0, 6) === 'CONECT') {
        const satom = parseInt(lines[i].slice(6, 11));

        parseBond(11, 5, satom, i);
        parseBond(16, 5, satom, i);
        parseBond(21, 5, satom, i);
        parseBond(26, 5, satom, i);
      }
    }

    // build and return geometry

    return buildGeometry();
  }
}
