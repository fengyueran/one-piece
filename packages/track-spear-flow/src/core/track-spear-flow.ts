import TrackSpear, { Config } from '@xinghunm/track-spear';

import * as apis from '../apis';

export const init = (config: Config) => {
  new TrackSpear(config, (event) => {
    console.log('event', event);
    apis.createEvent(event);
  });
};
