export interface RouteInfo {
  targetRoute: string;
}

export const listenRouteChange = (onPushState: (info: RouteInfo) => void) => {
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
