import { engine } from '@cc/viewers-dvtool';

export class InputBase extends engine.TSBehaviour {
  mousebuttonLimit = -1;

  matchGameObject?: engine.GameObject;

  protected currentMouseButton = 0;

  constructor() {
    super();
    this.scriptOrder = 99;
  }

  update(): void {
    const { events } = this.gameObject.scene.input;
    events.filter(this.eventFilter.bind(this)).forEach(this.handleEvent);
  }

  protected eventFilter(e: engine.InputEvent): boolean {
    if (this.mousebuttonLimit >= 0 && this.mousebuttonLimit !== e.button) {
      return false;
    }
    if (e.gameObject !== this.matchGameObject) {
      return false;
    }
    return true;
  }

  private handleEvent = (e: engine.InputEvent): void => {
    this.currentMouseButton = e.button;
    switch (e.type) {
      case engine.InputEventType.PointerEnter:
        this.onPointerEnter(e);
        break;
      case engine.InputEventType.PointerLeave:
        this.onPointerLeave(e);
        break;
      case engine.InputEventType.PointerDown:
        this.onPointerDown(e);
        break;
      case engine.InputEventType.PointerUp:
        this.onPointerUp(e);
        break;
      case engine.InputEventType.PointerMove:
        this.onPointerMove(e);
        break;
      case engine.InputEventType.PanStart:
        this.onPanStart(e);
        break;
      case engine.InputEventType.PanMove:
        this.onPanMove(e);
        break;
      case engine.InputEventType.PanEnd:
        this.onPanEnd(e);
        break;
      case engine.InputEventType.PanCancel:
        this.onPanCancel(e);
        break;
      case engine.InputEventType.Tap:
        this.onTap(e);
        break;
      case engine.InputEventType.Wheel:
        this.onWheel(e);
        break;
      case engine.InputEventType.PinchStart:
        this.onPinchStart(e);
        break;
      case engine.InputEventType.PinchEnd:
        this.onPinchEnd(e);
        break;
      case engine.InputEventType.PinchCancel:
        this.onPinchCancel(e);
        break;
      case engine.InputEventType.PinchIn:
      case engine.InputEventType.PinchOut:
        this.onPinchZoom(e);
        break;
      case engine.InputEventType.DblTap:
        this.onDblTap(e);
        break;
      default:
        break;
    }
  };

  onPinchStart(_e: engine.InputEvent): void {}

  onPinchEnd(_e: engine.InputEvent): void {}

  onPinchCancel(_e: engine.InputEvent): void {}

  onPinchZoom(_e: engine.InputEvent): void {}

  onPointerEnter(_e: engine.InputEvent): void {}

  onPointerLeave(_e: engine.InputEvent): void {}

  onPointerDown(_e: engine.InputEvent): void {}

  onPointerUp(_e: engine.InputEvent): void {}

  onPointerMove(_e: engine.InputEvent): void {}

  onPanStart(_e: engine.InputEvent): void {}

  onPanMove(_e: engine.InputEvent): void {}

  onPanEnd(_e: engine.InputEvent): void {}

  onPanCancel(_e: engine.InputEvent): void {}

  onTap(_e: engine.InputEvent): void {}

  onWheel(_e: engine.InputEvent): void {}

  onDblTap(_e: engine.InputEvent): void {}
}
