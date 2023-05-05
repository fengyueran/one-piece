import type { TypedArray } from './types';

import DataStream from './datastream';

import DicomParser from './dicomparser';

export interface FullDicom {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTag: (tagName: string) => any;
  pixelData: (index?: number) => TypedArray;
  rescaleSlope: () => number | undefined | null;
  rescaleIntercept: () => number | undefined | null;
  numberOfChannels: () => number | undefined | null;
  clearBuffer: () => void;
}

export const parseDicom = (arrayBuffer: ArrayBuffer): FullDicom => {
  const ds = new DataStream(arrayBuffer);
  if (!DicomParser.match(ds)) {
    throw new Error('not a dicom file.');
  }
  const dp = new DicomParser(ds);
  dp.parse();
  return {
    getTag: (tagName: string) => dp.valueOf(tagName),
    pixelData: (index = 0) => dp.readPixelData(index),
    rescaleSlope: () => (dp.rescaleSlope() ? parseFloat(dp.rescaleSlope()) : dp.rescaleSlope()),
    rescaleIntercept: () =>
      dp.rescaleIntercept() ? parseFloat(dp.rescaleIntercept()) : dp.rescaleIntercept(),
    numberOfChannels: () => dp.numberOfChannels(),
    clearBuffer: () => dp.clearBuffer(),
  };
};

export * from './types';
