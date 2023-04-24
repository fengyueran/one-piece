import getImageFrame from './get-image-frame';
import decodeImageFrame from './decode-image-frame';
import { getOptions } from './internal/options';
import { FullDicom } from '../dicom-parser';

function createImage(dicom: FullDicom, options = {}) {
  const { decodeConfig } = getOptions();
  const canvas = document.createElement('canvas');
  const imageFrame = getImageFrame(dicom.getTag);
  const transferSyntax = dicom.getTag('TransferSyntaxUID');
  const pixelData = dicom.pixelData() as any;
  debugger; //eslint-disable-line

  // const decodePromise = decodeImageFrame(
  //   imageFrame,
  //   transferSyntax,
  //   pixelData,
  //   canvas,
  //   options,
  //   decodeConfig,
  // );
}

export default createImage;
