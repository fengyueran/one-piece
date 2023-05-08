export const Tick = (step: () => void) => {
  let destroyed = false;

  const update = (): void => {
    if (destroyed) {
      return;
    }
    step();
    requestAnimationFrame(update);
  };
  const startTick = () => {
    update();
  };

  const destroy = () => {
    destroyed = true;
  };
  return { startTick, destroy };
};

export type TickType = ReturnType<typeof Tick>;

export class SceneModelTicker {
  private tick?: ReturnType<typeof Tick>;

  constructor(private modelGetters: (() => { step: () => void })[]) {
    this.modelGetters = modelGetters;
  }

  startTick = (onStep?: () => void) => {
    const step = () => {
      if (onStep) {
        onStep();
      }
      this.modelGetters?.forEach((getModel) => {
        const model = getModel();
        model?.step();
      });
    };
    this.tick = Tick(step);
    this.tick.startTick();
  };

  destory = () => {
    this.tick?.destroy();
  };
}
