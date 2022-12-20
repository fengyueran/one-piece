import { fromPairs } from 'lodash-es';

import { Image3D } from '../../image';
import type { TypedArray } from '../../core';

export type GetSliceInfoFn = (
  index: number,
  tags: Array<string>,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [attr: string]: any;
};

export class Image3DFromDicom<T extends TypedArray> extends Image3D<T> {
  getSliceInfo: GetSliceInfoFn = (index, tags) => {
    const results = this.cache.getTag(index, tags);
    return fromPairs(tags.map((tagName, i) => [tagName, results[i]]));
  };
}
