import { getUniqueSelector, listenRouteChange, RouteInfo } from '../utils';

export enum EventType {
  Click = 'Click',
  RouteChange = 'RouteChange',
}

interface Event {
  type: EventType;
  userId: string;
  userName: string;
  data: unknown;
}

export interface Config {
  rootId?: string;
  userId: string;
  userName?: string;
  events?: EventType[];
}

export class TrackSpear {
  private _currentRoute = window.location.pathname;
  private _currentDate = Date.now(); //ms

  constructor(private config: Config, private onEvent: (event: Event) => void) {
    listenRouteChange(this._onRouteChange);
    this._listenClickEvent();
  }

  private _emitEvent = (event: { type: EventType; data: unknown }) => {
    const events = this.config?.events;
    const shouldEmit = (!events || events.indexOf(event.type) >= 0) && this.onEvent;
    if (!shouldEmit) return;

    const { userId, userName } = this.config;
    const newEvent = {
      ...event,
      userId,
      userName,
    };
    this.onEvent(newEvent);
  };

  private _onRouteChange = (info: RouteInfo) => {
    const now = Date.now();
    const to = info.targetRoute;
    const event = {
      type: EventType.RouteChange,
      data: { from: this._currentRoute, to, duration: now - this._currentDate },
    };
    this._currentDate = now;
    this._currentRoute = to;

    this._emitEvent(event);
  };

  private _listenClickEvent = () => {
    const rootId = this.config?.rootId || 'root';
    const root = document.getElementById(rootId) || document;
    root.addEventListener('click', (e: PointerEvent) => {
      const { offsetX, offsetY } = e;
      const selectorPath = getUniqueSelector(e.target as Element);

      const event = {
        type: EventType.Click,
        data: { selectorPath, offsetX, offsetY },
      };
      this._emitEvent(event);
    });
  };
}
