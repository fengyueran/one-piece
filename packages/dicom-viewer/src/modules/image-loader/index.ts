import loadLocalFile from './load-local-file';
import { parseDicom } from '../dicom-parser';
import createImage from './create-image';

export const loadImage = async (dicomBuffer: ArrayBuffer) => {
  // const dicomBuffer = await getDicom();
  const dicom = parseDicom(dicomBuffer);
  const options = {};
  const imagePromise = createImage(dicom, options);
  debugger; //eslint-disable-line
};
