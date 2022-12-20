import {
  FetchType,
  Data,
  PayLoadType,
  IResourceRep,
  DataResource,
  Resource,
  ParseFn,
} from '../../core';
import { ResourceBasedImageCache } from '../../image';
import { DataSet } from '../dicomtags';

import { Image3DFromDicom } from './dicomimage';

const parsePixelBuffer: ParseFn = async ({ data, option }) => {
  const { rescaleSlope, rescaleIntercept } = option;
  const buffer = new Int16Array(data.getArrayBuffer());
  for (let i = 0; i < buffer.length; i += 1) {
    buffer[i] = buffer[i] * rescaleSlope + rescaleIntercept;
  }
  return new DataResource(new Data(PayLoadType.TYPED_ARRAY, buffer));
};

const parseDicomImage: ParseFn = async ({ data, option, mgr }) => {
  const json = data.getJson();
  if (json.length < 1) {
    throw new Error('dicom image need at least one instance');
  }

  const otherOption = option;
  const slices = json.map((slice: any) => {
    const sliceDS = new DataSet(slice);
    const origin = sliceDS.getElementValueArray('ImagePositionPatient');
    const url = sliceDS.getElementValue('PixelData');
    if (!origin || origin.length !== 3 || !url) {
      throw new Error('parseDicomImage: dicom is not image');
    }
    return {
      origin,
      url,
      ds: sliceDS,
    };
  });

  slices.sort((a: any, b: any) => a.origin[2] - b.origin[2]);

  const firstSlice = slices[0].ds;
  const width = firstSlice.getElementValue('Columns');
  const height = firstSlice.getElementValue('Rows');
  const spacing = firstSlice.getElementValueArray('PixelSpacing');
  const rescaleIntercept = firstSlice.getElementValue('RescaleIntercept');
  const rescaleSlope = firstSlice.getElementValue('RescaleSlope');

  const newOption = {
    ...otherOption,
    width,
    height,
    rescaleSlope,
    rescaleIntercept,
  };
  const resources: Array<IResourceRep> = [];
  for (let i = 0; i < json.length; i += 1) {
    const resource = mgr.addResource({
      fetchType: FetchType.Url,
      locator: { url: slices[i].url },
      parse: parsePixelBuffer,
      option: newOption,
    });
    resources.push(resource);
  }

  const size: [number, number, number] = [width, height, json.length];
  const cache = new ResourceBasedImageCache<Resource, Int16Array>(resources, {
    getBuffer: (r: Resource) => r.getTypedArray<Int16Array>(),
    getTagByNumber: (index: number, tagName: string) => slices[index].ds.getElementValue(tagName),
  });
  const origin = [-slices[0].origin[0], -slices[0].origin[1], slices[0].origin[2]];
  const imageInfo = {
    origin,
    size,
    spacing: [
      spacing[0],
      spacing[1],
      slices.length > 1 ? Math.abs(slices[1].origin[2] - slices[0].origin[2]) : 1,
    ],
  };

  const r = new Image3DFromDicom<Int16Array>(imageInfo, cache, Int16Array);
  return r;
};

export { parseDicomImage };
