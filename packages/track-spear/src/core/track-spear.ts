import { Config, EventType, Event } from '../types';
import {
  getUniqueSelector,
  listenRouteChange,
  RouteInfo,
  getCookieByName,
  setCookie,
} from '../utils';

export default class TrackSpear {
  private _currentRoute = window.location.pathname;
  private _currentDate = Date.now(); //ms

  constructor(private config: Config, private onEvent: (event: Event) => void) {
    listenRouteChange(this._onRouteChange);
    this._listenClickEvent();
    this._trackUniqueVisitor();
    this._sendIframeDimensions();
  }

  private _emitEvent = (event: { type: EventType; metaData?: unknown }) => {
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
      metaData: { from: this._currentRoute, to, duration: now - this._currentDate },
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
      const target = e.target as Element;
      const scrollWidth = document.documentElement.scrollWidth;
      const scrollHeight = document.documentElement.scrollHeight;

      const selectorPath = getUniqueSelector(target);
      const rect = target.getBoundingClientRect();
      const offsetXPercent = offsetX / rect.width;
      const offsetYPercent = offsetY / rect.height;

      const event = {
        type: EventType.Click,
        metaData: {
          selectorPath,
          scrollWidth,
          scrollHeight,
          url: this._currentRoute,
          offsetXPercent,
          offsetYPercent,
        },
      };
      this._emitEvent(event);
    });
  };

  private _trackUniqueVisitor = () => {
    const visitorId = getCookieByName('visitorId');
    if (visitorId) return;

    setCookie('visitorId', 'newVisitorId');
    const event = {
      type: EventType.NewVisitor,
    };
    this._emitEvent(event);
  };

  private _sendIframeDimensions = () => {
    window.addEventListener('load', function () {
      window.parent.postMessage(
        {
          type: 'iframeDimensions',
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
        },
        '*',
      );
    });
  };
}
