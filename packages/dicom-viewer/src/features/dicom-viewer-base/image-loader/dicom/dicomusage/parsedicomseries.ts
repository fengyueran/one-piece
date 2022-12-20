import { isNumber } from 'lodash-es';

import { Data, Resource, AnyResource, ParseFn, FetchType, TypedArray } from '../../core';
import { ResourceBasedImageCache } from '../../image';
import { DataSet } from '../dicomtags';

import { parseDicom, FullDicom } from '../dicomparser';
import { DicomSeries } from './dicomseries';

const dicomParse: ParseFn = async (param: { data: Data }) => {
  return new AnyResource<FullDicom>(parseDicom(param.data.getArrayBuffer()));
};

const parseDicomSeries: ParseFn = async ({ mgr, data, option }) => {
  const json = data.getArray();
  if (json.length < 1) {
    throw new Error('dicom image need at least one instance');
  }

  const dsList = json.map((j: any) => new DataSet(j));

  // sort by InstanceNumber
  const needSort = !dsList.find((ds: DataSet) => !isNumber(ds.getElementValue('InstanceNumber')));
  if (needSort) {
    dsList.sort(
      (l: DataSet, r: DataSet) =>
        l.getElementValue('InstanceNumber') - r.getElementValue('InstanceNumber'),
    );
  }

  const resources = dsList.map((ds: DataSet) =>
    mgr.addResource({
      fetchType: FetchType.DicomInstance,
      locator: {
        StudyInstanceUID: ds.StudyInstanceUID,
        SeriesInstanceUID: ds.SeriesInstanceUID,
        SOPInstanceUID: ds.SOPInstanceUID,
      },
      parse: dicomParse,
      option,
    }),
  );

  const cache = new ResourceBasedImageCache<Resource, TypedArray>(resources, {
    getBuffer: (r: Resource) => {
      const d = (r as AnyResource<FullDicom>).data;
      return d.pixelData();
    },
    getTagByResource: (r: Resource, tagName: string) => {
      const d = (r as AnyResource<FullDicom>).data;
      return d.getTag(tagName);
    },
  });

  const r = new DicomSeries(resources.length, cache);
  return r;
};

export { parseDicomSeries };
