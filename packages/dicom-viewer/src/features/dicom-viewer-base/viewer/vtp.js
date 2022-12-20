/* eslint-disable */
import xmlParser from 'fast-xml-parser';
import * as R from 'ramda';

const find = (obj, findKey) => {
  if (obj[findKey] && obj[findKey].DataArray) {
    if (Array.isArray(obj[findKey].DataArray)) {
      return obj[findKey].DataArray;
    }
    return [obj[findKey].DataArray];
  }

  const keys = Object.keys(obj);

  let result = [];
  // eslint-disable-next-line
  for (const key of keys) {
    if (obj[key] && typeof obj[key] === 'object') {
      const foundRes = find(obj[key], findKey);
      if (foundRes && foundRes.length) {
        result = result.concat(foundRes);
      }
    }
  }
  return result;
};

const stringToValues = R.compose(
  R.reject(Number.isNaN),
  R.map(Number),
  R.split(/[\n\s]+/),
  R.invoker(0, 'toString'),
);

const findAttribute = R.useWith(
  R.compose(stringToValues, R.ifElse(R.isNil, R.always(''), R.prop('#text')), R.find),
  [R.propEq('Name'), R.identity],
);

const findPointsAttr = findAttribute('Points');
const findFFRAttr = findAttribute('FFR');
const findRadiusAttr = findAttribute('Radius');
const findSphericalCoordinatesAttr = findAttribute('SphericalCoordinates');

const sphericalCoordToCPRIndex = ([theta, phi]) => [
  (Math.PI + theta) / (2 * Math.PI),
  (Math.PI / 2 + phi) / Math.PI,
];

export default async function parseVTP(vtps) {
  if (!Array.isArray(vtps)) {
    throw new Error('Vtps variable must be an array containing some vtp files');
  }

  let result = [];
  // eslint-disable-next-line
  for (const cl1DmeshText of vtps) {
    const cl1DmeshData = xmlParser.parse(cl1DmeshText, {
      ignoreAttributes: false,
      attributeNamePrefix: '',
    });

    const points = find(cl1DmeshData, 'Points');
    const pointData = find(cl1DmeshData, 'PointData');

    const vertices = findPointsAttr(points);
    const ffrArray = findFFRAttr(pointData);
    const radiusArray = findRadiusAttr(pointData);
    const sphericalCoordinates = findSphericalCoordinatesAttr(pointData);

    const itemRes = ffrArray.map((ffr, index) => ({
      /*
       * 存储ffr、radius、position的作用
       * 1. ffr、radius、position 为3D模型添加颜色
       * 2. position 也应用于使用鼠标点击位置查询点击中心线上的点
       */
      ffr,
      radius: radiusArray[index],
      position: vertices.slice(index * 3, (index + 1) * 3),
      cprIndex: sphericalCoordToCPRIndex(sphericalCoordinates.slice(index * 3, (index + 1) * 3)),
    }));
    result = result.concat(itemRes);
  }

  return result;
}
