import { BufferGeometry, DataTexture, RGBFormat } from 'three';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import leftVtp from '../assets/heart-left.vtp';
import rightVtp from '../assets/heart-right.vtp';
import ply from '../assets/heart.ply';
import parseVtp from './vtp';

const fetchFile = async (url: string) => {
  try {
    let response = await fetch(url);
    return await response.text();
  } catch (error) {
    throw error;
  }
};

const defaultFFRColorStops = [
  [18, 100, 252],
  [0, 149, 255],
  [11, 226, 204],
  [0, 255, 0],
  [188, 240, 0],
  [254, 142, 20],
  [255, 70, 41],
  [255, 39, 6],
  [255, 2, 0],
  [255, 2, 0],
  [255, 2, 0],
];

export const loadTexture = () => {
  const width = 510;
  const height = 1;

  const size = width * height;
  const data = new Uint8Array(3 * size);

  const colorSegmentCount = defaultFFRColorStops.length - 1;
  const step = Math.floor(width / colorSegmentCount);

  for (let i = 0; i < colorSegmentCount; i++) {
    const startColor = defaultFFRColorStops[i];
    const endColor = defaultFFRColorStops[i + 1];

    const start = i * step * 3;

    const [rStep, gStep, bStep] = [0, 1, 2].map((v) => {
      return (endColor[v] - startColor[v]) / step;
    });

    for (let j = 0; j < step; j++) {
      const stride = start + j * 3;
      data[stride] = rStep * j + startColor[0];
      data[stride + 1] = gStep * j + startColor[1];
      data[stride + 2] = bStep * j + startColor[2];
    }
  }

  return new DataTexture(data, width, height, RGBFormat);
};

const loadPly = (): Promise<BufferGeometry> =>
  new Promise((reslove, reject) => {
    const loader = new PLYLoader();
    loader.load(ply, function (geometry) {
      reslove(geometry);
    });
  });

const loadVtps = async () => {
  try {
    const vtpUrls = [leftVtp, rightVtp];
    const vtpfiles = await Promise.all(vtpUrls.map((vtpUrl) => fetchFile(vtpUrl)));
    const cldata = await parseVtp(vtpfiles);
    return cldata;
  } catch (err) {
    console.log('loadVtps error', err);
    throw err;
  }
};

export const loadModelFiles = async () => {
  try {
    const cldata = await loadVtps();
    const geometry = await loadPly();
    return { cldata, geometry };
  } catch (err) {
    throw err;
  }
};
