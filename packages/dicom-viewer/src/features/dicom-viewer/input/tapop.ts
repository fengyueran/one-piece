import { InputBase } from './inputbase';
import { engine } from '@cc/viewers-dvtool';

export abstract class TapOp extends InputBase {
  protected abstract doClick(x: number, y: number): void;

  onTap(e: engine.InputEvent): void {
    this.doClick(e.offsetX, e.offsetY);
  }
}
