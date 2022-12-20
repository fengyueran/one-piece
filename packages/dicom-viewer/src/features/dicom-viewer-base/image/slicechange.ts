import * as ccloader from '@cc/loader';
import { engine } from '@cc/viewers-dvtool';

type CB = (activeLayer: number) => boolean;

export class SliceChange extends engine.TSBehaviour {
  private activeLayer = -1;

  private cbSet = new Set<CB>();

  private source!: ccloader.image.Image2DSource<ccloader.TypedArray>;

  awake(): void {
    this.scriptOrder = 80; // before normal
  }

  setup(source: ccloader.image.Image2DSource<ccloader.TypedArray>): void {
    this.source = source;
  }

  update(): void {
    if (!this.source.getActiveDisplayed()) {
      return;
    }
    if (this.source.getActiveIndex() !== this.activeLayer) {
      this.activeLayer = this.source.getActiveIndex();
      //@ts-ignore
      const cbs = [...this.cbSet.keys()];
      cbs.forEach((cb) => {
        const ret = cb(this.activeLayer);
        if (!ret) {
          this.cbSet.delete(cb);
        }
      });
    }
  }

  addListener(cb: CB): void {
    this.cbSet.add(cb);
  }
}
