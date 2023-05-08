//@ts-ignore
import untar from 'js-untar';
import * as fflate from 'fflate';

const HOST = 'http://localhost:8080';

const unZip = (ab: ArrayBuffer): Promise<Uint8Array> => {
  const u = new Uint8Array(ab);
  return new Promise((resolve, reject) => {
    fflate.decompress(u, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
};

export const fetchFile = async (url: string) => {
  const r = await fetch(url);
  const arrayBuffer = await r.arrayBuffer();
  return arrayBuffer;
};

export const getNifti = async () => {
  const NIFTI_URL = `${HOST}/blue_iso.nii`;
  return fetchFile(NIFTI_URL);
};

interface UntarFile {
  buffer: ArrayBuffer;
}

export const getValidBufferList = async (fileList: UntarFile[]) => {
  const validFiles = fileList.filter(({ buffer }) => buffer.byteLength > 0);
  const bufferList = validFiles.map(({ buffer }) => buffer);

  return bufferList;
};

export const getSeriesDicom = async () => {
  const DICOM_TAR_URL = `${HOST}/1.2.392.200036.9116.2.1796265536.1658726928.7.1288600003.1.tgz`;
  const arrayBuffer = await fetchFile(DICOM_TAR_URL);

  const unZipped = await unZip(arrayBuffer);
  const dicomFileList: UntarFile[] = await untar(unZipped.buffer);

  return getValidBufferList(dicomFileList);
};
