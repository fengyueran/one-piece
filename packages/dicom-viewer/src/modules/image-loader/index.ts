import loadLocalFile from './load-local-file';
import { parseDicom } from '../dicom-parser';

const getDicom = async () => {
  const res = await fetch('http://localhost:8080/test.dcm');
  const ab = await res.arrayBuffer();
  return ab;
};
export const loadImage = async (dicomBuffer: ArrayBuffer) => {
  // const dicomBuffer = await getDicom();
  const image = parseDicom(dicomBuffer);
  console.log('dafsd', image.getTag('PixelData'));
  debugger; //eslint-disable-line
};
