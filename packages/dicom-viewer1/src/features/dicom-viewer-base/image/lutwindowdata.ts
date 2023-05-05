import { Vector2 } from 'three';
import { clamp, clone } from 'lodash-es';

import { LUTWindow } from './types';
import { components, engine } from '@cc/viewers-dvtool';

import { isNumber, isEqualWith } from 'lodash-es';

// compare object, array, number
export const deepFloatEqual = (a: unknown, b: unknown): boolean => {
  return isEqualWith(a, b, (l: number, r: number) => {
    if (isNumber(l) && isNumber(r)) {
      return Math.abs(l - r) < 0.0001;
    }
    return undefined;
  });
};

export class LUTWindowData extends engine.TSBehaviour {
  centerLimit: Vector2 = new Vector2(-65536, 65536);

  windowLimit: Vector2 = new Vector2(1, 65536);

  private mWindow: LUTWindow = {
    windowCenter: 300,
    windowWidth: 1000,
  };

  get data(): LUTWindow {
    return this.mWindow;
  }

  setData(v: LUTWindow): void {
    const newWindow = {
      windowCenter: clamp(v.windowCenter, this.centerLimit.x, this.centerLimit.y),
      windowWidth: clamp(v.windowWidth, this.windowLimit.x, this.windowLimit.y),
    };
    if (deepFloatEqual(this.mWindow, newWindow)) {
      return;
    }
    this.mWindow = newWindow;
    this.gameObject.scene.nc.emit('windowChanged', clone(newWindow));
  }

  addDiff(windowWidthDiff: number, windowCenterDiff: number): void {
    this.setData({
      windowCenter: this.data.windowCenter + windowCenterDiff,
      windowWidth: this.data.windowWidth + windowWidthDiff,
    });
  }
}
