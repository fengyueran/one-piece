import { debug } from 'console';
import { unZip, UZIPFiles } from './unzip';

const HOST = 'http://localhost:8080';

export const fetchFile = async (url: string) => {
  const r = await fetch(url);
  const arrayBuffer = await r.arrayBuffer();
  return arrayBuffer;
};

export const getNifti = async () => {
  const NIFTI_URL = `${HOST}/blue_iso.nii`;
  return fetchFile(NIFTI_URL);
};

export const getValidBufferList = async (fileMap: UZIPFiles) => {
  const validFiles = Object.keys(fileMap).filter((filePath) => {
    if (filePath.startsWith('__MACOSX')) return false;
    const { buffer } = fileMap[filePath];
    return buffer.byteLength > 0;
  });

  const bufferList = validFiles.map((filePath) => fileMap[filePath].buffer);
  return bufferList;
};

export const getDicom = async () => {
  const DICOM_TAR_URL = `${HOST}/dicom.zip`;
  const arrayBuffer = await fetchFile(DICOM_TAR_URL);
  const unZipped = await unZip(arrayBuffer);

  return getValidBufferList(unZipped);
};
