import { TagDict } from './types';

const CURA_GROUP_TAG = '3333';

const tags: TagDict = {};

const addTag = (name: string, group: string, element: string, vr: string) => {
  const tag = {
    tag: `(${group},${element})`,
    vr,
    vm: 1,
    name,
  };
  tags[`x${group}${element}`] = tag;
};

addTag('CURA_CREATOR', CURA_GROUP_TAG, '0010', 'LO');
addTag('CURA_VERSION', CURA_GROUP_TAG, '1010', 'LO');
addTag('CURA_LABEL18', CURA_GROUP_TAG, '1020', 'OB');
addTag('CURA_CL_LEFT', CURA_GROUP_TAG, '1021', 'OB');
addTag('CURA_CL_RIGHT', CURA_GROUP_TAG, '1022', 'OB');
addTag('CURA_PLY_LEFT', CURA_GROUP_TAG, '1023', 'OB');
addTag('CURA_PLY_RIGHT', CURA_GROUP_TAG, '1024', 'OB');
addTag('CURA_PLY_AORTA', CURA_GROUP_TAG, '1025', 'OB');
addTag('CURA_VRMASK', CURA_GROUP_TAG, '1026', 'OB');
addTag('CURA_INFO', CURA_GROUP_TAG, '1027', 'OB');
addTag('CURA_PROJECT', CURA_GROUP_TAG, '1028', 'OB');
addTag('CURA_PLY', CURA_GROUP_TAG, '1030', 'OB');
addTag('CURA_IMAGEINFO', CURA_GROUP_TAG, '1032', 'OB');
addTag('CURA_RAW_SERIES_UID', CURA_GROUP_TAG, '1040', 'LO');
addTag('CURA_SEGMENT_TYPE', CURA_GROUP_TAG, '1050', 'IS');
addTag('CURA_SEGMENT_VALUE', CURA_GROUP_TAG, '1051', 'IS');
addTag('CURA_SERIES_TYPE', CURA_GROUP_TAG, '1052', 'IS');
addTag('CURA_BRANCH_SERIES_TYPE', CURA_GROUP_TAG, '1053', 'IS');
addTag('CURA_FRAME_OF_REFERENCE', CURA_GROUP_TAG, '1060', 'DS');

export const cura = tags;
