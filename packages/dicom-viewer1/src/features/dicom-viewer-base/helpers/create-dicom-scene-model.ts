import * as ccloader from '@cc/loader';
import { DicomSceneModel, Option } from '../scene';
import * as exampleColorTable from './custom-color-table';
import { Image3DFromDicom, Image3D, makeAxialLoader } from '../image-loader';

export enum Plane {
  'Axial' = 'axial',
  'Sagittal' = 'sagittal',
  'Coronal' = 'coronal',
}

export type Image3DType = Image3D<Int16Array> | Image3DFromDicom<Int16Array>;

export const createDicomSceneModel = (
  type: Plane,
  image: Image3DType,
  mask?: Image3D<Uint8Array>,
  option?: Option,
) => {
  let dicomSceneModel;
  const orthographicSize = image.info.physicalSize[1] / 2;
  switch (type) {
    case Plane.Axial: {
      dicomSceneModel = new DicomSceneModel(
        'axial',
        image.getAxialInfo(),
        makeAxialLoader(image),
        mask && makeAxialLoader(mask),
        exampleColorTable,
        orthographicSize,
        option,
      );
      break;
    }
    // case Plane.Sagittal: {
    //   dicomSceneModel = new DicomSceneModel(
    //     'sagittal',
    //     image.getSagittalInfo(),
    //     ccloader.image.makeSagittalLoader(image),
    //     mask && ccloader.image.makeSagittalLoader(mask),
    //     exampleColorTable,
    //     orthographicSize,
    //     option,
    //   );
    //   break;
    // }
    // case Plane.Coronal: {
    //   dicomSceneModel = new DicomSceneModel(
    //     'coronal',
    //     image.getCoronalInfo(),
    //     ccloader.image.makeCoronalLoader(image),
    //     mask && ccloader.image.makeCoronalLoader(mask),
    //     exampleColorTable,
    //     orthographicSize,
    //     option,
    //   );
    //   break;
    // }
    default: {
      throw new Error('dicom type must be one of Axial、Sagittal、Coronal');
    }
  }
  return dicomSceneModel;
};

const getTags = (image: ccloader.dicom.Image3DFromDicom<Int16Array>) => {
  const tags =
    image.getSliceInfo &&
    image.getSliceInfo(0, [
      'StudyInstanceUID',
      'InstitutionName',
      'PatientName',
      'PatientSex',
      'PatientAge',
      'PatientID',
      'Manufacturer',
      'StudyDate',
      'KVP',
      'PixelSpacing',
      'Modality',
      'Rows',
      'HeartRate',
      'ImageComments',
      'PersonName',
      'Columns',
      'ImageType',
    ]);
  return tags || {};
};

export const getBasicInfo = (image: Image3DType, dicomSceneModel: DicomSceneModel) => {
  const physicalSizeY = dicomSceneModel.info.size[1] * dicomSceneModel.info.spacing[1];

  const getInstanceNumbers = () => {
    const instanceNumbers = [];
    for (let i = 0; i < dicomSceneModel.info.count; i += 1) {
      try {
        const tagMap = (image as any).getSliceInfo(i, ['InstanceNumber']);
        instanceNumbers.push(tagMap.InstanceNumber);
      } catch (error) {
        instanceNumbers.push('');
      }
    }
    return instanceNumbers;
  };

  const instanceNumbers = getInstanceNumbers();
  const tags = getTags(image as any);
  const coords3D = [
    Math.floor(image.size[0] / 2),
    Math.floor(image.size[1] / 2),
    Math.floor(image.size[2] / 2),
  ];
  const coords2D = dicomSceneModel.info.coords3DTo2D(coords3D as [number, number, number]);

  const basicInfo = {
    physicalSizeY,
    zoom: dicomSceneModel.defaultProperties.zoom,
    imgSize: image.size,
    tags,
    crosshair: coords2D,
    position: coords3D,
    spaceInfo: {
      count: dicomSceneModel.info.count,
      size: dicomSceneModel.info.size,
      spacing: dicomSceneModel.info.refImage3DSpaceInfo.spacing,
      anatomicalSystem: dicomSceneModel.info.anatomicalSystem,
    },
    physicalPerPixel: dicomSceneModel.getPhysicalPerPixel(),
    instanceNumbers,
  };

  return basicInfo;
};
