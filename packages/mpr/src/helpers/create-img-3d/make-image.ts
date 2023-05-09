import { image, nifti, dicom } from '@cc/loader';

import { FullDicomCache } from './full-dicom-cache';

export const makeImg3DByNiftiBuffer = async (
  niftiBuffer: ArrayBuffer
): Promise<image.Image3D<Int16Array>> => {
  const { buffer, info, header } = await nifti.parseNiftiWithWorker(
    niftiBuffer
  );

  const img3 = new image.Image3D<Int16Array>(
    info,
    new nifti.NiftiCache(buffer as Int16Array, info),
    Int16Array
  );
  (img3 as any).niftiHeader = header;

  return img3;
};

// the second step parseDicom.
const parseDicom = (dataList: Array<ArrayBuffer>) =>
  dataList
    .map((ab) => {
      try {
        return dicom.parseDicom(ab);
      } catch (e) {
        console.log('parseDicom error', e);
        return undefined;
      }
    })
    .filter((v) => !!v) as Array<dicom.FullDicom>;

const readImagePositionPatient = (d: dicom.FullDicom) => {
  try {
    return d.getTag('ImagePositionPatient').split('\\').map(Number);
  } catch (e) {
    return [0, 0, 0];
  }
};

const readSliceLocation = (d: dicom.FullDicom) => {
  const SliceLocation = d.getTag('SliceLocation') || 0;
  const ReconstructionTargetCenterPatient =
    d.getTag('ReconstructionTargetCenterPatient') || 0;
  const ImagePositionPatient = readImagePositionPatient(d);
  return [
    SliceLocation,
    ReconstructionTargetCenterPatient && ReconstructionTargetCenterPatient[2],
    ImagePositionPatient && ImagePositionPatient[2],
  ];
};

const diffSliceLocation = (b: Array<number>, a: Array<number>) => {
  for (let i = 0; i < a.length; i++) {
    const diff = Math.abs(b[i] - a[i]);
    if (diff > 0) {
      return a[i] - b[i];
    }
  }
  return 0;
};

const makeSlices = (dicomList: Array<dicom.FullDicom>) => {
  const slices = dicomList.map((d: dicom.FullDicom) => {
    const SliceLocation = readSliceLocation(d);
    return {
      SliceLocation,
      dicom: d,
    };
  });
  slices.sort((a, b) => diffSliceLocation(a.SliceLocation, b.SliceLocation));

  return slices;
};

const checkMultiFrames = (
  slices: { SliceLocation: any[]; dicom: dicom.FullDicom }[]
) => {
  if (slices.length === 1) {
    const firstSlice = slices[0].dicom;
    const numberOfFrames = Number(firstSlice.getTag('NumberOfFrames'));
    return numberOfFrames > 1;
  }
  return false;
};

// the third step parseSeries
const parseSeries = (dicomList: Array<dicom.FullDicom>) => {
  const slices = makeSlices(dicomList);

  const firstSlice = slices[0].dicom;

  const width = Number(firstSlice.getTag('Columns'));
  const height = Number(firstSlice.getTag('Rows'));
  const pixelSpacing = firstSlice.getTag('PixelSpacing');

  const spacing = pixelSpacing
    ? (pixelSpacing.split('\\').map(Number) as Array<number>)
    : [1, 1];

  const seriesUID = firstSlice.getTag('SeriesInstanceUID');
  dicomList.forEach((d) => {
    if (d.getTag('SeriesInstanceUID') !== seriesUID) {
      throw new Error('this is not one series');
    }
  });

  const isMultiFrames = checkMultiFrames(slices);
  const numberOfFrames = Number(slices[0].dicom.getTag('NumberOfFrames'));

  const sliceInterval =
    slices.length > 1
      ? diffSliceLocation(slices[1].SliceLocation, slices[0].SliceLocation)
      : 1;

  return {
    origin: readImagePositionPatient(slices[0].dicom),
    size: [width, height, isMultiFrames ? numberOfFrames : slices.length],
    spacing: [spacing[0], spacing[1], sliceInterval],
    slices,
  };
};

// the fourth step
// create the image
const makeImage3 = async (series: ReturnType<typeof parseSeries>) => {
  const imageInfo = {
    origin: series.origin,
    size: series.size,
    spacing: series.spacing,
  };
  const isMultiFrames = checkMultiFrames(series.slices);
  const numberOfFrames = Number(
    series.slices[0].dicom.getTag('NumberOfFrames')
  );
  const layerSize = imageInfo.size[0] * imageInfo.size[1];
  const layerCount = isMultiFrames ? numberOfFrames : imageInfo.size[2];
  const buffer = new Int16Array(layerSize * layerCount);

  const fillBuffer = (layer: number) =>
    new Promise((reslove, reject) => {
      setTimeout(() => {
        try {
          let start = isMultiFrames
            ? (layerCount - layer - 1) * layerSize
            : layer * layerSize;
          const targetSlice = isMultiFrames
            ? series.slices[0].dicom
            : series.slices[layer].dicom;
          const rescaleIntercept = Number(
            targetSlice.getTag('RescaleIntercept') || 0
          );
          const rescaleSlope = Number(targetSlice.getTag('RescaleSlope') || 1);
          const srcBuffer = targetSlice.pixelData(isMultiFrames ? layer : 0);

          for (let i = 0; i < layerSize; i++, start++) {
            buffer[start] = srcBuffer[i] * rescaleSlope + rescaleIntercept;
          }
          reslove(1);
        } catch (error) {
          reject(error);
        }
      }, 0);
    });

  for (let layer = 0; layer < layerCount; layer++) {
    await fillBuffer(layer);
  }

  const cache = new FullDicomCache<Int16Array>(
    buffer,
    imageInfo,
    (index: number, tagName: string) =>
      isMultiFrames
        ? series.slices[0].dicom.getTag(tagName)
        : series.slices[index].dicom.getTag(tagName)
  );
  const r = new dicom.Image3DFromDicom<Int16Array>(
    imageInfo,
    cache,
    Int16Array
  );
  return r;
};

export const makeImg3DByDicomBufferList = async (
  dicomFileBufferList: ArrayBuffer[]
) => {
  const dicomParsedResList = parseDicom(dicomFileBufferList);
  const series = parseSeries(dicomParsedResList);
  const image = await makeImage3(series);
  return image;
};
