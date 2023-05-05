import { LoadFnType, CachePolicy } from './fullcache';

import { Image3D } from '../image3';
import { Image2D } from '../image2';
import type { TypedArray } from '../../core';

export function cacheImage3<T extends TypedArray>(
  image3: Image3D<T>,
  C: new (loader: LoadFnType<Image2D<T>>) => CachePolicy<Image2D<T>>,
): Image3D<T> {
  const cAxial = new C(image3.getAxial);
  const cSagittal = new C(image3.getSagittal);
  const cCoronal = new C(image3.getCoronal);
  const caches = {
    getAxial: cAxial.get,
    getSagittal: cSagittal.get,
    getCoronal: cCoronal.get,
  };
  return new Proxy(image3, {
    get(target, propKey) {
      return Reflect.has(caches, propKey)
        ? Reflect.get(caches, propKey)
        : Reflect.get(target, propKey);
    },
  });
}
