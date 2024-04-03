interface RouteInfo {
  targetRoute: string;
}

export enum Event {
  RouteChange,
}

const listenRouteChange = (onPushState: (info: RouteInfo) => void) => {
  (function (history) {
    const pushState = history.pushState;
    const replaceState = history.replaceState;

    history.pushState = function (...args) {
      onPushState({ targetRoute: args[2] as string });
      return pushState.apply(history, args);
    };

    history.replaceState = function (...args) {
      onPushState({ targetRoute: args[2] as string });
      return replaceState.apply(history, args);
    };

    window.addEventListener('popstate', function () {
      onPushState({ targetRoute: document.location.pathname });
    });
  })(window.history);
};

export class TrackSpear {
  private _currentRoute = window.location.pathname;
  private _currentDate = Date.now(); //ms
  constructor(private onRouteChange) {
    listenRouteChange(this._onRouteChange);
  }

  private _onRouteChange = (info: RouteInfo) => {
    const now = Date.now();
    const to = info.targetRoute;
    const event = {
      type: Event.RouteChange,
      data: { from: this._currentRoute, to, duration: now - this._currentDate },
    };
    this._currentDate = now;
    this._currentRoute = to;
    console.log('onRouteChange', event);
    if (this.onRouteChange) {
      this.onRouteChange(event);
    }
  };
}
