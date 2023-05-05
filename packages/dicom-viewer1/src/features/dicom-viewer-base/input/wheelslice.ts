import { WheelOp } from './wheelop';
import { CoordinateSystem, CrosshairData, CSType } from '../image';

export class WheelSlice extends WheelOp {
  factor = 0.01;

  protected doWheel(wheelDelta: number): void {
    this.sliceDelta(wheelDelta);
  }

  crosshairData?: CrosshairData;

  cs?: CoordinateSystem;

  private sliceDelta(delta: number): void {
    if (!this.crosshairData || !this.cs) {
      return;
    }
    const index2 = this.cs.convert(this.crosshairData.crosshair, CSType.Index3C, CSType.Index2C);
    index2[2] -= delta;

    this.crosshairData.setCrosshair(this.cs.convert(index2, CSType.Index2C, CSType.Index3C));
  }
}
