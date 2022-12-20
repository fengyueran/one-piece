import * as uzip from 'uzip';

export const unZip = (ab: ArrayBuffer) => {
  const u = new Uint8Array(ab);
  const data = uzip.parse(u);
  return data;
};

export type UZIPFiles = uzip.UZIPFiles;
